import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldAlphaNumericComponent extends FormFieldComponent {

    constructor() {
        super();
        this.min = 9;
        this.max = 100;
    }

    validate(inputVal) {
        return inputVal && inputVal.length > this.min;
    }
}

window.customElements.define("form-aba-number", FormFieldAlphaNumericComponent);