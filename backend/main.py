from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import User, Order, ShipOrderRequest, Payment, SiteConfig

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="POD Platform API", version="0.1.0", lifespan=lifespan)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/payments/process", response_model=Payment)
def process_payment(payment_data: Payment, session: Session = Depends(get_session)):
    # 1. Verify Order exists
    order = session.get(Order, payment_data.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Simulate Payment Gateway (Stripe/PayPal)
    # In real world, we would call external API here.
    import uuid
    payment_data.transaction_id = f"txn_{uuid.uuid4().hex[:12]}"
    payment_data.status = "completed"
    
    # 3. Save Payment
    session.add(payment_data)
    
    # 4. Update Order Status
    order.payment_status = "paid"
    # If order was draft/pending, move to ready_for_print or whichever flow
    if order.status == "draft" or order.status == "pending":
         order.status = "ready_for_print"
    
    session.add(order)
    session.commit()
    session.refresh(payment_data)
    
    return payment_data

@app.get("/")
def read_root():
    return {"status": "ok", "message": "POD Platform API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Admin API Endpoints

@app.get("/admin/users", response_model=List[User])
def get_users(session: Session = Depends(get_session), offset: int = 0, limit: int = 100):
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users

@app.post("/admin/users/{user_id}/activate", response_model=User)
def activate_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/admin/users/{user_id}/deactivate", response_model=User)
def deactivate_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    session.add(user)
    session.commit()
    session.refresh(user)
    session.refresh(user)
    return user

class UserPricingUpdate(SQLModel):
    discount_percentage: Optional[float] = None
    custom_pricing_json: Optional[str] = None
    allow_on_account_payment: Optional[bool] = None

@app.put("/admin/users/{user_id}/pricing", response_model=User)
def update_user_pricing(user_id: int, pricing_data: UserPricingUpdate, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if pricing_data.discount_percentage is not None:
        user.discount_percentage = pricing_data.discount_percentage
    
    if pricing_data.custom_pricing_json is not None:
        user.custom_pricing_json = pricing_data.custom_pricing_json
        
    if pricing_data.allow_on_account_payment is not None:
        user.allow_on_account_payment = pricing_data.allow_on_account_payment
        
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/admin/orders", response_model=List[Order])
def get_orders(session: Session = Depends(get_session), offset: int = 0, limit: int = 100):
    orders = session.exec(select(Order).offset(offset).limit(limit)).all()
    return orders

@app.post("/admin/orders/{order_id}/verify", response_model=Order)
def verify_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "paid"
    session.add(order)
    session.commit()
    session.refresh(order)
    return order
    return order

@app.post("/admin/orders/{order_id}/ship", response_model=Order)
def ship_order(order_id: int, ship_req: ShipOrderRequest, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = "shipped"
    order.tracking_number = ship_req.tracking_number
    session.add(order)
    session.commit()
    session.refresh(order)
    print(f"Sending email to user {order.user_id} with tracking number {order.tracking_number}")
    return order

from models import SiteConfig

@app.get("/admin/site-config", response_model=List[SiteConfig])
def get_site_config(session: Session = Depends(get_session)):
    configs = session.exec(select(SiteConfig)).all()
    # Initialize defaults if empty (for prototype)
    if not configs:
        defaults = [
            SiteConfig(key="home.hero.title", value="Transform Your Art into Global Brands", group="home.hero", label="Hero Headline"),
            SiteConfig(key="home.hero.subtitle", value="Your trusted partner in wall art – delivering leading quality and seamless print on demand solutions for your business.", group="home.hero", label="Hero Subtitle"),
            SiteConfig(key="home.cta.primary", value="Get started", group="home.hero", label="Primary Button Text"),
            SiteConfig(key="home.cta.secondary", value="See products", group="home.hero", label="Secondary Button Text"),
        ]
        for config in defaults:
            session.add(config)
        session.commit()
        configs = defaults
    return configs

    session.commit()
    return {"status": "updated"}

from services.production_generator import ProductionGenerator
from fastapi.responses import FileResponse
import os

@app.post("/admin/orders/{order_id}/production-file")
def generate_production_file(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    generator = ProductionGenerator()
    try:
        # Generate PDF for the first item (prototype assumption)
        filepath = generator.generate_pdf(order, item_index=0)
        
        # Update order with file path
        order.production_file_url = filepath
        order.status = "in_production" # Automatically move to production
        session.add(order)
        session.commit()
        session.refresh(order)
        
        return FileResponse(filepath, media_type='application/pdf', filename=os.path.basename(filepath))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Payment Integration Endpoints ---

class PaymentConfig(SQLModel):
    stripe_public_key: str = ""
    stripe_enabled: bool = False
    paypal_client_id: str = ""
    paypal_enabled: bool = False

@app.get("/api/config/payment", response_model=PaymentConfig)
def get_payment_config(session: Session = Depends(get_session)):
    """Public endpoint to get enabled payment methods and public keys"""
    configs = session.exec(select(SiteConfig).where(SiteConfig.group == "payment")).all()
    config_dict = {c.key: c.value for c in configs}
    
    return PaymentConfig(
        stripe_public_key=config_dict.get("payment.stripe.public_key", ""),
        stripe_enabled=config_dict.get("payment.stripe.enabled", "false").lower() == "true",
        paypal_client_id=config_dict.get("payment.paypal.client_id", ""),
        paypal_enabled=config_dict.get("payment.paypal.enabled", "false").lower() == "true"
    )

class AdminPaymentConfig(SQLModel):
    stripe_public_key: str
    stripe_secret_key: str
    stripe_enabled: bool
    paypal_client_id: str
    paypal_secret_key: str
    paypal_enabled: bool

@app.post("/admin/config/payment")
def save_payment_config(config: AdminPaymentConfig, session: Session = Depends(get_session)):
    """Admin endpoint to save payment secrets"""
    
    settings = [
        ("payment.stripe.public_key", config.stripe_public_key, "text", "Stripe Public Key"),
        ("payment.stripe.secret_key", config.stripe_secret_key, "text", "Stripe Secret Key"),
        ("payment.stripe.enabled", str(config.stripe_enabled).lower(), "boolean", "Enable Stripe"),
        ("payment.paypal.client_id", config.paypal_client_id, "text", "PayPal Client ID"),
        ("payment.paypal.secret_key", config.paypal_secret_key, "text", "PayPal Secret Key"),
        ("payment.paypal.enabled", str(config.paypal_enabled).lower(), "boolean", "Enable PayPal"),
    ]

    for key, value, type_, label in settings:
        item = session.get(SiteConfig, key)
        if not item:
            item = SiteConfig(key=key, value=value, group="payment", type=type_, label=label)
        else:
            item.value = value
        session.add(item)
    
    session.commit()
    return {"status": "saved"}

class PaymentIntentRequest(SQLModel):
    amount: float
    currency: str = "USD"

@app.post("/api/payments/create-intent")
def create_payment_intent(req: PaymentIntentRequest, session: Session = Depends(get_session)):
    """Create Stripe PaymentIntent"""
    # 1. Get Secret Key
    secret_key_config = session.get(SiteConfig, "payment.stripe.secret_key")
    if not secret_key_config or not secret_key_config.value:
        raise HTTPException(status_code=400, detail="Stripe not configured")

    # 2. Call Stripe API (Mock for now, but structure is ready)
    # import stripe
    # stripe.api_key = secret_key_config.value
    # intent = stripe.PaymentIntent.create(...)
    
    # MOCK RESPONSE
    import uuid
    return {"clientSecret": f"pi_mock_{uuid.uuid4().hex}_secret_{uuid.uuid4().hex}"}

@app.post("/api/payments/paypal-order")
def create_paypal_order(req: PaymentIntentRequest, session: Session = Depends(get_session)):
    """Create PayPal Order"""
    # 1. Get Secret Key (In real flow, we use this to get access token)
    client_id = session.get(SiteConfig, "payment.paypal.client_id")
    if not client_id or not client_id.value:
        raise HTTPException(status_code=400, detail="PayPal not configured")
        
    # MOCK RESPONSE
    import uuid
    return {"orderID": f"PAYPAL_MOCK_{uuid.uuid4().hex[:12].upper()}"}
