'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';
import { UserProfile } from '@/types/presentation';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserProfile, isNewUser: boolean) => void;
  isGate?: boolean; // If true, cannot close without authenticating
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  isGate = false,
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBonusAlert, setShowBonusAlert] = useState(false);

  if (!isOpen) return null;

  // Google Login Simulation
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowBonusAlert(true);

      const newUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: 'Pixels (Google User)',
        email: 'mrpixelvns@gmail.com',
        avatar: 'PI',
        balance: 20000, // Tặng ngay 20.000 đ cho tài khoản mới!
        isGoogle: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        onLoginSuccess(newUser, true);
      }, 1000);
    }, 600);
  };

  // Email Register Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowBonusAlert(true);

      const displayName = name.trim() || email.split('@')[0];
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: displayName,
        email: email,
        avatar: displayName.substring(0, 2).toUpperCase(),
        balance: 20000, // Tặng ngay 20.000 đ
        isGoogle: false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        onLoginSuccess(newUser, true);
      }, 1000);
    }, 600);
  };

  // Email Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const displayName = email.split('@')[0];
      const existingUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: displayName,
        email: email,
        avatar: displayName.substring(0, 2).toUpperCase(),
        balance: 20000, // Có 20.000 đ
        isGoogle: false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      onLoginSuccess(existingUser, false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 relative overflow-y-auto max-h-[92vh]">
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button if not blocking gate */}
        {!isGate && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* App Logo & Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SlidePro AI Platform</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {tab === 'register' ? 'Đăng ký tài khoản mới' : 'Đăng nhập vào SlidePro'}
          </h2>
          <p className="text-xs text-slate-400">
            {tab === 'register'
              ? 'Tạo tài khoản để bắt đầu chuyển đổi PDF sang slide PowerPoint chuyên nghiệp'
              : 'Chào mừng bạn quay lại với hệ thống tạo bài giảng SlidePro'}
          </p>
        </div>

        {/* Promotional +20k Bonus Highlight Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md shadow-amber-500/30">
            <Gift className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-300 block">
              TẶNG NGAY 20.000 đ VÀO TÀI KHOẢN
            </span>
            <span className="text-slate-300 text-[11px]">
              Dành riêng cho mỗi tài khoản tạo mới để trải nghiệm tạo slide & xuất PowerPoint!
            </span>
          </div>
        </div>

        {/* Bonus Granted Notification Toast */}
        {showBonusAlert && (
          <div className="bg-emerald-950/90 border border-emerald-500/80 rounded-2xl p-3 mb-4 text-xs text-emerald-200 flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-emerald-300">Chúc mừng bạn!</strong>
              <span>Đã cộng thành công <strong>+20.000 đ</strong> vào số dư của bạn.</span>
            </div>
          </div>
        )}

        {/* Google One-Click Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-slate-100 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-md group cursor-pointer"
        >
          {/* Official Google Icon SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Tiếp tục với Google (+20.000 đ)</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-[#111827] px-3 text-slate-500 font-medium">
              hoặc với Email
            </span>
          </div>
        </div>

        {/* Switch Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng ký mới (+20k)
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng nhập
          </button>
        </div>

        {/* Form */}
        <form onSubmit={tab === 'register' ? handleRegisterSubmit : handleLoginSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Họ và tên của bạn</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="tenban@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>Đang xử lý...</span>
            ) : tab === 'register' ? (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Đăng ký & Nhận 20.000 đ</span>
              </>
            ) : (
              <>
                <span>Đăng nhập vào hệ thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Tài khoản dùng thử demo • Tự động kích hoạt ngay lập tức
          </span>
        </div>
      </div>
    </div>
  );
}
