// src/components/PriceManagement.js
import React, { useState, useEffect } from "react";
import api from "../services/api";

const PriceManagement = () => {
  const [prices, setPrices] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch prices from DB on mount
  const fetchPrices = async () => {
  try {
    const data = await api.getCurrentPrices();
    console.log("📊 Prices API Response:", data);   // 👈 check here
    setPrices(data);
  } catch (err) {
    console.error("❌ Error fetching prices:", err);
  }
};


  useEffect(() => {
    fetchPrices();
  }, []);

  const handleEditClick = (product, price) => {
    setEditingProduct(product);
    setNewPrice(price);
  };

  const handleSaveClick = async () => {
    if (!newPrice || isNaN(newPrice)) return;

    setLoading(true);
    try {
      await api.updatePrice(editingProduct, parseFloat(newPrice));
      await fetchPrices(); // ✅ refresh from DB
    } catch (err) {
      console.error("❌ Error updating price:", err);
    } finally {
      setEditingProduct(null);
      setNewPrice("");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Current Prices</h2>

      {prices.length === 0 ? (
        <p className="text-gray-500">No prices available</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border text-left">Product</th>
              <th className="py-2 px-4 border text-left">Price (KSh)</th>
              <th className="py-2 px-4 border"></th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item) => (
              <tr key={item.product} className="border-t">
                <td className="py-2 px-4">{item.product}</td>
                <td className="py-2 px-4">
                  {editingProduct === item.product ? (
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="border rounded px-2 py-1 w-24"
                    />
                  ) : (
                    `KSh ${item.price}`
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  {editingProduct === item.product ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveClick}
                        disabled={loading}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(item.product, item.price)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PriceManagement;
