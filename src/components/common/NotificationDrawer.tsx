import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCheck, Clock, AlertTriangle, ShieldCheck, ExternalLink, X } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComplaint?: (complaintId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectComplaint,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();

  if (!isOpen) return null;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'resolution':
        return <ShieldCheck className="text-emerald-500" size={16} />;
      case 'assignment':
        return <Clock className="text-blue-500" size={16} />;
      case 'status_change':
        return <AlertTriangle className="text-amber-500" size={16} />;
      default:
        return <Bell className="text-slate-500" size={16} />;
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-blue-600" />
            <h3 className="font-semibold text-slate-900 text-sm">Civic In-App Notifications</h3>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Bell size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You will receive updates here as your complaints progress.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.isRead) markNotificationAsRead(n.id);
                  if (n.complaintId && onSelectComplaint) {
                    onSelectComplaint(n.complaintId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${
                  n.isRead
                    ? 'hover:bg-slate-50 opacity-80'
                    : 'bg-blue-50/60 hover:bg-blue-50/90 border border-blue-100 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{getNotifIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    {n.complaintId && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-blue-600">
                        <span>View Complaint {n.complaintId}</span>
                        <ExternalLink size={11} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Simulated Municipal Push Notification Dispatcher
        </div>
      </div>
    </div>
  );
};
