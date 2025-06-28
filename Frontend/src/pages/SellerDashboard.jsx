import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const [kpis, setKpis] = useState({
    totalAmountSold: 0,
    totalWeightSold: 0,
    totalEmissionsPrevented: 0,
    totalTransactions: 0,
  });

  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: '', weight: '', price: '' });

  useEffect(() => {
    // Fetch KPI and transaction data for seller
    // Replace with your actual API endpoints
    fetch('/api/seller/kpis').then(res => res.json()).then(setKpis);
    fetch('/api/seller/transactions').then(res => res.json()).then(setTransactions);
  }, []);

  const handleAddItem = async () => {
    await fetch('/api/seller/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    setShowModal(false);
    setNewItem({ name: '', type: '', weight: '', price: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">AgriLoop</h1>
        <button onClick={() => navigate('/profile')} className="text-sm text-white bg-green-600 px-4 py-2 rounded-lg">Profile</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Amount Sold" value={`₹${kpis.totalAmountSold}`} />
        <KpiCard title="Total Weight Sold" value={`${kpis.totalWeightSold} kg`} />
        <KpiCard title="Emissions Prevented" value={`${kpis.totalEmissionsPrevented} kg CO₂`} />
        <KpiCard title="Transactions" value={kpis.totalTransactions} />
      </div>

      <button onClick={() => setShowModal(true)} className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
        + Add Item for Sale
      </button>

      <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Item</th>
              <th className="text-left p-4">Weight</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Buyer</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-4">{txn.item_name}</td>
                <td className="p-4">{txn.weight} kg</td>
                <td className="p-4">₹{txn.amount}</td>
                <td className="p-4">{txn.buyer_email}</td>
                <td className="p-4">{txn.status}</td>
                <td className="p-4">{new Date(txn.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
            <input
              className="w-full mb-3 border p-2 rounded"
              placeholder="Item Name"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              className="w-full mb-3 border p-2 rounded"
              placeholder="Waste Type"
              value={newItem.type}
              onChange={e => setNewItem({ ...newItem, type: e.target.value })}
            />
            <input
              className="w-full mb-3 border p-2 rounded"
              placeholder="Weight (kg)"
              type="number"
              value={newItem.weight}
              onChange={e => setNewItem({ ...newItem, weight: e.target.value })}
            />
            <input
              className="w-full mb-3 border p-2 rounded"
              placeholder="Price (₹)"
              type="number"
              value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: e.target.value })}
            />
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleAddItem}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KpiCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-xl font-bold text-green-700">{value}</p>
  </div>
);

export default SellerDashboard;
