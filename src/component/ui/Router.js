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
import ImportData from "../pages/manageData/ImportData";
import NotificationRouter from "../pages/notifications/Router";
import DetailStatusRouter from "../pages/detailStatus/Router";
import Adjudge from "../pages/court/Adjudge";
import AwaitingJudgment from "../pages/court/AwaitingJudgment";
import ReportCourt from "../pages/court/ReportCourt";
import Notice from "../pages/notice/Main";
import Calendar from "../pages/calendar/CalendarMain";
import { AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import AssignLawyers from "../pages/manageData/AssignLawyers";
import ChangeLawyersJob from "../pages/manageData/ChangeLawyersJob";

const supabase = createClient(
  "https://btjqmddnrozkizntpzkg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0anFtZGRucm96a2l6bnRwemtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNzA3MzgsImV4cCI6MjA0MDg0NjczOH0.5tBKhAwdjk9dgshiZkqhd7jhWsrJ-7xHat7P1hm0n7I"
);

export default function Router() {
  return (
    <>
      <SessionContextProvider supabaseClient={supabase}>
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
            <Route path="/notifications/*" element={<NotificationRouter />} />
            <Route path="/detail-status/*" element={<DetailStatusRouter />} />

            <Route path="court/adjudge/*" element={<Adjudge />} />
            <Route
              path="court/awaiting-judgment/*"
              element={<AwaitingJudgment />}
            />
            <Route path="court/report-court/*" element={<ReportCourt />} />
            <Route
              path="manage-data/assign-lawyers/*"
              element={<AssignLawyers />}
            />
            <Route
              path="manage-data/change-lawyers-jobs/*"
              element={<ChangeLawyersJob />}
            />
            <Route path="manage-data/import-data/*" element={<ImportData />} />

            <Route path="/" element={<Calendar />} />
          </Routes>
        </AnimatePresence>
      </SessionContextProvider>
    </>
  );
}
