'use client';

import React, { useState } from 'react';
import { Package, X, Sparkles, AlertCircle, Loader2, CreditCard, CheckCircle2 } from 'lucide-react';
import { LectureProject } from '@/types/presentation';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  project: LectureProject;
  mode: 'outline_to_script' | 'script_to_package';
  balance?: number;
  onOpenRecharge?: () => void;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  project,
  mode,
  balance = 20000,
  onOpenRecharge,
}: ConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isOutlineStep = mode === 'outline_to_script';
  const totalSlides = project.slides.length || project.totalPages || 1;
  const slideCost = totalSlides * 1000;
  const isAlreadyPaid = Boolean(project.isPaid);
  const effectiveCost = isOutlineStep && !isAlreadyPaid ? slideCost : 0;
  const isInsufficient = isOutlineStep && !isAlreadyPaid && balance < slideCost;
  const shortage = Math.max(0, slideCost - balance);

  const handleActionConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20">
            <Package className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isOutlineStep ? 'Xác nhận soạn nội dung' : 'Xác nhận nội dung bài giảng'}
          </h2>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Đơn vị học
              </span>
              <span className="text-lg font-bold text-white">
                {project.units.length}
              </span>
            </div>

            <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Số slide
              </span>
              <span className="text-lg font-bold text-cyan-400">
                {totalSlides}
              </span>
            </div>

            <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Câu hỏi
              </span>
              <span className="text-lg font-bold text-white">
                {project.units.reduce((sum, u) => sum + (Number(u.questionCount) || 0), 0) || project.quizzes.length}
              </span>
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800/90 rounded-xl px-3 py-2 flex justify-between items-center text-xs">
            <span className="text-slate-400">Đối tượng người học:</span>
            <span className="font-semibold text-white">{project.audience}</span>
          </div>
        </div>

        {/* Pricing & Balance Box (1.000 đ / slide) */}
        <div className="bg-[#0a0f1d] border border-slate-800 rounded-xl p-3.5 space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Đơn giá quy định:</span>
            <span className="font-semibold text-cyan-400">1.000 đ / 1 slide</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/80">
            <span className="text-slate-300 font-medium">Chi phí bài giảng ({totalSlides} slide):</span>
            <span className="text-sm font-bold text-amber-400">
              {isAlreadyPaid ? 'Đã thanh toán (0 đ)' : `${slideCost.toLocaleString('vi-VN')} đ`}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Số dư hiện tại của bạn:</span>
            <span className="font-semibold text-slate-200">{balance.toLocaleString('vi-VN')} đ</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/80">
            <span className="text-slate-400">Số dư sau khi thực hiện:</span>
            <span className={`font-bold ${isInsufficient ? 'text-red-400' : 'text-emerald-400'}`}>
              {isInsufficient
                ? `Thiếu ${shortage.toLocaleString('vi-VN')} đ`
                : `${Math.max(0, balance - effectiveCost).toLocaleString('vi-VN')} đ`}
            </span>
          </div>
        </div>

        {/* Warning / Prompt Box */}
        {isInsufficient ? (
          <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3 mb-5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-red-200/95 leading-relaxed">
              Số dư tài khoản không đủ để thanh toán ({balance.toLocaleString('vi-VN')} đ / {slideCost.toLocaleString('vi-VN')} đ). Vui lòng nạp thêm <strong>{shortage.toLocaleString('vi-VN')} đ</strong> để tiếp tục.
            </div>
          </div>
        ) : (
          <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-3 mb-5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              {isOutlineStep
                ? `Hệ thống sẽ trừ ${effectiveCost.toLocaleString('vi-VN')} đ và khởi tạo kịch bản thuyết trình cùng câu hỏi ôn tập tương tác.`
                : 'Mỗi đơn vị kiến thức là một bài giảng E-Learning. Nhấn Xác nhận để hoàn tất đóng gói và xuất file PowerPoint (.pptx).'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-40"
          >
            Quay lại
          </button>

          {isInsufficient ? (
            <button
              onClick={() => {
                onClose();
                if (onOpenRecharge) onOpenRecharge();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-200" />
              <span>Nạp thêm tiền</span>
            </button>
          ) : (
            <button
              onClick={handleActionConfirm}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>
                    {effectiveCost > 0
                      ? `Xác nhận & Trừ ${effectiveCost.toLocaleString('vi-VN')} đ`
                      : 'Xác nhận'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
