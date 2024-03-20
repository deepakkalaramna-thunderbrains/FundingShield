import { appletClientServiceIns } from "../../AppletClientService.js";
import { FormComponent } from "../../components/FormComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FormMode } from "../../constants/FormMode.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

class ContactForm extends FormComponent {

    componentData = null;
    
    constructor() {
        super("contact-form", FormMode.ADD_MODE);
    }

    onComponentDataSet(componentData) {
        this.componentData = componentData;
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        this.getPrimaryButton().click(this.onCreateNewClicked.bind(this));
    }

    async submitForm(formData) {
        appletClientServiceIns.showLoader();
        let payload = {
            companyID : this.componentData.field_values.closing_agent_field77.value,
            firstName : formData.first_name,
            lastName : formData.last_name,
            email : formData.email,
            phone : formData.phone,
            active : true
        }
        let fn = "INSERT_UPDATE_CLOSING_AGENT_CONTACT";
        let response = await FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
        if(response.status == 200){
            response = await this.updateTransaction(this.componentData.field_values.closing_agent_field22.display_value,response.data.contactID);
            if(response.status == 200){
                this.updateClosingAgent(this.componentData.id,formData);
                await this.timeout(3000);
                appletClientServiceIns.hideLoader();
                appletClientServiceIns.showSnackBar("Contact Created Successfully");
                UtilHelper.navigateTo(ComponentConstant.CONTACT_LIST,this.componentData);
                return;
            }
        }
        await this.timeout(3000);
        appletClientServiceIns.hideLoader();
        appletClientServiceIns.showSnackBar("There was an error creating contact.",true);
        UtilHelper.navigateTo(ComponentConstant.CONTACT_LIST,this.componentData);
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateTransaction(transactionId,contactId) {
        let payload = {
            transactionID : transactionId,
            contactID : contactId
        };
        let fn = "ATTACH_CONTACT_TO_TRANSACTION";
        return FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
    }

    updateClosingAgent(closingAgentId,contact) {
        let variables = {
            entity : "closing_agent",
            id : closingAgentId,
            field_values : {
                closing_agent_field98 : contact.email,
                closing_agent_field33 : contact.phone,
                closing_agent_field34 : contact.first_name,
                closing_agent_field35 : contact.last_name,
                closing_agent_field99 : contact.email
            }
        };
        FreeAgentApiService.getFreeAgentApiServiceIns().updateEntityFree(variables,(data) => {
            console.log("Closing Agent Updated");
        });
    }

    onCanceled() {
        super.onCanceled();
        UtilHelper.navigateTo(ComponentConstant.CONTACT_LIST,this.componentData);
    }

    removeValidation() {
        $(this).find('.span-required').hide();
    }

    setHTML() {
        return `
        <form id="contact-form">
            <fieldset style="border:1px solid red;">
                <legend style="background:#fff;">Contact Form</legend>
                <div class="container">
                    <div class="row">
                        <form-field-alpha-num class="col-md-6" label="First Name" name="first_name"></form-field-alpha-num>
                        <form-field-alpha-num class="col-md-6" label="Last Name" name="last_name"></form-field-alpha-num>
                    </div>

                    <div class="row">
                        <form-field-alpha-num class="col-md-6" label="Email" name="email"></form-field-alpha-num>

                        <form-field-phone class="col-md-6" label="Phone" name="phone"></form-field-phone>
                    </div>
                    <primary-secondary-button primary="Create" secondary="Cancel"></primary-secondary-button>
                </div>
            </fieldset>
        </form>
        `}
}

window.customElements.define(ComponentConstant.CONTACT_FORM, ContactForm);