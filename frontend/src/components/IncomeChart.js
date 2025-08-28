import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const IncomeChart = ({ data = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Monthly Income Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" 
            tickFormatter={(value) => {
              const date = new Date(value + "-01");
              return date.toLocaleString("en-US", { month: "short" });
            }}
          />
          <YAxis />
          <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, ""]} />
          <Legend />
          <Line type="monotone" dataKey="milk" stroke="#3B82F6" strokeWidth={2} name="Milk" />
          <Line type="monotone" dataKey="tea" stroke="#10B981" strokeWidth={2} name="Tea" />
          <Line type="monotone" dataKey="honey" stroke="#F59E0B" strokeWidth={2} name="Honey" />
          <Line type="monotone" dataKey="macadamia" stroke="#8B5CF6" strokeWidth={2} name="Macadamia" />
          <Line type="monotone" dataKey="apples" stroke="#EF4444" strokeWidth={2} name="Apples" />
          <Line type="monotone" dataKey="total" stroke="#1F2937" strokeWidth={3} name="Total" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
