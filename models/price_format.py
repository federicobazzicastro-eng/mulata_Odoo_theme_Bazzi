from decimal import Decimal, ROUND_HALF_UP

from odoo import models


class WebsiteMulataPrice(models.AbstractModel):
    _name = "mulata.price.format"
    _description = "Formato comercial de precios Mulata"

    def format_price(self, amount, currency="UYU"):
        value = Decimal(str(amount or 0))

        rounded = int(value.quantize(
            Decimal("1"),
            rounding=ROUND_HALF_UP,
        ))

        number = f"{rounded:,}".replace(",", ".")

        if currency == "USD":
            return f"US$ {number}"

        return f"$ {number}"
