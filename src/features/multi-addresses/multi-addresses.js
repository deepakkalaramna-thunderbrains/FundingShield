import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { ListComponent } from "../../components/ListComponent.js";

export class MultiAddress extends ListComponent {
    constructor() {
        super();
    }

    setHTML() {
        return 
           ` <div class="container">
                <div class="row border border-secondary rounded">
                    <div class="col-md-12">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 pt-2 text-left">
                                    <input style="float: right;" type="button" id="openAllDocuments" class="btn btn-outline-secondary" value="Open All Documents">
                                </div>
                            </div>
                        </div>
                        <table>
                        <thead>
                            <tr>
                                <th>Address 1</th>
                                <th>Address 2</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Zip Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Table rows will be added with actual data -->
                        </tbody>
                    </table>
            </div>`;
    }
}

window.customElements.define(ComponentConstant.MULTIADDRESSES, MultiAddress);
