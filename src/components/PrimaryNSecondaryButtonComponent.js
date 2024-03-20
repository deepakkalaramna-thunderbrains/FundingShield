import { CustomEventsConstants } from "../constants/CustomEventsConstants.js";
import { FragementComponent } from "./FragementComponent.js";

export class PrimaryNSecondaryButtonComponent extends FragementComponent {

    constructor() {
        super();
    }

    setHTML() {
        console.log("Contacts",this.getAttribute("contactsButton"));
        let className = this.getAttribute("filter") ? "m-l10" : "p-t20";
        return `
            <div class="row ${className}">
                <div class="col-5">
                    <input type="button" name="primary" class="btn btn-outline-info" value="${this.getAttribute("primary")}">
                </div>
                <div class="col-7">
                    <input style="float: left; display:${this.getAttribute("contactsButton") || "none"};" type="button" name="contactsButton" class="btn btn-outline-success" value="Contacts">
                    <input style="float: right;" type="button" name="secondary" class="btn btn-outline-secondary" value="${this.getAttribute("secondary")}">
                </div>
            </div>`
            ;
    }

    postRenderHTML() {
        super.postRenderHTML();
    }

    getPrimaryButton() {
        return $(this).find("input[name=primary]");
    }

    getSecondaryButton() {
        return $(this).find("input[name=secondary]");
    }

    getContactsButton(){
        return $(this).find("input[name=contactsButton]");
    }

    registerEventListenersAfterHTMLRendered() {
        let self = this;
        // this.getPrimaryButton().click(function (event) {
        //     self.onPrimaryClicked();
        // });
        this.getPrimaryButton().click(this.onPrimaryClicked.bind(this));
        // this.getSecondaryButton().click(function () {
        //     self.onSecondaryClicked();
        // });
        this.getSecondaryButton().click(this.onSecondaryClicked.bind(this))

        this.getContactsButton().click(this.onContactsButtonClicked.bind(this));
        // $(document).on(CustomEventsConstants.PRIMARY_SECONDARY_DISABLE_BUTTONS, this.disableButtons.bind(this));

        // $(document).on(CustomEventsConstants.PRIMARY_SECONDARY_ENABLE_BUTTONS, this.enableButtons.bind(this));
    }

    unRegisterEventListenersAfterHTMLRendered() {
        super.unRegisterEventListenersAfterHTMLRendered();
        // $(document).off(CustomEventsConstants.PRIMARY_SECONDARY_DISABLE_BUTTONS);
        // $(document).off(CustomEventsConstants.PRIMARY_SECONDARY_ENABLE_BUTTONS);
    }

    disableButtons() {
        this.getPrimaryButton().attr("disabled", "disabled").addClass("disabled-color");
        this.getSecondaryButton().attr("disabled", "disabled").addClass("disabled-color");
    }

    enableButtons() {
        this.getPrimaryButton().removeAttr("disabled").removeClass("disabled-color");
        this.getSecondaryButton().removeAttr("disabled").removeClass("disabled-color");
    }

    onPrimaryClicked() {
        $(document).trigger(CustomEventsConstants.PRIMARY_BUTTON_CLICKED);
    }

    hidePrimaryButton() {
        $(this).find("input[name=primary]").hide();
    }

    onSecondaryClicked() {
        $(document).trigger(CustomEventsConstants.SECONDARY_BUTTON_CLICKED);
    }

    onContactsButtonClicked(){
        
    }
}

window.customElements.define("primary-secondary-button", PrimaryNSecondaryButtonComponent);