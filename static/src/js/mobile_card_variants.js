/** @odoo-module **/

(function () {
    "use strict";

    const MOBILE = window.matchMedia("(max-width: 767.98px)");

    function arrangeCardVariants() {
        document.querySelectorAll(
            "#o_wsale_products_grid .oe_product_cart"
        ).forEach((card) => {

            const image = card.querySelector(".oe_product_image");
            const previewer = card.querySelector(".o_wsale_attribute_previewer");

            if (!image || !previewer) {
                return;
            }

            if (!previewer.__mulataPlaceholder) {
                previewer.__mulataPlaceholder =
                    document.createComment("mulata-card-variants");

                previewer.parentNode.insertBefore(
                    previewer.__mulataPlaceholder,
                    previewer
                );
            }

            if (MOBILE.matches) {
                previewer.classList.add("mulata-card-variants-overlay");

                if (previewer.parentNode !== image) {
                    image.appendChild(previewer);
                }
            } else {
                const placeholder = previewer.__mulataPlaceholder;

                if (placeholder?.parentNode) {
                    placeholder.parentNode.insertBefore(
                        previewer,
                        placeholder.nextSibling
                    );
                }

                previewer.classList.remove("mulata-card-variants-overlay");
            }
        });
    }

    function init() {
        arrangeCardVariants();

        setTimeout(arrangeCardVariants, 300);
        setTimeout(arrangeCardVariants, 900);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    MOBILE.addEventListener("change", arrangeCardVariants);

})();
