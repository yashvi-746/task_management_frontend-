import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TaskDetailModal({ task, boardMembers, onClose, onUpdated }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [allUsers, setAllUsers] = useState([]);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    assignedTo: task.assignedTo?._id || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      api.get('/users')
        .then(res => setAllUsers(res.data.data))
        .catch(() => {});
    }
  }, [isAdmin]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/tasks/${task._id}`, isAdmin ? form : { status: form.status });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${task._id}`);
    onUpdated();
    onClose();
  };

  const assignableUsers = isAdmin ? allUsers : boardMembers;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Task Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-3">{error}</div>}

          <div className="space-y-4">
            {isAdmin ? (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Title</p>
                <p className="font-semibold text-gray-800">{form.title}</p>
              </div>
            )}

            {isAdmin && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="Todo">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {isAdmin && (
              <>
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
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Assigned To</label>
                  <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    {assignableUsers?.map(m => (
                      <option key={m._id} value={m._id}>{m.name} {isAdmin ? `(${m.email})` : ''}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between mt-6">
            {isAdmin && (
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm">
                Delete Task
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button onClick={handleSave} disabled={loading}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
