import { ArrayHelper } from "../helpers/ArrayHelper.js";
import { BaseComponents } from "./BaseComponents.js";



export class DropdownComponent extends BaseComponents {

    dropDownData = null;
    selectLabel;
    idKey = null;
    valueKey = null;
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.callResourcesAPI();
    }

    afterHttpGetSuccess(response) {
        this.setDropDownData(response);
        // this.dropDownData = this.extractOutDataFromResponse(response);
        // this.renderHTML();
    }

    setDropDownData(response) {
        const extractedOutData = this.extractOutDataFromResponse(response);
        if (ArrayHelper.isArrayValid(extractedOutData)) {
            this.dropDownData = extractedOutData;
            this.renderHTML();
        }
    }

    extractOutDataFromResponse(response) {
        return response.data;
    }

    buildDropdown() {
        let optionHTMLStr = `<option class='form-select' value='0'>${this.selectLabel}</option>`;
        if (this.dropDownData) {
            // let optionHTMLStr = `<option class='form-select' value='0'>${this.selectLabel}</option>`;
            let selectedStatus = this.getAttribute("selected");
            this.dropDownData.forEach((dropDownItem) => {
                let selected = dropDownItem[this.idKey] === selectedStatus ? "selected='true'" : "";
                optionHTMLStr += `<option class='form-select' ${selected} id="${dropDownItem[this.idKey]}" value="${dropDownItem[this.idKey]}">${dropDownItem[this.valueKey]}</option>`;
            });
        }
        return optionHTMLStr;
    }

    setHTML() {
        let disabled = this.getAttribute("disabled") == "true" ? "disabled" : "";
        return `<select ${disabled} class="form-control ddlDocument">${this.buildDropdown()}</select>`;
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        let self = this;
        $(this).find("select").change(function () {
            self.onDropdownItemSelected($(this).val(), this);
        });
    }

    onDropdownItemSelected(item, curElem) {

    }

    postRenderHTML() {
        super.postRenderHTML();
    }

    async getHttpServiceObj() {
    }

    async callResourcesAPI() {
        let httpServiceObj = await this.getHttpServiceObj();
        if (httpServiceObj) {
            // appletClientServiceIns.showLoader();
            let result = await this.getHttpServiceObj().call();
            // appletClientServiceIns.hideLoader();
            if (this.isHttpGetResponseValid(result)) {
                this.afterHttpGetSuccess(result);
            } else {
                this.afterHttpGetError();
            }
        }
    }

    isHttpGetResponseValid(response) {
        // if()
        // console.log("my response", response);
        return response.status === 200;
    }

    afterHttpGetError(response) {
        this.dropDownData = [];
    }
}