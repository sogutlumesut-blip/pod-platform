import os
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from PIL import Image
from models import Order

class ProductionGenerator:
    def __init__(self, output_dir="production_files"):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    def generate_pdf(self, order: Order, item_index: int = 0) -> str:
        """
        Generates a print-ready PDF for a specific line item in the order.
        Assumes line_items_json is parsed and contains 'dimensions' (e.g., '100x100 cm') and 'image_path'.
        """
        # Parse item data (simplified)
        import json
        items = json.loads(order.line_items_json)
        if item_index >= len(items):
             raise ValueError("Item index out of range")
        
        item = items[item_index]
        sku = item.get('sku', 'UNKNOWN')
        # Simulate getting dimensions from variant string if not explicit
        # In real app, we parse "100x100 cm" -> width=100, height=100
        # For prototype, let's hardcode or try to parse simple string
        
        width_cm = 100.0
        height_cm = 100.0
        
        if 'variant' in item:
            try:
                # Naive parse: "100x100 cm"
                parts = item['variant'].lower().replace('cm', '').split('x')
                if len(parts) == 2:
                    width_cm = float(parts[0].strip())
                    height_cm = float(parts[1].strip())
            except:
                pass # Fallback to default
        
        # Bleed configuration
        bleed_cm = 2.0
        final_width_cm = width_cm + (2 * bleed_cm)
        final_height_cm = height_cm + (2 * bleed_cm)
        
        filename = f"{order.external_id or order.id}_{sku}_{item_index}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        # Create PDF
        c = canvas.Canvas(filepath, pagesize=(final_width_cm * cm, final_height_cm * cm))
        
        # Add cut line info
        c.setStrokeColorRGB(1, 0, 0) # Red cut line
        c.setLineWidth(1)
        c.rect(bleed_cm * cm, bleed_cm * cm, width_cm * cm, height_cm * cm)
        
        # Add text info
        c.setFont("Helvetica", 12)
        c.drawString(2 * cm, final_height_cm * cm - 2 * cm, f"Order: {order.external_id or order.id}")
        c.drawString(2 * cm, final_height_cm * cm - 2.5 * cm, f"SKU: {sku}")
        c.drawString(2 * cm, final_height_cm * cm - 3 * cm, f"Size: {width_cm}x{height_cm} cm (+{bleed_cm}cm bleed)")
        
        # In real implementation: Draw Image
        # if 'image_path' in item: c.drawImage(...)
        
        c.save()
        return filepath
