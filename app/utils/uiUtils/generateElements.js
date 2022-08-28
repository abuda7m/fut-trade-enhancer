import { idListFutBin, idViewFutBin } from "../../app.constants";
import { getFutbinPlayerUrl } from "../../services/futbin";
import { getValue } from "../../services/repository";
import { sendUINotification } from "../notificationUtil";
import { listCards } from "../reListUtil";
import { generateButton } from "./generateButton";

export const generateListForFutBinBtn = () => {
  return generateButton(
    idListFutBin,
    "List for FUTBIN",
    () => {
      const selectedPlayer = getValue("selectedPlayer");
      selectedPlayer && listCards([selectedPlayer]);
    },
    "accordian"
  );
};

export const generateViewOnFutBinBtn = () => {
  return generateButton(
    idViewFutBin,
    "View on FUTBIN",
    async () => {
      const selectedPlayer = getValue("selectedPlayer");
      const playerUrl = await getFutbinPlayerUrl(selectedPlayer);
      if (!playerUrl) {
        sendUINotification(
          "Unable to get futbin url",
          UINotificationType.NEGATIVE
        );
      }
      window.open(playerUrl, "_blank");
    },
    "accordian"
  );
};

export const generateSectionRelistBtn = (
  sectionHeader,
  callBack,
  dataSource
) => {
  return generateButton(
    `${sectionHeader}${dataSource}`.replace(/\s/g, ""),
    `List ${dataSource}`,
    callBack,
    "relist call-to-action mini "
  );
};
