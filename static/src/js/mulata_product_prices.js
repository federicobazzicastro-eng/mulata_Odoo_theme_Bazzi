/** @odoo-module **/

import { registry } from "@web/core/registry";
import { patch } from "@web/core/utils/patch";

const ProductPage = registry.category("public.interactions")
    .get("website_sale.product_page");

function formatMulataPrice(amount, currency) {
    const value = Math.round(Number(amount) || 0);

    const number = value.toLocaleString("es-UY", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return `${currency === "USD" ? "US$" : "$"} ${number}`;
}

function updateMulataDisplay(parent, amount) {
    const detail = parent.closest("#product_detail");

    if (!detail) {
        return;
    }

    const currency = detail.dataset.mulataCurrency || "UYU";
    const rate = Number(detail.dataset.mulataRate) || 42;

    const priceUYU = Number(amount) || 0;

    const displayAmount = currency === "USD"
        ? priceUYU / rate
        : priceUYU;

    const formatted = formatMulataPrice(displayAmount, currency);

    const priceContainers = document.querySelectorAll(
        "#product_detail .product_price .oe_price, " +
        ".mulata-mobile-buybar .product_price .oe_price"
    );

    for (const container of priceContainers) {
        let visual = container.parentElement.querySelector(
            ":scope > .mulata-visual-price"
        );

        if (!visual) {
            visual = document.createElement("span");
            visual.className = "mulata-visual-price fw-bold";
            container.insertAdjacentElement("afterend", visual);
        }

        visual.textContent = formatted;
        container.classList.add("d-none");
    }
}

patch(ProductPage.prototype, {
    async _onChangeCombination(ev, parent, combination, images) {
        await super._onChangeCombination(
            ev, parent, combination, images
        );

        if (!combination.hide_price) {
            updateMulataDisplay(parent, combination.price);
        }
    },
});
