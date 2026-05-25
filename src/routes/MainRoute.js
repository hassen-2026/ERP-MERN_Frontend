
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardAdminPage from '../pages/Admin_Pages/Dashboard_Page/DashboardAdminPage.jsx';
import DashboardUserPage from '../pages/User_Pages/DashboardPage/DashboardUserPage.jsx';
import ProductPage from '../pages/ProductPage';
import SupplierPage from '../pages/SupplierPage';
import AddSupplierPage from '../pages/Admin_Pages/Supplier_Pages/AddSupplierPage/AddSupplierPage.jsx';
import EditSupplierPage from '../pages/Admin_Pages/Supplier_Pages/EditSupplierPage/EditSupplierPage.jsx';
import SupplierDetailPage from '../pages/Admin_Pages/Supplier_Pages/SupplierDetailPage/SupplierDetailPage.jsx';
import PurchasePage from '../pages/Admin_Pages/Purchase_Pages/defaults/PurchasePage.jsx';
import AddPurchasePage from '../pages/Admin_Pages/Purchase_Pages/AddPurchasePage/AddPurchasePage.jsx';
import EditPurchasePage from '../pages/Admin_Pages/Purchase_Pages/EditPurchasePage/EditPurchasePage.jsx';
import PurchaseDetailPage from '../pages/Admin_Pages/Purchase_Pages/PurchaseDetailPage/PurchaseDetailPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage';
import EditProductPage from '../pages/Admin_Pages/Product_Pages/EditProductPage/EditProductPage.jsx';
import AddProductPage from '../pages/AddProductPage';
import CategoriesPage from '../pages/Admin_Pages/Category_Pages/CategoriesPage/CategoriesPage.jsx';
import AddCategoryPage from '../pages/Admin_Pages/Category_Pages/AddCategoryPage/AddCategoryPage.jsx';
import EditCategoryPage from '../pages/Admin_Pages/Category_Pages/EditCategoryPage/EditCategoryPage.jsx';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import BudgetManagement from '../pages/BudgetManagement/BudgetManagement';
import AddBudgetPage from '../pages/BudgetManagement/AddBudgetPage/AddBudgetPage';
import EditBudgetPage from '../pages/BudgetManagement/EditBudgetPage/EditBudgetPage';
import TargetManagement from '../pages/TargetManagement/TargetManagement';
import AddTargetPage from '../pages/TargetManagement/AddTargetPage/AddTargetPage';
import EditTargetPage from '../pages/TargetManagement/EditTargetPage/EditTargetPage';
import StockMovementsPage from '../pages/StockMovements/StockMovementsPage.jsx';
import NotificationsPage from '../pages/Notifications/NotificationsPage.jsx';
import PrivateRoute from './PrivateRoute.js';


const MainRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />

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
            <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
              <PurchasePage />
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
            <PrivateRoute allowedRoles={["admin", "procurement_manager"]}>
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

          <Route
            path="/targets"
            element={<Navigate to="/objectifs" replace />}
          />

          <Route
            path="/objectifs/add"
            element={
              <PrivateRoute allowedRoles={["super_admin", "admin", "finance_manager"]}>
                <AddTargetPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/targets/add"
            element={<Navigate to="/objectifs/add" replace />}
          />

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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoute;


