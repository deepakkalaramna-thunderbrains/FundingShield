import { appletClientServiceIns } from "../../AppletClientService.js";
import { FormComponent } from "../../components/FormComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FormMode } from "../../constants/FormMode.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js"
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";
import { Storage } from '../../storage/Storage.js';
import { AppConstant } from '../../constants/AppConstant.js';
class ClosingAgentForm extends FormComponent {

    stateId = null;
    constructor() {
        super("closingagent-form", FormMode.READONLY_MODE);
    }

    async onComponentDataSet(componentData) {
        UtilHelper.setComponentData(ComponentConstant.CLOSING_AGENT_FOOTER_BUTTON, componentData);
        let componentData1 = null;
        Storage.setInstanceId(componentData.id);
        if (!componentData.update) {
            appletClientServiceIns.showLoader();
            let response = await this.awsService.getClosingAgentById(componentData.field_values.closing_agent_field22.display_value);
            let closingAgentRecords = response.data;
            componentData1 = {
                address: closingAgentRecords.closingAgentAddress1,
                address2: closingAgentRecords.closingAgentAddress2,
                city: closingAgentRecords.closingAgentCity,
                email: closingAgentRecords.closingAgentEmail,
                name: closingAgentRecords.closingAgentName,
                phone: closingAgentRecords.closingAgentPhone,
                state: closingAgentRecords.closingAgentState,
                zip: closingAgentRecords.closingAgentZipCode
            }
        } else {
            let closingAgentRecords = componentData.selectedRowData;
            componentData1 = {
                address: closingAgentRecords.closingAgentAddress1,
                address2: closingAgentRecords.closingAgentAddress2,
                city: closingAgentRecords.closingAgentCity,
                email: closingAgentRecords.closingAgentEmail,
                name: closingAgentRecords.closingAgentName,
                phone: closingAgentRecords.closingAgentPhone,
                state: closingAgentRecords.closingAgentState,
                zip: closingAgentRecords.closingAgentZipCode
            }
        }
        this.formData = componentData1;
        this.bindDataToFormFields();
        appletClientServiceIns.hideLoader();
        $("#transaction-id").html(componentData1.name);
        $(document).trigger(CustomEventsConstants.BIND_STATE_NAME, this.formData.state);
        if (componentData && componentData.update) {
            componentData.update = false;
            await this.updateClosingAgentRecordToFS(componentData.selectedRowData);
        }
    }

    async updateClosingAgentRecord(data) {
        let state = AppConstant.STATES.find((state) => state.stateId == data.closingAgentState);
        let closingAgentId = null;
        if(data.closingAgentId && data.closingAgentId != ""){
            closingAgentId = typeof data.closingAgentId == "string" ? data.closingAgentId : data.closingAgentId.toString();
        }

        if(data.clientClosingAgentId && data.clientClosingAgentId != ""){
            closingAgentId = typeof data.clientClosingAgentId == "string" ? data.clientClosingAgentId : data.clientClosingAgentId.toString();
        }

        let variables = {
            entity: "closing_agent",
            id: this._componentData.id,
            field_values: {
                closing_agent_field77: closingAgentId,
                closing_agent_field23: data.closingAgentName || "",
                closing_agent_field24: data.closingAgentAddress1 || "",
                closing_agent_field25: data.closingAgentAddress2 || "",
                closing_agent_field26: data.closingAgentCity || "",
                closing_agent_field27: data.closingAgentState || "",
                closing_agent_field28: data.closingAgentZipCode || "",
                closing_agent_field98: data.closingAgentEmail || "",
                closing_agent_field33: data.closingAgentPhone || "",
                closing_agent_field34: data.closingAgentContactFirstName || "", // first name
                closing_agent_field35: data.closingAgentContactLastName || "", //Last name
                closing_agent_field99: data.closingAgentEmail || "",
                closing_agent_field66 : state.id || null
            }
        }
        FreeAgentApiService.getFreeAgentApiServiceIns().updateEntityFree(variables, (data) => { console.log(data) });
    }

