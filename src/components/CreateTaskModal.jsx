import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CreateTaskModal({ boardId, boardMembers, onClose, onCreated }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [allUsers, setAllUsers] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium',
    dueDate: '', assignedTo: boardMembers[0]?._id || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      api.get('/users')
        .then(res => {
          setAllUsers(res.data.data);
          if (res.data.data.length > 0 && !form.assignedTo) {
            setForm(f => ({ ...f, assignedTo: res.data.data[0]._id }));
          }
        })
        .catch(() => {});
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    if (!form.assignedTo) return setError('Please assign the task to someone');
    setLoading(true);
    try {
      await api.post(`/boards/${boardId}/tasks`, form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const assignableUsers = isAdmin ? allUsers : boardMembers;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">New Task</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Task title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Assign To *</label>
              <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                {assignableUsers.map(m => (
                  <option key={m._id} value={m._id}>{m.name} {isAdmin ? `(${m.email})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
