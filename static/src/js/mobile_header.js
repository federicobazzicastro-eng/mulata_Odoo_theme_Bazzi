/** @odoo-module **/

(function () {
    "use strict";

    function keepMulataMobileHeaderVisible() {
        if (window.innerWidth > 991) {
            return;
        }

        document
            .querySelectorAll(".o_header_hide_on_scroll")
            .forEach((el) => {
                el.classList.remove("hidden");
                el.style.removeProperty("display");
                el.style.removeProperty("visibility");
                el.style.removeProperty("opacity");
                el.style.removeProperty("transform");
                el.style.removeProperty("height");
                el.style.removeProperty("max-height");
            });

        const header = document.querySelector("header#top");

        if (header) {
            header.classList.add("o_no_autohide_menu");
            header.style.transform = "none";
        }

        const mobileTop = document.querySelector(".mulata-mobile-top");

        if (mobileTop) {
            mobileTop.style.display = "grid";
            mobileTop.style.visibility = "visible";
            mobileTop.style.opacity = "1";
            mobileTop.style.transform = "none";
        }
    }

    function initMulataMobileHeader() {
        keepMulataMobileHeaderVisible();

        window.addEventListener(
            "scroll",
            () => {
                window.requestAnimationFrame(
                    keepMulataMobileHeaderVisible
                );
            },
            { passive: true }
        );

        window.addEventListener(
            "resize",
            keepMulataMobileHeaderVisible
        );

        const header = document.querySelector("header#top");

        if (header) {
            const observer = new MutationObserver(
                keepMulataMobileHeaderVisible
            );

            observer.observe(header, {
                attributes: true,
                subtree: true,
                attributeFilter: ["class", "style"],
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initMulataMobileHeader
        );
    } else {
        initMulataMobileHeader();
    }
})();
