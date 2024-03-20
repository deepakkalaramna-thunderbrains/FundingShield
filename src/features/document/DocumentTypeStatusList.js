import { DropdownComponent } from "../../components/DropdownComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";

export class DocumentTypeStatusList extends DropdownComponent {

    constructor() {
        super();
        this.selectLabel = "Select Status";
        this.idKey = "value";
        this.valueKey = "displayValue";
    }

    onComponentDataSet(componentData) {
        this.setDropDownData(componentData);
    }

    onDropdownItemSelected(documentType) {
        $(document).trigger(CustomEventsConstants.DOCUMENT_TYPE_SELECTED, documentType);
    }

    extractOutDataFromResponse(response) {
        return response;
    }

    onDropdownItemSelected(item, curElem) {
        $(document).trigger(CustomEventsConstants.DOCUMENT_STATUS_SELECTED, { 
            guardianType: $(curElem).closest("tr").attr("guardianType"), 
            fileName: $(curElem).closest("tr").attr("fileName"), 
            active : curElem.active,
            statusId: item || null
        });
    }
}

export default window.customElements.define(ComponentConstant.DOCUMENT_TYPE_STATUS, DocumentTypeStatusList);