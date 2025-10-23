import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProductProvider } from './hooks/useProducts';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import SearchPage from './pages/SearchPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function AppContent() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route 
                        path="/admin" 
                        element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/admin/product/new" 
                        element={<ProtectedRoute><AdminProductEditPage /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/admin/product/edit/:id" 
                        element={<ProtectedRoute><AdminProductEditPage /></ProtectedRoute>} 
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}


export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </ProductProvider>
    </AuthProvider>
  );
}