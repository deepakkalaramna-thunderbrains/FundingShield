import { ComponentConstant } from "../../constants/ComponentConstant";
export class MultiAdress{
    setHTML(){
        return`<div>Hello it is working</div>`
    }
}
export default window.customElements.define(ComponentConstant.MULTIADDRESSESS, MultiAdress);