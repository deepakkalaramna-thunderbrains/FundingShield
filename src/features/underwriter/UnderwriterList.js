import { ListWithFilteredComponent } from "../../components/ListWithFilteredComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";
class UnderwriterList extends ListWithFilteredComponent {

    selectedRowData = null;
    listData = {
        tableConf: [
            {
                colName: "Business Name",
                dataKeyName: "underwriterName"
            },
            {
                colName: "Address",
                dataKeyName: "underwriterAddress1"
            },
            {
                colName: "Address 2",
                dataKeyName: "underwriterAddress2"
            },
            {
                colName: "City",
                dataKeyName: "underwriterCity"
            },
            {
                colName: "State",
                dataKeyName: "underwriterState"
            },
            {
                colName: "Zip",
                dataKeyName: "underwriterZipCode"
            }
        ],
        data: null
    }

    constructor() {
        super();
    }

    setHTML() {
        return `
        <underwriter-filter></underwriter-filter>
        <div class="container">
            <table-comp></table-comp>
        </div>
        
        <div class="container">
            <div class="row p-t20">
                    <div class="col-6">
                        <input type="button" name="update" class="btn btn-outline-info" value="Update">
                    </div>
                    <div class="col-6">
                        <input type="button" name="cancel" class="btn btn-outline-secondary right" value="Cancel">
                    </div>
                </div>
            </div>
            <pagination-component></pagination-component>
        </div>`;
    }

    onRowSelected(event, rowData) {
        this.selectedRowData = rowData;
    }

    getHttpServiceObj() {
        if (this.userFilteredInput) {
            let httpService = FSLambdaAPIService.getInstance().setPayload("GET_UNDERWRITER_LIST", { name: this.userFilteredInput.company_name, pageNumber: this.paginationDetails.pageNumber, pageSize: this.paginationDetails.pageSize }).call();
            return httpService;
        }
    }

    afterHttpGetSuccess(response) {
        super.afterHttpGetSuccess(response);
        this.getUpdateButton().show();
    }

    isHttpGetResponseValid(response) {
        return response.status === 200 && response.data.totalRecords > 0;
    }

    extractOutDataFromResponse(response) {
        return response.data.underwriterRecords;
    }

    onFiltered(event, filteredData) {
        super.onFiltered(event, filteredData);
        this.callResourcesAPI();
    }

    onFilterCleared() {
        super.onFilterCleared();
        this.getUpdateButton().hide();
    }

    getUpdateButton() {
        return $(this).find("input[name='update']");
    }

    getCancelButton() {
        return $(this).find("input[name='cancel']");
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();

        this.getUpdateButton().click(() => {
            if (this.selectedRowData) {
                this._componentData.update = true;
                this._componentData.selectedRowData = this.selectedRowData;
                this.navigateBetweenComponents(ComponentConstant.UNDERWRITER_FORM);
            }

        });
        this.getUpdateButton().hide();
        this.getCancelButton().click(() => {
            UtilHelper.navigateTo(ComponentConstant.UNDERWRITER_FORM);
        });
    }

    searchListDataByFilter(dataItem, filteredData) {
        return dataItem.name.toLowerCase().indexOf(filteredData.company_name.toLowerCase()) >= 0 && dataItem.state.toLowerCase().indexOf(filteredData.state_name.toLowerCase()) >= 0;
    }
}

export default window.customElements.define(ComponentConstant.UNDERWRITER_LIST, UnderwriterList);