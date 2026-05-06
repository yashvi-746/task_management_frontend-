import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CreateBoardModal from '../components/CreateBoardModal';

export default function AdminBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editBoard, setEditBoard] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState('');

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/boards');
      setBoards(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoards(); }, []);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.delete(`/boards/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchBoards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete board');
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Premium Vibrant Indigo-Blue Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white animate-fade-in">System Boards</h1>
          <p className="text-indigo-100 text-sm mt-1">Manage and monitor all active boards, project owners, and member groups across the organization.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="bg-white text-indigo-700 font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md hover:bg-indigo-50 transition transform active:scale-95 duration-150 whitespace-nowrap">
          🚀 Add New Board
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-indigo-400 font-medium text-lg">
          <div className="animate-pulse">Loading board statistics...</div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">BOARD TITLE</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">PROJECT OWNER</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">TEAM SIZE</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wider">TASKS COUNT</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {boards.map(b => (
                <tr key={b._id} className="hover:bg-indigo-50/50 hover:shadow-sm border-l-4 border-transparent hover:border-l-indigo-600 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <Link to={`/boards/${b._id}`} className="font-bold text-indigo-600 hover:text-indigo-800 transition text-base block hover:underline">
                      📁 {b.title}
                    </Link>
                    {b.description && (
                      <p className="text-xs text-gray-400 mt-1 max-w-md truncate">{b.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                        {b.owner?.name?.[0]?.toUpperCase() || 'O'}
                      </div>
                      <span className="text-gray-700 font-medium">{b.owner?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      👥 {b.members?.length || 0} Members
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      📌 {b.taskCount || 0} Tasks
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditBoard(b)} 
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition active:scale-95">
                        Edit
                      </button>
                      <button onClick={() => setConfirmDeleteId(b._id)} 
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition active:scale-95">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {boards.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No boards found. Click "Add New Board" to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Beautiful Custom Yes/No Deletion Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100/80 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl mb-4 animate-bounce">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Project Board?</h3>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Are you sure you want to delete this project board and all its tasks? This action is permanent and cannot be undone.
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

      {(showCreate || editBoard) && (
        <CreateBoardModal
          existing={editBoard}
          onClose={() => { setShowCreate(false); setEditBoard(null); }}
          onCreated={fetchBoards}
        />
      )}
    </div>
  );
}
