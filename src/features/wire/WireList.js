import { appletClientServiceIns } from "../../AppletClientService.js";
import { ListComponent } from "../../components/ListComponent.js";
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { FreeAgentApiService } from "../../FreeAgentApiService.js";
import { UtilHelper } from "../../helpers/UtilHelper.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";
class WireList extends ListComponent {

    selectedRowData = null;
    closingAgentId = null;
    instanceId = null;
    transactionId = null;
    listData = {
        select : {
            width : "30px"
        },
        tableConf: [
            {
                colName: "Account Name",
                dataKeyName: "accountName",
                width : "60px"
            },
            {
                colName: "Account Number",
                dataKeyName: "accountNumber",
                width : "70px"
            },
            {
                colName: "ABA/Routing",
                dataKeyName: "abaRouting",
                width : "50px"
            },
            {
                colName: "Bank Name",
                dataKeyName: "bankName",
                width : "50px"
            },
            {
                colName: "Sub Account Name",
                dataKeyName: "subAccountName",
                width : "80px"
            },
            {
                colName: "Sub Account Number",
                dataKeyName: "subAccountNumber",
                width : "80px"
            },
            {
                colName: "Intermediary Bank Name",
                dataKeyName: "intermediaryBankName",
                width : "90px"
            },
            {
                colName: "Intermediary Bank Account",
                dataKeyName: "bankAccountNumber",
                width : "90px"
            },
            {
                colName: "Phone",
                dataKeyName: "phone",
                width : "60px"
            },
            {
                colName: "City",
                dataKeyName: "city",
                width : "50px"
            },
            {
                colName: "State",
                dataKeyName: "state",
                width : "50px"
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
    callResourcesAPI (){}
    onRowSelected(event, rowData) {
        this.selectedRowData = rowData;
    }

    onComponentDataSet(componentData) {
        let orderId = componentData.field_values.wire_field12.value;
        this.instanceId = componentData.id;
        this.transactionId = componentData.field_values.wire_field12.display_value;
        this.getClosingAgentId(orderId,this.getWireList.bind(this));
    }

    async getWireList(data) {
        if(Array.isArray(data) && data.length > 0){
            let payload = {
                companyId : data[0].field_values.closing_agent_field77.value
            };
            let fn = "GET_ALL_WIRED_ACCOUNT_BY_CLOSING_AGENT";

            let response = await FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
            if(response.status == 200){
                this.afterHttpGetSuccess(response.data.reduce((result,r) => {
                    if(r.accountHolderInfo.accountName){
                        result.push({
                            accountName : r.accountHolderInfo.accountName,
                            accountNumber : r.accountHolderInfo.accountNumber,
                            phone : r.accountHolderInfo.phone,
                            city : r.accountHolderInfo.city,
                            state : r.accountHolderInfo.state,
                            subAccountName : r.accountHolderInfo.subAccountName,
                            subAccountNumber : r.accountHolderInfo.subAccountNumber,
                            bankName : r.bankInfo.bankName,
                            abaRouting : r.bankInfo.abaRouting,
                            intermediaryBankName : r.bankInfo.intermediaryBankName,
                            bankAccountNumber : r.bankInfo.accountNumber,
                            bankId : r.bankInfo.bankId
                        });
                    }
                    return result;
                },[]));
                appletClientServiceIns.hideLoader();
                return;
            }
        }
        appletClientServiceIns.hideLoader();
        appletClientServiceIns.showSnackBar("There is no wire information to get");
    }

    getClosingAgentId(orderId,callback) {
        let variables = {
            entity : "closing_agent",
            filters : [
                {
                    field_name : "closing_agent_field22",
                    operator : "includes",
                    values : [orderId]
                }
            ],
            limit : 1,
            fields : ["closing_agent_field77"]
        };
        FreeAgentApiService.getFreeAgentApiServiceIns().listEntityValuesFree(variables,callback);
    }

    afterHttpGetSuccess(response) {
        super.afterHttpGetSuccess(response);
        this.getUpdateButton().show();
    }

    extractOutDataFromResponse(response) {
        return response;
    }

    getUpdateButton() {
        return $(this).find("input[name='update']");
    }

    getCancelButton() {
        return $(this).find("input[name='cancel']");
    }

    async attachWireToTransaction(wireId,transactionId,instanceId) {
        let payload = {
            transactionId : transactionId,
            bankId : wireId
        };
        let fn = "ATTACH_WIRE_TO_TRANSACTION";
        try{
            let response = await FSLambdaAPIService.getInstance().setPayload(fn,payload).call().call();
            if(response.status == 200){
                appletClientServiceIns.showSnackBar("Wire updated successfully");
                this.updateFAWire(wireId,instanceId);
                await this.timeout(2000);
                return;
            }
        }catch(e){
            appletClientServiceIns.hideLoader();
            appletClientServiceIns.showSnackBar(`There was an error updating wire ${e}`,true);
        }
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateFAWire(wireId, instanceId) {
        if(typeof wireId != "string"){
            wireId = wireId.toString();
        }
        let variables = {
            entity : "wire",
            id : instanceId,
            field_values : {
                wire_field36 : wireId
            }
        };
        FreeAgentApiService.getFreeAgentApiServiceIns().updateEntityFree(variables,(data) => {
            appletClientServiceIns.hideLoader();
            UtilHelper.navigateTo(ComponentConstant.WIRE_FORM,data.entity_value);
        });
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();

        this.getUpdateButton().click( () => {
            let wireId = this.selectedRowData.bankId;
            appletClientServiceIns.showLoader();
            this.attachWireToTransaction(wireId,this.transactionId,this.instanceId);
        });

        this.getCancelButton().click(() => {
            this.navigateBetweenComponents(ComponentConstant.WIRE_FORM);
        });
    }
}

export default window.customElements.define(ComponentConstant.WIRE_LIST, WireList);