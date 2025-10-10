"use client";

import { useState } from "react";
import Plans from "./Plans";

export default function PlansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="container mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
        <p className="text-gray-600">
          Manage and configure your subscription plans and pricing tiers
        </p>
      </div>

      <Plans
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  );
}