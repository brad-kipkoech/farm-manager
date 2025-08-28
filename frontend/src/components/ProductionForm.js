// src/components/ProductionForm.js
import React, { useState } from "react";
import { Plus } from "lucide-react";

const ProductionForm = ({ onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const products = [
    { name: "Milk", unit: "liters" },
    { name: "Tea", unit: "kg" },
    { name: "Honey", unit: "kg" },
    { name: "Macadamia", unit: "kg" },
    { name: "Apples", unit: "kg" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.quantity) return;

    // get unit from product list
    const selected = products.find((p) => p.name === formData.product);
    const unit = selected ? selected.unit : "";

    // attach unit + user_id
    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      unit,
      user_id: user?.id, // ✅ make sure this exists
    };

    console.log("📤 Submitting production record:", payload);

    try {
      setSubmitting(true);
      await onSubmit(payload); // wait for API success

      // reset only if success
      setFormData({
        product: "",
        quantity: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    } catch (err) {
      console.error("❌ Failed to submit production:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Record Daily Production</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product
          </label>
          <select
            value={formData.product}
            onChange={(e) =>
              setFormData({ ...formData, product: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select product...</option>
            {products.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="Any notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            {submitting ? "Adding..." : "Add Record"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductionForm;
