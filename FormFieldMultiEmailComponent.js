import { ArrayHelper } from "../helpers/ArrayHelper.js";
import { FormFieldComponent } from "./FormFieldComponent.js";


export class FormFieldMultiEmailComponent extends FormFieldComponent {

    constructor() {
        super();
    }

    validate(inputVal) {
        let allEmails = inputVal.split(",");
        if (ArrayHelper.isArrayValid(allEmails)) {
            var emlRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            let isEmailValid = true;
            allEmails.forEach((email) => {
                isEmailValid = email && email.length > 3 && emlRegex.test(email);
                if (isEmailValid) {
                    // return false;
                    return;
                }
            })
            return isEmailValid;
        }
        return false;

    }
}

window.customElements.define("form-field-multi-email", FormFieldMultiEmailComponent);