import { FormFieldComponent } from "./FormFieldComponent.js";


export class FormFieldEmailComponent extends FormFieldComponent {

    constructor() {
        super();
    }

    validate(inputVal) {
        var emlRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return inputVal && inputVal.length > 3 && emlRegex.test(inputVal);
    }
}

window.customElements.define("form-field-email", FormFieldEmailComponent);