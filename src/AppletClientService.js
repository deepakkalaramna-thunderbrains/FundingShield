import { AppConstant } from "./constants/AppConstant.js";
import { ComponentConstant } from "./constants/ComponentConstant.js";
import { UtilHelper } from "./helpers/UtilHelper.js";
import { ObjectHelper } from "./helpers/ObjectHelper.js";
import { AppletActionConstants } from "./constants/AppletActionConstants.js";

class AppletClientService {
  appActionDetails = AppletActionConstants.appActionDetails;
  ffAAppletClient = null;

  eventData = null;

  constructor() {
    this.ffAAppletClient = new FAAppletClient({
      appletId: AppConstant.APPLET_ID,
    });
    this.registerAppActionListener();
  }

  registerAppActionListener() {
    this.appActionDetails.forEach((appActionDetail) => {
      this.ffAAppletClient.on(
        appActionDetail.actionName,
        this.onAppActionClicked.bind(this, appActionDetail)
      );
    });
    // this.navigateToApplet(this.appActionDetails[1]);
  }

  showSnackBar(message, error) {
    document
      .querySelector(ComponentConstant.SNACK_BAR)
      .showSnackBar(message, error);
  }

  showLoader() {
    document.querySelector(ComponentConstant.LOADER_COMPONENT).showLoader();
  }

  hideLoader() {
    document.querySelector(ComponentConstant.LOADER_COMPONENT).hideLoader();
  }

  onAppActionClicked(appActionDetail, eventData) {
    this.eventData = eventData;
    this.ffAAppletClient.open();
    this.navigateToApplet(appActionDetail, eventData);
  }

  navigateToApplet(appActionDetail, eventData) {
    eventData = eventData || {};
    let componentName = null;
    switch (appActionDetail.actionName) {
      case "onDocumentAppletClicked":
        componentName = ComponentConstant.DOCUMENT_LIST;
        break;
      case "onWireAppletClicked":
        componentName = ComponentConstant.WIRE_FORM;
        break;
      case "onLenderAppletClicked":
        componentName = ComponentConstant.LENDER_LIST;
        break;
      case "onclosingAgentAppletClicked":
        componentName = ComponentConstant.CLOSINGAGENT_FORM;
        break;
      case "onUnderwriterClicked":
        componentName = ComponentConstant.UNDERWRITER_FORM;
        break;
      // case "onWireAppletClicked":
      //     componentName = ComponentConstant.WIRE_LIST;
      //     break;
      case "onSendDocumentEmailClicked":
        componentName = ComponentConstant.EMAIL_FORM;
        break;
      case "onMultiAddressessClicked":
        componentName = ComponentConstant.MULTIADDRESSES;
        break;
      default:
        componentName = ComponentConstant.DOCUMENT_LIST;
        break;
    }
    if (ObjectHelper.isObjectValid(eventData)) {
      eventData.appletTitle = appActionDetail.appletTitle;
      // eventData.appletId = this.getAppletId(eventData, appActionDetail.idKey);
    }
    UtilHelper.navigateTo(componentName, eventData);
  }

  getFFAAppletClientIns() {
    return this.ffAAppletClient;
  }

  getAppletId(eventData, idKey) {
    return eventData["field_values"][idKey]["display_value"];
  }
}

export const appletClientServiceIns = new AppletClientService();
