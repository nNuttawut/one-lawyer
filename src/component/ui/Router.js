import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoute from "../pages/dashboard/Router";
import DebtPaymentRoute from "../pages/debtPayment/Router";
import DisbursementRoute from "../pages/disbursement/Router";
import InvestigateAssetsRoute from "../pages/investigateAssets/Router";
import PreLawsuitFiledRoute from "../pages/preLawsuitFiled/Router";
import ReportRoute from "../pages/report/Router";
import SaleAnnouncementRoute from "../pages/saleAnnouncement/Router";
import EnforcementRoute from "../pages/enforcement/Router";
import NegotiateRoute from "../pages/negotiate/Router";
import ImportData from "../pages/manageData/ImportData";
import NotificationRouter from "../pages/notifications/Router";
import DetailStatusRouter from "../pages/detail/Router";
import CaseIsFinal from "../pages/court/CaseIsFinal";
import AwaitingJudgment from "../pages/court/AwaitingJudgment";
import ReportCourt from "../pages/court/ReportCourt";
import Notice from "../pages/notice/MainNotice";
import Calendar from "../pages/calendar/CalendarMain";
import { AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import AssignLawyers from "../pages/manageData/AssignLawyers";
import ChangeLawyersJob from "../pages/manageData/ChangeLawyersJob";
import InvestigateAssetsBefore from "../pages/investigateAssets/InvestigateAssetsBefore";
import InvestigateAssetsAfter from "../pages/investigateAssets/InvestigateAssetsAfter";
import Judgement from "../pages/court/Judgement";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";
import FinalCase from "../pages/finalCase/MainFinal";
import CommissionLaw from "../pages/commission/CommissionLaw";
import CommissionInvestigate from "../pages/commission/CommissionInvestigate";

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
            <Route path="/final-case/*" element={<FinalCase />} />
            <Route path="/debt-payment/*" element={<DebtPaymentRoute />} />
            <Route path="/disbursement/*" element={<DisbursementRoute />} />
            <Route path="/notice/*" element={<Notice />} />
            <Route
              path="/investigate-assets/*"
              element={<InvestigateAssetsRoute />}
            />

            <Route
              path="investigate-assets/before-indict/*"
              element={<InvestigateAssetsBefore />}
            />
            <Route
              path="investigate-assets/after-indict/*"
              element={<InvestigateAssetsAfter />}
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
              element={<EnforcementRoute />}
            />
            <Route path="/negotiate/*" element={<NegotiateRoute />} />
            <Route path="/notifications/*" element={<NotificationRouter />} />
            <Route path="/detail-status/*" element={<DetailStatusRouter />} />

            <Route path="court/case-is-final/*" element={<CaseIsFinal />} />
            <Route path="court/judgement/*" element={<Judgement />} />
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
            <Route path="/chang-password" element={<ChangePassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Calendar />} />
            <Route
              path="commission/commission-law/*"
              element={<CommissionLaw />}
            />
            <Route
              path="commission/commission-investigate/*"
              element={<CommissionInvestigate />}
            />
          </Routes>
        </AnimatePresence>
      </SessionContextProvider>
    </>
  );
}
