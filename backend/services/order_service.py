from sqlmodel import Session, select
from models import Order, Store
import json
from datetime import datetime

class OrderService:
    def __init__(self, session: Session):
        self.session = session

    def create_order(self, order_data: dict) -> Order:
        """
        Generic method to create an order from any source.
        """
        order = Order(**order_data)
        self.session.add(order)
        self.session.commit()
        self.session.refresh(order)
        return order

    def import_external_order(self, store: Store, external_data: dict) -> Order:
        """
        Converts external platform data (via our standardized format) into an Order.
        """
        # check for existing
        existing = self.session.exec(
            select(Order).where(Order.external_id == external_data['external_id'])
        ).first()
        
        if existing:
            return existing

        order = Order(
            user_id=store.user_id,
            store_id=store.id,
            source=store.platform,
            external_id=external_data['external_id'],
            amount=0, # Calculated later or imported
            status="draft", # Needs configuration usually
            line_items_json=external_data['line_items_json'],
            recipient_name=external_data['recipient_name'],
            recipient_email=external_data['recipient_email'],
            street=external_data['street'],
            city=external_data['city'],
            state=external_data.get('state'),
            zip_code=external_data['zip_code'],
            country=external_data['country']
        )
        self.session.add(order)
        self.session.commit()
        self.session.refresh(order)
        return order
