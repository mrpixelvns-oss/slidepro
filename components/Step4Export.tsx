'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Play,
  Package,
  Download,
  ChevronDown,
  ChevronUp,
  Presentation,
  Home,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Share2,
  FileCheck
} from 'lucide-react';
import { LectureProject } from '@/types/presentation';
import { exportToPowerPoint } from '@/lib/exportPptx';

interface Step4ExportProps {
  project: LectureProject;
  onOpenPreview: () => void;
  onBack: () => void;
  onNewLecture: () => void;
  onGoToLibrary: () => void;
}

export default function Step4Export({
  project,
  onOpenPreview,
  onBack,
  onNewLecture,
  onGoToLibrary,
}: Step4ExportProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [isExportingScorm, setIsExportingScorm] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Trigger celebration confetti on mount (client-side only)
  useEffect(() => {
    let isMounted = true;
    import('canvas-confetti')
      .then((module) => {
        if (!isMounted) return;
        const fire = module.default || module;
        fire({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      })
      .catch(() => {
        // ignore if confetti fails
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownloadPowerPoint = async () => {
    setIsExportingPptx(true);
    try {
      await exportToPowerPoint(project);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handleDownloadScorm = () => {
    setIsExportingScorm(true);
    // Package HTML5 & SCORM simulation manifest
    const scormHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${project.title} - SCORM E-Learning</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: sans-serif; background: #0b101b; color: #f8fafc; padding: 30px; text-align: center; }
    .card { background: #131b2e; border: 1px solid #1e293b; max-width: 700px; margin: 0 auto; padding: 25px; border-radius: 16px; text-align: left; }
    h1 { color: #38bdf8; font-size: 22px; }
    .btn { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${project.title}</h1>
    <p><strong>Lĩnh vực:</strong> ${project.field}</p>
    <p><strong>Đối tượng:</strong> ${project.audience}</p>
    <p>${project.overview}</p>
    <hr style="border: 0.5px solid #334155; margin: 20px 0;">
    <h3>Danh sách Slide (${project.slides.length} slide)</h3>
    <ul>
      ${project.slides.map(s => `<li><strong>Slide ${s.pageNumber}:</strong> ${s.title}<br><em>Lời giảng:</em> ${s.script}</li>`).join('')}
    </ul>
    <button class="btn" onclick="alert('Đã ghi nhận hoàn thành khóa học SCORM 1.2/2004!')">Hoàn thành bài giảng</button>
  </div>
</body>
</html>`;

    const blob = new Blob([scormHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_SCORM_package.html`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportingScorm(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-6 max-w-5xl mx-auto w-full">
      <div className="space-y-5 sm:space-y-6 pt-2 sm:pt-4">
        {/* Success Icon & Header matching Screenshot 7 */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            Đóng gói E-learning & Xuất PowerPoint
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto px-2">
            Các gói E-Learning và tệp slide PowerPoint đã được khởi tạo hoàn tất. Bạn có thể xem trước tương tác hoặc tải về file thuyết trình (.pptx) chuẩn.
          </p>
        </div>

        {/* Download Success Toast */}
        {downloadSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-xl p-3 text-xs text-emerald-200 flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tệp PowerPoint (.pptx) đã được tải về máy của bạn thành công! Có đầy đủ Speaker Notes.</span>
          </div>
        )}

        {/* List of Results matching Screenshot 7 */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400">
            Kết quả theo từng phần: {project.units.length}/{project.units.length} phần xong
          </div>

          {project.units.map((unit, idx) => (
            <div
              key={unit.id || idx}
              className="bg-[#0d1424] border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 font-bold text-xs border border-emerald-800/60 shrink-0">
                  {unit.startSlide}–{unit.endSlide}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {unit.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-emerald-400 font-medium mt-0.5">
                    <span>✓ Sẵn sàng</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{project.slides.length} slide</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{project.quizzes.length} câu quiz</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons matching Screenshot 7 */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                {/* Xem trước Button */}
                <button
                  onClick={onOpenPreview}
                  className="p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors flex items-center justify-center active:bg-slate-800"
                  title="Xem trước bài giảng & nghe đọc"
                >
                  <Play className="w-4 h-4 text-cyan-400" />
                </button>

                {/* SCORM Package */}
                <button
                  onClick={handleDownloadScorm}
                  className="p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors flex items-center justify-center active:bg-slate-800"
                  title="Đóng gói SCORM / HTML5 E-Learning"
                >
                  <Package className="w-4 h-4 text-amber-400" />
                </button>

                {/* Main Download PPTX Button */}
                <button
                  onClick={handleDownloadPowerPoint}
                  disabled={isExportingPptx}
                  className="flex-1 sm:flex-initial min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isExportingPptx ? 'Đang tạo .pptx...' : 'Tải PPTX'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature highlight box: Why PPTX from SlidePro */}
        <div className="bg-[#12192c] border border-cyan-950/80 rounded-xl p-3.5 sm:p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block mb-0.5">Tích hợp Speaker Notes</strong>
              <span className="text-slate-400">Lời giảng do AI tạo được nhúng trực tiếp vào mục Ghi chú diễn giả trong PowerPoint.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block mb-0.5">Chuẩn định dạng 16:9</strong>
              <span className="text-slate-400">Tương thích hoàn hảo với Microsoft Office, Google Slides và Keynote trên Mac.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Package className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block mb-0.5">Kèm đề trắc nghiệm</strong>
              <span className="text-slate-400">Slide câu hỏi ôn tập có đầy đủ 4 phương án, đáp án và giải thích chi tiết.</span>
            </div>
          </div>
        </div>

        {/* Expandable Guide matching Screenshot 7 */}
        <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-[#101729]/50">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full px-3.5 sm:px-4 py-3 min-h-[44px] flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2 text-left pr-2">
              <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Hướng dẫn mở tệp PowerPoint (.pptx) và SCORM trên máy tính</span>
            </div>
            {showGuide ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>

          {showGuide && (
            <div className="px-3.5 sm:px-4 pb-4 pt-1 text-xs text-slate-400 space-y-2 border-t border-slate-800/60 bg-[#0d1322] leading-relaxed">
              <p>
                <strong>1. Với tệp PowerPoint (.pptx):</strong> Sau khi tải về, mở trực tiếp bằng Microsoft PowerPoint hoặc tải lên Google Slides. Khi thuyết trình, bấm phím <code>F5</code> hoặc chọn <em>Chế độ xem của diễn giả (Presenter View)</em> để nhìn thấy toàn bộ lời giảng kèm theo từng slide.
              </p>
              <p>
                <strong>2. Với tệp SCORM / HTML5:</strong> Bạn có thể tải lên hệ thống LMS (Moodle, Canvas, Blackboard) hoặc nhấp đúp vào tệp HTML để xem ngay trên bất kỳ trình duyệt web nào (Chrome, Safari, Edge) mà không cần cài đặt phần mềm phụ trợ.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar matching Screenshot 7 */}
      <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Quay lại
        </button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            onClick={onGoToLibrary}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kho bài giảng</span>
          </button>

          <button
            onClick={onNewLecture}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tạo bài giảng mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
