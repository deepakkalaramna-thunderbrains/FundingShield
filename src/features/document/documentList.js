import { appletClientServiceIns } from '../../AppletClientService.js';
import { ListComponent } from '../../components/ListComponent.js';
import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { CustomEventsConstants } from '../../constants/CustomEventsConstants.js';
import { DocumentTypeConstants } from '../../constants/DocumentTypeConstants.js';
import { ArrayHelper } from '../../helpers/ArrayHelper.js';
import { UtilHelper } from '../../helpers/UtilHelper.js';
import { FSLambdaAPIService } from '../../services/FSLambdaAPIService.js';
import { FreeAgentApiService } from "../../FreeAgentApiService.js"
import { DocumentTypeHelper } from './DocumentTypeHelper.js';

export class DocumentList extends ListComponent {

    selectedRowData = null;
    faValuesUpdate = {};
    intervalId;
    openingDocuments = false;
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

    onComponentDataSet(componentData) {
        this.callResourcesAPI();
        UtilHelper.setComponentData(ComponentConstant.DOCUMENT_UPLOAD, this._componentData);
        $("#transaction-id").html("");
    }

    getHttpServiceObj() {
        if (this._componentData) {
            let transactionId = this._componentData.field_values.order_val_field134.display_value;
            let httpService = FSLambdaAPIService.getInstance().setPayload("GET_DOCUMENT_TYPE_LIST", { transactionId }).call();
            return httpService;
        }
    }

    isHttpGetResponseValid(response) {
        return response.status === 200 && response.data.length > 0;
    }

    extractOutDataFromResponse(response) {
        return response.data;
    }

    afterHttpGetSuccess(response) {
        super.afterHttpGetSuccess(response);
        this.callDocumentStatusList();
    }

    async callDocumentStatusList() {
        let documentStatusList = await FSLambdaAPIService.getInstance().setPayload("FA_ORDER_STATUS_LIST").call().call();
        documentStatusList = documentStatusList.data;
        if (ArrayHelper.isArrayValid(documentStatusList)) {
            this.bindDataToDocumentTypeStatusComponent(documentStatusList);
        }
    }

    bindDataToDocumentTypeStatusComponent(dropDownData) {
        document.querySelectorAll(ComponentConstant.DOCUMENT_TYPE_STATUS).forEach(function (item) {
            item.componentData = dropDownData;
        });
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        document.getElementById("validateAll").addEventListener("click",this.validateAll.bind(this));
        document.getElementById("validateAllFirst").addEventListener("click",this.validateAllFirst.bind(this));
        document.getElementById("firstReviewReceived").addEventListener("click",this.updateToFirstReviewReceived.bind(this));
        document.getElementById("openAllDocuments").addEventListener("click",this.openAllDocuments.bind(this));

        $(document).on(CustomEventsConstants.DOCUMENT_STATUS_SELECTED, this.onDocumentStatusSelected.bind(this));
    }

    unRegisterEventListenersAfterHTMLRendered() {
        super.unRegisterEventListenersAfterHTMLRendered();
        $(document).off(CustomEventsConstants.DOCUMENT_STATUS_SELECTED);
    }

    openAllDocuments () {
        this.disableButtons();

        if(this.openingDocuments){
            return;
        }

        this.openingDocuments = true;

        let elements = document.querySelectorAll(`tr[filename]:not([guardiantype="txtAPI"])`);
        let links = [];

        if(elements && elements.length > 0){

            for(let i = 0; i < elements.length; i ++) {

                if($(elements[i]).find("input").is(":checked")){
                    links.push($(elements[i]).find("a"));
                }
            }
        } 

        for(let i = 0; i < links.length; i ++){
            links[i][0].click();
        }

        this.enableButtons();
        this.openingDocuments = false;
    }

    async updateToFirstReviewReceived () {
        this.disableButtons();
        appletClientServiceIns.showLoader();
        let validation = "bb898b9e-056e-4771-8fc7-584abb61295b";
        let options = document.querySelectorAll(`option[id='${validation}']`);
        let promises = [];
        let fieldValues = {};
        options.forEach((o) => {

            let field = this.getFADocumentFileTypeSystemName($(o).closest("tr").attr("guardianType"));
            let type = $(o).closest("tr").attr("guardianType");
            let radio = $(o).closest("tr").find('input[name="documentActiveStatus"]');
            let select = $(o).closest("select");

            if( (field && field != "") && (type == "pdfClosingProtectionLetter" || type == "pdfWireInstructions" )){
                o.selected = true;
                $(select).removeAttr("disabled");
                $(radio).prop('checked', true);
                fieldValues[field] = "bb898b9e-056e-4771-8fc7-584abb61295b";
                let payload = {
                    fileName : $(o).closest("tr").attr("fileName"), 
                    currentReviewStatusId : validation,
                    transactionId: this._componentData.field_values.order_val_field134.display_value,
                    active : true
                };
                promises.push(FSLambdaAPIService.getInstance().setPayload("UPDATE_DOCUMENT_TYPE_STATUS",payload).call().call());
            }
        });
        if(promises.length > 0){
            await Promise.all(promises);
        }
        FreeAgentApiService.getFreeAgentApiServiceIns("order_val",this._componentData.id).updateEntity(fieldValues, (data) => {});
        appletClientServiceIns.hideLoader();
        this.enableButtons();
    }

