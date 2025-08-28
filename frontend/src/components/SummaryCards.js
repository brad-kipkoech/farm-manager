import React from "react";
import { DollarSign, TrendingUp, FileText, Calendar, Award } from "lucide-react";

const SummaryCards = ({
  prices = [],
  monthlyIncome = [],
  todayIncome = 0,          // ✅ backend today's income
  todayProductsCount = 0,   // ✅ backend today's products count
}) => {
  // 🔹 Current month
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const monthData = monthlyIncome.find((m) => m.month === currentMonth);
  const monthTotal = monthData?.total || 0;

  // 🔹 Find top product contributor this month
  let topProduct = null;
  if (monthData) {
    const { milk, tea, honey, macadamia, apples } = monthData;
    const products = { milk, tea, honey, macadamia, apples };

    const [best, amount] = Object.entries(products).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["none", 0]
    );

    if (amount > 0) {
      topProduct = { name: best, amount };
    }
  }

  const cards = [
    {
      title: `Income (${new Date(currentMonth + "-01").toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      })})`,
      value: `KSh ${monthTotal.toLocaleString()}`,
      icon: Calendar,
      color: "text-indigo-600",
    },
    {
      title: "Today's Income",
      value: `KSh ${todayIncome.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Products",
      value: prices.length,
      icon: FileText,
      color: "text-purple-600",
    },
  ];

  if (topProduct) {
    cards.push({
      title: "Top Contributor (This Month)",
      value: `${topProduct.name} (KSh ${topProduct.amount.toLocaleString()})`,
      icon: Award,
      color: "text-yellow-600",
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <card.icon className={`h-8 w-8 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
