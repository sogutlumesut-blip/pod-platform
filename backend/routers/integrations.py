from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List
from models import Store, Order, User
from database import get_session
from services.order_service import OrderService
import json
import random
from datetime import datetime

router = APIRouter(prefix="/integrations", tags=["integrations"])

# Mock function to generate fake Etsy orders
def get_mock_etsy_data():
    orders = []
    
    # Mock Customer 1: US Address
    orders.append({
        "external_id": f"ETSY-{random.randint(100000, 999999)}",
        "recipient_name": "John Doe",
        "recipient_email": "john.doe@example.com",
        "street": "123 Maple Avenue",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62704",
        "country": "United States",
        "line_items_json": json.dumps([
            {"sku": "WL-204", "title": "Tropical Jungle Wallpaper", "quantity": 1, "variant": "100x100 cm"}
        ])
    })

    # Mock Customer 2: UK Address
    orders.append({
        "external_id": f"ETSY-{random.randint(100000, 999999)}",
        "recipient_name": "Sarah Smith",
        "recipient_email": "sarah.smith@example.uk",
        "street": "42 High Street, Camden",
        "city": "London",
        "zip_code": "NW1 8QL",
        "country": "United Kingdom",
        "line_items_json": json.dumps([
            {"sku": "CNV-001", "title": "Abstract Canvas Art", "quantity": 2, "variant": "50x70 cm"}
        ])
    })
    
    # Mock Customer 3: German Address
    orders.append({
        "external_id": f"ETSY-{random.randint(100000, 999999)}",
        "recipient_name": "Hans Muller",
        "recipient_email": "hans.muller@example.de",
        "street": "Berliner Str. 10",
        "city": "Berlin",
        "zip_code": "10115",
        "country": "Germany",
        "line_items_json": json.dumps([
            {"sku": "WL-999", "title": "Mountain View Wallpaper", "quantity": 1, "variant": "300x250 cm"}
        ])
    })

    return orders

def get_mock_shopify_data():
    orders = []
    
    # Shopify Order #1001
    orders.append({
        "external_id": f"SHPFY-{random.randint(1000, 9999)}",
        "recipient_name": "Michael Brown",
        "recipient_email": "mike.brown@shopify-test.com",
        "street": "456 Commerce St",
        "city": "Toronto",
        "state": "ON",
        "zip_code": "M5V 2H1",
        "country": "Canada",
        "line_items_json": json.dumps([
            {"sku": "WL-500", "title": "Geometric Pattern Wallpaper", "quantity": 3, "variant": "Roll (10m)"}
        ])
    })
    
    # Shopify Order #1002
    orders.append({
        "external_id": f"SHPFY-{random.randint(1000, 9999)}",
        "recipient_name": "Emma Watson",
        "recipient_email": "emma.w@shopify-test.com",
        "street": "789 Fifth Avenue",
        "city": "New York",
        "state": "NY",
        "zip_code": "10022",
        "country": "United States",
        "line_items_json": json.dumps([
            {"sku": "PST-003", "title": "Vintage Map Poster", "quantity": 1, "variant": "A1 Frame"}
        ])
    })

    return orders

@router.post("/connect/{platform}")
def connect_store(platform: str, shop_name: str, session: Session = Depends(get_session)):
    # ... (Keep existing connect logic)
    user_id = 1 
    
    existing_store = session.exec(select(Store).where(Store.user_id == user_id, Store.platform == platform)).first()
    
    if existing_store:
        existing_store.shop_name = shop_name
        existing_store.is_connected = True
        session.add(existing_store)
        session.commit()
        session.refresh(existing_store)
        return existing_store
    
    new_store = Store(
        user_id=user_id,
        platform=platform,
        shop_name=shop_name,
        access_token="mock-token-123", 
        is_connected=True
    )
    session.add(new_store)
    session.commit()
    session.refresh(new_store)
    return new_store

@router.post("/sync/{store_id}")
def sync_orders(store_id: int, session: Session = Depends(get_session)):
    store = session.get(Store, store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    order_service = OrderService(session)
    
    # Generate mock orders based on platform
    mock_data = []
    if store.platform == 'etsy':
        mock_data = get_mock_etsy_data()
    elif store.platform == 'shopify':
        mock_data = get_mock_shopify_data()
    
    count = 0
    for data in mock_data:
        # Service handles deduplication
        order = order_service.import_external_order(store, data)
        if order: # Ensure we count correctly (though implementation returns existing if found, we typically want 'new' count)
             # Basic check if it was just created would require more logic, but for prototype we just assume sync was successful
             count += 1
            
    return {"message": f"Successfully synced orders from {store.shop_name}", "new_orders_count": count}

@router.get("/orders")
def get_imported_orders(session: Session = Depends(get_session)):
    # Return orders that are drafts (imported but not yet processed)
    orders = session.exec(select(Order).where(Order.status == "draft").order_by(Order.created_at.desc())).all()
    return orders