    async updateDocumentStatusActive (event) {
        let select = $(event.target).closest("td").next("td").find("select")[0];
        let status = $(select).val();
        let flag = false;

        if(!event.target.checked){
            $(select).attr("disabled",true);
        }else{
            flag = true;
            $(select).removeAttr("disabled");
        }

        let variables = {
            fileName : $(event.target).closest("tr").attr("fileName"),
            active : event.target.checked,
            statusId : status,
            guardianType : $(event.target).closest("tr").attr("guardianType")
        };

        this.updateDocumentStatusToFA(variables);

        this.updateDocumentStatusToFS(variables);
    }

    async onDocumentStatusSelected(event, data) {
        appletClientServiceIns.showLoader();
        this.updateDocumentStatusToFA(data);
        this.updateDocumentStatusToFS(data);
        appletClientServiceIns.hideLoader();
    }

    async updateDocumentStatusToFS(data) {

        let response = await FSLambdaAPIService.getInstance().setPayload("UPDATE_DOCUMENT_TYPE_STATUS", { 
            fileName: data.fileName,
            currentReviewStatusId: data.statusId == "0" ? "00000000-0000-0000-0000-000000000000" : data.statusId, 
            transactionId: this._componentData.field_values.order_val_field134.display_value,
            active: data.active
        }).call().call();
        if (response.status === 201) {
            appletClientServiceIns.showSnackBar("Updated Successfully");
        } else {
            appletClientServiceIns.showSnackBar("There is an error while updating",true);
        }
    }

    disableButtons () {
        const buttons = document.querySelectorAll("input[type='button']");

        for(let i = 0; i < buttons.length; i++){
            buttons[i].setAttribute("disabled",true);
        }
    }

    enableButtons () {
        const buttons = document.querySelectorAll("input[type='button']");

        for(let i = 0; i < buttons.length; i++){
            buttons[i].removeAttribute("disabled");
        }
    }

    async validateAll() {
        let agent = this._componentData.agentInfo;

        if(!agent.roles || !Array.isArray(agent.roles) || !UtilHelper.validateRole(agent.roles)){
            appletClientServiceIns.showSnackBar("Operation not allowed",true);
            return null;
        }
        
        this.disableButtons();
        appletClientServiceIns.showLoader();
        let validation = "5500b990-c645-4280-8bc8-1c9d4852616d";
        let options = document.querySelectorAll(`option[id='${validation}']`);
        let promises = [];
        let fieldValues = {};
        options.forEach((o) => {

            let field = this.getFADocumentFileTypeSystemName($(o).closest("tr").attr("guardianType"));

            if(field && field != "" && !$(o).closest("select").attr("disabled")){
                o.selected = true;
                fieldValues[field] = "5500b990-c645-4280-8bc8-1c9d4852616d";
                let payload = {
                    fileName : $(o).closest("tr").attr("fileName"), 
                    currentReviewStatusId : validation,
                    transactionId: this._componentData.field_values.order_val_field134.display_value 
                };
                promises.push(FSLambdaAPIService.getInstance().setPayload("UPDATE_DOCUMENT_TYPE_STATUS",payload).call().call());
            }
        });
        if(promises.length > 0){
            await Promise.all(promises);
        }
        FreeAgentApiService.getFreeAgentApiServiceIns("order_val",this._componentData.id).updateEntity(fieldValues, (data) => {});
        appletClientServiceIns.hideLoader();
        this.enableButtons();
    }

