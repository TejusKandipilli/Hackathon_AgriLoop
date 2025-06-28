import React, { useState, useEffect } from 'react';

const BuyerDashboard = () => {
  const [kpis, setKpis] = useState({
    totalAmountBought: 0,
    totalWeightBought: 0,
    totalEmissionsPrevented: 0,
    totalTransactions: 0,
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/buyer/kpis').then(res => res.json()).then(setKpis);
    fetch('/api/buyer/transactions').then(res => res.json()).then(setTransactions);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">AgriLoop</h1>
        <button className="text-sm text-white bg-green-600 px-4 py-2 rounded-lg">Profile</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Amount Bought" value={`₹${kpis.totalAmountBought}`} />
        <KpiCard title="Total Weight Bought" value={`${kpis.totalWeightBought} kg`} />
        <KpiCard title="Emissions Prevented" value={`${kpis.totalEmissionsPrevented} kg CO₂`} />
        <KpiCard title="Transactions" value={kpis.totalTransactions} />
      </div>

      <h2 className="text-xl font-semibold mb-2">Transactions</h2>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Item</th>
              <th className="text-left p-4">Weight</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Seller</th>
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
                <td className="p-4">{txn.seller_email}</td>
                <td className="p-4">{txn.status}</td>
                <td className="p-4">{new Date(txn.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-xl font-bold text-green-700">{value}</p>
  </div>
);

export default BuyerDashboard;
