import { ListComponent } from "../../components/ListComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from "../../constants/CustomEventsConstants.js";
import { ArrayHelper } from "../../helpers/ArrayHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

export class TransactionDocumentList extends ListComponent {

    listData = { data: "" };
    // _componentData = {};
    checkedData = [];
    constructor() {
        super();
    }

    onComponentDataSet(componentData) {
        this.callResourcesAPI();
        // UtilHelper.setComponentData(ComponentConstant.TRANSACTION_DOCUMENT_LIST, componentData);
        // $("#transaction-id").html("");
    }

    buildTable() {
        this.innerHTML = this.setHTML();
        document.querySelectorAll('.form-check-input').forEach(box => {
            box.addEventListener('click', this.inputChecked.bind(this));
        });
    }

    buildPagination() {
        // left empty
    }

    inputChecked (event) {
        $("#max-file-attach-message").hide();
        
        if (event.target.checked) {

            if (this.checkedData.length === 4) {
                $(this).prop("checked", false);
                $("#max-file-attach-message").show();
            } else {
                let checkedData = this.searchByFileUploadId(this.listData.data, $(event.target).attr("id"));
                this.checkedData.push(checkedData);
            }

        } else {

            let unCheckedData = this.searchByFileUploadId(this.checkedData, $(event.target).attr("id"));
            this.checkedData.splice(this.checkedData.indexOf(unCheckedData), 1);
        }
        $(document).trigger(CustomEventsConstants.TRANSACTION_DOCUMENT_LIST_SELECTED, { checkedData: this.checkedData });
    }

    searchByFileUploadId(container, fileUploadId) {
        if (ArrayHelper.isArrayValid(container)) {
            let filteredData = container.find((item) => item.fileUploadID == fileUploadId);
            return filteredData;
        }
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.UNCHECK_TRANSACTION_DOCUMENT_LIST, this.onUncheckTransactionList.bind(this));

    }

    unRegisterEventListenersAfterHTMLRendered() {
        super.unRegisterEventListenersAfterHTMLRendered();
        $(document).off(CustomEventsConstants.UNCHECK_TRANSACTION_DOCUMENT_LIST);
    }

    onUncheckTransactionList() {
        this.checkedData = [];
        $("input:checked").each(function () {
            $(this).prop("checked", false);
        })
    }

    getHttpServiceObj() {
        if (this._componentData) {
            let transactionId = this._componentData.field_values.order_val_field134.display_value;
            let httpService = FSLambdaAPIService.getInstance().setPayload("TRANSACTION_DOCUMENT_LIST", { transactionId }).call();
            return httpService;
        }
    }

    isHttpGetResponseValid(response) {
        // return false;
        return response.status === 200 && response.data.length > 0;
    }

    extractOutDataFromResponse(response) {
        return response.data;
    }

    setHTML() {
        return `<div class="file-attach-wrapper col-12">
        <span class="span-required" style="display:none;" id="max-file-attach-message">You are not allowed to attach more than 4 files</span>
        <label class="form-label w-100 font-weight-bold">File to attach(Max 4)</label>
        <div class="checkbox-group">
            ${this.bindTransactionDocumentList()}
        </div>
    </div>`;
    }

    bindTransactionDocumentList() {
        if (this.listData.data) {
            let htmlStr = "";
            this.listData.data.forEach((item) => {
                if (item.fileType !== "API") {
                    htmlStr += `<div class="form-check">
                    <input type="checkbox" class="form-check-input" id="${item.fileUploadID}"/>
                    <label class="form-check-label" for="${item.fileUploadID}">${item.fileType} (${item.fileName})</label>
                </div>`;
                }
            });
            return htmlStr;
        } else {
            return `<span>No Transaction Document List Found</span>`;
        }
    }
}

export default window.customElements.define(ComponentConstant.TRANSACTION_DOCUMENT_LIST, TransactionDocumentList);