/** @odoo-module **/

import { registry } from "@web/core/registry";

const publicInteractions = registry.category("public.interactions");

const original = publicInteractions.get("website_sale.product_variant_preview");

if (original) {
    publicInteractions.remove("website_sale.product_variant_preview");
}

class MulataProductVariantPreview extends original {
    updateVariantPreview() {
        const attributePreviewers = this.el.querySelectorAll(
            ".o_wsale_attribute_previewer"
        );

        for (const attributePreviewer of attributePreviewers) {

            attributePreviewer.classList.add("mulata-show-all-variants");

            const variants = attributePreviewer.querySelectorAll(
                ".o_product_variant_preview"
            );

            for (const variant of variants) {
                variant.classList.remove("d-none");
            }

            const hiddenCount = attributePreviewer.querySelector(
                "span[name='hidden_ptavs_count']"
            );

            if (hiddenCount) {
                hiddenCount.classList.add("d-none");
            }
        }
    }
}

publicInteractions.add(
    "website_sale.product_variant_preview",
    MulataProductVariantPreview
);


/* =========================================================
   MULATA — VARIANTES EN CARDS
   Al seleccionar una medida, abrir la ficha de esa variante
   ========================================================= */

document.addEventListener("click", function (ev) {
    const link = ev.target.closest(
        "#o_wsale_products_grid a.o_product_variant_preview"
    );

    if (!link) {
        return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    if (link.href) {
        window.location.href = link.href;
    }
}, true);

