import { appletClientServiceIns } from "../../AppletClientService.js";
import { FormComponent } from "../../components/FormComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FormMode } from "../../constants/FormMode.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

class WireForm extends FormComponent {

    wireFormInfo = null;
    componentInfo = null;
    stateName = null;
    fsWireId = null;
    constructor() {
        super("wire-form", FormMode.READONLY_MODE);
    }

    onComponentDataSet(componentData) {
        $("#transaction-id").html("");
        try{
            appletClientServiceIns.showLoader();
            UtilHelper.setComponentData(ComponentConstant.WIRE_FOOTER_BUTTON, componentData);
            this.componentInfo = componentData;
            this.fsWireId = this.fsWireId ? this.fsWireId : componentData.field_values.wire_field36.value;
            if(this.componentInfo.accountHolderInfo && this.componentInfo.accountHolderInfo.state){
                $(document).trigger(CustomEventsConstants.BIND_STATE_NAME, this.componentInfo.accountHolderInfo.state);
            }
            let orderId = componentData.field_values.wire_field12.value
            this.getClosingAgentId(orderId,this.getWireInfo.bind(this));
        }catch(e){
            appletClientServiceIns.hideLoader();
            console.log(e);
        }
    }

    async getWireInfo(closingAgent) {
        if(Array.isArray(closingAgent) && closingAgent.length > 0){
            let closingAgentId = closingAgent[0].field_values.closing_agent_field77.value;
            let payload = {
                CompanyId : closingAgentId,
                AccountId : this.fsWireId
            };
            let response = await FSLambdaAPIService.getInstance().setPayload("GET_WIRE_ACCOUNT",payload).call().call();
            if(response.status == 200){
                if(response.data && response.data.accountHolderInfo && response.data.accountHolderInfo.accountName){
                    this.formData = { 
                        accountName: response.data.accountHolderInfo.accountName || "" ,
                        accountNumber: response.data.accountHolderInfo.accountNumber || "",
                        phone: response.data.accountHolderInfo.phone || "",
                        city: response.data.accountHolderInfo.city || "",
                        subAccountName: response.data.accountHolderInfo.subAccountName || "",
                        subAccountNumber: response.data.accountHolderInfo.subAccountNumber || "",
                        bankName : response.data.bankInfo.bankName || "",
                        abaRouting : response.data.bankInfo.abaRouting || "",
                        intermediaryBankName : response.data.bankInfo.intermediaryBankName || "",
                        bankAccountNumber : response.data.bankInfo.accountNumber || "",
                        state : response.data.accountHolderInfo.state || ""
                    };
                    this.bindDataToFormFields();
                    $(document).trigger(CustomEventsConstants.BIND_STATE_NAME, this.formData.state);
                }
            }
        }
        appletClientServiceIns.hideLoader();
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.CREATE_NEW_WIRE_EVENT, this.onCreateNewClicked.bind(this));
        $(document).on(CustomEventsConstants.STATE_NAME_SELECTED, this.onStateNameSelected.bind(this));
    }

    onCreateNewClicked() {
        this.formMode = FormMode.ADD_MODE;
        this.setFormMode();
        this.hideWireFooterButton();
    }

    hideWireFooterButton() {
        $(this).find("wire-footer-button").hide();
    }

    showUnderwriteFooterButton() {
        $(this).find("wire-footer-button").show();
    }

    submitForm(formData) {
        this.wireFormInfo = formData;
        appletClientServiceIns.showLoader();
        
        let orderId = this.componentInfo.field_values.wire_field12.value;
        this.getClosingAgentId(orderId,this.createNewWire.bind(this));
    }

    onStateNameSelected(event,stateName) {
        this.stateName = stateName;
    }

    async createNewWire(closingAgent) {
        if(Array.isArray(closingAgent) && closingAgent.length > 0){
            let closingAgentId = closingAgent[0].field_values.closing_agent_field77.value;
            let transactionId = this.componentInfo.field_values.wire_field12.display_value;
            let instanceId = this.componentInfo.id;
            let payload = {
                companyId : closingAgentId,
                accountHolderInfo : {
                    accountName: this.wireFormInfo.accountName,
                    accountNumber: this.wireFormInfo.accountNumber,
                    phone: this.wireFormInfo.phone,
                    city: this.wireFormInfo.city,
                    state: this.stateName,
                    subAccountName: this.wireFormInfo.subAccountName,
                    subAccountNumber: this.wireFormInfo.subAccountNumber
                },
                bankInfo : {
                    bankName : this.wireFormInfo.bankName,
                    abaRouting : this.wireFormInfo.abaRouting,
                    intermediaryBankName : this.wireFormInfo.intermediaryBankName,
                    intermedAccountNumber : this.wireFormInfo.bankAccountNumber
                  }
            };
            let fn = "ADD_NEW_WIRE_ACCOUNT";
            let response = await FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
            if(response.status == 200){
                let wireId = response.data.bankInfo.bankId;
                this.fsWireId = wireId;
                this.attachWireToTransaction(wireId,transactionId,instanceId);
                return;
            }
        }
        appletClientServiceIns.hideLoader();
        appletClientServiceIns.showSnackBar("There was an error creating Wire");
        await this.timeout(2000);
    }


    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async attachWireToTransaction(wireId,transactionId,instanceId) {
        let payload = {
            transactionId : transactionId,
            bankId : wireId
        };
        let fn = "ATTACH_WIRE_TO_TRANSACTION";
        try{
            let response = await FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
            if(response.status == 200){
                appletClientServiceIns.hideLoader();
                appletClientServiceIns.showSnackBar("Wire created successfully");
                this.updateFAWire(wireId,instanceId);
                await this.timeout(2000);
            }
        }catch(e){
            appletClientServiceIns.hideLoader();
            appletClientServiceIns.showSnackBar("There was an error creating a new wire",true);
            await this.timeout(2000);
        }
    }

    updateFAWire(wireId, instanceId) {
        if(typeof wireId != "string"){
            wireId = wireId.toString();
        }
        let variables = {
            entity : "wire",
            id : instanceId,
            field_values : {
                wire_field36 : wireId
            }
        };
        FreeAgentApiService.getFreeAgentApiServiceIns().updateEntityFree(variables,(data) => {
            UtilHelper.navigateTo(ComponentConstant.WIRE_FORM,data.entity_value);
            console.log("Closing Agent Updated");
        });
    }

    getClosingAgentId(orderId,callback) {
        let variables = {
            entity : "closing_agent",
            filters : [
                {
                    field_name : "closing_agent_field22",
                    operator : "includes",
                    values : [orderId]
                }
            ],
            limit : 1,
            fields : ["closing_agent_field77"]
        };
        FreeAgentApiService.getFreeAgentApiServiceIns().listEntityValuesFree(variables,callback);
    }

    onCanceled() {
        super.onCanceled();
        this.formMode = FormMode.READONLY_MODE;
        this.setFormMode();
        this.showUnderwriteFooterButton();
        this.removeValidation();
        this.navigateBetweenComponents(ComponentConstant.WIRE_FORM);
    }

    removeValidation() {
        $(this).find('.span-required').hide();
    }

    setAppletHeader() {
      
    }

    setHTML() {
        return `
        <form id="wire-form">
            <div class="container">
            <legend style="background:#fff;">Account Holder Information</legend>
                <div class="row">
                    <form-field-alpha-num class="col-md-6" label="Name on Account" name="accountName"></form-field-alpha-num>
                    <form-field-alpha-num class="col-md-6" label="Account #" name="accountNumber"></form-field-alpha-num>
                </div>

                <div class="row">
                    <form-field-alpha-num class="col-md-6" notRequired="true" label="Sub Account Name" name="subAccountName"></form-field-alpha-num>
                    <form-field-alpha-num class="col-md-6" notRequired="true" label="Sub Account #" name="subAccountNumber"></form-field-alpha-num>
                </div>

                <div class="row">
                    <form-field-alpha-num class="col-md-6" notRequired="true" label="Phone" name="phone"></form-field-alpha-num>
                    <form-field-alpha-num class="col-md-6" notRequired="true" label="City" name="city"></form-field-alpha-num>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label">State</label>
                        <state-select></state-select>
                    </div>
                </div>
                <br>
                <legend style="background:#fff;">Bank Information</legend>
                <div class="row">
                    <form-field-alpha-num class="col-md-6" label="Bank Name" name="bankName"></form-field-alpha-num>
                    <form-aba-number class="col-md-6" label="ABA/Routing" name="abaRouting"></form-aba-number>
                </div>
                <div class="row">
                    <form-field-alpha-num class="col-md-6" notRequired="true" label="Intermediary Bank Name" name="intermediaryBankName"></form-field-alpha-num>
                    <form-field-alpha-num class="col-md-6" notRequired="true" label="Account #" name="bankAccountNumber"></form-field-alpha-num>
                </div>
                <primary-secondary-button primary="Create" secondary="Cancel"></primary-secondary-button>
                <wire-footer-button></wire-footer-button>
            </div>
        </form>`
    }
}

window.customElements.define(ComponentConstant.WIRE_FORM, WireForm);