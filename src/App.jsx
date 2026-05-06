import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';
import AdminUsers from './pages/AdminUsers';
import AdminBoards from './pages/AdminBoards';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#f0f4fa]">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/boards/:id" element={<ProtectedRoute><BoardView /></ProtectedRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/boards" element={<AdminRoute><AdminBoards /></AdminRoute>} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
