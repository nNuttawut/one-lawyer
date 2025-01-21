import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoute from "../pages/dashboard/Router";
import DebtPaymentRoute from "../pages/debtPayment/Router";
import DisbursementRoute from "../pages/disbursement/Router";
import InvestigateAssetsRoute from "../pages/investigateAssets/Router";
import PreLawsuitFiledRoute from "../pages/preLawsuitFiled/Router";
import ReportNotice from "../pages/report/Router";
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
import AssignLawyers from "../pages/manageData/AssignLawyers";
import ChangeLawyersJob from "../pages/manageData/ChangeLawyersJob";
import EstimateAssets from "../pages/investigateAssets/EstimateAssets";
import Judgement from "../pages/court/Judgement";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";
import FinalCase from "../pages/finalCase/MainFinal";
import CommissionLaw from "../pages/commission/CommissionLaw";
import CommissionInvestigate from "../pages/commission/CommissionInvestigate";
import ReadText from "../pages/guidebook/ReadText";
import Test from "../pages/guidebook/Test";
import ReplyNotice from "../pages/notice/ReplyNotice";
import Liff from "../pages/lineLogIn/Liff";
import Loginline from "../pages/lineLogIn/LoginLine";
import { AnimatePresence } from "framer-motion";
// import { createClient } from "@supabase/supabase-js";
// import { SessionContextProvider } from "@supabase/auth-helpers-react";
import CreateInvestigateAssets from "../pages/investigateAssets/CreateInvestigateAssets";
import AssetsFound from "../pages/investigateAssets/AssetsFound";
import AdvanePay from "../pages/chargeIndict/AdvanePay";
import ClearAdvanePay from "../pages/chargeIndict/ClearAdvanePay";
import LawsuitAdvanePayment from "../pages/preLawsuitFiled/LawsuitAdvanePayment";
import LawsuitClearAdvanePayment from "../pages/preLawsuitFiled/LawsuitClearAdvanePayment";
import MainPreLawsuitFiled from "../pages/preLawsuitFiled/MainPreLawsuitFiled";
import CreateScanNoticeMain from "../pages/notice/CreateScanNoticeMain";
import ReplyNoticeEms from "../pages/notice/ReplyNoticeEms";
import CreateTerminateContract from "../pages/terminateContract/CreateTerminateContract";
import ReplyTerminateContract from "../pages/terminateContract/ReplyTerminateContract";
import ImportTerminateContractEms from "../pages/terminateContract/ImportTerminateContractEms";
import ReportTerminate from "../pages/report/ReportTerminate";

// const supabase = createClient(
//   "https://btjqmddnrozkizntpzkg.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0anFtZGRucm96a2l6bnRwemtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNzA3MzgsImV4cCI6MjA0MDg0NjczOH0.5tBKhAwdjk9dgshiZkqhd7jhWsrJ-7xHat7P1hm0n7I"
// );

export default function Router() {
  return (
    <>
      {/* <SessionContextProvider supabaseClient={supabase}> */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<DashboardRoute />} />
          <Route path="/final-case" element={<FinalCase />} />
          <Route path="/debt-payment" element={<DebtPaymentRoute />} />
          <Route path="/disbursement/" element={<DisbursementRoute />} />

          <Route path="/notice/create-notice" element={<Notice />} />
          <Route path="/notice/reply-notice" element={<ReplyNotice />} />
          <Route
            path="/notice/create-notice-ems"
            element={<CreateScanNoticeMain />}
          />
          <Route path="/notice/reply-notice-ems" element={<ReplyNoticeEms />} />

          <Route
            path="/terminate-contract/create-terminate-contract"
            element={<CreateTerminateContract />}
          />
          <Route
            path="/terminate-contract/import-terminate-contract-ems"
            element={<ImportTerminateContractEms />}
          />
          <Route
            path="/terminate-contract/reply-terminate-contract"
            element={<ReplyTerminateContract />}
          />

          <Route
            path="/investigate-assets"
            element={<InvestigateAssetsRoute />}
          />
          <Route
            path="/investigate-assets/assets-found"
            element={<AssetsFound />}
          />
          <Route
            path="/investigate-assets/estimate-assets"
            element={<EstimateAssets />}
          />
          <Route
            path="/investigate-assets/create-invitigate-assets"
            element={<CreateInvestigateAssets />}
          />

          <Route
            path="/lawsuit/pre-lawsuit-filed"
            element={<MainPreLawsuitFiled />}
          />
          <Route
            path="/lawsuit/advane-payment"
            element={<LawsuitAdvanePayment />}
          ></Route>
          <Route
            path="/lawsuit/clear-advane-payment"
            element={<LawsuitClearAdvanePayment />}
          ></Route>
          <Route path="/report/notice" element={<ReportNotice />} />
          <Route path="/report/terminate" element={<ReportTerminate />} />
          <Route
            path="/sale-announcement"
            element={<SaleAnnouncementRoute />}
          />
          <Route path="/send-to-enforcement" element={<EnforcementRoute />} />
          <Route path="/negotiate" element={<NegotiateRoute />} />
          <Route path="/notifications" element={<NotificationRouter />} />
          <Route path="/detail-status" element={<DetailStatusRouter />} />

          <Route path="/court/case-is-final" element={<CaseIsFinal />} />
          <Route path="/court/judgement" element={<Judgement />} />
          <Route
            path="/court/awaiting-judgment"
            element={<AwaitingJudgment />}
          />
          <Route path="/court/report-court" element={<ReportCourt />} />
          <Route
            path="/manage-data/assign-lawyers"
            element={<AssignLawyers />}
          />
          <Route
            path="/manage-data/change-lawyers-jobs"
            element={<ChangeLawyersJob />}
          />
          <Route path="/manage-data/import-data" element={<ImportData />} />
          <Route path="/chang-password" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route
            path="/commission/commission-law"
            element={<CommissionLaw />}
          />
          <Route
            path="/commission/commission-investigate"
            element={<CommissionInvestigate />}
          />
          <Route path="/charge-indict/advane-pay" element={<AdvanePay />} />
          <Route
            path="/charge-indict/clear-advane-pay"
            element={<ClearAdvanePay />}
          />

          <Route path="/guidbook/read-text" element={<ReadText />} />
          <Route path="/guidbook/test" element={<Test />} />
          <Route path="/liff" element={<Liff />} />
          <Route path="/login-line" element={<Loginline />} />
        </Routes>
      </AnimatePresence>
      {/* </SessionContextProvider> */}
    </>
  );
}
