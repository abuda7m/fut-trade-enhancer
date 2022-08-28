import { getValue } from "../services/repository";
import { convertToSeconds, getRandWaitTime, wait } from "./commonUtil";
import { sendUINotification } from "./notificationUtil";
import { getBuyBidPrice, getSellBidPrice, roundOffPrice } from "./priceUtil";

export const listForPrice = async (sellPrice, player, ignoreRoundOff) => {
  await getPriceLimits(player);
  if (sellPrice) {
    const duration = getValue("EnhancerSettings")["idFutBinDuration"] || "1H";
    if (player.hasPriceLimits()) {
      if (!ignoreRoundOff) {
        sellPrice = computeSellPrice(sellPrice);
      } else {
        if (
          sellPrice < player._itemPriceLimits.minimum ||
          sellPrice > player._itemPriceLimits.maximum
        ) {
          sendUINotification(
            "Given price is not in card's price range",
            UINotificationType.NEGATIVE
          );
          return;
        }
      }
    }
    sellPrice = roundOffPrice(sellPrice, 200);
    services.Item.list(
      player,
      getSellBidPrice(sellPrice),
      sellPrice,
      convertToSeconds(duration) || 3600
    );
    await wait(getRandWaitTime("3-8"));
  }
};

const computeSellPrice = (sellPrice) => {
  sellPrice = roundOffPrice(
    Math.min(
      player._itemPriceLimits.maximum,
      Math.max(player._itemPriceLimits.minimum, sellPrice)
    )
  );

  if (sellPrice === player._itemPriceLimits.minimum) {
    sellPrice = getBuyBidPrice(sellPrice);
  }
};

const getPriceLimits = async (player) => {
  return new Promise((resolve) => {
    if (player.hasPriceLimits()) {
      resolve();
      return;
    }
    services.Item.requestMarketData(player).observe(
      this,
      async function (sender, response) {
        resolve();
      }
    );
  });
};
