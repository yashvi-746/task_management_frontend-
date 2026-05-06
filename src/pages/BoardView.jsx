import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import CreateTaskModal from '../components/CreateTaskModal';

const STATUSES = ['Todo', 'InProgress', 'Done'];
const STATUS_LABELS = { Todo: 'To Do', InProgress: 'In Progress', Done: 'Done' };
const STATUS_COLORS = {
  Todo: 'bg-slate-100/60 border border-slate-200/80 rounded-2xl shadow-sm',
  InProgress: 'bg-blue-50/40 border border-blue-100/80 rounded-2xl shadow-sm',
  Done: 'bg-emerald-50/40 border border-emerald-100/80 rounded-2xl shadow-sm',
};
const STATUS_INDICATORS = {
  Todo: 'bg-slate-400',
  InProgress: 'bg-blue-500',
  Done: 'bg-emerald-500',
};

export default function BoardView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', assignedTo: '' });

  const fetchBoard = async () => {
    try {
      const [bRes, tRes] = await Promise.all([
        api.get(`/boards/${id}`),
        api.get(`/boards/${id}/tasks`, { params: filters }),
      ]);
      setBoard(bRes.data.data);
      setTasks(tRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoard(); }, [id, filters]);

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchBoard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status.');
      console.error('Failed to update task status:', err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading board...</div>;
  if (!board) return <div className="text-center py-20 text-gray-400">Board not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Premium Vibrant Indigo Gradient Banner Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{board.title}</h1>
          {board.description && <p className="text-indigo-100 text-sm mt-1">{board.description}</p>}
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowCreate(true)}
            className="bg-white text-indigo-700 font-extrabold px-5 py-2.5 rounded-xl text-sm shadow hover:shadow-md hover:bg-indigo-50 transition transform active:scale-95 duration-150 whitespace-nowrap z-10">
            ➕ Add Task
          </button>
        )}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/30 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}
          className="border rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select value={filters.assignedTo} onChange={e => setFilters({ ...filters, assignedTo: e.target.value })}
          className="border rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white">
          <option value="">All Assignees</option>
          {board.members?.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map(status => (
          <div key={status} className={`p-5 min-h-[450px] flex flex-col ${STATUS_COLORS[status]}`}>
            <h2 className="font-extrabold text-gray-800 mb-4 flex items-center justify-between text-base tracking-tight">
              <span className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${STATUS_INDICATORS[status]}`}></span>
                {STATUS_LABELS[status]}
              </span>
              <span className="bg-white text-gray-500 text-xs px-2.5 py-0.5 rounded-full border border-gray-100 font-bold shadow-sm">
                {tasksByStatus(status).length}
              </span>
            </h2>
            <div className="space-y-4 flex-1 overflow-y-auto">
              {tasksByStatus(status).map(task => (
                <TaskCard key={task._id} task={task} onClick={() => setSelectedTask(task)} onStatusUpdate={handleStatusUpdate} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          boardMembers={board.members}
          onClose={() => setSelectedTask(null)}
          onUpdated={fetchBoard}
        />
      )}

      {showCreate && (
        <CreateTaskModal
          boardId={id}
          boardMembers={board.members}
          onClose={() => setShowCreate(false)}
          onCreated={fetchBoard}
        />
      )}
    </div>
  );
}
