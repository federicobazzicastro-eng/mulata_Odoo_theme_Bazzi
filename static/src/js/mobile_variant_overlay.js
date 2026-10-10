/** @odoo-module **/

(function () {
    "use strict";

    const MOBILE = window.matchMedia("(max-width: 767.98px)");

    function updateOverlayMode() {
        const overlay = document.querySelector(
            "#o-carousel-product .mulata-mobile-variant-overlay"
        );
        const chips = overlay?.querySelector(".mulata-mobile-variant-chips");

        if (!overlay || !chips) {
            return;
        }

        requestAnimationFrame(() => {
            const hasOverflow = chips.scrollWidth > chips.clientWidth + 6;
            overlay.classList.toggle("has-overflow", hasOverflow);
        });
    }

    function buildVariantOverlay() {

        if (!MOBILE.matches) {
            document
                .querySelectorAll(".mulata-mobile-variant-overlay")
                .forEach((el) => el.remove());

            document
                .querySelectorAll(".mulata-original-mobile-variants")
                .forEach((el) => {
                    el.classList.remove("mulata-original-mobile-variants");
                });

            return;
        }

        const carousel = document.querySelector("#o-carousel-product");

        const variants = document.querySelector(
            "#product_detail .o_wsale_product_page_variants"
        );

        if (!carousel || !variants) {
            return;
        }

        variants.classList.add("mulata-original-mobile-variants");

        const oldOverlay = carousel.querySelector(
            ".mulata-mobile-variant-overlay"
        );

        if (oldOverlay) {
            oldOverlay.remove();
        }

        const overlay = document.createElement("div");
        overlay.className = "mulata-mobile-variant-overlay";

        const chips = document.createElement("div");
        chips.className = "mulata-mobile-variant-chips";

        const inputs = variants.querySelectorAll(
            "input.js_variant_change[data-attribute-value-id]"
        );

        inputs.forEach((input) => {
            const pill = input.closest(".o_variant_pills");
            if (!pill) return;

            const label =
                pill.querySelector(".radio_input_value") ||
                pill.querySelector("label");

            if (!label) return;

            const id = input.dataset.attributeValueId;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "mulata-mobile-variant-chip";
            button.textContent = label.textContent.trim();

            if (input.checked) {
                button.classList.add("active");
            }

            button.addEventListener("click", function (ev) {
                ev.preventDefault();
                ev.stopPropagation();

                const url = new URL(window.location.href);
                url.searchParams.set("attribute_values", id);
                window.location.assign(url.toString());
            });

            chips.appendChild(button);
        });

        overlay.appendChild(chips);
        carousel.appendChild(overlay);

        updateOverlayMode();
        setTimeout(updateOverlayMode, 120);
    }

    function init() {
        buildVariantOverlay();
        setTimeout(buildVariantOverlay, 250);
        setTimeout(buildVariantOverlay, 800);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    MOBILE.addEventListener("change", buildVariantOverlay);
    window.addEventListener("resize", updateOverlayMode);
})();
