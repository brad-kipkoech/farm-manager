import React from "react";

const ByProductTable = ({ data }) => {
  const grouped = {};
  data.forEach(({ month, product, total }) => {
    if (!grouped[month]) grouped[month] = { month };
    grouped[month][product] = Number(total);
  });

  const rows = Object.values(grouped);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Monthly Income Table</h3>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Milk</th>
            <th className="p-2 border">Tea</th>
            <th className="p-2 border">Honey</th>
            <th className="p-2 border">Macadamia</th>
            <th className="p-2 border">Apples</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border">{row.month}</td>
              <td className="p-2 border">{row.milk?.toLocaleString() || 0}</td>
              <td className="p-2 border">{row.tea?.toLocaleString() || 0}</td>
              <td className="p-2 border">{row.honey?.toLocaleString() || 0}</td>
              <td className="p-2 border">{row.macadamia?.toLocaleString() || 0}</td>
              <td className="p-2 border">{row.apples?.toLocaleString() || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ByProductTable;
