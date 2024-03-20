import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { ClosingAgentFilter } from "../closing-agent/ClosingAgentFilter.js";

export class WireFilter extends ClosingAgentFilter {

    constructor() {
        super();
    }

    onBusinessKeypUp(event) {
        this.stateName = true;
        super.onBusinessKeypUp(event);
    }

    setHTML() {
        return `
        <form id="filter-form">
            <div class="container">
                <div class="row">
                    <div class="input-group col-md-9">
                        <input type="text" class="form-control" placeholder="Wire Name" name="company_name" aria-label="Business Name" aria-describedby="button-addon2">
                        <primary-secondary-button filter="true" primary="Find" secondary="Clear"></primary-secondary-button>
                    </div>  
                </div>
            </div>
        </form>`;
    }
}

window.customElements.define(ComponentConstant.WIRE_FILTER, WireFilter);