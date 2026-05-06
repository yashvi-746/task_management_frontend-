import React from 'react';

const PRIORITY_STYLES = {
  Low: 'bg-green-50 text-green-700 border border-green-100',
  Medium: 'bg-amber-50 text-amber-700 border border-amber-100',
  High: 'bg-red-50 text-red-700 border border-red-100',
};

const TaskCard = React.memo(function TaskCard({ task, onClick, onStatusUpdate }) {
  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const handleAction = (e, newStatus) => {
    e.stopPropagation();
    if (onStatusUpdate) onStatusUpdate(task._id, newStatus);
  };

  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100/80 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      
      {/* Visual status accent bar on the left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        task.status === 'Todo' ? 'bg-gray-300' : task.status === 'InProgress' ? 'bg-blue-500' : 'bg-emerald-500'
      }`}></div>

      <div className="pl-1 space-y-3">
        <h3 className="text-sm font-extrabold text-gray-800 leading-snug group-hover:text-indigo-600 transition duration-150">
          {task.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`text-[10px] font-bold ${isOverdue ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100/60">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold border border-indigo-200">
              {initials(task.assignedTo.name)}
            </div>
            <span className="text-[11px] text-gray-500 font-semibold">{task.assignedTo.name}</span>
          </div>
        )}

        {/* Interactive Quick Status Action Controls */}
        {onStatusUpdate && (
          <div className="flex gap-1.5 pt-2 border-t border-gray-100/60 justify-end">
            {task.status === 'Todo' && (
              <button 
                onClick={(e) => handleAction(e, 'InProgress')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-lg text-[10px] transition duration-150 flex items-center gap-1">
                ⚡ Start Task →
              </button>
            )}
            {task.status === 'InProgress' && (
              <>
                <button 
                  onClick={(e) => handleAction(e, 'Todo')}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded-lg text-[10px] transition duration-150 flex items-center gap-1">
                  ← Revert
                </button>
                <button 
                  onClick={(e) => handleAction(e, 'Done')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-[10px] transition duration-150 flex items-center gap-1">
                  ✓ Complete Task
                </button>
              </>
            )}
            {task.status === 'Done' && (
              <button 
                onClick={(e) => handleAction(e, 'InProgress')}
                className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-lg text-[10px] transition duration-150 flex items-center gap-1">
                ↺ Reopen Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default TaskCard;
