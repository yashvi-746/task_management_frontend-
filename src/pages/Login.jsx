import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState('user'); // 'user' or 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const successMsg = location.state?.success;

  // Auto-fill or clear based on login mode
  useEffect(() => {
    if (loginMode === 'admin') {
      setForm({ email: 'admin@example.com', password: 'admin123456' });
    } else {
      setForm({ email: '', password: '' });
    }
    setError('');
  }, [loginMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('All fields required');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${loginMode === 'admin' ? 'bg-gradient-to-tr from-indigo-900 to-slate-900' : 'bg-slate-100'}`}>
      <div className={`bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border transition-all duration-500 ${loginMode === 'admin' ? 'border-purple-500/50 shadow-purple-500/10' : 'border-slate-200'}`}>
        
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setLoginMode('user')}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${loginMode === 'user' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            👤 Regular User
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('admin')}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${loginMode === 'admin' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🛡️ Admin Portal
          </button>
        </div>

        <h1 className={`text-2xl font-black mb-1 transition-colors duration-300 ${loginMode === 'admin' ? 'text-indigo-800' : 'text-indigo-600'}`}>
          {loginMode === 'admin' ? 'Admin Control Panel' : 'User Portal'}
        </h1>
        <p className="text-slate-500 text-xs mb-6">
          {loginMode === 'admin' ? 'Access global controls, workspace management, and user assignments.' : 'Track your personal tasks, view board status, and collaborate.'}
        </p>

        {successMsg && <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4 border border-green-200">{successMsg}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4 border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder={loginMode === 'admin' ? 'admin@example.com' : 'yourname@example.com'}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 ${loginMode === 'admin' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? 'Authenticating...' : loginMode === 'admin' ? '⚡ Log In as Admin' : '👤 Sign In'}
          </button>
        </form>

        {loginMode === 'user' && (
          <p className="text-sm text-center mt-6 text-slate-500">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register Here</Link>
          </p>
        )}
      </div>
    </div>
  );
}
