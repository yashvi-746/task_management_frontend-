import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CreateBoardModal({ onClose, onCreated, existing }) {
  const [form, setForm] = useState({
    title: existing?.title || '',
    description: existing?.description || '',
    members: existing?.members?.map(m => m._id) || [],
  });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.data)).catch(() => {});
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter(m => m !== id) : [...f.members, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    setLoading(true);
    try {
      if (existing) {
        await api.put(`/boards/${existing._id}`, form);
      } else {
        await api.post('/boards', form);
      }
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">{existing ? 'Edit Board' : 'New Board'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Board Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Members</label>
              <input type="text" placeholder="Search members by name or email..." 
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-400" />
              <div className="border rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
                {filteredUsers.map(u => (
                  <label key={u._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input type="checkbox" checked={form.members.includes(u._id)}
                      onChange={() => toggleMember(u._id)} className="rounded" />
                    <span className="text-sm text-gray-700">{u.name} <span className="text-gray-400">({u.email})</span></span>
                  </label>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">No users found</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {loading ? 'Saving...' : existing ? 'Update' : 'Create Board'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
