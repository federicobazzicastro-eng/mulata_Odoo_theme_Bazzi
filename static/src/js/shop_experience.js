/** @odoo-module **/

(function () {
    "use strict";

    function mountMulataShopBenefits() {
        const shop = document.querySelector(".oe_website_sale");
        if (!shop) return;

        if (shop.querySelector(".mulata-shop-benefits")) return;

        const toolbar =
            shop.querySelector(".o_wsale_products_header") ||
            shop.querySelector("#products_grid .o_wsale_products_header");

        if (!toolbar) return;

        const benefits = document.createElement("div");
        benefits.className = "mulata-shop-benefits";

        benefits.innerHTML = `
            <div class="mulata-shop-benefit">
                <span class="mulata-benefit-icon">
                    <i class="fa fa-credit-card"></i>
                </span>
                <div>
                    <strong>Hasta 12 cuotas</strong>
                    <span>Pagá como te quede mejor</span>
                </div>
            </div>

            <div class="mulata-shop-benefit">
                <span class="mulata-benefit-icon">
                    <i class="fa fa-truck"></i>
                </span>
                <div>
                    <strong>Entrega rápida</strong>
                    <span>24–48 h en Montevideo</span>
                </div>
            </div>

            <div class="mulata-shop-benefit">
                <span class="mulata-benefit-icon">
                    <i class="fa fa-map-marker"></i>
                </span>
                <div>
                    <strong>Todo Uruguay</strong>
                    <span>Envíos al interior</span>
                </div>
            </div>
        `;

        toolbar.insertAdjacentElement("beforebegin", benefits);
    }

    function boot() {
        mountMulataShopBenefits();

        // Odoo puede reconstruir parte del shop al filtrar.
        const shop = document.querySelector(".oe_website_sale");

        if (shop) {
            const observer = new MutationObserver(() => {
                mountMulataShopBenefits();
            });

            observer.observe(shop, {
                childList: true,
                subtree: true,
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
