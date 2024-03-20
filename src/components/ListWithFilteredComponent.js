import { CustomEventsConstants } from "../constants/CustomEventsConstants.js";
import { ListComponent } from "./ListComponent.js";

export class ListWithFilteredComponent extends ListComponent {

    // filteredData = null;
    userFilteredInput = null;

    constructor() {
        super();
    }

    onFiltered(event, filteredData) {
        console.log("on filtered twicwe");
        this.userFilteredInput = filteredData;
        this.setPaginationParams();
        // this.filteredData.data = this.listData.filter((dataItem) => {
        //     return this.searchListDataByFilter(dataItem, filteredData);
        // });
        // this.getResources();
        // this.buildTable();
    }

    onFilterCleared(event) {
        this.userFilteredInput = null;
        this.listData.data = null;
        this.buildTable();
        this.setPaginationParams();
        this.buildPagination();
    }

    // buildTable() {
    //     $(document).trigger(CustomEventsConstants.BUILD_TABLE, this.filteredData);
    // }

    /**
     * would be implemented by derived class
     * @param {*} dataItem 
     * @param {*} filteredData 
     */
    searchListDataByFilter(dataItem, filteredData) {

    }

    registerEventListenersAfterHTMLRendered() {
        super.registerEventListenersAfterHTMLRendered();
        $(document).on(CustomEventsConstants.SEARCH_CLOSING_AGENT_RECORDS, this.onFiltered.bind(this));
        $(document).on(CustomEventsConstants.CLEAR_TABLE_RECORDS, this.onFilterCleared.bind(this));
    }

    unRegisterEventListenersAfterHTMLRendered() {
        super.unRegisterEventListenersAfterHTMLRendered();
        $(document).off(CustomEventsConstants.SEARCH_CLOSING_AGENT_RECORDS);
        $(document).off(CustomEventsConstants.PAGE_CHANGED);
        $(document).off(CustomEventsConstants.CLEAR_TABLE_RECORDS);
    }

}