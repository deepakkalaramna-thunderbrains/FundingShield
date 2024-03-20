import { appletClientServiceIns } from "../../AppletClientService.js";
import { FormComponent } from "../../components/FormComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FormMode } from "../../constants/FormMode.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

class UnderwriterForm extends FormComponent {

    constructor() {
        super("underwriter-form", FormMode.READONLY_MODE);
    }

    onComponentDataSet(componentData) {
        UtilHelper.setComponentData(ComponentConstant.UNDERWRITER_FOOTER_BUTTON, componentData);
        this.formData = {};
        if (componentData.update) {
            this.formData.name = componentData.selectedRowData.underwriterName;
            this.formData.address = componentData.selectedRowData.underwriterAddress1;
            this.formData.address2 = componentData.selectedRowData.underwriterAddress2;
            this.formData.city = componentData.selectedRowData.underwriterCity;
            this.formData.zip = componentData.selectedRowData.underwriterZipCode;
            this.formData.state = componentData.selectedRowData.underwriterState;
            this.updateDataToFS(componentData.selectedRowData);
        } else {
            this.setFormDataFromFieldValues(componentData);
        }
        this.formMode = FormMode.READONLY_MODE;
        this.setFormMode();
        $(document).trigger(CustomEventsConstants.BIND_STATE_NAME, this.formData.state);
        $("#transaction-id").html(this.formData.name);
    }

    async updateDataToFS(data) {
        const payload = { 
            transactionId: this._componentData.field_values.underwriter_field19.display_value, 
            companyID : data.underwriterId
        };
        appletClientServiceIns.showLoader();
        let response = await FSLambdaAPIService.getInstance().setPayload("ATTACH_UNDERWRITER_TO_TRANSACTION", payload).call().call();
        appletClientServiceIns.hideLoader();
        if (response.status === 200) {
            await this.updateData(data);
            appletClientServiceIns.showSnackBar("Updated Successfully");
        } else {
            appletClientServiceIns.showSnackBar("There is an error while updating",true);
        }
    }

    async updateData(componentData) {
        let underwriterId = typeof componentData.underwriterId == "number" ? componentData.underwriterId.toString() : componentData.underwriterId;
        const fieldValues = { 
            underwriter_field0: componentData.underwriterName, 
            underwriter_field1: componentData.underwriterAddress1, 
            underwriter_field2: componentData.underwriterAddress2, 
            underwriter_field3: componentData.underwriterCity, 
            underwriter_field4: componentData.underwriterState, 
            underwriter_field5: componentData.underwriterZipCode,
            underwriter_field25 : underwriterId
        };
        FreeAgentApiService.getFreeAgentApiServiceIns("underwriter", this._componentData.id).updateEntity(fieldValues, (data) => {
            console.log("updated underwirte");
        });
    }

    setFormDataFromFieldValues(componentData) {
        if (componentData.field_values) {
            this.formData.name = componentData.field_values.underwriter_field0.display_value;
            this.formData.address = componentData.field_values.underwriter_field1.display_value
            this.formData.address2 = componentData.field_values.underwriter_field2.display_value
            this.formData.city = componentData.field_values.underwriter_field3.display_value;
            this.formData.state = componentData.field_values.underwriter_field4.display_value;
            this.formData.zip = componentData.field_values.underwriter_field5.display_value;
        }
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.CREATE_NEW_UNDERWRITER_EVENT, this.onCreateNewClicked.bind(this));
    }

    postRenderHTML() {
        super.postRenderHTML();
        UtilHelper.getComponentDomIns(ComponentConstant.UNDERWRITER_FOOTER_BUTTON).hidePrimaryButton();
    }

    onCreateNewClicked() {
        this.formMode = FormMode.ADD_MODE;
        this.setFormMode();
        this.hideUnderwriterFooterButton();
    }

    hideUnderwriterFooterButton() {
        $(this).find("underwrite-footer-button").hide();
    }

    showUnderwriteFooterButton() {
        $(this).find("underwrite-footer-button").show();
    }

    submitForm(formData) {
        console.log("formData", formData);
    }

    onCanceled() {
        super.onCanceled();
        this.formMode = FormMode.READONLY_MODE;
        this.setFormMode();
        this.showUnderwriteFooterButton();
        this.removeValidation();
    }

    removeValidation() {
        $(this).find('.span-required').hide();
    }

    setAppletHeader() {
        if (this._componentData && this._componentData.field_values) {
            // $(this).find("#title").html(componentData.appletTitle);
            $("#transaction-id").html(this._componentData.field_values.underwriter_field0.display_value || "");
        }
    }

    setHTML() {
        return `
        <form id="underwriter-form">
            <div class="container">
                <div class="row">
                    <form-field-text class="col-md-6" label="Business Name" name="name"></form-field-text>
                    <form-field-text class="col-md-6" label="Address" name="address"></form-field-text>
                </div>

                <div class="row">
                    <form-field-text class="col-md-6" label="Address 2" name="address2"></form-field-text>
                    <form-field-text class="col-md-6" label="City" name="city"></form-field-text>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label">State</label>
                        <state-select></state-select>
                    </div>
                    <form-field-number min="5" max="5" class="col-md-6" label="Zip" name="zip"></form-field-number>
                </div>
                <primary-secondary-button primary="Create" secondary="Cancel"></primary-secondary-button>
                <underwrite-footer-button></underwrite-footer-button>
            </div>
        </form>
        `
    }

}

export default window.customElements.define(ComponentConstant.UNDERWRITER_FORM, UnderwriterForm);