    async validateAllFirst () {

        this.disableButtons();
        appletClientServiceIns.showLoader();
        let validation = "5bf00f35-12c1-48aa-94b7-0d1904a1ef4e";
        let options = document.querySelectorAll(`option[id='${validation}']`);
        let promises = [];
        let fieldValues = {};
        options.forEach((o) => {

            let field = this.getFADocumentFileTypeSystemName($(o).closest("tr").attr("guardianType"));

            if(field && field != "" && !$(o).closest("select").attr("disabled")){
                o.selected = true;
                fieldValues[field] = "5bf00f35-12c1-48aa-94b7-0d1904a1ef4e";
                let payload = {
                    fileName : $(o).closest("tr").attr("fileName"), 
                    currentReviewStatusId : validation,
                    transactionId: this._componentData.field_values.order_val_field134.display_value 
                };
                promises.push(FSLambdaAPIService.getInstance().setPayload("UPDATE_DOCUMENT_TYPE_STATUS",payload).call().call());
            }
        });
        if(promises.length > 0){
            await Promise.all(promises);
        }
        FreeAgentApiService.getFreeAgentApiServiceIns("order_val",this._componentData.id).updateEntity(fieldValues, (data) => {});
        appletClientServiceIns.hideLoader();
        this.enableButtons();
    }

    
    updateDocumentStatusToFA(data) {
        if(this.intervalId){
            clearTimeout(this.intervalId);
            this.disableButtons();
        }

        let elements = document.querySelectorAll(`tr[guardianType="${data.guardianType}"]`);
        let statusList = [];

        if(elements && elements.length > 0){

            for(let i = 0; i < elements.length; i ++) {

                if($(elements[i]).find("input").is(":checked")){

                    if($(elements[i]).find("select").val() == "0"){

                        statusList.push(null);    
                        continue;
                    }

                    statusList.push($(elements[i]).find("select").val());
                }
            }
        } 

        this.faValuesUpdate[this.getFADocumentFileTypeSystemName(data.guardianType)] = DocumentTypeHelper.getAppropiateStatus(statusList);

        this.intervalId = setTimeout( () => {
            FreeAgentApiService.getFreeAgentApiServiceIns("order_val", this._componentData.id).updateEntity(this.faValuesUpdate, async (data) => {
                clearTimeout(this.intervalId);
                this.faValuesUpdate = {};
                this.intervalId = null;
                this.enableButtons();
            });
        },3500);
    }

    getFADocumentFileTypeSystemName(documentFileType) {
        return DocumentTypeHelper.getFADocumentFileTypeSystemName(documentFileType);
    }

    getFADocumentStatus(fsCurrentReviewStatusId) {
        return DocumentTypeHelper.getFADocumentStatus(fsCurrentReviewStatusId);
    }

    buildTable() {
        let tbodyHTML = "";
        if (this.listData.data && this.listData.data.length > 0) {
            this.listData.data.forEach(function (item) {
                let active = item.activeRecord ? "checked" : "";
                let type = DocumentTypeConstants.DOCUMENT_TYPE[item.guardianType];
                let disabled = !item.activeRecord || DocumentTypeConstants.INVALID_TYPES.includes(item.guardianType);
                tbodyHTML += `<tbody class="text-center">`;
                tbodyHTML += `<tr fileName="${item.fileName}" guardianType="${item.guardianType}" active="${item.activeRecord}" status="${item.currentReviewStatusId}">`;
                tbodyHTML += `<td style="width:20%"><a title="${item.documentUri}" href="${item.documentUri}" target="_blank">${type}</a></td>`;
                tbodyHTML += `<td style="width:30%">${new Date(item.uploadDate).toLocaleString()}</td>`;
                tbodyHTML += `<td style="width:10%"><input type="checkbox" name="documentActiveStatus" ${active}></td>`
                tbodyHTML += `<td style="width:40%"><document-type-status disabled=${disabled} selected="${item.currentReviewStatusId}"></document-type-status></td>`;
                tbodyHTML += "</tr></tbody>";
            });
            this._componentData.document_resp = this.listData.data;
            UtilHelper.setComponentData(ComponentConstant.DOCUMENT_UPLOAD, this._componentData);
            
        } else {
            tbodyHTML = `<tbody class="text-center">
            <tr>
                <td colspan="3">There is no record found</td>
            </tr></tbody>`;
        }
        $("tbody").replaceWith(tbodyHTML);

        document.getElementsByName("documentActiveStatus").forEach( (e) => { 
            e.addEventListener("click",this.updateDocumentStatusActive.bind(this));
        });
    }

    buildPagination() {

    }

    setHTML() {
        return `<div class="container">
                <div class="row border border-secondary rounded">
                    <div class="col-md-12">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 pt-2 text-left">
                                    <input style="float: right;" type="button" id="openAllDocuments" class="btn btn-outline-secondary " value="Open All Documents">
                                </div>
                            </div>
                        </div>
                        <table class="table table-striped">
                            <thead class="table-light text-center"> 
                                <tr>
                                    <th>File Type</th>
                                    <th>Date</th>
                                    <th>Active</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="col-4">
                                <input style="float: left;" type="button" id="firstReviewReceived" class="btn btn-outline-secondary" value="1st Review Received">
                            </div>
                            <div class="col-8">
                                <input style="float: left;" type="button" id="validateAllFirst" class="btn btn-outline-secondary" value="Validate First Reviewer">
                                <input style="float: right;" type="button" id="validateAll" class="btn btn-outline-secondary" value="Validate Second Reviewer">
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
                <div class="row border border-secondary rounded m-t30 p-a20">
                    <document-upload style="width: 100%"></document-upload>
                </div> 
            </div>`;
    }
}

export default window.customElements.define(ComponentConstant.DOCUMENT_LIST, DocumentList);