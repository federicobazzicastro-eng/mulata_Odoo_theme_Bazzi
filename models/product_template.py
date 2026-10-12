from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    is_home_featured = fields.Boolean(
        string="Destacado Home",
        default=False,
        help="Mostrar este producto en la sección Productos destacados de la home de Mulata.",
    )

    home_featured_sequence = fields.Integer(
        string="Orden Home",
        default=10,
        help="Orden de aparición en Productos destacados. Menor número aparece primero.",
    )


    mulata_display_currency = fields.Selection(
        [
            ("UYU", "Pesos uruguayos"),
            ("USD", "Dólares estadounidenses"),
        ],
        string="Moneda visual web",
        default="UYU",
        required=True,
        help="Moneda utilizada para presentar el precio comercial.",
    )

    gelbring_pvp_usd = fields.Float(
        string="PVP Gelbring USD",
        digits=(16, 2),
        help="Precio de venta sugerido original de Gelbring en dólares.",
    )

    mulata_exchange_rate = fields.Float(
        string="Tipo de cambio comercial",
        digits=(16, 4),
        default=42.0,
        help="Pesos uruguayos por dólar.",
    )

    def mulata_get_display_price(self, price_uyu):
        self.ensure_one()

        if self.mulata_display_currency == "USD":
            rate = self.mulata_exchange_rate or 42.0
            return {
                "amount": float(price_uyu or 0.0) / rate,
                "currency": "USD",
            }

        return {
            "amount": float(price_uyu or 0.0),
            "currency": "UYU",
        }
