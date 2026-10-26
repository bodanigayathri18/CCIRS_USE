import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, INITIAL_USERS } from '../../services/storage';
import { UserCheck, Shield, HardHat, User, RefreshCw, X } from 'lucide-react';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitched?: () => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSwitched,
}) => {
  const { currentUser, switchDemoUser } = useAuth();

  if (!isOpen) return null;

  const handleSelect = (userId: string) => {
    switchDemoUser(userId);
    if (onSwitched) onSwitched();
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo complaints and data back to initial software engineering lab state?')) {
      storage.resetToSeedData();
      window.location.reload();
    }
  };

  const getRoleBadge = (role: string, dept?: string) => {
    if (role === 'admin') {
      return (
        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
          Administrator
        </span>
      );
    }
    if (role === 'officer') {
      return (
        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
          Officer · {dept || 'Municipal'}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
        Citizen
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck size={20} className="text-teal-400" />
              <h3 className="font-bold text-base">Interactive Role Switcher</h3>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              Test all three personas instantly without entering passwords
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
          {INITIAL_USERS.map((user) => {
            const isCurrent = currentUser?.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => handleSelect(user.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-purple-600 text-white'
                        : user.role === 'officer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <Shield size={18} />
                    ) : user.role === 'officer' ? (
                      <HardHat size={18} />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">{user.name}</h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                    {user.designation && (
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {user.designation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {getRoleBadge(user.role, user.departmentName?.split(' ')[0])}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded transition-colors"
          >
            <RefreshCw size={13} />
            <span>Reset Demo DB</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
