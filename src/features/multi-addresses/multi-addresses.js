import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { ListComponent } from "../../components/ListComponent.js";

export class MultiAddresses extends ListComponent {
  constructor(addresses) {
    super();
    this.addresses = addresses || [
      {
        address1: "123 Main St",
        address2: "Apt 101",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      },
      {
        address1: "456 Elm St",
        address2: "Suite 200",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001"
      },
      {
        address1: "789 Oak St",
        address2: "Unit B",
        city: "Chicago",
        state: "IL",
        zipCode: "60601"
      }
    ];
  }

  setHTML() {
    const addressRows = this.addresses.map(address => `
      <tr>
        <td>${address.address1}</td>
        <td>${address.address2}</td>
        <td>${address.city}</td>
        <td>${address.state}</td>
        <td>${address.zipCode}</td>
      </tr>
    `).join('');

    return `<div class="container mt-4">
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
                        ${addressRows}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
  }
}

window.customElements.define(ComponentConstant.MULTI_ADDRESSES, MultiAddresses);
