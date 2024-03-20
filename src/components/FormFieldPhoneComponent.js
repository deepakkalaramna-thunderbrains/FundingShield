import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldPhoneComponent extends FormFieldComponent {

    constructor() {
        super();
    }

    validate(inputVal) {
        const phoneNoRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
        let isValid = phoneNoRegExp.test(inputVal);
        if(isValid){
            let val = typeof inputVal == "string" ? inputVal : inputVal.toString();
            return val.replace(/\D/g,"").length == 10;
        }
        return isValid;
    }
}

window.customElements.define("form-field-phone", FormFieldPhoneComponent);