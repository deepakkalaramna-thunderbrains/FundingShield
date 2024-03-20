import { FormComponent } from "../../components/FormComponent.js";
import { FormMode } from "../../constants/FormMode.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { ClosingAgentFilter } from "../closing-agent/ClosingAgentFilter.js";

export class LenderFilter extends ClosingAgentFilter {

    constructor() {
        super();
    }

    // postRenderHTML() {
    //     super.postRenderHTML();
    //     console.log("sss");
    // }

    // registerEventListenersAfterHTMLRendered() {
    //     super.registerEventListenersAfterHTMLRendered();
    //     $(this).find("input[name='primary']").show();
    // }

    setHTML() {
        return `
        <form id="filter-form">
            <div class="container">
                <div class="row">
                    <div class="col-md-3">
                        <state-select></state-select>
                    </div>
                    <div class="input-group col-md-9">
                        <input type="text" class="form-control" name="company_name" placeholder="Lender Name" aria-label="Lender Name" aria-describedby="button-addon2">
                        <primary-secondary-button filter="true" primary="Find" secondary="Clear"></primary-secondary-button>
                    </div>
                    
                </div>
            <div>
        </form>`;
    }

    // registerEventListenersAfterHTMLRendered() {
    //     super.registerEventListenersAfterHTMLRendered();
    //     $(document).on(CustomEventsConstants.STATE_NAME_SELECTED, this.onStateSelected.bind(this));
    //     $("form#" + this.formSelector).find("input[name=lender_name]").keyup(this.onBusinessKeypUp.bind(this));
    // }

    // unRegisterEventListenersAfterHTMLRendered() {
    //     super.unRegisterEventListenersAfterHTMLRendered();
    //     $(document).off(CustomEventsConstants.STATE_NAME_SELECTED);
    // }

    // onBusinessKeypUp(event) {
    //     this.enableOrDisableFilterButtons(this.searchedCompanyName, event.target.value, this.stateName);
    //     this.searchedCompanyName = event.target.value;
    // }

    // onCanceled() {
    //     this.stateName = null;
    //     this.searchedCompanyName = null;
    //     this.resetFormFields();
    //     // $(document).trigger(CustomEventsConstants.PRIMARY_SECONDARY_DISABLE_BUTTONS);
    //     UtilHelper.makeButtonDisabled($(this).find(`primary-secondary-button input[type='button']`));
    //     $(document).trigger(CustomEventsConstants.CLEAR_TABLE_RECORDS);
    // }

    // enableOrDisableFilterButtons(curVal, nextVal, entityVal) { // entityVal can be state name or company name
    //     if ((!curVal && nextVal) && entityVal) {
    //         // $(document).trigger(CustomEventsConstants.PRIMARY_SECONDARY_ENABLE_BUTTONS);
    //         UtilHelper.makeButtonEnabled($(this).find(`primary-secondary-button input[type='button']`));
    //     } else if ((curVal && !nextVal)) {
    //         UtilHelper.makeButtonDisabled($(this).find(`primary-secondary-button input[type='button']`));
    //         // $(document).trigger(CustomEventsConstants.PRIMARY_SECONDARY_DISABLE_BUTTONS);
    //     }
    // }

    // postRenderHTML() {
    //     super.postRenderHTML();
    //     UtilHelper.makeButtonDisabled($(this).find(`primary-secondary-button input[type='button']`));
    //     // $(document).trigger(CustomEventsConstants.PRIMARY_SECONDARY_DISABLE_BUTTONS);
    // }

    // submitForm(formData) {
    //     formData.state_name = this.stateName;
    //     console.log("form submitted", formData);
    //     $(document).trigger(CustomEventsConstants.SEARCH_CLOSING_AGENT_RECORDS, formData);
    // }

    // onStateSelected(event, stateName) {
    //     this.enableOrDisableFilterButtons(this.stateName, stateName, this.searchedCompanyName);
    //     this.stateName = stateName;
    //     console.log("this.stateName", this.stateName);
    // }


}

window.customElements.define('lender-filter', LenderFilter);
//export default window.customElements.define(ComponentConstant.Lender_FILTER, LenderFilter);