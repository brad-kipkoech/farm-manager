import React from "react";

const ProductionTable = ({ data = [] }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Product</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Unit</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Notes</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Income (KSh)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                No production records found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{item.product}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.unit}</td>
                <td className="px-4 py-2">{item.notes || "-"}</td>
                <td className="px-4 py-2 font-semibold">
                  {item.income ? `KSh ${Number(item.income).toLocaleString()}` : "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionTable;
