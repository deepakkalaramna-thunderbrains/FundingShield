import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { ListComponent } from "../../components/ListComponent.js";

export class MultiAddress extends ListComponent {
    constructor() {
        super();
    }

    setHTML() {
        return `
            <div class="container">
                <div class="row border border-secondary rounded">
                    <div class="col-md-12">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 pt-2 text-left">
                                    <input style="float: right;" type="button" id="openAllDocuments" class="btn btn-outline-secondary" value="Open All Documents">
                                </div>
                            </div>
                        </div>
                        <table class="table table-striped">
                            <thead class="table-light text-center">
                                <tr>
                                    <th>address 1</th>
                                    <th>address 2</th>
                                    <th>city</th>
                                    <th>state</th>
                                    <th>zip Code</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="col-md-4">
                                <input style="float: left;" type="button" id="firstReviewReceived" class="btn btn-outline-secondary" value="1st Review Received">
                            </div>
                            <div class="col-md-8">
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

window.customElements.define(ComponentConstant.MULTIADDRESSES, MultiAddress);
