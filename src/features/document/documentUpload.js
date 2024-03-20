import { appletClientServiceIns } from '../../AppletClientService.js';
import { FragementComponent } from '../../components/FragementComponent.js';
import { ComponentConstant } from '../../constants/ComponentConstant.js';
import { CustomEventsConstants } from '../../constants/CustomEventsConstants.js';
import { FSLambdaAPIService } from '../../services/FSLambdaAPIService.js';
import { DocumentTypeHelper } from './DocumentTypeHelper.js';
import { FreeAgentApiService } from "../../FreeAgentApiService.js"

export class DocumentUpload extends FragementComponent {

    selectedDocumentType = null;
    files = {};
    FILES_TYPES = {
        pdfBankReferenceLetter : {
            name : "Bank Reference",
            multiple : true
        },
        pdfClosingProtectionLetter : {
            name : "CPL",
            multiple : false
        },
        pdfCPLValidation : {
            name : "CPL Validation",
            multiple : true
        },
        pdfCrimesPolicy : {
            name : "Crimes Policy",
            multiple : true
        },
        pdfErrorsAndOmissionsInsurance : {
            name : "E & O Insurance",
            multiple : false
        },
        pdfFidelityBond : {
            name : "Fidelity Bound",
            multiple : true
        },
        pdfStateLicense : {
            name : "State License",
            multiple : true
        },
        pdfWireInstructions : {
            name : "Wire Instructions",
            multiple : false
        }
    }
    constructor() {
        super();
    }

