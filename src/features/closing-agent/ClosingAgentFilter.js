import { FormComponent } from "../../components/FormComponent.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FormMode } from "../../constants/FormMode.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";

export class ClosingAgentFilter extends FormComponent {

    stateName = null;
    searchedCompanyName = null;
    constructor() {
        super("filter-form", FormMode.ADD_MODE);
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.STATE_NAME_SELECTED, this.onStateSelected.bind(this));
        $("form#" + this.formSelector).keydown(this.onEnterPressed.bind(this));
        $("form#" + this.formSelector).find("input[name=company_name]").keyup(this.onBusinessKeypUp.bind(this));
    }

    onEnterPressed(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            this.enableOrDisableFilterButtons(this.searchedCompanyName, this.searchedCompanyName, this.stateName);
            if (this.searchedCompanyName && this.stateName) {
                this.onSubmitted();
            }
            return false;
        }
    }

    setFormModeAdd() {
        super.setFormModeAdd();
    }

    validateForm() {
        return true;
    }

    unRegisterEventListenersAfterHTMLRendered() {
        super.unRegisterEventListenersAfterHTMLRendered();
        $(document).off(CustomEventsConstants.STATE_NAME_SELECTED);
        $("form#" + this.formSelector).off("keydown");
    }

    onBusinessKeypUp(event) {
        this.enableOrDisableFilterButtons(this.searchedCompanyName, event.target.value, this.stateName);
        this.searchedCompanyName = event.target.value;
    }

    onCanceled() {
        this.stateName = null;
        this.searchedCompanyName = null;
        this.resetFormFields();
        UtilHelper.makeButtonDisabled($(this).find(`primary-secondary-button input[type='button']`));
        $(document).trigger(CustomEventsConstants.CLEAR_TABLE_RECORDS);
    }

    enableOrDisableFilterButtons(curVal, nextVal, entityVal) { // entityVal can be state name or company name
        if (this.isFilterFormValid(curVal, nextVal, entityVal)) {
            UtilHelper.makeButtonEnabled($(this).find(`primary-secondary-button input[type='button']`));
        } else if ((curVal && !nextVal)) {
            UtilHelper.makeButtonDisabled($(this).find(`primary-secondary-button input[type='button']`));
        }
    }

    isFilterFormValid(curVal, nextVal, entityVal) {
        const isValid = ((!curVal && nextVal) && entityVal);
        console.log("isValid", isValid);
        return isValid;
    }

    postRenderHTML() {
        super.postRenderHTML();
        UtilHelper.makeButtonDisabled($(this).find(`primary-secondary-button input[type='button']`));
    }

    submitForm(formData) {
        formData.state_name = this.stateName;
        $(document).trigger(CustomEventsConstants.SEARCH_CLOSING_AGENT_RECORDS, formData);
    }

    onStateSelected(event, stateName) {
        this.enableOrDisableFilterButtons(this.stateName, stateName, this.searchedCompanyName);
        this.stateName = stateName;
    }

    setHTML() {
        return `
        <form id="filter-form">
            <div class="container">
                <div class="row">
                    <div class="col-md-3">
                        <state-select></state-select>
                    </div>
                    <div class="input-group col-md-9">
                        <input type="text" class="form-control" placeholder="Company Name" name="company_name" aria-label="Company Name" aria-describedby="button-addon2">
                        <input type="text" class="form-control enable-control" placeholder="Street Address" name="street_address" aria-label="Street Address">
                        <input type="text" class="form-control enable-control" placeholder="Zip Code" name="zip_code" aria-label="Zip Code">
                    </div>
                    <div class="input-group col-md-3 mt-2 ml-auto">
                        <primary-secondary-button filter="true" primary="Find" secondary="Clear"></primary-secondary-button>
                    </div>
                </div>
            </div>
        </form>
    `;
    }
}


window.customElements.define('closing-agent-filter', ClosingAgentFilter);