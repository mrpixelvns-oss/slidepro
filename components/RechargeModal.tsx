'use client';

import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBalance: (amount: number) => void;
}

export default function RechargeModal({
  isOpen,
  onClose,
  onAddBalance,
}: RechargeModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(50000);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const packages = [
    { amount: 20000, label: 'Gói Cơ bản', slides: '20 slide bài giảng', bonus: '' },
    { amount: 50000, label: 'Gói Phổ thông (Khuyên dùng)', slides: '55 slide + Lời giảng AI', bonus: 'Tặng thêm 5.000 đ' },
    { amount: 100000, label: 'Gói Giảng viên Pro', slides: '120 slide + Full Quiz & PPTX', bonus: 'Tặng thêm 20.000 đ' },
  ];

  const handleConfirmRecharge = () => {
    onAddBalance(selectedPackage);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Nạp tiền vào tài khoản</h2>
            <p className="text-xs text-cyan-400 font-medium">Đơn giá: 1.000 đ / 1 slide bài giảng</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Nạp tiền thành công!</h3>
            <p className="text-xs text-slate-400">Số dư đã được cập nhật ngay lập tức.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {packages.map((pkg) => (
                <div
                  key={pkg.amount}
                  onClick={() => setSelectedPackage(pkg.amount)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedPackage === pkg.amount
                      ? 'bg-blue-950/50 border-cyan-500 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{pkg.amount.toLocaleString('vi-VN')} đ</span>
                    {pkg.bonus && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {pkg.bonus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{pkg.label}</span>
                    <span className="text-cyan-400">{pkg.slides}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Giao dịch mô phỏng trực tiếp an toàn, kích hoạt ngay lập tức.</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmRecharge}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>Nạp {selectedPackage.toLocaleString('vi-VN')} đ</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
