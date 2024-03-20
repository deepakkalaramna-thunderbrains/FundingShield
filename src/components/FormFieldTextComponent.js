import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldTextComponent extends FormFieldComponent {

    constructor() {
        super();
        this.min = 0;
        this.max = 1000;
    }

    validate(inputVal) {
        let regex = /^[a-zA-Z ]+$/;
        return inputVal && regex.test(inputVal);
    }
}

window.customElements.define("form-field-text", FormFieldTextComponent);