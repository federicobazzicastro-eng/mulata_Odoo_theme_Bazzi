/** @odoo-module **/
/*
 * Mulata: progressive enhancement of the existing website_description.
 * Only activates on the Gelbring Enxuta BCENXS452300N pilot.
 * If JS fails, the original server-rendered content remains visible.
 * Does not change product form, pricing, variations, gallery or checkout.
 */
(function () {
    "use strict";

    const PILOT_SKU = "BCENXS452300N";
    const ROOT_SELECTOR = ".mulata-product-editorial";
    const IMAGE_PATH = "/theme_mulata/static/src/img/";
    const TABS = [
        ["descripcion", "Descripción"],
        ["caracteristicas", "Características técnicas"],
        ["medidas", "Medidas"],
        ["envios", "Envíos"],
        ["preguntas", "Preguntas frecuentes"],
    ];

    function el(tag, cls, text) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function benefit(title, detail, symbol) {
        const item = el("div", "me2-benefit");
        item.append(el("span", "me2-benefit-icon", symbol));
        const copy = el("div", "me2-benefit-copy");
        copy.append(el("strong", "", title), el("small", "", detail));
        item.append(copy);
        return item;
    }

    function heading(kicker, title, summary) {
        const wrap = el("div", "me2-panel-heading");
        wrap.append(el("span", "me2-kicker", kicker), el("h2", "", title));
        if (summary) wrap.append(el("p", "", summary));
        return wrap;
    }

    function inspirationCard(opts) {
        const card = el("article", "me2-inspo-card");
        const media = el("div", "me2-inspo-media");
        if (opts.src) {
            const img = document.createElement("img");
            img.src = opts.src;
            img.alt = opts.alt;
            img.loading = "lazy";
            img.decoding = "async";
            media.append(img);
        } else {
            media.classList.add("me2-inspo-diagram");
            media.append(el("span", "", "2 velocidades"));
            media.append(el("span", "", "3 niveles de calor"));
            media.append(el("span", "", "Aire frío"));
        }
        media.append(el("span", "me2-inspo-label", "Inspiración de uso"));
        const body = el("div", "me2-inspo-body");
        if (opts.kicker) body.append(el("span", "me3-story-kicker", opts.kicker));
        body.append(el("h3", "", opts.title), el("p", "", opts.copy));
        card.append(media, body);
        return card;
    }

    function getSpecValue(table, label) {
        const rows = Array.from(table.querySelectorAll("tr"));
        const row = rows.find(r => {
            const first = r.querySelector("th,td");
            return first && first.textContent.toLowerCase().includes(label.toLowerCase());
        });
        if (!row) return "";
        const cells = row.querySelectorAll("th,td");
        return cells.length > 1 ? cells[cells.length - 1].textContent.trim() : "";
    }

    function dimension(box, label, value) {
        const card = el("div", "me2-dimension");
        card.append(el("strong", "", value), el("span", "", label));
        box.append(card);
    }

    // MULATA EDITORIAL V3 APROBADO
    function editorialIntro() {
        const wrap = el("div", "me3-intro-wrap");
        const lead = el("div", "me3-intro");
        const main = el("div", "me3-intro-main");
        main.append(el("span", "me3-kicker", "Enxuta · Una forma distinta de usarlo"));
        const headline = el("h2", "me3-headline");
        headline.append(document.createTextNode("No todos los días\nte peinás "));
        headline.append(el("em", "", "igual."));
        main.append(headline);
        const aside = el("div", "me3-aside");
        aside.append(el("strong", "", "¿Con cuál vas hoy?"));
        aside.append(el("p", "", "Concentrador para dirigir el aire. Difusor para distribuirlo. Dos accesorios para elegir cómo trabajar tu peinado."));
        lead.append(main, aside);
        wrap.append(lead);

        const meter = el("div", "me3-meter");
        meter.setAttribute("aria-label", "Funciones confirmadas del modelo Enxuta");
        for (const [number, title, detail, type] of [
            ["02", "velocidades", "Regulá el flujo", ""],
            ["03", "niveles de calor", "Elegí la temperatura", ""],
            ["Cool Shot", "aire frío", "Para terminar", "me3-metric-air"],
        ]) {
            const stat = el("div", "me3-metric" + (type ? " " + type : ""));
            stat.append(el("span", "me3-metric-number", number));
            const copy = el("div", "me3-metric-copy");
            copy.append(el("strong", "", title), el("small", "", detail));
            stat.append(copy);
            meter.append(stat);
        }
        wrap.append(meter);
        return wrap;
    }

    function createPanels(original) {
        const table = original.querySelector("table");
        const faqs = Array.from(original.querySelectorAll("details"));
        if (!table || !faqs.length) return null;

        const shell = el("div", "me2-shell");
        shell.append(editorialIntro());

        const tabbar = el("div", "me2-tabbar");
        tabbar.setAttribute("role", "tablist");
        tabbar.setAttribute("aria-label", "Información del producto");
        const panels = el("div", "me2-panels");
        const buttons = [];
        const panelNodes = [];
        const prefix = "me2-enxuta-";

        for (const [key, label] of TABS) {
            const button = el("button", "me2-tab", label);
            const panel = el("section", "me2-panel");
            button.type = "button";
            button.id = prefix + "tab-" + key;
            panel.id = prefix + "panel-" + key;
            button.setAttribute("role", "tab");
            panel.setAttribute("role", "tabpanel");
            button.setAttribute("aria-controls", panel.id);
            panel.setAttribute("aria-labelledby", button.id);
            button.setAttribute("aria-selected", "false");
            button.setAttribute("tabindex", "-1");
            panel.hidden = true;
            buttons.push(button);
            panelNodes.push(panel);
            tabbar.append(button);
            panels.append(panel);
        }

        const [description, specifications, measurements, shipping, faqPanel] = panelNodes;
        const sectionHeading = el("div", "me3-section-heading");
        sectionHeading.append(el("h2", "", "Dos accesorios. Dos maneras."));
        sectionHeading.append(el("span", "", "Fotos editoriales de uso ilustrativo"));
        description.append(sectionHeading);
        const cards = el("div", "me2-inspo-grid");
        cards.append(
            inspirationCard({
                src: IMAGE_PATH + "enxuta_inspiracion_rulos.jpg",
                alt: "Imagen editorial de cabello con ondas y rulos. No representa un resultado garantizado del secador.",
                kicker: "01 / Difusor",
                title: "Cuando querés trabajar tus ondas.",
                copy: "Distribuye el aire sobre una zona más amplia. Una opción para secar ondas y rulos sin concentrar todo el flujo en un punto.",
            }),
            inspirationCard({
                src: IMAGE_PATH + "enxuta_inspiracion_brushing.jpg",
                alt: "Imagen editorial de peinado lacio. No representa un resultado garantizado del secador.",
                kicker: "02 / Concentrador",
                title: "Cuando buscás un brushing más dirigido.",
                copy: "Concentra el aire para acompañar el cepillo y trabajar el peinado por secciones.",
            }),
        );
        description.append(cards);
        description.append(el(
            "p", "me2-editorial-note",
            "Las imágenes de peinados son ilustrativas. El resultado depende del cabello, las herramientas y la técnica.",
        ));

        specifications.append(heading("Datos del fabricante", "Características técnicas",
            "Información verificada del modelo Enxuta BCENXS452300N."));
        const techTable = table.cloneNode(true);
        techTable.removeAttribute("class");
        techTable.className = "me2-tech";
        const responsive = el("div", "me2-tech-scroll");
        responsive.append(techTable);
        specifications.append(responsive);

        measurements.append(heading("Información de producto", "Medidas del secador",
            "Dimensiones indicadas por el proveedor para el modelo BCENXS452300N."));
        const raw = getSpecValue(table, "Dimensiones del producto");
        const measureBox = el("div", "me2-measures");
        const labels = [["Ancho", /ancho\s*([\d.,]+)\s*cm/i],
                        ["Profundidad", /profundidad\s*([\d.,]+)\s*cm/i],
                        ["Alto", /alto\s*([\d.,]+)\s*cm/i]];
        const matches = labels.map(([label, regex]) => [label, raw.match(regex)]);
        if (matches.every(([, match]) => !!match)) {
            for (const [label, match] of matches) dimension(measureBox, label, match[1] + " cm");
            measurements.append(measureBox);
        } else {
            measurements.append(el("p", "me2-plain", raw || "Consultá las medidas con Mulata."));
        }
        measurements.append(el("p", "me2-note", "Estas medidas no sustituyen las instrucciones de uso del fabricante."));

        shipping.append(heading("Entrega y condiciones", "Opciones de envío",
            "Este artículo forma parte del catálogo con entrega coordinada por el proveedor."));
        const shippingGrid = el("div", "me2-shipping-grid");
        for (const [title, content] of [
            ["Montevideo", "El costo del envío se informa antes de confirmar la compra."],
            ["Interior del país", "La entrega se coordina según las condiciones del proveedor."],
            ["Consulta por tu pedido", "Podés comunicarte con Mulata para confirmar disponibilidad y condiciones de entrega."],
        ]) {
            const item = el("div", "me2-shipping-item");
            item.append(el("h3", "", title), el("p", "", content));
            shippingGrid.append(item);
        }
        shipping.append(shippingGrid);

        faqPanel.append(heading("Respondemos tus dudas", "Preguntas frecuentes",
            "Información sobre uso, accesorios y características del producto."));
        for (const item of faqs) {
            const cloned = item.cloneNode(true);
            cloned.className = "me2-faq";
            faqPanel.append(cloned);
        }
        const manual = original.querySelector('a[href$=".pdf"], a[href*=".pdf?"]');
        if (manual) {
            const holder = el("div", "me2-manual");
            const a = el("a", "", "Consultar manual oficial ↗");
            a.href = manual.href;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            holder.append(a);
            faqPanel.append(holder);
        }

        function activate(index, moveFocus) {
            buttons.forEach((button, i) => {
                const active = i === index;
                button.classList.toggle("me2-selected", active);
                button.setAttribute("aria-selected", String(active));
                button.tabIndex = active ? 0 : -1;
                panelNodes[i].hidden = !active;
            });
            if (moveFocus) buttons[index].focus();
        }
        buttons.forEach((button, index) => {
            button.addEventListener("click", () => activate(index, false));
            button.addEventListener("keydown", (event) => {
                let next = null;
                if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
                if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = buttons.length - 1;
                if (next !== null) {
                    event.preventDefault();
                    activate(next, true);
                }
            });
        });
        activate(0, false);
        shell.append(tabbar, panels);
        return shell;
    }

    function boot() {
        const roots = document.querySelectorAll(ROOT_SELECTOR);
        for (const root of roots) {
            if (root.dataset.me2Activated) continue;
            if (!root.textContent.includes(PILOT_SKU)) continue;
            try {
                const shell = createPanels(root);
                if (!shell) continue;
                root.replaceChildren(shell);
                root.classList.add("me2-ready");
                root.dataset.me2Activated = "1";
            } catch (error) {
                // Preserve original server-rendered content when enhancement fails.
                console.warn("Mulata editorial: contenido original conservado", error);
            }
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, {once: true});
    } else {
        boot();
    }
})();
