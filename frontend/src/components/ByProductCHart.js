import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Transform backend [{month, product, total}] → [{month: "2025-07", milk: 1000, tea: 500}]
const transformData = (rawData) => {
  const grouped = {};
  rawData.forEach(({ month, product, total }) => {
    if (!grouped[month]) grouped[month] = { month };
    grouped[month][product] = Number(total);
  });
  return Object.values(grouped);
};

const ByProductChart = ({ data }) => {
  const formatted = transformData(data);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Monthly Income by Product</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(v) => `KSh ${v.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="milk" stackId="a" fill="#3B82F6" />
          <Bar dataKey="tea" stackId="a" fill="#10B981" />
          <Bar dataKey="honey" stackId="a" fill="#F59E0B" />
          <Bar dataKey="macadamia" stackId="a" fill="#8B5CF6" />
          <Bar dataKey="apples" stackId="a" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ByProductChart;
