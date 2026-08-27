"""Order microservice – Flask REST API."""
import uuid
from datetime import datetime, timezone
from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory store (swap with a real DB in production)
orders: dict[str, dict] = {}


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"}), 200


@app.route("/api/orders", methods=["GET"])
def list_orders():
    return jsonify(list(orders.values())), 200


@app.route("/api/orders/<order_id>", methods=["GET"])
def get_order(order_id: str):
    order = orders.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order), 200


@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json(silent=True) or {}

    user_id = data.get("userId") or data.get("user_id")
    product = data.get("product")
    quantity = data.get("quantity", 1)

    errors = []
    if not user_id:
        errors.append("userId is required")
    if not product:
        errors.append("product is required")
    if not isinstance(quantity, int) or quantity < 1:
        errors.append("quantity must be a positive integer")
    if errors:
        return jsonify({"errors": errors}), 400

    order_id = uuid.uuid4().hex[:8]
    order = {
        "id": order_id,
        "user_id": user_id,
        "product": product,
        "quantity": quantity,
        "status": "PENDING",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    orders[order_id] = order
    return jsonify(order), 201


@app.route("/api/orders/<order_id>", methods=["DELETE"])
def delete_order(order_id: str):
    if orders.pop(order_id, None) is None:
        return jsonify({"error": "Order not found"}), 404
    return "", 204


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
