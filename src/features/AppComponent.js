import { FragementComponent } from "../components/FragementComponent.js";
import { AppConstant } from "../constants/AppConstant.js";
import { UtilHelper } from "../helpers/UtilHelper.js";

export class AppComponent extends FragementComponent {

    constructor() {
        super();
        $(document).on(AppConstant.ROUTE_CHANGED_EVENT, this.routeChanged.bind(this));
    }

    setHTML() {
        return `<div>
        <header>
                <div class="row justify-content-md-center">
                    <h4 id="title"></h4>
                </div>
                <hr>
                <div class="row justify-content-md-center">
                    <h5 id="transaction-id"></h5>
                </div>
            </header>
        <div id="app-comp"></div>
        </div>
        `;
    }

    setApplet() {

    }

    routeChanged(event, compDetails) {
        let comp = null;
        comp = UtilHelper.buildComponentTagName(compDetails.compName);
        $(this).find("#app-comp").empty();
        $(this).find("#app-comp").html(comp);
        this.setHeaderValue(compDetails.data);
        document.querySelector(compDetails.compName).componentData = compDetails.data;
    }

    setHeaderValue(componentData) {
        if (componentData) {
            $(this).find("#title").html(componentData.appletTitle);
            // $(this).find("#transaction-id").html(componentData.appletId);
        }
    }
}

window.customElements.define("app-component", AppComponent);
