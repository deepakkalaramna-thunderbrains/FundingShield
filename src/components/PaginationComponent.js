import { AppConstant } from '../constants/AppConstant.js';
import { CustomEventsConstants } from '../constants/CustomEventsConstants.js';
import { FragementComponent } from './FragementComponent.js';

export class PaginationComponent extends FragementComponent {

    numberOfRecords;
    pageSize = AppConstant.RECORDS_PER_PAGE;
    numberOfPages;
    curPageNumber = 1;
    pageDifference = 3;
    showNumberOfPageBlock = 7;

    setHTML() {
        let anchorTag = "";
        if (this.numberOfPages > 1) {
            anchorTag = `<a href="#" id="prev">&lt;</a>`;
            let startFrom = 0;
            let endTo = 0;
            if (this.numberOfPages <= this.showNumberOfPageBlock) {
                startFrom = 1;
                endTo = this.numberOfPages;
            } else if ((this.curPageNumber - this.pageDifference) > 0 && (this.numberOfPages - this.curPageNumber) >= this.pageDifference) {
                startFrom = this.curPageNumber - this.pageDifference;
                endTo = startFrom + this.showNumberOfPageBlock - 1;
            } else if ((this.pageDifference + this.curPageNumber) >= this.numberOfPages) {
                endTo = this.numberOfPages;
                startFrom = (this.numberOfPages - this.showNumberOfPageBlock) + 1;
            }
            else {
                startFrom = 1;
                endTo = this.showNumberOfPageBlock;
            }
            console.log("loop started", startFrom, endTo, this.curPageNumber, this.pageDifference, this.numberOfPages);
            for (let i = startFrom; i <= endTo; i++) {
                anchorTag += `<a href="#" id=page-number-${i} class="page-number">${i}</a>`;
            }
            anchorTag += `<a id="next" href="#" name="prev" > &gt; </a>`;
        }
        return `<div class="pagination-center">
            <div id="pagination">
                ${anchorTag}
            </div>
        </div>`;
    }

    registerEventListenersAfterHTMLRendered() {
        let self = this;
        $(".page-number").click(function (event) {
            self.changePage($(this).html());
        })
        $("#prev").click(function (event) {
            self.changePage(self.curPageNumber - 1);
        })

        $("#next").click(function (event) {
            self.changePage(self.curPageNumber + 1);
        })
    }

    toggleClass() {
        $(".page-number").each(function () {
            $(this).removeClass("active");
        });
        $("#page-number-" + this.curPageNumber).addClass("active");
    }

    changePage(pageNumber) {
        pageNumber = parseInt(pageNumber);
        if (pageNumber > 0 && pageNumber <= this.numberOfPages) {
            this.curPageNumber = pageNumber;
            // this.renderHTML();
            $(document).trigger(CustomEventsConstants.PAGE_CHANGED, this.curPageNumber);
        }
    }

    buildPagination(paginationDetails) {
        this.numberOfRecords = paginationDetails.numberOfRecords;
        this.curPageNumber = paginationDetails.pageNumber === 1 ? 1 : this.curPageNumber;
        this.numberOfPages = Math.ceil(this.numberOfRecords / this.pageSize);
        this.renderHTML();
        this.toggleClass();
    }

}


window.customElements.define("pagination-component", PaginationComponent);