import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Navbar() {
  const { user, logout, updateUserState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) setProfileName(user.name);
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    try {
      const res = await api.put('/auth/update-profile', {
        name: profileName,
        password: profilePassword || undefined,
      });
      updateUserState(res.data.data);
      setProfileSuccess('Profile updated successfully!');
      setProfilePassword('');
      setTimeout(() => {
        setShowProfileModal(false);
        setProfileSuccess('');
      }, 1500);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="font-extrabold text-xl tracking-tight text-white hover:text-indigo-100 transition mr-2">📋 TaskBoard</Link>
        
        {/* Active Pill Styled Navigation Links */}
        <Link to="/dashboard" className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/dashboard') ? 'bg-white/15 border border-white/20 text-white shadow-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'}`}>
          Dashboard
        </Link>

        {user?.role === 'admin' && (
          <>
            <Link to="/admin/boards" className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/admin/boards') ? 'bg-white/15 border border-white/20 text-white shadow-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'}`}>
              All Boards
            </Link>
            <Link to="/admin/users" className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/admin/users') ? 'bg-white/15 border border-white/20 text-white shadow-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'}`}>
              Users
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Beautiful Functional User Dropdown Trigger */}
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition active:scale-95 duration-150 outline-none select-none">
          <div className="w-8 h-8 rounded-full bg-indigo-500/50 border border-white/30 flex items-center justify-center font-bold uppercase text-white shadow-sm text-sm">
            {user?.name?.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-white">
            {user?.name}
          </span>
          {user?.role === 'admin' ? (
            <span className="bg-amber-400 text-amber-950 text-[10px] px-2 py-0.5 rounded-full border border-amber-300 font-extrabold shadow-sm">Admin</span>
          ) : (
            <span className="bg-blue-400 text-blue-950 text-[10px] px-2 py-0.5 rounded-full border border-blue-300 font-extrabold shadow-sm">User</span>
          )}
          <span className="text-indigo-200 text-xs transition duration-150 select-none">{showDropdown ? '▲' : '▼'}</span>
        </button>

        {/* Floating User Options Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-100 text-slate-800 w-64 p-3 flex flex-col gap-2 z-50 animate-in fade-in slide-in-from-top-3 duration-150">
            <div className="px-3 py-2 border-b border-gray-50 flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Signed In As</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 truncate">{user?.name}</span>
              <span className="text-xs text-slate-500 font-medium truncate mt-0.5">{user?.email}</span>
            </div>

            <button 
              onClick={() => { setShowDropdown(false); setShowProfileModal(true); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition w-full text-left">
              ⚙️ Account Settings
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition w-full text-left">
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Beautiful Glassmorphic Update Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100/80 animate-in fade-in zoom-in duration-150 text-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold text-gray-800">Account Settings</h3>
              <button 
                onClick={() => { setShowProfileModal(false); setProfileError(''); setProfileSuccess(''); }}
                className="text-gray-400 hover:text-gray-600 font-bold transition">
                ✕
              </button>
            </div>

            {profileError && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-semibold mb-4">
                ⚠️ {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold mb-4">
                ✓ {profileSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full border border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  value={user?.email}
                  className="w-full bg-slate-50 border border-gray-200 outline-none rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed select-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Email address cannot be modified.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password (Optional)</label>
                <input 
                  type="password" 
                  minLength={8}
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full border border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button"
                  onClick={() => { setShowProfileModal(false); setProfileError(''); setProfileSuccess(''); }} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
