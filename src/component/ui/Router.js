import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoute from "../pages/dashboard/Router";
import BadDebtRoute from "../pages/badDebt/Router";
import DebtPaymentRoute from "../pages/debtPayment/Router";
import DisbursementRoute from "../pages/disbursement/Router";
import InvestigateAssetsRoute from "../pages/investigateAssets/Router";
import PreLawsuitFiledRoute from "../pages/preLawsuitFiled/Router";
import ReportRoute from "../pages/report/Router";
import SaleAnnouncementRoute from "../pages/saleAnnouncement/Router";
import SendToEnforcementRoute from "../pages/sendToEnforcement/Router";
import NegotiateRoute from "../pages/negotiate/Router";
import ImportData from "../pages/importData/Router";
import NotificationRouter from "../pages/notifications/Router";
import DetailStatusRouter from "../pages/detailStatus/Router";
import Adjudge from "../pages/court/Adjudge";
import AwaitingJudgment from "../pages/court/AwaitingJudgment";
import ReportCourt from "../pages/court/ReportCourt";
import Notice from "../pages/notice/Main";
import { AnimatePresence } from "framer-motion";

export default function Router() {
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/dashboard/*" element={<DashboardRoute />} />
          <Route path="/bad-debt/*" element={<BadDebtRoute />} />
          <Route path="/debt-payment/*" element={<DebtPaymentRoute />} />
          <Route path="/disbursement/*" element={<DisbursementRoute />} />
          <Route path="/notice/*" element={<Notice />} />
          <Route
            path="/investigate-assets/*"
            element={<InvestigateAssetsRoute />}
          />
          <Route
            path="/pre-lawsuit-filed/*"
            element={<PreLawsuitFiledRoute />}
          />
          <Route path="/report/*" element={<ReportRoute />} />
          <Route
            path="/sale-announcement/*"
            element={<SaleAnnouncementRoute />}
          />
          <Route
            path="/send-to-enforcement/*"
            element={<SendToEnforcementRoute />}
          />
          <Route path="/negotiate/*" element={<NegotiateRoute />} />
          <Route path="/import-data/*" element={<ImportData />} />
          <Route path="/notifications/*" element={<NotificationRouter />} />
          <Route path="/detail-status/*" element={<DetailStatusRouter />} />

          <Route path="/adjudge/*" element={<Adjudge />} />
          <Route path="/awaiting-judgment/*" element={<AwaitingJudgment />} />
          <Route path="/report-court/*" element={<ReportCourt />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
