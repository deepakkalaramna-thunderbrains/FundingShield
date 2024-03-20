import { PrimaryNSecondaryButtonComponent } from "../../components/PrimaryNSecondaryButtonComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";

export class ContactFooterButtonComponent extends PrimaryNSecondaryButtonComponent {

    constructor() {
        super();
        this.setAttribute("primary", "Create New");
        this.setAttribute("secondary", "Find Wire");
    }

    onPrimaryClicked() {
        $(document).trigger(CustomEventsConstants.CREATE_NEW_WIRE_EVENT);
    }

    onSecondaryClicked() {
        this.navigateBetweenComponents(ComponentConstant.WIRE_LIST);
    }
}

window.customElements.define(ComponentConstant.CONTACT_FOOTER_BUTTON, ContactFooterButtonComponent);