    onComponentDataSet(componentData) {
        console.log("component  data set", componentData);
    }
    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.PRIMARY_BUTTON_CLICKED, this.onSubmitButtonClicked.bind(this));
        $(document).on(CustomEventsConstants.SECONDARY_BUTTON_CLICKED, this.onCancelButtonClicked.bind(this));
        $(document).on(CustomEventsConstants.DOCUMENT_TYPE_SELECTED, this.onDocumentTypeSelected.bind(this));
        document.getElementById("fileInput").addEventListener("change",this.addFiles.bind(this));
        document.getElementById("fileListButton").addEventListener("click",this.showModal.bind(this));
        document.getElementById("closeButton").addEventListener("click",this.closeModal.bind(this));
        document.getElementById("xButton").addEventListener("click",this.closeModal.bind(this));
    }

    showModal() {
        $('#filesListModal').modal('show');
    }

    closeModal() {
        $('#filesListModal').modal('hide');
    }

    addFilesToModal(){
        let headers = Object.keys(this.files);
        if(headers.length == 0){
            return;
        }
        let html = headers.reduce((result,header) => {
            let content = "";

            for(let i = 0; i < this.files[header].length; i ++){
                let file = this.files[header][i];
                content += ` <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${file.name}
                        <a href="#" class="badge badge-primary badge-pill" name="${file.name}">Delete</a>
                    </li>
                </ul>`
            }

            result += `<h5>${this.FILES_TYPES[header].name}</h5><br>${content}<br>`;

            return result;
        },"");

        $("#fileListModalContent").html(html);

        headers.forEach((header) => {
            for(let i = 0; i < this.files[header].length; i ++){
                let file = this.files[header][i];
                let span = document.getElementsByName(file.name);
                
                for(let i = 0; i < span.length; i ++){
                    span[i].addEventListener("click",this.deleteItem.bind(this));
                }
            }
        });
    }

    deleteItem(event){
        let nameToRemove = event.target.name;
        let filesTemp = {};
        let fileNames = Object.keys(this.files);
        fileNames.forEach((fileName) => {
            if(!filesTemp[fileName]){
                filesTemp[fileName] = [];
            }

            for(let i = 0; i < this.files[fileName].length; i ++){
                let file = this.files[fileName][i];

                if(file.name != nameToRemove){
                    filesTemp[fileName].push(file);
                }
            }
        });

        this.files = filesTemp;

        this.addFilesToModal();
    }

    addFiles (e) {
        if(this.selectedDocumentType == 0 || !this.selectedDocumentType){
            return;
        }

        $("#fileListButton").removeAttr("disabled");

        if(this.FILES_TYPES[this.selectedDocumentType].multiple){

            if(!this.files[this.selectedDocumentType]){
                this.files[this.selectedDocumentType] = [];
            }

            this.files[this.selectedDocumentType].push(...e.target.files);
        }else{
            this.files[this.selectedDocumentType] = [...e.target.files];
        }

        this.addFilesToModal();
        this.showModal();
        e.target.value = "";
    }

    unRegisterEventListenersAfterHTMLRendered() {
        super.unRegisterEventListenersAfterHTMLRendered();
        $(document).off(CustomEventsConstants.PRIMARY_BUTTON_CLICKED);
        $(document).off(CustomEventsConstants.SECONDARY_BUTTON_CLICKED);
        $(document).off(CustomEventsConstants.DOCUMENT_TYPE_SELECTED);
    }

    onSubmitButtonClicked(event) {
        let documentType = this.selectedDocumentType;

        let fileNames = Object.keys(this.files);

        if (fileNames.length > 0) {
            $("#error-msg").hide();
            this.uploadFile(documentType);
        } else {
            $("#error-msg").show();
        }
    }

    onDocumentTypeSelected(event, documentType) {

        if(documentType == 0){
            $("#filesList").prop("disabled",true);
            return;
        }

        $("#filesList").removeAttr("disabled");
        
        if(this.FILES_TYPES[documentType].multiple){
            $("#fileInput").prop("multiple",true);
        }else{
            $("#fileInput").removeAttr("multiple");
        }

        this.selectedDocumentType = documentType;
    }

    async deactivateFiles(list) {
        let promises = [];

        let types = Object.keys(this.files);

        for(let i = 0; i < types.length; i ++){
            let type = types[i];

            if(this.FILES_TYPES[type].multiple){
                continue;
            }

            if(type == "pdfClosingProtectionLetter"){
                let cpl = list.filter((file) => file.guardianType == "pdfClosingProtectionLetter");
                let cplValidation = list.filter((file) => file.guardianType == "pdfCPLValidation");

                let documents = [...cpl, ...cplValidation];

                if(documents.length == 0){
                    continue;
                }

                documents.forEach((document) => {
                    promises.push(FSLambdaAPIService.getInstance().setPayload("UPDATE_DOCUMENT_TYPE_STATUS",{
                        active : false,
                        currentReviewStatusId : document.currentReviewStatusId,
                        fileName : document.fileName,
                        transactionId : document.transactionId
                    }).call().call());
                });

                continue;
            }

            let documents = list.filter((file) => file.guardianType == type);

            if(documents.length == 0){
                continue;
            }

            documents.forEach((document) => {
                promises.push(FSLambdaAPIService.getInstance().setPayload("UPDATE_DOCUMENT_TYPE_STATUS",{
                    active : false,
                    currentReviewStatusId : document.currentReviewStatusId,
                    fileName : document.fileName,
                    transactionId : document.transactionId
                }).call().call());
            });
        }

        return Promise.all(promises);
    }

    async uploadFile(documentType) {
        appletClientServiceIns.showLoader();
        let transactionId = this._componentData.field_values.order_val_field134.display_value;
       
        let inputs = {};
        let names = Object.keys(this.files);

        for(let i = 0;  i < names.length; i ++){
            let name = names[i];

            if(this.files[name].length == 0){
                continue;
            }

            if(!inputs[name]){
                inputs[name] = [];
            }

            for(let j = 0 ; j < this.files[name].length; j++){
                let file = this.files[name][j];
                let base64 = await this.getBase64(file);
                inputs[name].push({
                    name : file.name,
                    file : base64
                });
            }
        }

        let currentFiles = await FSLambdaAPIService.getInstance().setPayload("GET_DOCUMENT_TYPE_LIST",{
            transactionId
        }).call().call();

        currentFiles = currentFiles.data;

        if(currentFiles.length > 0){
            let activeFiles = currentFiles.filter((file) => file.activeRecord);

            if(activeFiles.length > 0){
                await this.deactivateFiles(activeFiles);
            }
        }

        let httpService = await FSLambdaAPIService.getInstance().setPayload("UPLOAD_DOCUMENT", { 
            transactionId, 
            base64inputs : inputs, 
            documentType 
        }).call().call();

        appletClientServiceIns.hideLoader();

        if (httpService.status === 200) {
            appletClientServiceIns.showSnackBar("File uploaded successfully");
            this.onCancelButtonClicked();
            this.navigateBetweenComponents(ComponentConstant.DOCUMENT_LIST);
            setTimeout(() => {
                this.changeDocumentTypeStatusToEmptyInFA(names)
            },3000);
        }
        else {
            appletClientServiceIns.showSnackBar("There is an error while uploading a file",true);
        }
    }

    async changeDocumentTypeStatusToEmptyInFA(documentTypes) {
        let fieldValues = {};

        if(documentTypes.some((document) => document == "pdfClosingProtectionLetter")){
            documentTypes.push("pdfCPLValidation");
        }
        
        let elementsArray = documentTypes.map((documentType) => {
            return document.querySelectorAll(`tr[guardianType="${documentType}"]`)
        });

        elementsArray.forEach(elements => {

            if(elements && elements.length > 0){

                for(let i = 0; i < elements.length; i ++) {
                    
                    const element = elements[i];
                    const documentType = $(element).attr("guardianType");
                    const field = DocumentTypeHelper.getFADocumentFileTypeSystemName(documentType);

                    if(!fieldValues[field]){
                        fieldValues[field] = [];
                    }

                    if(!$(element).find("input").is(":checked")){
                        continue;
                    }

                    fieldValues[field].push($(elements[i]).find("select").val());
                }
            } 
        });

        Object.keys(fieldValues).forEach((field) => {
            fieldValues[field] = DocumentTypeHelper.getAppropiateStatus(fieldValues[field]);
        })

        FreeAgentApiService.getFreeAgentApiServiceIns("order_val", this._componentData.id).updateEntity(fieldValues, (data) => {
            console.log("updated");
        });
    }

    async getBase64(fileData) {
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        return toBase64(fileData);
    }

    onCancelButtonClicked(event) {
        $("#error-msg").hide();
        $("input[type='file']").val("");
        $("#file-list").val("0");
    }

    setHTML() {
        return `
        <div class="modal fade" id="filesListModal" tabindex="-1" role="dialog" aria-labelledby="filesListModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Files List</h5>
                        <button type="button" id="xButton" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
                    <div class="modal-body" id="fileListModalContent">
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="closeButton" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>    
            <div class="row">
                <div class="col-md-6">
                   <document-type-master-list></document-type-master-list>
                </div>
                <div class="col-md-6">
                    <div class="file-upload-wrapper row">
                        <div class="col-md-6">
                            <input style="color:white;" name="file-upload-field" type="file" id="fileInput" class="form-control-file">
                        </div>
                        <div class="col-md-6">
                            <button type="button" class="btn btn-outline-dark btn-sm" id="fileListButton" disabled=true>Files List</button>
                        </div>
                    </div>
                </div>
            </div>
            <primary-secondary-button class="m-l0" primary="Upload" secondary="Cancel" ></primary-secondary-button>    
        `;
    }
}

window.customElements.define(ComponentConstant.DOCUMENT_UPLOAD, DocumentUpload);