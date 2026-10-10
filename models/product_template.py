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
