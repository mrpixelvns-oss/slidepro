'use client';

import React from 'react';
import {
  Sparkles,
  FolderKanban,
  Mail,
  Receipt,
  User,
  MessageSquareHeart,
  PlusCircle,
  HardDrive,
  LogOut,
  X
} from 'lucide-react';
import { LectureProject, UserProfile } from '@/types/presentation';
import { calculateTotalStorageMb, formatStorageDisplay } from '@/lib/storageUtils';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  activeView: 'editor' | 'library' | 'inbox' | 'history' | 'account';
  setActiveView: (view: 'editor' | 'library' | 'inbox' | 'history' | 'account') => void;
  balance: number;
  onOpenRecharge: () => void;
  onOpenFeedback: () => void;
  onNewLecture: () => void;
  user?: UserProfile | null;
  onLogout?: () => void;
  projects?: LectureProject[];
}

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  balance,
  onOpenRecharge,
  onOpenFeedback,
  onNewLecture,
  user,
  onLogout,
  projects = [],
}: SidebarProps) {
  if (!isOpen) return null;

  const isLowBalance = balance < 1000;
  const storageInfo = formatStorageDisplay(calculateTotalStorageMb(projects));

  const handleItemClick = (action: () => void) => {
    action();
    // Auto close mobile drawer on narrow screens
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (< lg) */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside className="fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0a0f1d] border-r border-slate-800/80 shadow-2xl flex flex-col justify-between p-4 select-none shrink-0 overflow-y-auto animate-in slide-in-from-left duration-200 lg:static lg:w-64 lg:h-auto lg:z-auto lg:shadow-none lg:min-h-[calc(100vh-4rem)] lg:animate-none">
        <div className="space-y-5">
          {/* Mobile Header with Close button (visible only on < lg) */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base text-white">SlidePro Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main CTA Button: Tạo bài giảng */}
          <button
            onClick={() => {
              handleItemClick(() => {
                setActiveView('editor');
                onNewLecture();
              });
            }}
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-semibold text-sm transition-all shadow-md active:scale-98 ${
              activeView === 'editor'
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 ring-1 ring-blue-400/40'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>Tạo bài giảng mới</span>
          </button>

          {/* Group 1: BÀI GIẢNG */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Bài giảng
            </div>
            <button
              onClick={() => handleItemClick(() => setActiveView('library'))}
              className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'library'
                  ? 'bg-slate-800/90 text-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 active:bg-slate-800'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Kho bài giảng</span>
            </button>
            <button
              onClick={() => handleItemClick(() => setActiveView('inbox'))}
              className={`w-full min-h-[42px] flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'inbox'
                  ? 'bg-slate-800/90 text-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 active:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Hộp thư</span>
              </div>
              <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-500/30">
                1
              </span>
            </button>
          </div>

          {/* Group 2: TÀI KHOẢN */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Tài khoản
            </div>
            <button
              onClick={() => handleItemClick(() => setActiveView('history'))}
              className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'history'
                  ? 'bg-slate-800/90 text-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 active:bg-slate-800'
              }`}
            >
              <Receipt className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Lịch sử giao dịch</span>
            </button>
            <button
              onClick={() => handleItemClick(() => setActiveView('account'))}
              className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'account'
                  ? 'bg-slate-800/90 text-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 active:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Tài khoản {user ? `(${user.name.split(' ')[0]})` : ''}</span>
            </button>
          </div>

          {/* Balance Card matching user screenshots */}
          <div className="p-3.5 rounded-xl bg-[#101728] border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Số dư</span>
              {isLowBalance ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Sắp hết
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Tài khoản mới +20k
                </span>
              )}
            </div>

            <div>
              <div className="text-xl font-bold text-white tracking-tight">
                {balance.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Tạo được khoảng {Math.floor(balance / 1000)} slide (1.000 đ/slide)
              </div>
            </div>

            <button
              onClick={() => handleItemClick(onOpenRecharge)}
              className="w-full min-h-[40px] py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:bg-blue-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nạp tiền</span>
            </button>

            {/* Storage Capacity Bar */}
            <div className="pt-2 border-t border-slate-800/70 space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-slate-400" />
                  Dung lượng
                </span>
                <span className="text-slate-300 font-semibold transition-all">
                  {storageInfo.usedFormatted} / {storageInfo.totalFormatted}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${storageInfo.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feedback and Logout Button */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => handleItemClick(onOpenFeedback)}
            className="flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 transition-all w-full justify-start active:bg-amber-500/20"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 shrink-0" />
            <span>+ Góp ý cho nhóm phát triển</span>
          </button>

          {user && onLogout && (
            <button
              onClick={() => handleItemClick(onLogout)}
              className="flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors w-full justify-start active:bg-red-950/30"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
