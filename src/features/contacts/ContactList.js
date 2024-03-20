import { appletClientServiceIns } from "../../AppletClientService.js";
import { ListComponent } from "../../components/ListComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

class ContactList extends ListComponent {

    selectedRowData = null;
    closingAgentId = null;
    recordInfo = null;
    listData = {
        select : {
            width : "20px"
        },
        tableConf: [
            {
                colName: "First Name",
                dataKeyName: "firstName",
                width : "50px"
            },
            {
                colName: "Last Name",
                dataKeyName: "lastName",
                width : "50px"
            },
            {
                colName: "Email",
                dataKeyName: "email",
                width : "100px"
            },
            {
                colName: "Phone",
                dataKeyName: "phone",
                width : "60px"
            }
        ],
        data: null
    }

    constructor() {
        super();
    }

    setHTML() {
        return `
        <div class="container">
            <table-comp></table-comp>
        </div>
        
        <div class="container">
            <div class="row p-t20">
                    <div class="col-5">
                        <input type="button" name="update" class="btn btn-outline-info" value="Create">
                    </div>
                    <div class="col-7">
                        <input style="float: left;" type="button" name="updateContact" class="btn btn-outline-success" value="Update">
                        <input style="float: right;" type="button" name="cancel" class="btn btn-outline-secondary" value="Cancel">
                    </div>
                </div>
            </div>
            <pagination-component></pagination-component>
        </div>`;
    }

    onRowSelected(event, rowData) {
        this.selectedRowData = rowData;
    }

    onComponentDataSet(componentData) {
        this.closingAgentId = componentData.field_values.closing_agent_field77.value;
        this.callResourcesAPI();
        this.recordInfo = componentData;
    }

    getHttpServiceObj() {
        if (this.closingAgentId) {
            let httpService = FSLambdaAPIService.getInstance().setPayload("CLOSING_AGENT_CONTACT_LIST", { 
                closingAgentId: this.closingAgentId 
            }).call();

            return httpService;
        }
    }

    afterHttpGetSuccess(response) {
        super.afterHttpGetSuccess(response);
        this.getUpdateButton().show();
    }

    isHttpGetResponseValid(response) {
        const isSuccess = response.status === 200;
        return isSuccess;
    }

    extractOutDataFromResponse(response) {
        return response.data;
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

    getUpdateContactButton () {
        return $(this).find("input[name='updateContact']");
    }

    async registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        this.getUpdateButton().click(() => {
            this.navigateBetweenComponents(ComponentConstant.CONTACT_FORM);
        });

        this.getCancelButton().click(() => {
            UtilHelper.navigateTo(ComponentConstant.CLOSINGAGENT_FORM, this.recordInfo);
        });

        this.getUpdateContactButton().click( async () => {
            appletClientServiceIns.showLoader();
            let transactionId = this.recordInfo.field_values.closing_agent_field22.display_value;
            let contactId = this.selectedRowData.contactID;
            let transactionUpdated = await this.updateTransaction(transactionId,contactId);
            if(transactionUpdated.status == 200){
                appletClientServiceIns.hideLoader();
                appletClientServiceIns.showSnackBar("Contact Updated Successfully");
                this.updateClosingAgent(this.recordInfo.id,this.selectedRowData);
                await this.timeout(2000);
                UtilHelper.navigateTo(ComponentConstant.CLOSINGAGENT_FORM,this.recordInfo);
            }
            appletClientServiceIns.hideLoader();

            if(transactionUpdated.status != 200){
                appletClientServiceIns.showSnackBar("There was an error updating transaction",true);
            }
        });
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateTransaction(transactionId,contactId) {
        let payload = {
            transactionID : transactionId,
            contactID : contactId
        };
        let fn = "ATTACH_CONTACT_TO_TRANSACTION";
        return FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
    }

    updateClosingAgent(closingAgentId,contact) {
        let variables = {
            entity : "closing_agent",
            id : closingAgentId,
            field_values : {
                closing_agent_field98 : contact.email,
                closing_agent_field33 : contact.phone,
                closing_agent_field34 : contact.firstName,
                closing_agent_field35 : contact.lastName,
                closing_agent_field99 : contact.email
            }
        };
        FreeAgentApiService.getFreeAgentApiServiceIns().updateEntityFree(variables,(data) => {
            console.log("Closing Agent Updated");
        })
    }

    searchListDataByFilter(dataItem, filteredData) {
        return dataItem.name.toLowerCase().indexOf(filteredData.company_name.toLowerCase()) >= 0 && dataItem.state.toLowerCase().indexOf(filteredData.state_name.toLowerCase()) >= 0;
    }
}

export default window.customElements.define(ComponentConstant.CONTACT_LIST, ContactList);