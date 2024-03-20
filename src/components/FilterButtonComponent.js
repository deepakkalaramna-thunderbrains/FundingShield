import { FormComponent } from "./FormComponent.js";

export class FilterButtonComponent extends FormComponent {

    constructor() {
        super();
    }

    setHTML() {
        return `<div class="row">
        <div class="col-md-3 FAContainerForm">
            <input class="margin-left15 search-button disabled-color" type="button" name="search" value="Search" id="btn-search-CPL" disabled="disabled">
        </div>
    </div>`;
    }

    registerEventListenersAfterHTMLRendered() {
        console.log("here button");
    }

}

