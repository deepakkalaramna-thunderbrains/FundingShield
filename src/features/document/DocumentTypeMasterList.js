import { DropdownComponent } from "../../components/DropdownComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

export class DocumentTypeMasterList extends DropdownComponent {

    constructor() {
        super();
        this.selectLabel = "Select Your File Type";
        this.idKey = "value";
        this.valueKey = "displayValue";
    }

    getHttpServiceObj() {
        let httpService = FSLambdaAPIService.getInstance().setPayload("MASTER_DOCUMENT_TYPE").call();
        return httpService;
    }

    onDropdownItemSelected(documentType) {
        $(document).trigger(CustomEventsConstants.DOCUMENT_TYPE_SELECTED, documentType);
    }
}

export default window.customElements.define(ComponentConstant.DOCUMENT_TYPE_MASTER_LIST, DocumentTypeMasterList);