import { AppConstant } from "../constants/AppConstant.js";

export class UtilHelper {
    static validateRole(roles) {
        const validRoles = [
            "2nd Review",
            "Administrator",
            "App Admin",
            "Manager",
            "Power User"
        ];
        if(Array.isArray(roles)){
            return roles.some((role) => validRoles.includes(role.name));
        }
        return false;
    }

    static buildComponentTagName(componentName) {
        return `<${componentName}></${componentName}>`;
    }

    static navigateTo(compName, data) {
        $(document).trigger(AppConstant.ROUTE_CHANGED_EVENT, { compName, data });
    }

    static makeButtonDisabled(buttonElemObj) {
        buttonElemObj.attr("disabled", "disabled").addClass("disabled-color");
    }

    static makeButtonEnabled(buttonElemObj) {
        buttonElemObj.removeAttr("disabled").removeClass("disabled-color");
    }

    static getFreeAgentId(eventData) {
        return eventData.id;
    }

    static setComponentData(compName, componentData) {
        document.querySelector(compName).componentData = componentData;
    }

    static getComponentDomIns(compName){
        return document.querySelector(compName);
    }
}