import { CustomEventsConstants } from "../constants/CustomEventsConstants.js";
import { AWSService } from "../services/AWSService.js";
import { BaseComponents } from "./BaseComponents.js";
import { appletClientServiceIns } from '../AppletClientService.js'
import { UtilHelper } from "../helpers/UtilHelper.js";
import { ComponentConstant } from "../constants/ComponentConstant.js";
import { AppConstant } from "../constants/AppConstant.js";

export class ListComponent extends BaseComponents {

    listData = null;
    paginationDetails = null;

    constructor() {
        super();
        this.awsService = new AWSService();
    }

    setPaginationParams() {
        this.paginationDetails = { pageSize: AppConstant.RECORDS_PER_PAGE, pageNumber: 1, numberOfRecords: 0 };
    }

    buildTable() {
        $(document).trigger(CustomEventsConstants.BUILD_TABLE, this.listData);
    }

    afterHttpGetSuccess(response) {
        this.listData.data = this.extractOutDataFromResponse(response);
        this.buildTable();
        this.buildPagination(response);
    }

    buildPagination(response) {
        if (response) {
            this.paginationDetails.numberOfRecords = response.data.totalRecords;
        }
        let paginationIns = UtilHelper.getComponentDomIns(ComponentConstant.PAGINATION_COMPONENT);
        paginationIns.buildPagination(this.paginationDetails);
    }

    afterHttpGetError(response) {
        this.listData.data = [];
        this.buildTable();
        this.setPaginationParams();
        this.buildPagination(null);
    }

    extractOutDataFromResponse(response) {
        return null;
    }

    async callResourcesAPI() {
        if (this.getHttpServiceObj()) {
            appletClientServiceIns.showLoader();
            let result = await this.getHttpServiceObj().call();
            appletClientServiceIns.hideLoader();
            if (this.isHttpGetResponseValid(result)) {
                this.afterHttpGetSuccess(result);
            } else {
                this.afterHttpGetError();
            }
        }
    }

    isHttpGetResponseValid(response) {
        return true;
    }

    async getHttpServiceObj() {
    }

    postRenderHTML() {
        super.postRenderHTML();
        this.buildTable();
        this.setPaginationParams();
        this.callResourcesAPI();
    }

    onRowSelected(event, rowData) {
    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.TABLE_ROW_SELECTED, this.onRowSelected.bind(this));
        $(document).on(CustomEventsConstants.PAGE_CHANGED, this.onPageChanged.bind(this));
    }

    onPageChanged(event, pageNumber) {
        this.paginationDetails.pageNumber = pageNumber;
        this.callResourcesAPI();
    }
}