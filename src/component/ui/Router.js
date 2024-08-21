import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoute from "../pages/dashboard/Router";
import DebtorRoute from "../pages/debtor/Router";
import DebtPaymentRoute from "../pages/debtPayment/Router";
import DisbursementRoute from "../pages/disbursement/Router";
import InvestigateAssetsRoute from "../pages/investigateAssets/Router";
import PreLawsuitFiledRoute from "../pages/preLawsuitFiled/Router";
import ReportRoute from "../pages/report/Router";
import SaleAnnouncementRoute from "../pages/saleAnnouncement/Router";
import SendToEnforcementRoute from "../pages/sendToEnforcement/Router";
export default function Router() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardRoute />} />
      <Route path="/debtor/*" element={<DebtorRoute />} />
      <Route path="/debt-payment/*" element={<DebtPaymentRoute />} />
      <Route path="/disbursement/*" element={<DisbursementRoute />} />
      <Route
        path="/investigate-assets/*"
        element={<InvestigateAssetsRoute />}
      />
      <Route path="/pre-lawsuit-filed/*" element={<PreLawsuitFiledRoute />} />
      <Route path="/report/*" element={<ReportRoute />} />
      <Route path="/sale-announcement/*" element={<SaleAnnouncementRoute />} />
      <Route
        path="/send-to-enforcement/*"
        element={<SendToEnforcementRoute />}
      />
    </Routes>
  );
}
