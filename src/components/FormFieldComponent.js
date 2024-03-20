import { FragementComponent } from './../components/FragementComponent.js';
export class FormFieldComponent extends FragementComponent {

    min = 0;
    max = 2048;
    constructor() {
        super();
    }

    getLabel() {
        return this.getAttribute("label");
    }

    getFieldName() {
        return this.getAttribute("name");
    }

    getNotRequired (){
        return this.getAttribute("notRequired");
    }

    validateMinNMax(inputVal, minVal, maxVal) {
        let inputLength = inputVal.length;
        return inputLength >= minVal && inputLength <= maxVal;
    }

    compareMinNMax(inputVal) {
        let minVal = this.getAttribute("min") || this.min;
        let maxVal = this.getAttribute("max") || this.max;
        let validateMinNMax = this.validateMinNMax(inputVal, minVal, maxVal);
        return validateMinNMax;
    }

    isNotRequired(field) {
        return $(field).attr("notRequired") ? true : false;
    }

    setHTML() {
        let label = this.getLabel();
        return `
            <div>
                <label class="form-label ${this.getNotRequired() ? "" : "required"}">${label}</label>
                ${this.getFieldTypeHTML()}
                ${this.getNotRequired() ? "" : `<span class="span-required" style="display: none;">Please enter valid ${label}</span>`}
            </div>`;
    }

    getFieldTypeHTML() {
        return `<input type="text" ${this.getNotRequired() ? "notRequired='true'" : ""} class="form-control" name="${this.getFieldName()}">`;
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        let self = this;
        $(this).find(":input").keyup(function () {
            self.validateField.call(self, this);
        });

        $(this).find(":input").blur(function () {
            self.validateField.call(self, this);
        });
    }

    validateField(formField) {
        let message = $(formField).next(".span-required");
        let isFieldValid = this.isFieldValid(formField);
        if (isFieldValid) {
            message.hide();
        } else {
            message.show();
        }
        return isFieldValid;
    }

    isFieldValid(formField) {
        if(this.isNotRequired(formField)){
            return true;
        }
        let inputVal = this.getFieldValue(formField);
        return this.validate(inputVal) && this.compareMinNMax(inputVal);
    }

    getFieldValue(curElem) {
        return $(curElem).val();
    }

    validate(inputVal) {

    }
}

// window.customElements.define("form-field", FormFieldComponent);