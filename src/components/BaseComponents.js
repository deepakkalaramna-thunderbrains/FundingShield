import { UtilHelper } from "../helpers/UtilHelper.js";

export class BaseComponents extends HTMLElement {

    _componentData = null;

    constructor() {
        super();
    }

    /**
     * @param {any} data
     */
    set componentData(data) {
        this._componentData = data;
        this.setAppletHeader();
        this.setAppletTitle();
        this.onComponentDataSet(data);
    }

    setAppletHeader() {
        if (this._componentData) {
            $("#transaction-id").html(this._componentData.appletId);
        }
    }

    setAppletTitle() {
        if (this._componentData) {
            $("#title").html(this._componentData.appletTitle);
        }
    }

    /**
     * would be impleened by derived class
     * @param {would} componentData 
     */
    onComponentDataSet(componentData) {

    }

    navigateBetweenComponents(componentName) {
        UtilHelper.navigateTo(componentName, this._componentData);
    }

    connectedCallback() {
        this.renderHTML();
    }

    disconnectedCallback() {
        this.unRegisterEventListenersAfterHTMLRendered();
    }

    setHTML() {

    }

    renderHTML() {
        this.innerHTML = this.setHTML();
        this.postRenderHTML();
    }

    postRenderHTML() {
        this.registerEventListenersAfterHTMLRendered();
    }

    registerEventListenersAfterHTMLRendered() {

    }

    unRegisterEventListenersAfterHTMLRendered() {

    }
}