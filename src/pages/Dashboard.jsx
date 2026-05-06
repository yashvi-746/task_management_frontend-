import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateBoardModal from '../components/CreateBoardModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/boards');
      setBoards(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoards(); }, []);

  // Compute stats
  const totalBoards = boards.length;
  const totalTasks = boards.reduce((acc, b) => acc + (b.taskCount || 0), 0);
  const totalMembers = boards.reduce((acc, b) => acc + (b.members?.length || 0), 0);
  const totalCompleted = boards.reduce((acc, b) => acc + (b.completedCount || 0), 0);
  const totalInProgress = boards.reduce((acc, b) => acc + (b.inProgressCount || 0), 0);
  const totalTodo = totalTasks - totalCompleted - totalInProgress;

  const globalProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Premium Hero Greeting Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            ✨ Welcome Back
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Workspace Member'}!
          </h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            Track, collaborate, and manage your tasks. You have active projects and collaborations assigned across your organization today.
          </p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowCreate(true)}
            className="bg-white text-indigo-700 font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow hover:shadow-lg hover:bg-indigo-50 transition transform active:scale-95 duration-150 whitespace-nowrap z-10">
            🚀 Create New Board
          </button>
        )}
        {/* Subtle Decorative Background Blob */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Global Interactive Progress Dashboard Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              📊 Workspace Progress Status
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Real-time task completion statistics across all assigned boards</p>
          </div>
          <span className="text-xl font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-2xl text-center shadow-sm">
            ✓ {globalProgress}% Completed
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/40">
          <div 
            style={{ width: `${globalProgress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-1000 ease-out shadow-sm">
          </div>
        </div>

        {/* Status Legends */}
        <div className="grid grid-cols-3 gap-4 pt-1 text-center">
          <div className="bg-slate-50/60 border border-slate-100/80 rounded-2xl p-3 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To Do</span>
            <span className="text-lg font-extrabold text-gray-700">{totalTodo >= 0 ? totalTodo : 0} Tasks</span>
          </div>
          <div className="bg-blue-50/40 border border-blue-100/40 rounded-2xl p-3 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">In Progress</span>
            <span className="text-lg font-extrabold text-blue-700">{totalInProgress} Tasks</span>
          </div>
          <div className="bg-emerald-50/40 border border-emerald-100/40 rounded-2xl p-3 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Done</span>
            <span className="text-lg font-extrabold text-emerald-700">{totalCompleted} Tasks</span>
          </div>
        </div>
      </div>

      {/* Analytics Statistics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-sm border border-indigo-100/40">
            📁
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Boards</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalBoards}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-sm border border-blue-100/40">
            📌
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalTasks}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-sm border border-emerald-100/40">
            👥
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collaborators</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalMembers}</p>
          </div>
        </div>
      </div>

      {/* Boards Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
          <span>📁</span> My Active Workspaces
        </h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          {boards.length} Boards Total
        </span>
      </div>

      {loading ? (
        <div className="text-center py-24 text-indigo-400 font-semibold text-lg animate-pulse">
          Syncing workspaces...
        </div>
      ) : boards.length === 0 ? (
        <div className="bg-white border border-gray-100/80 rounded-2xl p-12 text-center text-gray-400 shadow-md max-w-lg mx-auto">
          <p className="text-xl font-bold text-gray-700">No active boards found</p>
          <p className="text-sm mt-2 text-gray-400">Ask a system administrator to invite you or create a new board to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map(board => {
            const boardProgress = board.taskCount > 0 ? Math.round((board.completedCount / board.taskCount) * 100) : 0;
            return (
              <Link key={board._id} to={`/boards/${board._id}`}
                className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden block">
                
                {/* Colored top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-500/80 transition-all group-hover:h-2 group-hover:bg-indigo-600"></div>
                
                <div className="pt-2">
                  <h3 className="font-extrabold text-gray-800 text-lg group-hover:text-indigo-600 transition duration-150">
                    📁 {board.title}
                  </h3>
                  {board.description ? (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {board.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-300 italic mt-2">No description provided.</p>
                  )}
                  
                  {/* Board Level Progress Indicator */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Progress</span>
                      <span className="text-indigo-600">{boardProgress}% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                      <div 
                        style={{ width: `${boardProgress}%` }}
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700">
                      </div>
                    </div>
                  </div>

                  {/* Visual Dividers */}
                  <div className="border-t border-gray-100/80 my-4"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        👥 {board.members?.length || 0} Team
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        📌 {board.taskCount || 0} Tasks
                      </span>
                    </div>
                    <span className="text-xs font-bold text-indigo-500 group-hover:underline flex items-center gap-1">
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateBoardModal onClose={() => setShowCreate(false)} onCreated={fetchBoards} />
      )}
    </div>
  );
}
