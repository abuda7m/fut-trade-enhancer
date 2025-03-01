import { idSectionPrices } from "../../app.constants";
import { getSelectedPlayersBySection } from "../../services/repository";
import { t } from "../../services/translate";
import { getPercentDiff } from "../commonUtil";
import { generateSectionRelistBtn } from "./generateElements";

export const appendPrice = (dataSource, auctionElement, price, boughtFor) => {
  let percentDiff = undefined;
  const element = $("<div class='futbinprice auctionValue priceholder'></div>");
  auctionElement.find(".futbinprice").remove();
  if (boughtFor) {
    percentDiff = getPercentDiff(price * 0.95, boughtFor);
    appendPriceInfo(
      services.Localization.localize("infopanel.label.prevBoughtPrice"),
      element,
      boughtFor,
      "boughtFor"
    );
  }

  appendPriceInfo(dataSource, element, price, "futbinpricesel", percentDiff);
  auctionElement.prepend(element);
};

export const appendPackPrice = (packValue) => {
  $(".ut-store-reveal-modal-list-view--wallet").append(
    `<span class="ut-store-reveal-modal-list-view--coins">${t(
      "packValue"
    )} ${packValue}</span>`
  );
};

export const appendSquadTotal = (dataSource, total) => {
  if ($(".squadTotal").length) {
    $(".squadTotal").text(total);
  } else {
    $(
      `<div class="rating">
          <span class="ut-squad-summary-label">${dataSource} ${t(
        "squadPrice"
      )}</span>
          <div>
            <span class="ratingValue squadTotal currency-coins">${total}</span>
          </div> 
        </div>
        `
    ).insertAfter($(".chemistry"));
  }
};

export const appendPriceToSlot = (rootElement, price) => {
  rootElement.prepend(`
    <div style="position: absolute;top: -10px;width: 100%;">
      <span class="currency-coins value squad-fut-bin">${
        price ? price.toLocaleString() : "---"
      }</span>
    </div>`);
};

const handleCheckBoxToggle = (isChecked, selectedPlayersBySection, card) => {
  if (!isChecked) {
    selectedPlayersBySection.delete(card.id);
    $(`#${card.id}_check`).prop("checked", true);
  } else {
    selectedPlayersBySection.set(card.id, card);
    $(`#${card.id}_check`).prop("checked", false);
  }
};

const eventMappers = new Set();

export const appendCheckBox = (rootElement, section, card) => {
  const selectedPlayersBySection = getSelectedPlayersBySection(section);
  rootElement.find(".player-select").remove();

  if (!eventMappers.has(card.id)) {
    $(document).on("click touchend", `#${card.id}`, function (evt) {
      const isChecked = !selectedPlayersBySection.has(card.id);
      handleCheckBoxToggle(isChecked, selectedPlayersBySection, card);
    });
    eventMappers.add(card.id);
  }

  const checkBox = $(
    `<div id='${card.id}' class="price-filter player-select"><input type='checkbox' id='${card.id}_check' class="player-select" /></div>`
  );
  if (!selectedPlayersBySection.get(card.id)) {
    checkBox.find("input").prop("checked", true);
  }

  rootElement.prepend(checkBox);
};

export const appendSectionTotalPrices = (
  rootElement,
  dataSource,
  { totalBid, totalBin, totalExternalPrice }
) => {
  rootElement.parent().find(`#${idSectionPrices}`).remove();
  const sectionPrices = $(`<div id=${idSectionPrices} class="ut-button-group">
    <h3 class="ut-group-button cta price-totals ut-store-reveal-modal-list-view--wallet">
    <span  class="ut-store-reveal-modal-list-view--coins">${t(
      "bidTotal"
    )} ${totalBid}</span>
    <span class="ut-store-reveal-modal-list-view--coins">${t(
      "binTotal"
    )} ${totalBin}</span>
    <span class="ut-store-reveal-modal-list-view--coins">${dataSource} ${totalExternalPrice} </span>
    </h3>
  </div>`);

  sectionPrices.insertAfter(rootElement);
};

export const appendRelistExternal = (
  header,
  rootElement,
  dataSource,
  externalCallBack,
  fixedCallBack
) => {
  if (!rootElement.find(".relistwrapper").length) {
    rootElement.addClass("relistsection");
    const element = $("<div class='relistwrapper'></div>");
    element.append(
      generateSectionRelistBtn(externalCallBack, dataSource).__root
    );
    element.append(generateSectionRelistBtn(fixedCallBack, t("fixed")).__root);
    rootElement.append(element);
  }
};

export const appendDuplicateTag = (rootElement) => {
  rootElement.find(".rowContent").append(
    `<div class="show-duplicate ut-list-tag-view ut-list-active-tag-view">
            <div class="label-container">
              <span class="fut_icon icon_squad">
              </span>
              <span class="label">
              </span>
            </div>
        </div>`
  );
};

export const appendContractInfo = (rootElement, contract) => {
  rootElement.find(".ut-item-player-status--loan").text(contract);
};

const appendPriceInfo = (
  label,
  auctionElement,
  price,
  selector,
  percentDiff
) => {
  const color =
    percentDiff < 0 ? "orangered" : percentDiff > 0 ? "lime" : "darksalmon";
  auctionElement.prepend(`<div class="auctionValue ${selector} futbinprice">
              <span class="label">${label} ${
    percentDiff !== undefined
      ? `<info style='color: ${color}'>(${percentDiff.toFixed(2)}%)</info>`
      : ""
  }</span>
              <span class="currency-coins value">${
                price ? price.toLocaleString() : "---"
              }</span>             
            </div>`);
};
