import { ComponentConstant } from '../constants/ComponentConstant.js';
import { CustomEventsConstants } from '../constants/CustomEventsConstants.js';
import { FormMode } from '../constants/FormMode.js';
import { BaseComponents } from './BaseComponents.js'
import { AWSService } from "../services/AWSService.js";

export class FormComponent extends BaseComponents {

    formMode = null;
    formData = null;
    formSelector = null;
    constructor(formSelector, formMode) {
        super();
        this.awsService = new AWSService();
        this.formSelector = formSelector;
        this.formMode = formMode || FormMode.ADD_MODE;
    }

    connectedCallback() {
        super.connectedCallback();
        this.setFormMode();
    }
    setFormMode() {
        switch (this.formMode) {
            case FormMode.ADD_MODE:
                this.setFormModeAdd();
                break;
            case FormMode.READONLY_MODE:
                this.setFormModeReadOnly();
                break;
            case FormMode.EDIT_MODE:
                this.setFormModeEdit();
                break;
            default:
                this.setFormModeAdd();
                break;
        }
    }

    setFormModeAdd() {
        this.removeFormFieldReadOnly();
        this.resetFormFields();
        this.showSubmitNCancelButton();
    }

    setFormModeEdit() {
        this.removeFormFieldReadOnly();
        this.showSubmitNCancelButton();
        this.bindDataToFormFields();
    }

    setFormModeReadOnly() {
        this.bindDataToFormFields();
        this.makeFormFieldReadOnly();
        this.hideSubmitNCancelButton();
    }

    resetFormFields() {
        this.formFieldIterator((currentElement) => {
            $(currentElement).val("");
        });
    }

    bindDataToFormFields() {
        if (this.formData) {
            this.formFieldIterator((currentElement) => {
                let fieldName = $(currentElement).attr("name");
                if (fieldName in this.formData) {
                    $(currentElement).val(this.formData[fieldName]);
                }
            });
        }
    }

    registerEventListenersAfterHTMLRendered() {
        $(document).on(CustomEventsConstants.PRIMARY_BUTTON_CLICKED, this.onSubmitted.bind(this));
        $(document).on(CustomEventsConstants.SECONDARY_BUTTON_CLICKED, this.onCanceled.bind(this));
    }

    unRegisterEventListenersAfterHTMLRendered() {
        console.log("form unregistered");
        $(document).off(CustomEventsConstants.PRIMARY_BUTTON_CLICKED);
        $(document).off(CustomEventsConstants.SECONDARY_BUTTON_CLICKED);
    }

    onSubmitted() {
        const formData = this.preSubmitForm();
        const isFormValidated = this.validateForm();
        if (isFormValidated) {
            this.submitForm(formData);
        }
    }

    validateForm() {
        let isFormValidated = false;
        const formFieldElem = "form-aba-number,form-field-text,form-field-email,form-field-number,form-field-url,form-field-phone,form-field-multi-email,form-field-textarea,form-field-alpha-num";
        this.getFormElem().find(formFieldElem).each(function (curElem) {
            isFormValidated = this.validateField($(this).find(":input"));
        });
        return isFormValidated;
    }

    onCanceled() {
        this.resetFormFields();
    }

    submitForm(formData) {

    }

    getFormElem() {
        return $("form#" + this.formSelector);
    }

    preSubmitForm() {
        let formInput = this.getFormElem().serializeArray();
        let formData = {};
        for (let index = 0; index < formInput.length; index++) {
            formData[formInput[index].name] = formInput[index].value;
        }
        return formData;
    }

    makeFormFieldReadOnly() {
        this.formFieldIterator((currentElement) => {
            this.disableFormField(currentElement);
        });
    }

    removeFormFieldReadOnly() {
        this.formFieldIterator((currentElement) => {
            this.enableFormField(currentElement);
        });
    }

    hideSubmitNCancelButton() {
        $(this).find(`#${this.formSelector} ${ComponentConstant.PRIMARY_SECONDARY_BUTTON}`).hide();
    }

    showSubmitNCancelButton() {
        $(this).find(`#${this.formSelector} ${ComponentConstant.PRIMARY_SECONDARY_BUTTON}`).show();
    }

    disableFormField(formField) {
        $(formField).attr("disabled", true).removeClass("enable-control");
    }

    enableFormField(formField) {
        $(formField).removeAttr("disabled").addClass("enable-control");
    }

    formFieldIterator(callback) {
        $("#" + this.formSelector).find(":input").each(function () {
            if ($(this).attr("type") !== "button") {
                callback(this);
            }
        });
    }

    formSubmitted(event) {
        event.preventDefault();
        let data = this.preFormSubmitted(event);
        this.postFormSubmitted(data);
    }

    preFormSubmitted(event) {
       
    }
}