import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldNumberComponent extends FormFieldComponent {

    constructor() {
        super();
    }

    validate(inputVal) {
        return inputVal && !isNaN(inputVal);
    }
}

window.customElements.define("form-field-number", FormFieldNumberComponent);