import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldTextComponent extends FormFieldComponent {

    constructor() {
        super();
        this.min = 2;
        this.max = 300;
    }

    validate(inputVal) {
        let regex = /^[a-zA-Z ]+$/;
        return inputVal && regex.test(inputVal);
    }
}

window.customElements.define("form-field-text", FormFieldTextComponent);