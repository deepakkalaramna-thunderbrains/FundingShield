import { CustomEventsConstants } from "../constants/CustomEventsConstants.js";
import { FragementComponent } from "./FragementComponent.js";
import { ArrayHelper } from "./../helpers/ArrayHelper.js";

class TableBuilder extends FragementComponent {

    tableData = null;
    constructor() {
        super();
    }

    setHTML() {
        let htmlStr = "";
        if (this.tableData) {
            let tableHeaderStr = this.buildHeader(this.tableData.tableConf,this.tableData.select);
            let tableBodyStr = this.buildRow(this.tableData.tableConf, this.tableData.data);
            htmlStr = `
                <div class='row p-t20'>
                    <div class='col-md-12 tbl-section'>
                        <table class='table table-striped' style="table-layout: fixed; width: 1700px !important">
                            <thead class='table-light'>${tableHeaderStr}</thead>
                            <tbody>${tableBodyStr}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }
        return htmlStr;
    }

    buildTable(event, tableData) {
        this.tableData = tableData;
        this.renderHTML();
    }

    buildHeader(tableConf,select) {

        let radioPx = select ? select.width : "90px"
        let tableHeaderStr = `<tr !important"><th class="txt_col" style='width: ${radioPx}; text-align:center;'>Select</th>`;
        if (tableConf) {
            tableConf.forEach(header => {
                tableHeaderStr += `<th ${header.width ? `style='width: ${header.width};'` : ""} class="txt_col">${header.colName}</th>`;
            });
        }
        return `${tableHeaderStr}</tr>`;
    }

    onRowSelected(rowIndex) {
        let selectedData = this.tableData.data[rowIndex + 1];
        $(document).trigger(CustomEventsConstants.TABLE_ROW_SELECTED, selectedData);
    }

    buildRow(tableConf, tableData) {
        let tableBodyStr = "";
        if (ArrayHelper.isArrayValid(tableData)) {
            tableData.forEach(dataRow => {
                tableBodyStr += "<tr><td style='text-align:center'><input type='radio' name='radio-name'></td>";
                tableConf.forEach((tblConf) => {
                    tableBodyStr += `<td>${dataRow[tblConf.dataKeyName] || ""}</td>`;
                });
                tableBodyStr += "</tr>";
            });
        } else {
            tableBodyStr = this.buildNoRecordFound(tableConf);
        }
        return tableBodyStr;
    }

    buildNoRecordFound(tableConf) {
        return `<tr><td style='text-align:center;' colspan=${tableConf.length + 1}>There is no available records to show</td></tr>`;
    }

    rowClicked() {

    }
    registerEventListenersAfterHTMLRendered() {
        $(document).on(CustomEventsConstants.BUILD_TABLE, this.buildTable.bind(this));
        let self = this;
        $('input[name=radio-name]').click(function () {
            let index = $(this).parent().parent().index();
            self.onRowSelected(index - 1);
        });
    }

    unRegisterEventListenersAfterHTMLRendered() {
        $(document).off(CustomEventsConstants.BUILD_TABLE);
    }

}

export default window.customElements.define("table-comp", TableBuilder);