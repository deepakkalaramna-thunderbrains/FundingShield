import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { ListWithFilteredComponent } from "../../components/ListWithFilteredComponent.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js";
import { appletClientServiceIns } from "../../AppletClientService.js";

export class LendertList extends ListWithFilteredComponent {

    selectedRowData = null;
    listData = {
        tableConf: [
            {
                colName: "Name",
                dataKeyName: "lenderLegalName"
            },
            {
                colName: "Email",
                dataKeyName: "lenderEmail"
            },
            {
                colName: "Phone",
                dataKeyName: "lenderPhone"
            },
            {
                colName: "Address",
                dataKeyName: "lenderAddress1"
            },
            {
                colName: "Address2",
                dataKeyName: "lenderAddress2"
            },
            {
                colName: "City",
                dataKeyName: "lenderCity"
            },
            {
                colName: "State",
                dataKeyName: "lenderState"
            },
            {
                colName: "Zip",
                dataKeyName: "lenderZipCode"
            }
        ],
        data: null
    }

    instanceId = "";
    constructor() {
        super();
    }

    onComponentDataSet(data) {
        this.instanceId = data.id;
    }

    postRenderHTML() {
        super.postRenderHTML();
    }

    setHTML() {
        return `
            <lender-filter></lender-filter>
            <div class="container">
                <div class="row">
                    <div class="col-md-12 tbl-section">
                        <table-comp></table-comp>
                    <div>
                    <div class="row">
                        <input type="button" name="update" class="btn btn-outline-info" value="Update"> 
                    </div>
                <div>
                <pagination-component></pagination-component>
            <div>           
        `;
    }

    setAppletHeader() {
        if (this._componentData && this._componentData.field_values) {
            $("#transaction-id").html(this._componentData.field_values.underwriter_field0.display_value || "");
        }
    }

    onRowSelected(event, rowData) {
        this.selectedRowData = rowData;
    }

    getHttpServiceObj() {
        if (this.userFilteredInput) {
            let httpService = FSLambdaAPIService.getInstance().setPayload("GET_LENDER_LIST", { name: this.userFilteredInput.company_name, state: this.userFilteredInput.state_name, pageNumber: this.paginationDetails.pageNumber, pageSize: this.paginationDetails.pageSize }).call();
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
        return response.data.lenderRecords;
    }

    onFiltered(event, filteredData) {
        super.onFiltered(event, filteredData);
        this.callResourcesAPI();
    }

    getUpdateButton() {
        return $(this).find("input[name='update']");
    }

    getCancelButton() {
        return $(this).find("input[name='secondary']");
    }

    registerEventListenersAfterHTMLRendered() {
        console.log("lender registered");
        super.registerEventListenersAfterHTMLRendered();
        this.getUpdateButton().click(() => {
            if (this.selectedRowData) {
                this.updateLenderRecordToFS(this.selectedRowData);
            }
        });
        this.getUpdateButton().hide();
    }

    setAppletHeader() {
        if (this._componentData && this._componentData.field_values) {
            $("#transaction-id").html(this._componentData.field_values.lender_field55.display_value || "");
        }
    }

    async updateLenderRecord(data) {
        let lenderId = "";
        if(typeof data.lenderId == "number"){
            lenderId = data.lenderId.toString();
        }

        if(typeof data.lenderId == "string"){
            lenderId = data.lenderId;
        }

        const fieldValues = { 
            lender_field55: data.lenderLegalName, 
            lender_field43: data.lenderAddress1, 
            lender_field44: data.lenderAddress2, 
            lender_field45: data.lenderCity, 
            lender_field46: data.lenderState, 
            lender_field47: data.lenderZipCode, 
            lender_field48: data.lenderLegalName, 
            lender_field49: data.lenderAddress1, 
            lender_field53: data.lenderAddress2, 
            lender_field50: data.lenderCity, 
            lender_field51: data.lenderState, 
            lender_field52: data.lenderZipCode,
            lender_field57 : data.lenderEmail,
            lender_field58 : data.lenderEmail,
            lender_field54 : lenderId
        };
        FreeAgentApiService.getFreeAgentApiServiceIns("lender", this._componentData.id).updateEntity(fieldValues, (data) => { console.log(data) });
    }

    async updateLenderRecordToFS(data) {
        const payload = {
                transactionId : this._componentData.field_values.lender_field7.display_value,
                companyID : data.lenderId,
                companyName: data.lenderLegalName
        };
        appletClientServiceIns.showLoader();
        let response = await FSLambdaAPIService.getInstance().setPayload("ATTACH_LENDER_TO_TRANSACTION", payload).call().call();
        appletClientServiceIns.hideLoader();
        if (response.status === 200) {
            await this.updateLenderRecord(this.selectedRowData);
            appletClientServiceIns.showSnackBar("Updated Successfully");
        } else {
            appletClientServiceIns.showSnackBar("There is an error while updating",true);
        }
    }

    searchListDataByFilter(dataItem, filteredData) {
        return dataItem.name.toLowerCase().indexOf(filteredData.company_name.toLowerCase()) >= 0 && dataItem.state.toLowerCase().indexOf(filteredData.state_name.toLowerCase()) >= 0;
    }

    onFilterCleared() {
        super.onFilterCleared();
        this.getUpdateButton().hide();
    }

}

export default window.customElements.define(ComponentConstant.LENDER_LIST, LendertList);