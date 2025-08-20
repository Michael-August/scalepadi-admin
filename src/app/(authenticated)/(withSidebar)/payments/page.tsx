"use client";

import React, { useState } from "react";
import { tabs } from "@/app/data";
import Payments from "@/components/paymentTabs/Payments";
import Subscriptions from "@/components/paymentTabs/Subscriptions";
import ExpertPayouts from "@/components/paymentTabs/ExpertPayouts";

export default function PaymentsMainContent() {
  const [activeTab, setActiveTab] = useState("payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setCurrentPage(1);
    setSearchQuery("");
  };

  return (
    <div className="rounded-2xl bg-gray-100/50 p-3 font-montserrat">
      <main className="w-full px-2 py-6 bg-white min-h-[80vh] rounded-xl shadow-sm">
        {/* Tabs */}
        <nav aria-label="Payments tabs" className="mb-4">
          <ul className="flex gap-6 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <li key={tab.value}>
                <button
                  className={`py-2 px-4 md:px-6 font-montserrat text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.value
                      ? "border-b-2 border-blue-600/60 text-black"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                  aria-current={activeTab === tab.value ? "page" : undefined}
                  onClick={() => handleTabChange(tab.value)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab Panels */}
        {activeTab === "payments" && (
          <Payments
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )}

        {activeTab === "subscriptions" && (
          <Subscriptions
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )}

        {activeTab === "expertPayout" && (
          <ExpertPayouts
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )}
      </main>
    </div>
  );
}