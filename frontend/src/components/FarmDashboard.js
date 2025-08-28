// src/components/FarmDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Plus,
  DollarSign,
  TrendingUp,
  LogOut,
  X,
  BarChart3,
} from "lucide-react";

import api from "../services/api";
import ProductionForm from "./ProductionForm";
import ProductionTable from "./ProductionTable";
import IncomeChart from "./IncomeChart";
import SummaryCards from "./SummaryCards";
import PriceManagement from "./PriceManagement";

const FarmDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const [productionData, setProductionData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [prices, setPrices] = useState([]);
  const [incomeByProduct, setIncomeByProduct] = useState([]);

  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [todayIncome, setTodayIncome] = useState(0);

  const [showProductionForm, setShowProductionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);


  // ---------- Greeting ----------
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // ---------- Fetch Dashboard Data ----------
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [
        productionRes,
        incomeRes,
        pricesRes,
        monthIncomeRes,
        byProductRes,
        todayIncomeRes,
      ] = await Promise.allSettled([
        api.getProduction(),
        api.getMonthlyIncome(),
        api.getCurrentPrices(),
        api.getCurrentMonthIncome(),
        api.getIncomeByProductMonthly(),
        api.getTodayIncome(),
      ]);

      setProductionData(productionRes.value || []);
      setIncomeData(incomeRes.value || []);
      setPrices(pricesRes.value || []);
      setIncomeByProduct(byProductRes.value || []);
      setCurrentMonthIncome(monthIncomeRes.value?.total || 0);
      setTodayIncome(todayIncomeRes.value?.total || 0);
    } catch (error) {
      console.error("Unexpected error in loadData:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  // ---------- Handlers ----------
  const handleAddProduction = async (data) => {
    try {
      const newRecord = await api.addProduction(data);
      setProductionData((prev) => [newRecord, ...prev]);
      setShowProductionForm(false);

      const [currentIncome, todayIncomeRes] = await Promise.all([
        api.getCurrentMonthIncome(),
        api.getTodayIncome(),
      ]);
      setCurrentMonthIncome(currentIncome.total || 0);
      setTodayIncome(todayIncomeRes.total || 0);
    } catch (error) {
      console.error("❌ Error adding production:", error);
    }
  };

  const handleUpdatePrice = async (product, newPrice) => {
    try {
      await api.updatePrice(product, newPrice);
      const [refreshed, currentIncome, todayIncomeRes] = await Promise.all([
        api.getCurrentPrices(),
        api.getCurrentMonthIncome(),
        api.getTodayIncome(),
      ]);
      setPrices(refreshed);
      setCurrentMonthIncome(currentIncome.total || 0);
      setTodayIncome(todayIncomeRes.total || 0);
    } catch (error) {
      console.error("❌ Error updating price:", error);
    }
  };

  // ---------- Derived ----------
  const today = new Date().toLocaleDateString("en-CA");
  const todayProduction = productionData.filter((item) => {
    const recordDate = new Date(item.date).toLocaleDateString("en-CA");
    return recordDate === today;
  });

  // ---------- Tabs ----------
  const TABS = [
    { id: "overview", name: "Overview", icon: TrendingUp, roles: ["manager", "owner"] },
    { id: "production", name: "Production", icon: Calendar, roles: ["manager", "owner"] },
    { id: "prices", name: "Prices", icon: DollarSign, roles: ["owner"] },
    { id: "reports", name: "Reports", icon: BarChart3, roles: ["owner"] },
  ];

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
{/* ---------- Header ---------- */}
<header className="bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
    {/* Farm Management Title */}
    <h1 className="text-xl font-semibold text-gray-800">Farm Management</h1>

    <div className="flex items-center gap-4">
      {/* ✅ Add Production button → managers & owners */}
      {(user?.role === "manager" || user?.role === "owner") && (
        <button
          onClick={() => setShowProductionForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={16} /> Add Production
        </button>
      )}

      {/* ---------- Profile Dropdown ---------- */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-3 focus:outline-none"
        >
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {getGreeting()}, {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "guest"} Account
            </p>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
              user?.role === "owner" ? "bg-purple-600" : "bg-green-600"
            }`}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
        </button>

        {/* ▼ Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role} Account
              </p>
              <p className="text-xs text-gray-500">Farm ID: {user.farm_id}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</header>


      {/* ---------- Tabs ---------- */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
          {TABS.filter((tab) => tab.roles.includes(user?.role)).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon size={16} /> {tab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* ---------- Main Content ---------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <SummaryCards
              prices={prices}
              todayProduction={todayProduction}
              todayIncome={todayIncome}
              monthlyIncome={incomeData}
              currentMonthIncome={currentMonthIncome}
            />

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Today’s Production</h2>
              <ProductionTable data={todayProduction} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeChart data={incomeData} />
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Records</h2>
                <ProductionTable data={productionData.slice(0, 10)} />
              </section>
            </div>
          </div>
        )}

        {activeTab === "production" && <ProductionTable data={productionData} />}
        {activeTab === "prices" && <PriceManagement prices={prices} onUpdatePrice={handleUpdatePrice} />}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Monthly Income by Product</h2>
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Total (KSh)</th>
                </tr>
              </thead>
              <tbody>
                {incomeByProduct.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">
                      {new Date(row.month).toLocaleString("en-US", { month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-2 capitalize">{row.product}</td>
                    <td className="px-4 py-2">KSh {Number(row.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ---------- Production Form Modal ---------- */}
      {showProductionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowProductionForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <ProductionForm
              user={user}
              onSubmit={handleAddProduction}
              onCancel={() => setShowProductionForm(false)}
              userId={user.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmDashboard;
