console.log("MULATA JS DIRECTO: cargado");

(function () {

    function moneyToNumber(text) {
        if (!text) return 0;

        let value = text
            .replace(/\$/g, "")
            .replace(/\s/g, "")
            .replace(/[^\d.,]/g, "");

        if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(value)) {
            value = value.replace(/\./g, "").replace(",", ".");
        } else {
            value = value.replace(",", ".");
        }

        return Number.parseFloat(value) || 0;
    }

    function formatUYU(value) {
        return new Intl.NumberFormat("es-UY", {
            maximumFractionDigits: 0,
        }).format(value);
    }

    function initMulataProduct() {

        const product = document.querySelector(".mulata-product-page");

        if (!product) {
            return;
        }

        console.log("MULATA: ficha encontrada");

        // -------------------------
        // CUOTAS
        // -------------------------

        const price =
            product.querySelector(".oe_price") ||
            product.querySelector(".product_price");

        const installments =
            product.querySelector(".mulata-installments");

        if (price && installments) {

            const total = moneyToNumber(price.textContent);

            if (total > 0) {

                const cuota = Math.ceil(total / 12);

                installments.innerHTML = `
                    <i class="fa fa-credit-card"></i>
                    <span>
                        Hasta <strong>12 cuotas de $ ${formatUYU(cuota)}</strong>
                    </span>
                `;

            }
        }

        // -------------------------
        // MOBILE BUY BAR
        // -------------------------

        if (document.querySelector(".mulata-mobile-buybar")) {
            return;
        }

        const addButton =
            product.querySelector("#add_to_cart") ||
            [...product.querySelectorAll("a, button")]
                .find(el =>
                    el.textContent.includes("Agregar al carrito")
                );

        if (!addButton) {
            console.log("MULATA: botón carrito no encontrado");
            return;
        }

        const quantityInput =
            product.querySelector(".css_quantity input") ||
            product.querySelector("input[name='add_qty']");

        const bar = document.createElement("div");

        bar.className = "mulata-mobile-buybar";

        bar.innerHTML = `
            <div class="mulata-mobile-quantity">

                <button
                    type="button"
                    class="mulata-mobile-minus">
                    −
                </button>

                <span class="mulata-mobile-number">
                    ${quantityInput?.value || 1}
                </span>

                <button
                    type="button"
                    class="mulata-mobile-plus">
                    +
                </button>

            </div>

            <button
                type="button"
                class="mulata-mobile-add">

                <i class="fa fa-shopping-cart"></i>

                Agregar al carrito

            </button>
        `;

        document.body.appendChild(bar);

        const number =
            bar.querySelector(".mulata-mobile-number");

        function setQty(value) {

            value = Math.max(
                1,
                Number(value) || 1
            );

            number.textContent = value;

            if (quantityInput) {

                quantityInput.value = value;

                quantityInput.dispatchEvent(
                    new Event(
                        "change",
                        { bubbles: true }
                    )
                );

            }
        }

        bar.querySelector(".mulata-mobile-minus")
            .addEventListener("click", () => {

                setQty(
                    Number(number.textContent) - 1
                );

            });

        bar.querySelector(".mulata-mobile-plus")
            .addEventListener("click", () => {

                setQty(
                    Number(number.textContent) + 1
                );

            });

        bar.querySelector(".mulata-mobile-add")
            .addEventListener("click", () => {

                addButton.click();

            });

        console.log("MULATA: barra móvil creada");
    }


    function boot() {

        initMulataProduct();

        setTimeout(
            initMulataProduct,
            300
        );

        setTimeout(
            initMulataProduct,
            1000
        );

        setTimeout(
            initMulataProduct,
            2000
        );
    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            boot
        );

    } else {

        boot();

    }

})();
