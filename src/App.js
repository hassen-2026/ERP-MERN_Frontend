import { Navigate, Route, Routes } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import Logout from "./services/Logout";
import DashboardAdminPage from "./pages/Admin_Pages/Dashboard_Page/DashboardAdminPage";
import DashboardUserPage from "./pages/User_Pages/DashboardPage/DashboardUserPage";
import ProductPage from "./pages/Admin_Pages/Product_Pages/ProductPage/ProductPage";
import SupplierPage from "./pages/Admin_Pages/Supplier_Pages/SupplierPage/SupplierPage";
import AddSupplierPage from "./pages/Admin_Pages/Supplier_Pages/AddSupplierPage/AddSupplierPage";
import EditSupplierPage from "./pages/Admin_Pages/Supplier_Pages/EditSupplierPage/EditSupplierPage";
import SupplierDetailPage from "./pages/Admin_Pages/Supplier_Pages/SupplierDetailPage/SupplierDetailPage";
import PurchasePage from "./pages/Admin_Pages/Purchase_Pages/PurchasePage/PurchasePage";
import PurchaseOcrPage from "./pages/Admin_Pages/Purchase_Pages/PurchaseOcrPage/PurchaseOcrPage";
import AddPurchasePage from "./pages/Admin_Pages/Purchase_Pages/AddPurchasePage/AddPurchasePage";
import EditPurchasePage from "./pages/Admin_Pages/Purchase_Pages/EditPurchasePage/EditPurchasePage";
import PurchaseDetailPage from "./pages/Admin_Pages/Purchase_Pages/PurchaseDetailPage/PurchaseDetailPage";
import ProductDetailPage from "./pages/Admin_Pages/Product_Pages/ProductDetailPage/ProductDetailPage";
import EditProductPage from "./pages/Admin_Pages/Product_Pages/EditProductPage/EditProductPage";
import AddProductPage from "./pages/Admin_Pages/Product_Pages/AddProductPage/AddProductPage";
import CategoriesPage from "./pages/Admin_Pages/Category_Pages/CategoriesPage/CategoriesPage";
import AddCategoryPage from "./pages/Admin_Pages/Category_Pages/AddCategoryPage/AddCategoryPage";
import EditCategoryPage from "./pages/Admin_Pages/Category_Pages/EditCategoryPage/EditCategoryPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/Authentification_Pages/LoginPage/LoginPage";
import SignUpPage from "./pages/Authentification_Pages/SignUpPage/SignUpPage";
import ForgetPasswordPage from "./pages/Authentification_Pages/ForgetPasswordPage/ForgetPasswordPage";
import ResetPasswordPage from "./pages/Authentification_Pages/ResetPasswordPage/ResetPasswordPage";
import ClientPage from "./pages/Admin_Pages/Client_Pages/ClientPage/ClientPage";
import AddClientPage from "./pages/Admin_Pages/Client_Pages/AddClientPage/AddClientPage";
import EditClientPage from "./pages/Admin_Pages/Client_Pages/EditClientPage/EditClientPage";
import DevisPage from "./pages/Admin_Pages/Devis_Pages/DevisPage/DevisPage";
import AddDevisPage from "./pages/Admin_Pages/Devis_Pages/AddDevisPage/AddDevisPage";
import EditDevisPage from "./pages/Admin_Pages/Devis_Pages/EditDevisPage/EditDevisPage";
import CommandePage from "./pages/Admin_Pages/Commande_Pages/CommandePage/CommandePage";
import AddCommandePage from "./pages/Admin_Pages/Commande_Pages/AddCommandePage/AddCommandePage";
import EditCommandePage from "./pages/Admin_Pages/Commande_Pages/EditCommandePage/EditCommandePage";
import BonCommandePage from "./pages/Admin_Pages/BonCommande_Pages/BonCommandePage/BonCommandePage";
import AddBonCommandePage from "./pages/Admin_Pages/BonCommande_Pages/AddBonCommandePage/AddBonCommandePage";
import BonCommandeDetailPage from "./pages/Admin_Pages/BonCommande_Pages/BonCommandeDetailPage/BonCommandeDetailPage";
import TransporterPage from "./pages/Admin_Pages/Transporter_Pages/TransporterPage/TransporterPage";
import AddTransporterPage from "./pages/Admin_Pages/Transporter_Pages/AddTransporterPage/AddTransporterPage";
import EditTransporterPage from "./pages/Admin_Pages/Transporter_Pages/EditTransporterPage/EditTransporterPage";
import LivraisonPage from "./pages/Admin_Pages/Livraison_Pages/LivraisonPage/LivraisonPage";
import AddLivraisonPage from "./pages/Admin_Pages/Livraison_Pages/AddLivraisonPage/AddLivraisonPage";
import LivraisonDetailPage from "./pages/Admin_Pages/Livraison_Pages/LivraisonDetailPage/LivraisonDetailPage";
import CommandeDetailPage from "./pages/Admin_Pages/Commande_Pages/CommandeDetailPage/CommandeDetailPage";
import DeliveryNoteTemplatePage from "./pages/Admin_Pages/Documents_Pages/DeliveryNoteTemplatePage";
import InvoiceTemplatePage from "./pages/Admin_Pages/Documents_Pages/InvoiceTemplatePage";
import FacturePage from "./pages/Admin_Pages/Facture_Pages/FacturePage/FacturePage";
import AddFacturePage from "./pages/Admin_Pages/Facture_Pages/AddFacturePage/AddFacturePage";
import FactureDetailPage from "./pages/Admin_Pages/Facture_Pages/FactureDetailPage/FactureDetailPage";
import EditFacturePage from "./pages/Admin_Pages/Facture_Pages/EditFacturePage/EditFacturePage";
import PaiementPage from "./pages/Admin_Pages/Paiement_Pages/PaiementPage/PaiementPage";
import PaiementDetailPage from "./pages/Admin_Pages/Paiement_Pages/PaiementDetailPage/PaiementDetailPage";
import AddPaiementPage from "./pages/Admin_Pages/Paiement_Pages/AddPaiementPage/AddPaiementPage";
import EmployeePage from "./pages/Admin_Pages/RH_Pages/Employee_Pages/EmployeePage/EmployeePage";
import AddEmployeePage from "./pages/Admin_Pages/RH_Pages/Employee_Pages/AddEmployeePage/AddEmployeePage";
import EditEmployeePage from "./pages/Admin_Pages/RH_Pages/Employee_Pages/EditEmployeePage/EditEmployeePage";
import EmployeeDetailPage from "./pages/Admin_Pages/RH_Pages/Employee_Pages/EmployeeDetailPage/EmployeeDetailPage";
import DepartmentPage from "./pages/Admin_Pages/RH_Pages/Department_Pages/DepartmentPage/DepartmentPage";
import AddDepartmentPage from "./pages/Admin_Pages/RH_Pages/Department_Pages/AddDepartmentPage/AddDepartmentPage";
import EditDepartmentPage from "./pages/Admin_Pages/RH_Pages/Department_Pages/EditDepartmentPage/EditDepartmentPage";
import DepartmentDetailPage from "./pages/Admin_Pages/RH_Pages/Department_Pages/DepartmentDetailPage/DepartmentDetailPage";
import ContractPage from "./pages/Admin_Pages/RH_Pages/Contract_Pages/ContractPage/ContractPage";
import LeavePage from "./pages/Admin_Pages/RH_Pages/Leave_Pages/LeavePage/LeavePage";
import AddContractPage from "./pages/Admin_Pages/RH_Pages/Contract_Pages/AddContractPage/AddContractPage";
import EditContractPage from "./pages/Admin_Pages/RH_Pages/Contract_Pages/EditContractPage/EditContractPage";
import ContractDetailPage from "./pages/Admin_Pages/RH_Pages/Contract_Pages/ContractDetailPage/ContractDetailPage";
import AddLeavePage from "./pages/Admin_Pages/RH_Pages/Leave_Pages/AddLeavePage/AddLeavePage";
import LeaveDetailPage from "./pages/Admin_Pages/RH_Pages/Leave_Pages/LeaveDetailPage/LeaveDetailPage";
import PositionPage from "./pages/Admin_Pages/RH_Pages/Position_Pages/PositionPage/PositionPage";
import AddPositionPage from "./pages/Admin_Pages/RH_Pages/Position_Pages/AddPositionPage/AddPositionPage";
import EditPositionPage from "./pages/Admin_Pages/RH_Pages/Position_Pages/EditPositionPage/EditPositionPage";
import PositionDetailPage from "./pages/Admin_Pages/RH_Pages/Position_Pages/PositionDetailPage/PositionDetailPage";
import DocumentPage from "./pages/Admin_Pages/RH_Pages/Document_Pages/DocumentPage/DocumentPage";
import AddDocumentPage from "./pages/Admin_Pages/RH_Pages/Document_Pages/AddDocumentPage/AddDocumentPage";
import EditDocumentPage from "./pages/Admin_Pages/RH_Pages/Document_Pages/EditDocumentPage/EditDocumentPage";
import DocumentDetailPage from "./pages/Admin_Pages/RH_Pages/Document_Pages/DocumentDetailPage/DocumentDetailPage";
import EvaluationPage from "./pages/Admin_Pages/RH_Pages/Evaluation_Pages/EvaluationPage/EvaluationPage";
import AddEvaluationPage from "./pages/Admin_Pages/RH_Pages/Evaluation_Pages/AddEvaluationPage/AddEvaluationPage";
import EditEvaluationPage from "./pages/Admin_Pages/RH_Pages/Evaluation_Pages/EditEvaluationPage/EditEvaluationPage";
import EvaluationDetailPage from "./pages/Admin_Pages/RH_Pages/Evaluation_Pages/EvaluationDetailPage/EvaluationDetailPage";
import TrainingPage from "./pages/Admin_Pages/RH_Pages/Training_Pages/TrainingPage/TrainingPage";
import AddTrainingPage from "./pages/Admin_Pages/RH_Pages/Training_Pages/AddTrainingPage/AddTrainingPage";
import EditTrainingPage from "./pages/Admin_Pages/RH_Pages/Training_Pages/EditTrainingPage/EditTrainingPage";
import TrainingDetailPage from "./pages/Admin_Pages/RH_Pages/Training_Pages/TrainingDetailPage/TrainingDetailPage";
import PayrollPage from "./pages/Admin_Pages/RH_Pages/Payroll_Pages/PayrollPage/PayrollPage";
import AddPayrollPage from "./pages/Admin_Pages/RH_Pages/Payroll_Pages/AddPayrollPage/AddPayrollPage";
import EditPayrollPage from "./pages/Admin_Pages/RH_Pages/Payroll_Pages/EditPayrollPage/EditPayrollPage";
import PayrollDetailPage from "./pages/Admin_Pages/RH_Pages/Payroll_Pages/PayrollDetailPage/PayrollDetailPage";
import RHInsightsPage from "./pages/Admin_Pages/RH_Pages/RHInsightsPage/RHInsightsPage";

