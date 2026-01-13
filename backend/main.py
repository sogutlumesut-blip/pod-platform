from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import User, Order, ShipOrderRequest

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
