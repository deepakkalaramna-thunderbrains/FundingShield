import { appletClientServiceIns } from "../../AppletClientService.js";
import { FormComponent } from "../../components/FormComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FormMode } from "../../constants/FormMode.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js";
import { ArrayHelper } from "../../helpers/ArrayHelper.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

export class EmailController extends FormComponent {

    emailType = null;
    attachedFile = null;
    emailTemplate = null;
    transactionId = null;

    constructor() {
        super("email-form", FormMode.ADD_MODE);
    }

    onComponentDataSet(componentData) {
        UtilHelper.setComponentData(ComponentConstant.TRANSACTION_DOCUMENT_LIST, componentData);
        this.transactionId = componentData.field_values.order_val_field134.value;
        $("#preview").dialog({modal : true, autoOpen : false});
        document.getElementById("openPreview").addEventListener("click",this.openPreview.bind(this));
        // document.getElementsByName("message")[1].setAttribute("disabled",true);
    }

    openPreview (event) {
        event.preventDefault();
        $("#preview").html(this.formData.preview);
        $("#preview").dialog("open");
        return false;
    }

    formatHTML = (html) => {
        let text = html.replace(/<[^>]+>/g, '');

        let textArray = text.split("\n");

        return textArray.reduce((result,value) => {
            value = value.replace(/\t/g,"").trim();
            let lastChar = value.slice(-1);
            let firstChar = value.charAt(0);

            console.log(lastChar);
            console.log(value);

            if( (value.length > 0 && value.length < 4) || lastChar == "}" || lastChar == ";" || lastChar == "{" || firstChar == "." || firstChar == ","){
                return result;
            }

            if(value == "table,"){
                return result;
            }

            if(!value.length && result != "" && result.split("\n").pop() != ""){
                return result + "\n";
            }

            if(!value.length){
                return result;
            }

            return result + `${value}\n`;
        },"");
    }

    async getEmailTempateByEmailTypeId() {
        appletClientServiceIns.showLoader();
        let httpService = await FSLambdaAPIService.getInstance().setPayload("EMAIL_TEMPLATE", {
            emailTypeId: this.emailType,
            transactionId : this.transactionId
        }).call().call();
        appletClientServiceIns.hideLoader();
        this.formData = {
            subject: httpService.data.emailSubject, 
            message: httpService.data.plainText,//this.formatHTML(httpService.data.html),
            preview : httpService.data.html,
            emailAddress : httpService.data.sendTo,
            alterNetEmailAddress : httpService.data.cc
        };
        this.bindDataToFormFields();
    }

    onSubmitted() {
        super.onSubmitted();
        this.showHideEmailTypeValidationMessage();
    }

    setHTML() {
        return `
            <form id="email-form">
                <div class="container">
                    <div class="row p-t20">
                        <div class="col-md-12">
                            <label class="form-label">Please pick the type of email to send from the list below</label>
                            <email-type></email-type>
                            <span class="span-required" style="display:none;" id="email-type-message">Please Select the Email Type</span>
                        </div>
                    </div>
                    <div class="row p-t20">
                        <div class="col-md-12 subject-form-group">
                            <label class="form-label w-100 font-weight-bold">Email Address</label>
                            <form-field-multi-email class="col-md-6" label="To" id="emailAddress1" name="emailAddress"></form-field-multi-email>
                            <form-field-multi-email notRequired="true" class="col-md-6" label="CC" name="alterNetEmailAddress"></form-field-multi-email>
                            <div class="d-block text-center">(Please seperate them by commas)</div>
                        </div>
                        <div class="col-md-12 subject-form-group">
                            <form-field-alpha-num class="col-md-6" id="subject1" label="Subject" name="subject"></form-field-alpha-num>
                        </div>
                        <div class="col-md-12 subject-form-group message-group input">
                            <div class="row p-t20">
                                <form-field-textarea disabled=true class="col-md-12" label="Message" name="message"></form-field-textarea>
                            </div>
                            <div class="row p-t20">
                                <div class="col-md-9">
                                </div>
                                <div class="col-md-3">
                                    <button style="float: right;" class="btn btn-outline-secondary" id="openPreview">Open Preview</button>
                                </div>
                            </div>
                            <div id="preview"></div>
                        </div>
                    </div>
                    <transaction-document-list></transaction-document-list>
                    <primary-secondary-button class="p-t20" primary="Send" secondary="Reset" ></primary-secondary-button>
                </div>
            </form>`
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.EMAIL_TYPE_SELECTED, this.onEmailTypeSelected.bind(this));
        $(document).on(CustomEventsConstants.TRANSACTION_DOCUMENT_LIST_SELECTED, this.onTransacionDocumentListSelected.bind(this));
    }

    unRegisterEventListenersAfterHTMLRendered() {
        super.unRegisterEventListenersAfterHTMLRendered();
        $(document).off(CustomEventsConstants.EMAIL_TYPE_SELECTED);
        $(document).off(CustomEventsConstants.TRANSACTION_DOCUMENT_LIST_SELECTED);
    }

    onTransacionDocumentListSelected(event, data) {
        this.attachedFile = data.checkedData;
    }

    onEmailTypeSelected(event, emailType) {
        this.emailType = emailType.emailType;
        this.getEmailTempateByEmailTypeId();
    }



    showHideEmailTypeValidationMessage() {
        if (this.emailType) {
            $("#email-type-message").hide();
            return true;
        } else {
            $("#email-type-message").show();
            return false;
        }
    }

    validateDate (date){
        date = new Date(date);

        return date.getTime() == date.getTime()
    }

    async submitForm(formData) {
        if (this.showHideEmailTypeValidationMessage()) {
            formData.transactionId = this._componentData.field_values.order_val_field134.display_value;
            formData.emailType = this.emailType;
            formData.documentsLists = this.attachedFile;
            formData.entityId = this._componentData.entityId;
            formData.instanceId = this._componentData.id;
            formData.message = this.formData.preview;
            appletClientServiceIns.showLoader();
            let httpService = await FSLambdaAPIService.getInstance().setPayload("SEND_EMAIL", formData).call().call();
            appletClientServiceIns.hideLoader();
            if (httpService.status === 200 && !!httpService.data) {
                appletClientServiceIns.showSnackBar("Email sent successfully");
                $(document).trigger(CustomEventsConstants.UNCHECK_TRANSACTION_DOCUMENT_LIST);
                let certDateFromFS = httpService.data || '';
                certDateFromFS = certDateFromFS.indexOf('Z') !== -1 ? certDateFromFS : certDateFromFS + ' UTC';
                console.log('certDate from FS:', certDateFromFS);
                let variables = {
                    order_val_field133 : "984cfc05-34cc-426b-bfce-42234cf08202",
                    order_val_field5 : !!httpService.data && this.validateDate(certDateFromFS) ? new Date(certDateFromFS).toISOString() : null
                };

                FreeAgentApiService.getFreeAgentApiServiceIns("order_val", this._componentData.id).updateEntity(variables, (data) => {
                    console.log("updated");
                });
                this.attachedFile = null;
                this.resetFormFields();
            } else {
                appletClientServiceIns.showSnackBar("There is an error while sending an email",true);
            }
        }
    }
}

export default window.customElements.define(ComponentConstant.EMAIL_FORM, EmailController);