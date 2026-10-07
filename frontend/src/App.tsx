import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "./components/layout/DashboardLayout";

import Home from "./pages/Home";
import VirtualCardsProduct from "./pages/products/VirtualCardsProduct";
import ScheduledTransfersProduct from "./pages/products/ScheduledTransfersProduct";
import SavingsVaultsProduct from "./pages/products/SavingsVaultsProduct";
import SecurityProduct from "./pages/products/SecurityProduct";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import Cards from "./pages/Cards";
import Vaults from "./pages/Vaults";
import Scheduled from "./pages/Scheduled";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Product Showcase Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/features/virtual-cards" element={<VirtualCardsProduct />} />
          <Route path="/features/scheduled-transfers" element={<ScheduledTransfersProduct />} />
          <Route path="/features/savings-vaults" element={<SavingsVaultsProduct />} />
          <Route path="/features/security" element={<SecurityProduct />} />
          <Route path="/login" element={<Login />} />
          
          {/* Authenticated Banking Portal Pages */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/vaults" element={<Vaults />} />
            <Route path="/scheduled" element={<Scheduled />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