    async updateClosingAgentRecordToFS(data) {
        let payload = { 
            data : {
                transactionId : this._componentData.field_values.closing_agent_field22.display_value,
                companyID : typeof data.closingAgentId != "string" ? data.closingAgentId.toString() : data.closingAgentId
            }
        };
        appletClientServiceIns.showLoader();
        const response = await FSLambdaAPIService.getInstance().setPayload("ATTACH_CLOSINGAGENT_TO_TRANSACTION", payload).call().call();
        appletClientServiceIns.hideLoader();
        if (response.status === 200) {
            appletClientServiceIns.showSnackBar("Updated Successfully");
            await this.updateClosingAgentRecord(data).bind(this);
        } else {
            appletClientServiceIns.showSnackBar("There is some error while updating",true);
        }
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.CREATE_NEW_CLOSING_AGENT_EVENT, this.onCreateNewClicked.bind(this));
        $(document).on(CustomEventsConstants.STATE_NAME_SELECTED, this.onStateNameSelected.bind(this));
    }

    onStateNameSelected(event, stateId) {
        this.stateId = stateId;
        console.log("state", this.stateId);
    }

    onCreateNewClicked() {
        this.formMode = FormMode.ADD_MODE;
        this.setFormMode();
        this.hideClosingAgentFooterButton();
    }

    hideClosingAgentFooterButton() {
        $(this).find("closing-agent-footer-button").hide();
    }

    showClosingAgentFooterButton() {
        $(this).find("closing-agent-footer-button").show();
        $(this).find("contactsButton").show();
    }

    updateFreeAgent (data,instanceId) {
        let state = AppConstant.STATES.find((state) => state.stateId == data.state);
        let variables = {
            entity : "closing_agent",
            id : instanceId,
            field_values : {
                closing_agent_field77 : typeof data.companyId != "string" ? data.companyId.toString() : data.companyId,
                closing_agent_field23 : data.companyName,
                closing_agent_field24 : data.address,
                closing_agent_field25 : data.address2,
                closing_agent_field26 : data.city,
                closing_agent_field27 : data.state,
                closing_agent_field28 : data.zipCode,
                closing_agent_field98 : data.email,
                closing_agent_field33 : data.phone,
                closing_agent_field66 : state.id || null
            }
        };
        FreeAgentApiService.getFreeAgentApiServiceIns().updateEntityFree(variables,(data) => {
            console.log("Closing Agent Updated");
        });
    }

    async submitForm(formData) {
        appletClientServiceIns.showLoader();
        formData.state = this.stateId;
        let response = await this.awsService.createClosingAgent(formData);
        if(response.status == 200){
            let instanceId = this._componentData.id;
            let transactionId = this._componentData.field_values.closing_agent_field22.display_value;
            this.updateFreeAgent(response.data,instanceId);
            response = await this.updateTransaction(response.data,transactionId);
            appletClientServiceIns.showSnackBar("Closing Agent successfully created");
        }else{
            appletClientServiceIns.showSnackBar("There was an error creating closing agent.",true);
        }

        appletClientServiceIns.hideLoader();
        UtilHelper.navigateTo(ComponentConstant.CLOSINGAGENT_FORM,this._componentData);
    }

    updateTransaction(data,transactionId) {
        let payload = {
            data : {
                transactionId : transactionId,
                companyID : typeof data.companyId != "string" ? data.companyId.toString() : data.companyId
            }
        };
        let fn = "ATTACH_CLOSINGAGENT_TO_TRANSACTION";
        return FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
    }

    onCanceled() {
        super.onCanceled();
        this.formMode = FormMode.READONLY_MODE;
        this.setFormMode();
        this.showClosingAgentFooterButton();
        this.removeValidation();
    }

    removeValidation() {
        $(this).find('.span-required').hide();
    }

    setAppletHeader() {
        if (this._componentData && this._componentData.field_values) {
            $("#transaction-id").html(this._componentData.field_values.closing_agent_field23.display_value || "");
        }
    }

    setHTML() {
        return `
            <form id="closingagent-form">
                <div class="container">
                    <div class="row p-t20">
                        <form-field-alpha-num class="col-md-6" label="Company Name" name="name"></form-field-alpha-num>
                        <form-field-alpha-num class="col-md-6" label="Contact Email" name="email"></form-field-alpha-num>
                    </div>
                    <div class="row p-t20">
                        <form-field-phone min="10" max="18" class="col-md-6" label="Phone" name="phone"></form-field-phone>
                        <form-field-alpha-num class="col-md-6" label="Address" name="address"></form-field-alpha-num>
                    </div>
                    <div class="row p-t20">
                        <form-field-alpha-num class="col-md-6" notRequired="true" label="Address2" name="address2"></form-field-alpha-num>
                        <form-field-alpha-num class="col-md-6" label="City" name="city"></form-field-alpha-num>
                    </div>
                    <div class="row p-t20">
                        <div class="col-md-6">
                            <label class="form-label required">State</label>
                            <state-select required></state-select>
                        </div>
                        <form-field-number min="5" max="5" class="col-md-6" label="Zip" name="zip"></form-field-number>
                    </div>
                    <div class="row p-t20">
                        <form-field-url class="col-md-6" notRequired="true" label="Website" name="website"></form-field-url>
                    </div>
                    <primary-secondary-button class="p-t20" primary="Create" secondary="Cancel" ></primary-secondary-button>
                    <closing-agent-footer-button class="p-t20"></closing-agent-footer-button>
                </div>
            </form>
        `
    }
}

export default window.customElements.define(ComponentConstant.CLOSINGAGENT_FORM, ClosingAgentForm);