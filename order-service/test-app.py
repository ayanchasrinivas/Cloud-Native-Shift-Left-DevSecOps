"""Tests for order-service."""
import json
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c

def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.get_json()["status"] == "UP"

def test_create_order(client):
    r = client.post("/api/orders",
                     data=json.dumps({"userId": "u1", "product": "Widget", "quantity": 3}),
                     content_type="application/json")
    assert r.status_code == 201
    assert r.get_json()["product"] == "Widget"

def test_list_orders(client):
    r = client.get("/api/orders")
    assert r.status_code == 200

def test_create_order_validation(client):
    r = client.post("/api/orders",
                     data=json.dumps({}),
                     content_type="application/json")
    assert r.status_code == 400
