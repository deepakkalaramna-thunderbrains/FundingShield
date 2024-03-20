import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldAbaNumberComponent extends FormFieldComponent {

    constructor() {
        super();
        this.min = 1;
        this.max = 300;
    }

    validate(inputVal) {
        return inputVal && inputVal.length > this.min;
    }
}

window.customElements.define("form-field-alpha-num", FormFieldAbaNumberComponent);