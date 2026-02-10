import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductListPage from './pages/ProductListPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CategoryListPage from './pages/CategoryListPage';
import ClientListPage from './pages/ClientListPage';
import EmployeeListPage from './pages/EmployeeListPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import PointOfSalePage from './pages/PointOfSalePage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/layout/MainLayout'; // Import Layout
import { useAuthStore } from './store/useAuthStore';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Custom Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-rose-600 mb-4">Algo salió mal</h2>
            <p className="text-slate-600 mb-4">La aplicación ha encontrado un error crítico.</p>
            <pre className="bg-slate-100 p-4 rounded-lg text-xs font-mono text-slate-800 overflow-auto max-h-48">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Layout Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/edit/:id" element={<ProductFormPage />} />
            <Route path="/products/:id/details" element={<ProductDetailsPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/clients" element={<ClientListPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/sales" element={<SalesHistoryPage />} />
            <Route path="/pos" element={<PointOfSalePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
