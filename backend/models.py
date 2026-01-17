from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: str
    password_hash: str
    is_active: bool = Field(default=False)
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Custom Pricing
    discount_percentage: float = Field(default=0.0)
    custom_pricing_json: Optional[str] = Field(default=None) # JSON string: {"material_id": unit_price_float}
    allow_on_account_payment: bool = Field(default=False)

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(foreign_key="user.id", default=None) # Optional for external orders
    
    # Source & Identity
    source: str = Field(default="manual") # manual, etsy, shopify
    external_id: Optional[str] = Field(default=None, index=True) # e.g., ETSY-12345
    store_id: Optional[int] = Field(foreign_key="store.id", default=None)
    
    # Financials
    amount: float
    currency: str = Field(default="USD")
    payment_status: str = Field(default="pending") # pending, paid
    
    # Fulfillment
    status: str = Field(default="draft")  # draft, ready_for_print, in_production, shipped, cancelled
    tracking_number: Optional[str] = None
    
    # Product Details (JSON for flexibility in prototype)
    # Storing as list of dicts: [{sku, title, quantity, variant, image_url, dimensions}]
    line_items_json: str 
    
    # Production Assets
    production_file_url: Optional[str] = None # Path to generated PDF
    
    # Shipping Address (Normalized)
    recipient_name: str
    recipient_email: Optional[str] = None
    street: str
    city: str
    state: Optional[str] = None
    zip_code: str
    country: str
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ShipOrderRequest(SQLModel):
    tracking_number: str

class SiteConfig(SQLModel, table=True):
    key: str = Field(primary_key=True)
    value: str
    group: str = Field(default="general") # e.g., "home.hero", "home.features"
    type: str = Field(default="text") # "text", "image", "json"
    label: str # User-friendly label for the admin UI

class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    amount: float
    currency: str = Field(default="USD")
    method: str = Field(default="credit_card") # credit_card, paypal
    status: str = Field(default="pending") # pending, completed, failed
    transaction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Store(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    platform: str = Field(default="etsy") # etsy, shopify, woo
    shop_name: str
    access_token: str # In a real app, this should be encrypted
    is_connected: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

