import { ComponentConstant } from "../../constants/ComponentConstant.js";
export class MultiAdress{
    setHTML(){
        return`<form id="multi-addresses">
        <div class="container">
                    <div class="row p-t20">
                        <form-field-alpha-num class="col-md-6" label="Company Name" name="name"></form-field-alpha-num>
                        <form-field-alpha-num class="col-md-6" label="Contact Email" name="email"></form-field-alpha-num>
                    </div>
                    <div class="row p-t20">
                        <form-field-phone min="10" max="18" class="col-md-6" label="Phone" name="phone"></form-field-phone>
                        <form-field-alpha-num class="col-md-6" label="Address" name="address"></form-field-alpha-num>
                    </div></div>
        </form>`
        
    }
}
export default window.customElements.define(ComponentConstant.MULTIADDRESSESS, MultiAdress);