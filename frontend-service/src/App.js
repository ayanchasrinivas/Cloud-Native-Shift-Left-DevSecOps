import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || '';

function App() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [newOrder, setNewOrder] = useState({ userId: '', product: '', quantity: 1 });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users`);
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      setError('Failed to fetch orders');
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/users`, newUser);
      setNewUser({ name: '', email: '' });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const createOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/orders`, newOrder);
      setNewOrder({ userId: '', product: '', quantity: 1 });
      fetchOrders();
    } catch (err) {
      setError('Failed to create order');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>DevSecOps Microservices Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h2>Users (Java Service)</h2>
        <form onSubmit={createUser} style={{ marginBottom: 16 }}>
          <input placeholder="Name" value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
          <input placeholder="Email" value={newUser.email} type="email"
            onChange={e => setNewUser({ ...newUser, email: e.target.value })} required style={{ marginLeft: 8 }} />
          <button type="submit" style={{ marginLeft: 8 }}>Add User</button>
        </form>
        <table border="1" cellPadding="8">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
          <tbody>
            {users.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td></tr>)}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Orders (Python Service)</h2>
        <form onSubmit={createOrder} style={{ marginBottom: 16 }}>
          <input placeholder="User ID" value={newOrder.userId}
            onChange={e => setNewOrder({ ...newOrder, userId: e.target.value })} required />
          <input placeholder="Product" value={newOrder.product}
            onChange={e => setNewOrder({ ...newOrder, product: e.target.value })} required style={{ marginLeft: 8 }} />
          <input placeholder="Qty" type="number" value={newOrder.quantity} min="1"
            onChange={e => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })} style={{ marginLeft: 8, width: 60 }} />
          <button type="submit" style={{ marginLeft: 8 }}>Place Order</button>
        </form>
        <table border="1" cellPadding="8">
          <thead><tr><th>ID</th><th>User ID</th><th>Product</th><th>Qty</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map(o => <tr key={o.id}><td>{o.id}</td><td>{o.userId || o.user_id}</td><td>{o.product}</td><td>{o.quantity}</td><td>{o.status}</td></tr>)}
          </tbody>
        </table>
      </section>

      <footer style={{ marginTop: 40, color: '#888', fontSize: 12 }}>
        DevSecOps Pipeline Demo &mdash; Secured by Jenkins CI/CD
      </footer>
    </div>
  );
}

export default App;
