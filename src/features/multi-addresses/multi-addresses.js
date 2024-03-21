import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { ListComponent } from "../../components/ListComponent.js";

export class MultiAddress extends ListComponent {
  constructor() {
    super();
  }

  setHTML() {
    return` <div class="container mt-4">
    <div class="row border border-secondary rounded p-3">
        <div class="col-md-12">
            <div class="row align-items-center mb-3">
                <div class="col-md-6">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search...">
                </div>
                <div class="col-md-6 text-md-right mt-2 mt-md-0">
                    <button type="button" id="searchButton" class="btn btn-primary">
                        <i class="bi bi-search"></i> Search
                    </button>
                </div>
            </div>

            <table class="table table-striped">
                <thead class="thead-light text-center"> 
                    <tr>
                        <th>Address 1</th>
                        <th>Address 2</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Zip Code</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>123 Main St</td>
                        <td>Apt 101</td>
                        <td>New York</td>
                        <td>NY</td>
                        <td>10001</td>
                    </tr>
                    <tr>
                        <td>456 Elm St</td>
                        <td>Suite 200</td>
                        <td>Los Angeles</td>
                        <td>CA</td>
                        <td>90001</td>
                    </tr>
                    <tr>
                        <td>789 Oak St</td>
                        <td>Unit B</td>
                        <td>Chicago</td>
                        <td>IL</td>
                        <td>60601</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>`;

  }
}

window.customElements.define(ComponentConstant.MULTI_ADDRESSES, MultiAddress);
