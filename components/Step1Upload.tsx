'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileCheck,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { SAMPLE_PROJECTS } from '@/lib/sampleData';
import { LectureProject } from '@/types/presentation';
import { parsePdfFile } from '@/lib/pdfUtils';

interface Step1UploadProps {
  onFileLoaded: (project: LectureProject) => void;
  onProceed: () => void;
  currentProject: LectureProject | null;
}

export default function Step1Upload({
  onFileLoaded,
  onProceed,
  currentProject,
}: Step1UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHowToConvert, setShowHowToConvert] = useState(false);

  // Processing state when user clicks "Bắt đầu xử lý"
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState('');
  const [processProgress, setProcessProgress] = useState(0);

  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string;
    size: string;
  } | null>(
    currentProject
      ? { name: currentProject.fileName, size: currentProject.fileSize }
      : null
  );

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    const mb = file.size / (1024 * 1024);
    const calculatedSize = mb >= 0.1 ? `${mb.toFixed(1)} MB` : `${Math.max(20, Math.round(file.size / 1024))} KB`;

    setSelectedFileMeta({
      name: file.name,
      size: calculatedSize,
    });

    try {
      const parsed = await parsePdfFile(file);

      // Extract text content and calculate total slides
      const totalSlidesCount = parsed.slides.length || parsed.totalPages || 3;
      const defaultQuestionCount = Math.min(Math.max(3, Math.round(totalSlidesCount / 2)), 12);

      // Detect field/domain from file name and text
      const lowerInfo = (file.name + ' ' + (parsed.title || '') + ' ' + (parsed.slides[0]?.text || '')).toLowerCase();
      let detectedField = 'Khoa học & Đào tạo';
      if (/html|css|javascript|web|lập trình|code|react|python|cntt|công nghệ|software|ai|machine learning|tin học/i.test(lowerInfo)) {
        detectedField = 'Công nghệ thông tin & Khoa học dữ liệu';
      } else if (/tim|bệnh|y khoa|sức khoẻ|sức khỏe|dược|y tế|triệu chứng|chẩn đoán|lâm sàng/i.test(lowerInfo)) {
        detectedField = 'Khoa học sự sống & Sức khoẻ';
      } else if (/kinh tế|marketing|quản trị|kinh doanh|tài chính|kế toán|thị trường|doanh nghiệp/i.test(lowerInfo)) {
        detectedField = 'Kinh tế & Quản trị kinh doanh';
      } else if (/toán|vật lý|hóa học|cơ khí|kỹ thuật|điện/i.test(lowerInfo)) {
        detectedField = 'Khoa học tự nhiên & Kỹ thuật';
      } else if (/tiếng anh|ngôn ngữ|english|kỹ năng/i.test(lowerInfo)) {
        detectedField = 'Ngoại ngữ & Kỹ năng mềm';
      }

      // Extract main content for unit
      const combinedText = parsed.slides
        .slice(0, 5)
        .map((s) => s.text)
        .filter(Boolean)
        .join('\n\n• ')
        .slice(0, 800);

      // Create lecture project structure
      const newProject: LectureProject = {
        id: `proj-${Date.now()}`,
        title: parsed.title || file.name.replace(/\.pdf$/i, ''),
        fileName: file.name,
        fileSize: calculatedSize,
        totalPages: totalSlidesCount,
        field: detectedField,
        audience: 'Sinh viên đại học/cao đẳng',
        overview: `Bài giảng trích xuất từ tài liệu "${file.name}", bao gồm ${totalSlidesCount} trang slide với các nội dung cốt lõi và hướng dẫn chi tiết theo chuẩn sư phạm hiện đại.`,
        voice: 'Nữ trẻ',
        voiceSpeed: 1,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        units: [
          {
            id: `unit-${Date.now()}`,
            title: parsed.title || file.name.replace(/\.pdf$/i, ''),
            type: 'theory',
            startSlide: 1,
            endSlide: totalSlidesCount, // Accurately matches total slides (e.g. 15)
            mainContent: combinedText || 'Khái niệm, phân tích và hướng dẫn ứng dụng.',
            questionCount: defaultQuestionCount,
          }
        ],
        slides: parsed.slides.map((s, idx) => {
          const lines = s.text
            ? s.text.split('\n').map((l) => l.trim()).filter((l) => l.length > 3)
            : [];
          const slideTitle = lines[0] || `Slide ${s.pageNumber}: Nội dung bài học`;
          const bulletPoints = lines.slice(1, 5);

          return {
            id: `slide-${idx + 1}`,
            pageNumber: s.pageNumber,
            title: slideTitle.length > 50 ? slideTitle.substring(0, 48) + '...' : slideTitle,
            points: bulletPoints.length > 0 ? bulletPoints : [
              s.text ? s.text.substring(0, 85) : 'Trọng tâm bài giảng phần này.',
              'Phân tích chi tiết các nguyên lý và trường hợp minh họa.',
              'Ứng dụng vào thực tiễn bài tập và kiểm tra.',
            ],
            script: `Xin kính chào quý thầy cô và các bạn. Tại slide số ${s.pageNumber}, chúng ta cùng tập trung vào nội dung: ${s.text ? s.text.substring(0, 110) : 'kiến thức trọng tâm'}. Hãy chú ý các điểm cốt lõi để áp dụng chính xác.`,
            duration: 55,
            wordCount: 145,
            thumbnailUrl: s.thumbnailUrl,
            rotation: 0
          };
        }),
        quizzes: Array.from({ length: defaultQuestionCount }).map((_, qIdx) => ({
          id: `q-${Date.now()}-${qIdx + 1}`,
          question: `Câu hỏi ôn tập ${qIdx + 1}: Trọng tâm của nội dung "${parsed.title || file.name}" trong bài học là gì?`,
          options: [
            'Nắm vững bản chất nguyên lý và ứng dụng thực hành chính xác',
            'Bỏ qua các bước phân tích lý thuyết ban đầu',
            'Chỉ ghi nhớ máy móc mà không cần vận dụng',
            'Không cần tuân thủ quy trình chuẩn'
          ],
          correctIndex: 0,
          explanation: 'Theo cấu trúc bài giảng, việc hiểu sâu lý thuyết gắn liền với thực hành là yêu cầu bắt buộc.'
        }))
      };

      onFileLoaded(newProject);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: LectureProject) => {
    setSelectedFileMeta({
      name: sample.fileName,
      size: sample.fileSize,
    });
    const newInstance: LectureProject = {
      ...sample,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onFileLoaded(newInstance);
  };

  // Trigger processing and load Step 2 when user clicks "Bắt đầu xử lý"
  const handleStartProcessing = () => {
    if (!currentProject || isProcessing) return;
    setIsProcessing(true);
    setProcessProgress(20);
    setProcessStage('Đang đọc cấu trúc các trang slide từ tệp PDF...');

    setTimeout(() => {
      setProcessProgress(55);
      setProcessStage('Hệ thống AI đang phân tích nội dung, trích xuất dàn ý chuyên sâu...');
    }, 500);

    setTimeout(() => {
      setProcessProgress(85);
      setProcessStage('Đang khởi tạo các đơn vị kiến thức và kiểm tra bố cục bài giảng...');
    }, 1000);

    setTimeout(() => {
      setProcessProgress(100);
      setProcessStage('Hoàn tất phân tích! Đang chuyển sang màn hình Duyệt dàn ý...');
    }, 1450);

    setTimeout(() => {
      setIsProcessing(false);
      onProceed();
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-6 max-w-5xl mx-auto w-full relative">
      {/* Top Title Section matching screenshot 1 */}
      <div className="text-center pt-2 sm:pt-4 pb-4 sm:pb-6 space-y-1.5 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
          Tải lên bài giảng PDF
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto px-2">
          Chọn file PDF bài giảng để bắt đầu soạn nội dung, tạo kịch bản thuyết trình và xuất định dạng PowerPoint (.pptx).
        </p>
      </div>

      {/* Main Drag & Drop Card */}
      <div className="max-w-2xl mx-auto w-full space-y-4 sm:space-y-5">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative overflow-hidden active:scale-[0.99] ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : selectedFileMeta
              ? 'border-blue-500/80 bg-blue-950/20'
              : 'border-slate-700/80 bg-[#101729]/70 hover:border-slate-500 hover:bg-[#121b30]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            accept=".pdf"
            className="hidden"
          />

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 sm:mb-4">
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : selectedFileMeta ? (
              <FileCheck className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-200" />
            ) : (
              <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-white mb-1 px-2 break-all line-clamp-2">
            {selectedFileMeta
              ? selectedFileMeta.name
              : 'Kéo và thả file PDF vào đây'}
          </h3>
          <p className="text-xs text-slate-400 mb-3 sm:mb-4">
            {selectedFileMeta
              ? `Kích thước: ${selectedFileMeta.size} • Đã sẵn sàng phân tích`
              : 'hoặc'}
          </p>

          <button
            type="button"
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-colors"
          >
            {selectedFileMeta ? 'Chọn file PDF khác' : 'Chọn file từ thiết bị'}
          </button>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
            <span className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 text-[11px] sm:text-xs font-medium border border-slate-700/60">
              Định dạng PDF
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 text-[11px] sm:text-xs font-medium border border-slate-700/60">
              Tối đa 100 MB
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 text-[11px] sm:text-xs font-medium border border-slate-700/60">
              1 slide = 1 trang
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-[11px] sm:text-xs font-semibold border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              1.000 đ / 1 slide
            </span>
          </div>
        </div>

        {/* Quick Samples */}
        <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hoặc thử nhanh với file mẫu bài giảng:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => handleSelectSample(SAMPLE_PROJECTS[0])}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 active:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors group min-h-[48px]"
            >
              <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                  {SAMPLE_PROJECTS[0].title}
                </div>
                <div className="text-[11px] text-slate-400">
                  {SAMPLE_PROJECTS[0].totalPages} slide (~{(SAMPLE_PROJECTS[0].totalPages * 1000).toLocaleString('vi-VN')} đ) • Y khoa
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelectSample(SAMPLE_PROJECTS[1])}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 active:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors group min-h-[48px]"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                  {SAMPLE_PROJECTS[1].title}
                </div>
                <div className="text-[11px] text-slate-400">
                  {SAMPLE_PROJECTS[1].totalPages} slide (~{(SAMPLE_PROJECTS[1].totalPages * 1000).toLocaleString('vi-VN')} đ) • AI & Tech
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Expandable Accordion Help */}
        <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-[#101729]/50">
          <button
            onClick={() => setShowHowToConvert(!showHowToConvert)}
            className="w-full px-3.5 sm:px-4 py-3 min-h-[44px] flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2 text-left pr-2">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="line-clamp-2">Cách chuyển PowerPoint, Google Slides, Keynote sang PDF</span>
            </div>
            {showHowToConvert ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>

          {showHowToConvert && (
            <div className="px-3.5 sm:px-4 pb-4 pt-1 text-xs text-slate-400 space-y-2 border-t border-slate-800/60 bg-[#0d1322] leading-relaxed">
              <p>
                <strong>• Microsoft PowerPoint:</strong> Vào menu <em>File &gt; Export (hoặc Save As) &gt; Chọn định dạng PDF (*.pdf)</em>.
              </p>
              <p>
                <strong>• Google Slides:</strong> Chọn <em>Tệp &gt; Tải xuống &gt; Tài liệu PDF (.pdf)</em>.
              </p>
              <p>
                <strong>• Apple Keynote:</strong> Chọn <em>File &gt; Export To &gt; PDF...</em>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar matching screenshot 1 */}
      <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-400 truncate">
          {selectedFileMeta ? (
            <span className="text-emerald-400 font-medium flex items-center gap-1.5 truncate">
              <FileCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Đã chọn: {selectedFileMeta.name} ({selectedFileMeta.size})</span>
            </span>
          ) : (
            'Chọn một file để tiếp tục.'
          )}
        </div>

        <button
          onClick={handleStartProcessing}
          disabled={!currentProject || isLoading || isProcessing}
          className={`min-h-[44px] px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            currentProject && !isLoading && !isProcessing
              ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-500/25 cursor-pointer hover:scale-[1.02]'
              : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-800'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
              <span>Đang phân tích & bóc tách...</span>
            </>
          ) : (
            <>
              <span>Bắt đầu xử lý</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Processing Overlay Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#111827] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
              <Cpu className="w-8 h-8 animate-pulse text-cyan-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Đang xử lý tệp bài giảng PDF
              </h3>
              <p className="text-xs text-cyan-300 font-medium h-6 flex items-center justify-center">
                {processStage}
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  style={{ width: `${processProgress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Phân tích trang bài giảng</span>
                <span className="font-semibold text-cyan-400">{processProgress}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Tự động nhận diện cấu trúc, slide & tạo dàn ý bài giảng</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
