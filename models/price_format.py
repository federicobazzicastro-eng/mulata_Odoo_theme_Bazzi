from odoo import models
from odoo.tools.misc import formatLang


class WebsiteMulataPrice(models.AbstractModel):
    _name = "mulata.price.format"
    _description = "Formato comercial de precios Mulata"

    def format_price(self, amount):
        amount = float(amount or 0.0)

        decimals = 0 if abs(amount - round(amount)) < 0.000001 else 2

        formatted = formatLang(
            self.env.with_context(lang="es_UY"),
            amount,
            digits=2,
            grouping=True,
        )

        if decimals == 0:
            formatted = formatted.rsplit(",", 1)[0]

        return "$ " + formatted
