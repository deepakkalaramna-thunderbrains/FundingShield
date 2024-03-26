import { ComponentConstant } from "../../constants/ComponentConstant.js";
import { ListComponent } from "../../components/ListComponent.js";
import { FSLambdaAPIService } from "../../services/FSLambdaAPIService.js";

export class MultiAddresses extends ListComponent {
  constructor(addresses) {
    super();
    this.addresses = [];
  }

  onComponentDataSet(componentData) {
    console.log(componentData);
    this.getAddresses();
    // this.callResourcesAPI();
    $("#transaction-id").html("");
  }
  
  async getHttpServiceObj() {
    if (this._componentData) {
      let transactionId =
        this._componentData.field_values.order_val_field134.display_value;
      
      let httpService = await this.awsService
        .callAWSLambdaApi("GET_MULTI_ADDRESSES", { transactionId })
      return httpService;
    }
  }

  async getAddresses() {
    try {
      const addresses = await this.getMultiAddresses();
      this.addresses = addresses || [];
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }

  async getMultiAddresses() {
    try {
      if (this._componentData) {
        let transactionId =
          this._componentData.field_values.order_val_field134.display_value;
          transactionId = 1476989;
        await this.awsService
        .callAWSLambdaApi("GET_MULTI_ADDRESSES", { transactionId });
      }
      return [];
    } catch (error) {
      console.error("Error fetching multi addresses:", error);
      throw error;
    }
  }

  setHTML() {
    const addressRows = this.addresses
      .map(
        (address) => `
      <tr>
        <td>${address.address1}</td>
        <td>${address.address2}</td>
        <td>${address.city}</td>
        <td>${address.state}</td>
        <td>${address.zipCode}</td>
      </tr>
    `
      )
      .join("");

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
