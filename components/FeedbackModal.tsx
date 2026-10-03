'use client';

import React, { useState } from 'react';
import { X, MessageSquareHeart, CheckCircle2, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [content, setContent] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setContent('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Góp ý phát triển SlidePro</h2>
            <p className="text-xs text-slate-400">Chia sẻ trải nghiệm của bạn để chúng tôi nâng cấp tính năng</p>
          </div>
        </div>

        {isSent ? (
          <div className="py-8 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Cảm ơn bạn đã đóng góp ý kiến!</h3>
            <p className="text-xs text-slate-400">Đội ngũ kỹ thuật SlidePro sẽ xem xét để cải thiện bài giảng tốt hơn.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Ý kiến đóng góp của bạn</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ví dụ: Cần bổ sung thêm kiểu giao diện PowerPoint y tế, hỗ trợ xuất hình ảnh độ phân giải cao..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi góp ý</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
