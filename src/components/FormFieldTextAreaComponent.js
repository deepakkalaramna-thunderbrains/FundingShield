import { FormFieldAlphaNumericComponent } from "./FormFieldAlphaNumericComponent.js";

export class FormFieldTextAreaComponent extends FormFieldAlphaNumericComponent {

    constructor() {
        super();
        this.min = 0;
        this.max = 999999999999;
    }

    getFieldTypeHTML() {
        return `<textarea name="${this.getFieldName()}"></textarea>`;
    }

}

window.customElements.define("form-field-textarea", FormFieldTextAreaComponent);