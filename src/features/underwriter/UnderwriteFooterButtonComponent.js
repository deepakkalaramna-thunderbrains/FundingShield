import { PrimaryNSecondaryButtonComponent } from "../../components/PrimaryNSecondaryButtonComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";


export class UnderwriteFooterButtonComponent extends PrimaryNSecondaryButtonComponent {

    constructor() {
        super();
        this.setAttribute("primary", "Create New");
        this.setAttribute("secondary", "Find Underwriter");
    }

    onPrimaryClicked() {
        $(document).trigger(CustomEventsConstants.CREATE_NEW_UNDERWRITER_EVENT);
    }

    onSecondaryClicked() {
        this.navigateBetweenComponents(ComponentConstant.UNDERWRITER_LIST);
        // UtilHelper.navigateTo(ComponentConstant.UNDERWRITER_LIST);
    }
}

window.customElements.define("underwrite-footer-button", UnderwriteFooterButtonComponent);