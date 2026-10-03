import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090d18] text-slate-100 flex items-center justify-center p-6">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">
          404
        </div>
        <h1 className="text-2xl font-bold text-white">Không tìm thấy trang</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <span>Về trang chủ SlidePro</span>
        </Link>
      </div>
    </div>
  );
}
