import { FormFieldComponent } from "./FormFieldComponent.js";

export class FormFieldURLComponent extends FormFieldComponent {

    constructor() {
        super();
        this.min = 3;
        this.max = 64;
    }

    validate(inputVal) {
        const webSiteRegex = /^((http|https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
        return webSiteRegex.test(inputVal);
    }
}

window.customElements.define("form-field-url", FormFieldURLComponent);