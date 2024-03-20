import { DropdownComponent } from "../../components/DropdownComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

export class EmailTypes extends DropdownComponent {

    constructor() {
        super();
        this.selectLabel = "Please pick the email types";
        this.idKey = "value";
        this.valueKey = "displayValue";
    }

    onComponentDataSet(componentData) {
        // this.setDropDownData(componentData);
    }

    getHttpServiceObj() {
        let httpService = FSLambdaAPIService.getInstance().setPayload("EMAIL_TYPES").call();
        return httpService;
    }

    onDropdownItemSelected(item, curElem) {
        $(document).trigger(CustomEventsConstants.EMAIL_TYPE_SELECTED, { emailType: item });
    }
}

export default window.customElements.define(ComponentConstant.EMAIL_TYPES, EmailTypes);