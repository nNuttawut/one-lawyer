import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoute from "../pages/dashboard/Router";
import DebtPaymentRoute from "../pages/debtPayment/Router";
import DisbursementRoute from "../pages/disbursement/Router";
import InvestigateAssetsRoute from "../pages/investigateAssets/Router";
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
import Profile from "../pages/userManage/Profile";
import ChangePassword from "../pages/userManage/ChangePassword";
import FinalCase from "../pages/finalCase/MainFinal";
import CommissionLaw from "../pages/commission/CommissionLaw";
import CommissionInvestigate from "../pages/commission/CommissionInvestigate";
import ReadText from "../pages/guidebook/ReadText";
import Resize from "../pages/guidebook/Resize";
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
import AppointmentLawsuit from "../pages/preLawsuitFiled/AppointmentLawsuit";
import CreateScanNoticeMain from "../pages/notice/CreateScanNoticeMain";
import ReplyNoticeEms from "../pages/notice/ReplyNoticeEms";
import CreateTerminateContract from "../pages/terminateContract/CreateTerminateContract";
import ReplyTerminateContract from "../pages/terminateContract/ReplyTerminateContract";
import ImportTerminateContractEms from "../pages/terminateContract/ImportTerminateContractEms";
import ReportTerminate from "../pages/report/ReportTerminate";
import ContractToLawuit from "../pages/terminateContract/ContractToLawuit";
import ApprovedClearAdvanePay from "../pages/chargeIndict/ApprovedClearAdvanePay";
import ImportOldData from "../pages/preLawsuitFiled/ImportOldData";
import ContractToLawuitHand from "../pages/terminateContractHand/ContractToLawuitHand";
import ReplyTerminateContractHand from "../pages/terminateContractHand/ReplyTerminateContractHand";
import ImportTerminateContractEmsHand from "../pages/terminateContractHand/ImportTerminateContractEmsHand";
import CreateTerminateContractHand from "../pages/terminateContractHand/CreateTerminateContractHand";
import DetailPayment from "../pages/detail/DetailPayment";
import InvestigateAssetsAdvanePayment from "../pages/investigateAssets/InvestigateAssetsAdvanePayment";
import InvestigateAssetsClearAdvanePayment from "../pages/investigateAssets/InvestigateAssetsClearAdvanePayment";
import ReportTerminateHand from "../pages/report/ReportTerminateHand";
import ChartTerminate from "../pages/report/ChartTerminate";
import CreateTerminateContractRepurchase from "../pages/terminateContractRepurchase/CreateTerminateContractRepurchase";
import ImportTerminateContractEmsRepurchase from "../pages/terminateContractRepurchase/ImportTerminateContractEmsRepurchase";
import ReplyTerminateContractRepurchase from "../pages/terminateContractRepurchase/ReplyTerminateContractRepurchase";
import ContractToLawuitRepurchase from "../pages/terminateContractRepurchase/ContractToLawuitRepurchase";
import CreateTerminateContractLand from "../pages/terminateContractLand/CreateTerminateContractLand";
import ImportTerminateContractEmsLand from "../pages/terminateContractLand/ImportTerminateContractEmsLand";
import ReplyTerminateContractLand from "../pages/terminateContractLand/ReplyTerminateContractLand";
import ContractToLawuitLand from "../pages/terminateContractLand/ContractToLawuitLand";
import ChartCancel from "../pages/terminateContract/ChartCancel";
import ChartCancelHand from "../pages/terminateContractHand/ChartCancelHand";
import ChartCancelRepurchase from "../pages/terminateContractRepurchase/ChartCancelRepurchase";
import ChartCancelLand from "../pages/terminateContractLand/ChartCancelLand";
import SettingSystem from "../pages/userManage/SettingSystem";
import MainWithdrawCase from "../pages/withdrawCase/MainWithdrawCase";
import MainTimeoutCase from "../pages/timeoutCase/MainTimeoutCase";
import MainBadDebt from "../pages/badDebt/MainBadDebt";
import CourtAdvanePayment from "../pages/court/CourtAdvanePayment";
import CourtClearAdvanePayment from "../pages/court/CourtClearAdvanePayment";
import ImportDecideData from "../pages/enforcement/ImportDecideData";
import MainClosingBalance from "../pages/closingBalance/MainClosingBalance";
import MainAverage from "../pages/saleAnnouncement/MainAverage";
import EnforcementAdvanePayment from "../pages/enforcement/EnforcementAdvanePayment";
import EnforcementClearAdvanePayment from "../pages/enforcement/EnforcementClearAdvanePayment";
import AnotherAdvanePayment from "../pages/disbursement/AnotherAdvanePayment";
import AnotherClearAdvanePayment from "../pages/disbursement/AnotherClearAdvanePayment";
import ReportAdvanePay from "../pages/chargeIndict/ReportAdvanePay";
import ChooseContract from "../pages/preInvestigateAssets/ChooseContract";
import CreatePreInvestigateAssets from "../pages/preInvestigateAssets/CreatePreInvestigateAssets";
import ReportReceiveMoney from "../pages/receiveCustomerMoney/ReportReceiveMoney";
import ReportLawsuit from "../pages/preLawsuitFiled/ReportLawsuit";
import ReceiveMoney from "../pages/receiveCustomerMoney/ReceiveMoney";
import ChangeStatusContract from "../pages/manageData/ChangeStatusContract";
import CreateCancelContract from "../pages/preInvestigateAssets/CreateCancelContract";
import LawyersJob from "../pages/preInvestigateAssets/LawyersJob";

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
          <Route path="/*" element={<DashboardRoute />} />
          <Route path="/final-case" element={<FinalCase />} />
          <Route path="/debt-payment/*" element={<DebtPaymentRoute />} />
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
            path="/terminate-contract/terminate-contract-to-lawsuit"
            element={<ContractToLawuit />}
          />
          <Route
            path="terminate-contract/terminate-Contract-Chart"
            element={<ChartCancel />}
          />
          <Route
            path="/terminate-contract-hand/create-terminate-contract"
            element={<CreateTerminateContractHand />}
          />
          <Route
            path="/terminate-contract-hand/import-terminate-contract-ems"
            element={<ImportTerminateContractEmsHand />}
          />
          <Route
            path="/terminate-contract-hand/reply-terminate-contract"
            element={<ReplyTerminateContractHand />}
          />
          <Route
            path="/terminate-contract-hand/terminate-contract-to-lawsuit"
            element={<ContractToLawuitHand />}
          />
          <Route
            path="terminate-contract-hand/terminate-Contract-chart"
            element={<ChartCancelHand />}
          />
          <Route
            path="/terminate-contract-repurchase/create-terminate-contract"
            element={<CreateTerminateContractRepurchase />}
          />
          <Route
            path="/terminate-contract-repurchase/import-terminate-contract-ems"
            element={<ImportTerminateContractEmsRepurchase />}
          />
          <Route
            path="/terminate-contract-repurchase/reply-terminate-contract"
            element={<ReplyTerminateContractRepurchase />}
          />
          <Route
            path="/terminate-contract-repurchase/terminate-contract-to-lawsuit"
            element={<ContractToLawuitRepurchase />}
          />
          <Route
            path="terminate-contract-Repurchase/terminate-Contract-chart"
            element={<ChartCancelRepurchase />}
          />
          <Route
            path="/terminate-contract-land/create-terminate-contract"
            element={<CreateTerminateContractLand />}
          />
          <Route
            path="/terminate-contract-land/import-terminate-contract-ems"
            element={<ImportTerminateContractEmsLand />}
          />
          <Route
            path="/terminate-contract-land/reply-terminate-contract"
            element={<ReplyTerminateContractLand />}
          />
          <Route
            path="/terminate-contract-land/terminate-contract-to-lawsuit"
            element={<ContractToLawuitLand />}
          />
          <Route
            path="terminate-contract-land/terminate-Contract-chart"
            element={<ChartCancelLand />}
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
            path="/investigate-assets/advane-payment-assets-found"
            element={<InvestigateAssetsAdvanePayment />}
          />
          <Route
            path="/investigate-assets/clear-advane-payment-assets-found"
            element={<InvestigateAssetsClearAdvanePayment />}
          />
          <Route
            path="/lawsuit/pre-lawsuit-filed"
            element={<MainPreLawsuitFiled />}
          />
          <Route
            path="/lawsuit/appointment-lawsuit"
            element={<AppointmentLawsuit />}
          />
          <Route path="/lawsuit/report-lawsuit" element={<ReportLawsuit />} />

          <Route
            path="/lawsuit/advane-payment"
            element={<LawsuitAdvanePayment />}
          />
          <Route
            path="/lawsuit/clear-advane-payment"
            element={<LawsuitClearAdvanePayment />}
          />
          <Route path="/lawsuit/import-old-data" element={<ImportOldData />} />
          <Route path="/report/chart-terminate" element={<ChartTerminate />} />
          <Route path="/report/notice" element={<ReportNotice />} />
          <Route path="/report/terminate" element={<ReportTerminate />} />
          <Route
            path="/report/terminate-hand"
            element={<ReportTerminateHand />}
          />
          <Route
            path="sale-announcement/report-sale/*"
            element={<SaleAnnouncementRoute />}
          />
          <Route
            path="sale-announcement/report-average"
            element={<MainAverage />}
          />
          <Route
            path="enforcement/send-to-enforcement/*"
            element={<EnforcementRoute />}
          />

          <Route
            path="enforcement/advane-payment/*"
            element={<EnforcementAdvanePayment />}
          />
          <Route
            path="enforcement/clear-advane-payment/*"
            element={<EnforcementClearAdvanePayment />}
          />

          <Route
            path="enforcement/import-lawsuit-data/*"
            element={<ImportDecideData />}
          />
          <Route path="/negotiate/*" element={<NegotiateRoute />} />
          <Route path="/notifications/*" element={<NotificationRouter />} />
          <Route path="/detail-status" element={<DetailStatusRouter />} />
          <Route path="/court/case-is-final" element={<CaseIsFinal />} />
          <Route path="/court/judgement" element={<Judgement />} />
          <Route
            path="/court/awaiting-judgment"
            element={<AwaitingJudgment />}
          />
          <Route
            path="/court/advane-payment"
            element={<CourtAdvanePayment />}
          />
          <Route
            path="/court/clear-advane-payment"
            element={<CourtClearAdvanePayment />}
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
          <Route
            path="manage-data/change-status-contract"
            element={<ChangeStatusContract />}
          />

          <Route path="/manage-data/import-data" element={<ImportData />} />
          <Route path="/chang-password" element={<ChangePassword />} />
          <Route path="/setting-system" element={<SettingSystem />} />
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
          <Route
            path="/charge-indict/approved-clear-advane-pay"
            element={<ApprovedClearAdvanePay />}
          />
          <Route
            path="/charge-indict/report-advane-pay"
            element={<ReportAdvanePay />}
          />
          <Route
            path="/contract-detail/detail-payment"
            element={<DetailPayment />}
          />

          {/* การรับเงินลูกค้า */}
          <Route
            path="receive-customer-money/receive-money"
            element={<ReceiveMoney />}
          />
          <Route
            path="receive-customer-money/report-receive-money"
            element={<ReportReceiveMoney />}
          />

          {/* สืบทรัพย์ก่อนบังคับคดี */}
          <Route
            path="pre-investigate-assets/choose-contract"
            element={<ChooseContract />}
          />
          <Route
            path="pre-investigate-assets/investigate-assets-search"
            element={<CreatePreInvestigateAssets />}
          />

          <Route
            path="pre-investigate-assets/export-cancel-contract"
            element={<CreateCancelContract />}
          />

          <Route
            path="pre-investigate-assets/send-to-lawsuit"
            element={<LawyersJob />}
          />

          <Route
            path="pre-investigate-assets/sumary-report"
            element={<null />}
          />

          {/* เบิกอื่น ๆ */}
          <Route
            path="/disbursement/advane-payment"
            element={<AnotherAdvanePayment />}
          />
          <Route
            path="/disbursement/clear-advane-payment"
            element={<AnotherClearAdvanePayment />}
          />
          <Route path="/withdraw-case" element={<MainWithdrawCase />} />
          <Route path="/timeout-case" element={<MainTimeoutCase />} />
          <Route path="/bad-debt" element={<MainBadDebt />} />
          <Route path="/guidbook/read-text" element={<ReadText />} />
          <Route path="/guidbook/resize" element={<Resize />} />
          <Route path="/guidbook/contno" element={<Test />} />
          <Route path="/liff" element={<Liff />} />
          <Route path="/login-line" element={<Loginline />} />
          {/* ขอปิดยอดเบน */}
          <Route
            path="/closing-balance/request-closing-balance"
            element={<MainClosingBalance />}
          />
        </Routes>
      </AnimatePresence>
      {/* </SessionContextProvider> */}
    </>
  );
}
