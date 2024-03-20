import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldAbaNumberComponent extends FormFieldComponent {

    constructor() {
        super();
        this.min = 0;
        this.max = 1000;
    }

    validate(inputVal) {
        return inputVal && inputVal.length > this.min;
    }
}

window.customElements.define("form-field-alpha-num", FormFieldAbaNumberComponent);