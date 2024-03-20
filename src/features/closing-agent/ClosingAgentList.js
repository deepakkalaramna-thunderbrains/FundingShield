import { ListWithFilteredComponent } from "../../components/ListWithFilteredComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { ArrayHelper } from "../../helpers/ArrayHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";
class ClosingAgentList extends ListWithFilteredComponent {

    selectedRowData = null;
    listData = {
        tableConf: [
            {
                colName: "Company Name",
                dataKeyName: "closingAgentName"
            },
            {
                colName: "Contact Email",
                dataKeyName: "closingAgentEmail"
            },
            {
                colName: "Phone",
                dataKeyName: "closingAgentPhone"
            },
            {
                colName: "Address",
                dataKeyName: "closingAgentAddress1"
            },
            {
                colName: "Address 2",
                dataKeyName: "closingAgentAddress2"
            },
            {
                colName: "City",
                dataKeyName: "closingAgentCity"
            },
            {
                colName: "State",
                dataKeyName: "closingAgentState"
            },
            {
                colName: "Zip",
                dataKeyName: "closingAgentZipCode"
            }
        ],
        data: null
    }

    constructor() {
        super();
    }

    setHTML() {
        return `
        <closing-agent-filter></closing-agent-filter>
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
            <pagination-component></pagination-component>
        </div>
        `;
    }

    onRowSelected(event, rowData) {
        this.selectedRowData = rowData;
        console.log("this.selectedRowData", this.selectedRowData);
    }

    getHttpServiceObj() {
        if (this.userFilteredInput) {
            console.log(this.userFilteredInput);
            let httpService = FSLambdaAPIService.getInstance().setPayload("GET_CLOSING_AGENT_NAME", {
                name: this.userFilteredInput.company_name, 
                state: this.userFilteredInput.state_name, 
                pageNumber: this.paginationDetails.pageNumber, 
                pageSize: this.paginationDetails.pageSize,
                streetAddress : this.userFilteredInput.street_address,
                zipCode : this.userFilteredInput.zip_code
            }).call();

            return httpService;
        }
    }

    isHttpGetResponseValid(response) {
        return response.status === 200 && response.data.totalRecords > 0;
    }

    extractOutDataFromResponse(response) {
        return response.data.closingAgentRecords;
    }

    afterHttpGetSuccess(response) {
        super.afterHttpGetSuccess(response);
        this.showUpdateButton();
    }

    async onFiltered(event, filteredData) {
        super.onFiltered(event, filteredData);
        this.callResourcesAPI();
    }

    showUpdateButton() {
        if (ArrayHelper.isArrayValid(this.listData.data)) {
            this.getUpdateButton().show();
        }
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
                UtilHelper.navigateTo(ComponentConstant.CLOSINGAGENT_FORM, this._componentData);
            }
        });
        this.getUpdateButton().hide();
        this.getCancelButton().click(() => {
            UtilHelper.navigateTo(ComponentConstant.CLOSINGAGENT_FORM, this._componentData);
        });
    }

    searchListDataByFilter(dataItem, filteredData) {
        return dataItem.name.toLowerCase().indexOf(filteredData.company_name.toLowerCase()) >= 0 && dataItem.state.toLowerCase().indexOf(filteredData.state_name.toLowerCase()) >= 0;
    }
}

export default window.customElements.define(ComponentConstant.CLOSINGAGENT_LIST, ClosingAgentList);