import EmployeeAttendanceListPage from "./pages/Admin_Pages/RH_Pages/Employee_Pages/EmployeeAttendanceListPage/EmployeeAttendanceListPage";
import AddEmployeeAttendancePage from "./pages/Admin_Pages/RH_Pages/Employee_Pages/AddEmployeeAttendancePage/AddEmployeeAttendancePage";
import BudgetManagement from "./pages/BudgetManagement/BudgetManagement";
import AddBudgetPage from "./pages/BudgetManagement/AddBudgetPage/AddBudgetPage";
import EditBudgetPage from "./pages/BudgetManagement/EditBudgetPage/EditBudgetPage";
import TargetManagement from "./pages/TargetManagement/TargetManagement";
import AddTargetPage from "./pages/TargetManagement/AddTargetPage/AddTargetPage";
import EditTargetPage from "./pages/TargetManagement/EditTargetPage/EditTargetPage";
import CurrencyRatesPage from "./pages/CurrencyRates/CurrencyRatesPage";
import StockMovementsPage from "./pages/StockMovements/StockMovementsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup/:roleSlug" element={<SignUpPage />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
   
      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardAdminPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/user"
        element={
          <PrivateRoute allowedRoles={["user"]}>
            <DashboardUserPage />
          </PrivateRoute>
        }
      />
        <Route
          path="/dashboard/manager"
          element={
            <PrivateRoute allowedRoles={["manager"]}>
              <DashboardUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/sales"
          element={
            <PrivateRoute allowedRoles={["sales_manager"]}>
              <DashboardUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/procurement"
          element={
            <PrivateRoute allowedRoles={["procurement_manager"]}>
              <DashboardUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/hr"
          element={
            <PrivateRoute allowedRoles={["hr_manager"]}>
              <DashboardUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/finance"
          element={
            <PrivateRoute allowedRoles={["finance_manager"]}>
              <DashboardUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/logistics"
          element={
            <PrivateRoute allowedRoles={["logistics_manager"]}>
              <DashboardUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/stock-movements"
          element={
            <PrivateRoute allowedRoles={["admin", "procurement_manager", "logistics_manager"]}>
              <StockMovementsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute allowedRoles={["admin", "manager", "sales_manager", "procurement_manager", "hr_manager", "finance_manager", "logistics_manager", "user"]}>
              <NotificationsPage />
            </PrivateRoute>
          }
        />
      <Route
        path="/inventory"
        element={
            <PrivateRoute allowedRoles={["admin", "procurement_manager", "logistics_manager"]}>
            <ProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/budgets"
        element={
          <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
            <BudgetManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/budgets/add"
        element={
          <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
            <AddBudgetPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/budgets/:id/edit"
        element={
          <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
            <EditBudgetPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/objectifs"
        element={
          <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
            <TargetManagement />
          </PrivateRoute>
        }
      />
      <Route path="/targets" element={<Navigate to="/objectifs" replace />} />
      <Route
        path="/objectifs/add"
        element={
          <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
            <AddTargetPage />
          </PrivateRoute>
        }
      />
      <Route path="/targets/add" element={<Navigate to="/objectifs/add" replace />} />
      <Route
        path="/objectifs/:id/edit"
        element={
          <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
            <EditTargetPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/targets/:id/edit"
        element={
          <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
            <EditTargetPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/currency-rates"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager", "sales_manager", "finance_manager"]}>
            <CurrencyRatesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
            <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <CategoriesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories/add"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <AddCategoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <EditCategoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <SupplierPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/suppliers/add"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <AddSupplierPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/suppliers/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <EditSupplierPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/suppliers/:id"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <SupplierDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/achats"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager", "finance_manager", "logistics_manager", "user"]}>
            <PurchasePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <PrivateRoute allowedRoles={["admin", "manager", "sales_manager"]}>
            <ClientPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/clients/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddClientPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/clients/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditClientPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/devis"
        element={
          <PrivateRoute allowedRoles={["admin", "manager", "sales_manager"]}>
            <DevisPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/devis/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddDevisPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/devis/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditDevisPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes"
        element={
          <PrivateRoute allowedRoles={["admin", "manager", "sales_manager", "logistics_manager"]}>
            <CommandePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/bon-commandes"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <BonCommandePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/bon-commandes/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddBonCommandePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/bon-commandes/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <BonCommandeDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/factures"
        element={
          <PrivateRoute allowedRoles={["admin", "manager", "sales_manager", "finance_manager"]}>
            <FacturePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/factures/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddFacturePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/factures/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <FactureDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/paiements"
        element={
          <PrivateRoute allowedRoles={["admin", "sales_manager", "finance_manager"]}>
            <PaiementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/employees"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <EmployeePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/employees/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddEmployeePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/employees/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditEmployeePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/employees/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EmployeeDetailPage />
          </PrivateRoute>
        }
      />
        <Route
          path="/rh/employees/:id/attendances"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <EmployeeAttendanceListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/rh/employees/:id/attendance/add"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AddEmployeeAttendancePage />
            </PrivateRoute>
          }
        />
      <Route
        path="/rh/departments"
        element={
            <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <DepartmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/departments/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddDepartmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/departments/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditDepartmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/departments/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DepartmentDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/positions"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <PositionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/positions/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddPositionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/positions/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditPositionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/positions/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <PositionDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/contracts"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <ContractPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/contracts/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddContractPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/contracts/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditContractPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/contracts/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ContractDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/leaves"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <LeavePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/leaves/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddLeavePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/leaves/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <LeaveDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/documents"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <DocumentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/documents/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddDocumentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/documents/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditDocumentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/documents/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DocumentDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/evaluations"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <EvaluationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/evaluations/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddEvaluationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/evaluations/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditEvaluationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/evaluations/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EvaluationDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/trainings"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager"]}>
            <TrainingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/trainings/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddTrainingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/trainings/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditTrainingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/trainings/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <TrainingDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/payrolls"
        element={
          <PrivateRoute allowedRoles={["admin", "hr_manager", "finance_manager"]}>
            <PayrollPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/payrolls/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddPayrollPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/payrolls/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditPayrollPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/payrolls/:id/detail"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <PayrollDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rh/insights"
        element={
          <PrivateRoute allowedRoles={["admin", "manager", "hr_manager"]}>
            <RHInsightsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/paiements/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddPaiementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/paiements/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <PaiementDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/factures/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditFacturePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/transporters"
        element={
          <PrivateRoute allowedRoles={["admin", "logistics_manager"]}>
            <TransporterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/transporters/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddTransporterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/transporters/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditTransporterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/livraisons"
        element={
          <PrivateRoute allowedRoles={["admin", "logistics_manager"]}>
            <LivraisonPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/livraisons/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddLivraisonPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/livraisons/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <LivraisonDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/livraisons/:id/bon-template"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DeliveryNoteTemplatePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes/add"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AddCommandePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <EditCommandePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <CommandeDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes/:id/facture-template"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <InvoiceTemplatePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/achats/add"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <AddPurchasePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/achats/ocr"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <PurchaseOcrPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/achats/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <EditPurchasePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/achats/:id"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager", "logistics_manager"]}>
            <PurchaseDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <ProductDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/product/:id/edit"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <EditProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/product/add"
        element={
          <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
            <AddProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/logout"
        element={
            <Logout />
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
