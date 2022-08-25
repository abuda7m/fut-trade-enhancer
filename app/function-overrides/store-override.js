import {
  purchasePopUpMessage,
  validateFormAndOpenPack,
} from "../utils/openPacksUtil";
import { sendUINotification } from "../utils/notificationUtil";
import { showPopUp } from "./popup-override";

export const storeOverride = () => {
  const setupBuyCoinsButton =
    UTStorePackDetailsView.prototype.setupBuyCoinsButton;

  const autoOpenPacks = function (e, t, i) {
    let isHandled = false;
    services.Store.getPacks().observe(this, function (sender, data) {
      if (isHandled) return;
      isHandled = true;
      const pack = data.response.packs.find(
        (item) => item.id === this.articleId
      );
      if (!pack) {
        sendUINotification(
          "Unable to find the pack",
          UINotificationType.NEGATIVE
        );
        return;
      }

      showPopUp(
        [
          { labelEnum: enums.UIDialogOptions.OK },
          { labelEnum: enums.UIDialogOptions.CANCEL },
        ],
        "Auto Open Packs",
        purchasePopUpMessage,
        (text) => {
          text === 2 && validateFormAndOpenPack(pack);
        }
      );
    });
  };
  UTStorePackDetailsView.prototype.setupBuyCoinsButton = function (...params) {
    setupBuyCoinsButton.call(this, ...params);
    this._btnOpenPacks && this.removeActionButton(this._btnOpenPacks);
    this._btnOpenPacks = new UTCurrencyButtonControl();
    this._btnOpenPacks.init();
    this._btnOpenPacks.setText("Open pack");
    this._btnOpenPacks.setSubText("Automatically");
    this._btnOpenPacks.addClass("call-to-action packOpen");
    this._btnOpenPacks.addTarget(this, autoOpenPacks, EventType.TAP);
    this.appendActionButton(this._btnOpenPacks);
  };
};
