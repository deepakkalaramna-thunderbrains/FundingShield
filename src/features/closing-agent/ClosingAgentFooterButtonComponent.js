import { PrimaryNSecondaryButtonComponent } from "../../components/PrimaryNSecondaryButtonComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";

export class ClosingAgentFooterButtonComponent extends PrimaryNSecondaryButtonComponent {

    constructor() {
        super();
        this.setAttribute("primary", "Create New");
        this.setAttribute("secondary", "Find Closing Agent");
        this.setAttribute("contactsButton","block");
    }

    onPrimaryClicked() {
        $(document).trigger(CustomEventsConstants.CREATE_NEW_CLOSING_AGENT_EVENT);
    }

    onSecondaryClicked() {
        this.navigateBetweenComponents(ComponentConstant.CLOSINGAGENT_LIST);
    }

    onContactsButtonClicked(){
        this.navigateBetweenComponents(ComponentConstant.CONTACT_LIST);
    }
}

window.customElements.define("closing-agent-footer-button", ClosingAgentFooterButtonComponent);