import { FragementComponent } from './FragementComponent.js';

export class SnackBarComponent extends FragementComponent {

    constructor() {
        super();
    }

    setHTML() {
        return `<div id="snackbar"></div>`;
    }

    // setMessage(message) {
    //     this.getSnackBarElem().html(message);
    // }

    getSnackBarElem() {
        return $(this).find("#snackbar");
    }

    showSnackBar(message,error) {
        this.getSnackBarElem().attr("style","background-color:#A0CA9A");
        console.log(error);
        if(error){
            this.getSnackBarElem().attr("style","background-color:#FF0000");
        }
        this.getSnackBarElem().addClass("show").html(message);;
        setTimeout(() => {
            this.hideSnackBar();
        }, 3000);
    }


    hideSnackBar() {
        this.getSnackBarElem().removeClass("show").html("");
    }

}

window.customElements.define("snack-bar", SnackBarComponent);