import {FragementComponent} from './FragementComponent.js'

export class LoaderComponent extends FragementComponent {
    constructor(){
        super();
        // this.htmlStr = `<div>This is loader component</div>`;
    }

    setHTML(){
        return `<div class="d-flex justify-content-center">
        <div id="loader" class="spinner-border text-success" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      `;
    }

    registerEventListenersAfterHTMLRendered(){
    }

    getLoader(){
        return $(this).find("#loader")
    }

    showLoader(){
        // console.log("inside show loader");
        return this.getLoader().show();
    }

    hideLoader(){
        // console.log("inside hide loader");
        return this.getLoader().hide();
    }
}
window.customElements.define("loader-component", LoaderComponent);