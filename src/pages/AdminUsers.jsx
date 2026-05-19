import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalError, setModalError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setModalError('');
    try {
      await api.post('/users', formData);
      setShowAddModal(false);
      setModalError('');
      setFormData({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setModalError('');
    setFormData({ name: '', email: '', password: '', role: 'user' });
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.delete(`/users/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 relative">
      {/* Premium Header with Add New User Button */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Users</h1>
          <p className="text-indigo-100 text-sm mt-1">Manage, monitor, and configure role privileges of all active registered members in the system.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="bg-white text-indigo-700 font-extrabold px-5 py-2.5 rounded-xl text-sm shadow hover:shadow-md hover:bg-indigo-50 transition transform active:scale-95 duration-150 whitespace-nowrap z-10">
          ➕ Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-indigo-400 font-medium text-lg animate-pulse">
          Loading system users...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">NAME</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">EMAIL ADDRESS</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">SYSTEM ROLE</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">JOIN DATE</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-indigo-50/40 transition duration-150 group">
                  <td className="px-6 py-4 border-l-4 border-transparent group-hover:border-l-indigo-600 transition-all duration-150">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                        {u.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-bold text-gray-800 whitespace-nowrap">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                        : 'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}>
                      {u.role === 'admin' ? '👑 Admin' : '👥 User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => setConfirmDeleteId(u._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition duration-150">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Beautiful Custom Yes/No Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100/80 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete User Account?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this user? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 mt-6 justify-end">
              <button 
                onClick={() => setConfirmDeleteId(null)} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl text-sm transition">
                No, Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition shadow-sm">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Custom Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100/80 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold text-gray-800">Add New User</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 font-bold transition">
                ✕
              </button>
            </div>

            {modalError && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-semibold mb-4 animate-shake">
                ⚠️ {modalError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full border border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full border border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      formData.role === 'user'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-1 ring-indigo-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}>
                    <span className="text-2xl mb-1">👥</span>
                    <span className="text-sm font-extrabold">Regular User</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 font-medium leading-tight">Can only see assigned boards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      formData.role === 'admin'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-1 ring-indigo-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}>
                    <span className="text-2xl mb-1">👑</span>
                    <span className="text-sm font-extrabold">System Admin</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 font-medium leading-tight">Full administrative control</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button"
                  onClick={handleCloseModal} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-md">
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
