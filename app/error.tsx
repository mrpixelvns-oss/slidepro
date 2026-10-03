'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090d18] text-slate-100 flex items-center justify-center p-6">
      <div className="text-center max-w-md space-y-4 bg-[#0d1424] border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Đã xảy ra sự cố</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Ứng dụng gặp lỗi tạm thời trong quá trình xử lý. Vui lòng thử tải lại hoặc liên hệ hỗ trợ.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Thử lại</span>
        </button>
      </div>
    </div>
  );
}
