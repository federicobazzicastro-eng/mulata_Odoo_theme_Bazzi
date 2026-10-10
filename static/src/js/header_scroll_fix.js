/** @odoo-module **/

(function () {
    "use strict";

    /*
     * Histéresis:
     * - Compactamos recién después de 140 px.
     * - Volvemos al header completo solamente cerca del inicio.
     *
     * Esto evita que el cambio de altura del propio header
     * haga oscilar el estado.
     */
    const COMPACT_AT = 140;
    const EXPAND_AT = 25;

    let compact = false;
    let ticking = false;

    function updateMulataHeader() {
        const header = document.querySelector("header#top");
        const main = document.querySelector("main");

        document
            .querySelectorAll(".mulata-mobile-search input")
            .forEach((input) => {
                input.setAttribute("placeholder", "Buscar en Mulata");
            });

        if (!header || !header.querySelector(".mulata-mobile-header")) {
            return;
        }

        if (window.innerWidth >= 992) {
            compact = false;
            header.classList.remove("mulata-header-compact");

            if (main) {
                main.style.removeProperty("padding-top");
            }

            return;
        }

        /*
         * Neutralizamos únicamente el desplazamiento vertical
         * que Odoo intenta aplicar al header.
         */
        header.style.setProperty("transform", "none", "important");

        if (main) {
            main.style.setProperty("padding-top", "0px", "important");
        }

        const y = window.scrollY;

        /*
         * Entrar y salir usan valores diferentes.
         * Así nunca queda rebotando alrededor del mismo punto.
         */
        if (!compact && y >= COMPACT_AT) {
            compact = true;
            header.classList.add("mulata-header-compact");
        } else if (compact && y <= EXPAND_AT) {
            compact = false;
            header.classList.remove("mulata-header-compact");
        }
    }

    function requestUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;

        requestAnimationFrame(() => {
            updateMulataHeader();
            ticking = false;
        });
    }

    function init() {
        updateMulataHeader();

        window.addEventListener("scroll", requestUpdate, {
            passive: true,
        });

        window.addEventListener("resize", requestUpdate);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
