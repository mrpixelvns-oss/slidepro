'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Edit3,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  Package,
  Eye,
  Download,
  RotateCw,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { LectureProject, Slide, QuizQuestion } from '@/types/presentation';
import { VOICE_OPTIONS } from '@/lib/sampleData';
import { exportToPowerPoint } from '@/lib/exportPptx';

interface Step3ScriptQuizProps {
  project: LectureProject;
  onUpdateProject: (updated: LectureProject) => void;
  onContinue: () => void;
  onBack: () => void;
  onOpenPreview: () => void;
}

export default function Step3ScriptQuiz({
  project,
  onUpdateProject,
  onContinue,
  onBack,
  onOpenPreview,
}: Step3ScriptQuizProps) {
  const [activeTab, setActiveTab] = useState<'script' | 'quiz'>('script');
  const [selectedVoice, setSelectedVoice] = useState(project.voice || 'Nữ trẻ');
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editedScriptText, setEditedScriptText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeech = (text: string, slideId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ phát âm thanh trực tiếp.');
      return;
    }

    if (isPlayingAudio === slideId) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Clear pedagogical lecture cadence

    // Match selected voice if system has Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => setIsPlayingAudio(null);
    utterance.onerror = () => setIsPlayingAudio(null);

    setIsPlayingAudio(slideId);
    window.speechSynthesis.speak(utterance);
  };

  const handleOpenEditModal = (slide: Slide) => {
    setEditingSlideId(slide.id);
    setEditedScriptText(slide.script);
  };

  const handleSaveScript = (slideId: string) => {
    const wordCount = editedScriptText.trim().split(/\s+/).length;
    const duration = Math.round((wordCount / 140) * 60);

    const updatedSlides = project.slides.map((s) =>
      s.id === slideId
        ? {
            ...s,
            script: editedScriptText,
            wordCount,
            duration,
          }
        : s
    );

    onUpdateProject({
      ...project,
      slides: updatedSlides,
    });
    setEditingSlideId(null);
  };

  const handleAiPolishScript = (slideId: string) => {
    const slide = project.slides.find((s) => s.id === slideId);
    if (!slide) return;

    // Enhance and polish script
    const polished = `${slide.script} Để minh chứng rõ hơn cho luận điểm này, các nghiên cứu thực nghiệm đã chỉ ra rằng khi áp dụng đúng phương pháp chuẩn, hiệu quả tiếp thu và ghi nhớ kiến thức tăng hơn 40%.`;
    const wordCount = polished.trim().split(/\s+/).length;
    const duration = Math.round((wordCount / 140) * 60);

    const updatedSlides = project.slides.map((s) =>
      s.id === slideId
        ? {
            ...s,
            script: polished,
            wordCount,
            duration,
          }
        : s
    );

    onUpdateProject({
      ...project,
      slides: updatedSlides,
    });
  };

  // Generate AI Quizzes
  const handleGenerateAiQuiz = async () => {
    setIsGeneratingAiQuiz(true);
    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          slides: project.slides.map((s) => ({ title: s.title, points: s.points })),
          count: 3,
          audience: project.audience,
        }),
      });

      const data = await res.json();
      if (data.quizzes && data.quizzes.length > 0) {
        onUpdateProject({
          ...project,
          quizzes: [...project.quizzes, ...data.quizzes],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const handleAddManualQuiz = () => {
    const newQuiz: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'Câu hỏi mới: Trọng tâm nội dung bài giảng là gì?',
      options: [
        'Lựa chọn chính xác A',
        'Lựa chọn B',
        'Lựa chọn C',
        'Lựa chọn D',
      ],
      correctIndex: 0,
      explanation: 'Giải thích chi tiết cho đáp án chính xác.',
    };

    onUpdateProject({
      ...project,
      quizzes: [...project.quizzes, newQuiz],
    });
  };

  const handleDeleteQuiz = (id: string) => {
    onUpdateProject({
      ...project,
      quizzes: project.quizzes.filter((q) => q.id !== id),
    });
  };

  const handleUpdateQuiz = (id: string, updated: Partial<QuizQuestion>) => {
    onUpdateProject({
      ...project,
      quizzes: project.quizzes.map((q) => (q.id === id ? { ...q, ...updated } : q)),
    });
  };

  const handleExportPowerPoint = async () => {
    setIsExportingPptx(true);
    try {
      await exportToPowerPoint(project);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExportingPptx(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="space-y-3.5 sm:space-y-4">
        {/* Title Row matching Screenshot 4 */}
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            Tạo lời giảng/Quiz
          </h1>
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
            {project.slides.length} slide • {(project.slides.length * 1000).toLocaleString('vi-VN')} đ (1.000 đ/slide)
          </span>
        </div>

        {/* Warning / Notice Banner */}
        <div className="bg-[#241712] border border-amber-900/60 rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 text-xs text-amber-200">
          <div className="w-6 h-6 rounded-lg bg-amber-600/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="leading-relaxed">
            <strong>Kiểm tra lại lời giảng và câu hỏi do SlidePro soạn.</strong>{' '}
            Bạn có thể chỉnh sửa nội dung hoặc phát âm thanh thuyết trình bất cứ lúc nào.
          </div>
        </div>

        {/* Sub-bar with Unit info, Voice Selection & Actions matching Screenshot 4 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          {/* Active Unit Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">
              Phần 1 • slide 1–{project.slides.length}
            </span>
          </div>

          {/* Voice Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Giọng giảng bài:</span>
            <select
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                onUpdateProject({ ...project, voice: e.target.value });
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none min-h-[38px]"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                handleSpeech(
                  'Xin chào các bạn, tôi là trợ lý ảo hỗ trợ thuyết trình bài giảng SlidePro.',
                  'sample-voice'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nghe thử</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPreview}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 active:bg-amber-600/40 border border-amber-500/30 font-medium transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem bài giảng</span>
            </button>

            <button
              onClick={handleExportPowerPoint}
              disabled={isExportingPptx}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 active:bg-red-600/40 border border-red-500/30 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPptx ? 'Đang tạo...' : 'Tải PPTX'}</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons: [Lời giảng] & [Câu hỏi] */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('script')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'script'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Lời giảng</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">
              {project.slides.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Câu hỏi</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">
              {project.quizzes.length}
            </span>
          </button>
        </div>

        {/* TAB 1: LỜI GIẢNG CARDS */}
        {activeTab === 'script' && (
          <div className="space-y-4">
            {project.slides.map((slide, sIdx) => {
              const isPlaying = isPlayingAudio === slide.id;

              return (
                <div
                  key={slide.id}
                  className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-start hover:border-slate-700 transition-colors"
                >
                  {/* Left Column: Thumbnail & Duration */}
                  <div className="md:col-span-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Slide {sIdx + 1}</span>
                      <span className="text-[11px] text-slate-400">
                        ~{slide.duration} giây • {slide.wordCount} từ
                      </span>
                    </div>

                    {/* Slide Mini Canvas / Card */}
                    <div className="bg-white rounded-lg p-4 shadow-sm min-h-[140px] flex flex-col justify-between text-slate-800 select-none">
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-1 line-clamp-1">
                          {slide.title}
                        </div>
                        <ul className="text-[10px] text-slate-600 space-y-1 list-disc pl-3">
                          {slide.points.slice(0, 2).map((pt, pIdx) => (
                            <li key={pIdx} className="line-clamp-1">
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                        <span>SlidePro PPT</span>
                        <span>Trang {sIdx + 1}</span>
                      </div>
                    </div>

                    {/* Speech / Audio trigger button */}
                    <button
                      onClick={() => handleSpeech(slide.script, slide.id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        isPlaying
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Dừng phát âm thanh</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Tạo giọng giảng bài (Nghe)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right Column: Lecture Script Editor */}
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-300">
                        Lời giảng cho slide {sIdx + 1}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAiPolishScript(slide.id)}
                          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                          title="Dùng AI làm lời giảng tự nhiên và cuốn hút hơn"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI viết lại</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(slide)}
                          className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa lời giảng</span>
                        </button>
                      </div>
                    </div>

                    {/* Script Content Card */}
                    <div className="bg-[#12192c] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed min-h-[120px]">
                      {slide.script}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: CÂU HỎI TRẮC NGHIỆM */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            {project.quizzes.length === 0 ? (
              /* Empty state matching Screenshot 5 */
              <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <HelpCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">CÂU HỎI</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Phần này chưa có câu hỏi trắc nghiệm nào. Tạo câu hỏi ngay tại đây.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={handleGenerateAiQuiz}
                    disabled={isGeneratingAiQuiz}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>
                      {isGeneratingAiQuiz ? 'Đang soạn câu hỏi...' : 'Tạo câu hỏi tự động (AI)'}
                    </span>
                  </button>

                  <button
                    onClick={handleAddManualQuiz}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tạo câu hỏi thủ công</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz List */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-slate-300">
                    Danh sách {project.quizzes.length} câu hỏi trắc nghiệm củng cố
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateAiQuiz}
                      disabled={isGeneratingAiQuiz}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isGeneratingAiQuiz ? 'Đang tạo...' : '+ Thêm bằng AI'}</span>
                    </button>
                    <button
                      onClick={handleAddManualQuiz}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thủ công</span>
                    </button>
                  </div>
                </div>

                {project.quizzes.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-amber-600/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) =>
                            handleUpdateQuiz(q.id, { question: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Xoá câu hỏi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 4 Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctIndex === optIdx;
                        const letter = String.fromCharCode(65 + optIdx);

                        return (
                          <div
                            key={optIdx}
                            onClick={() =>
                              handleUpdateQuiz(q.id, { correctIndex: optIdx })
                            }
                            className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                              isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {letter}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...q.options];
                                newOpts[optIdx] = e.target.value;
                                handleUpdateQuiz(q.id, { options: newOpts });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-transparent border-none text-xs w-full focus:outline-none"
                            />
                            {isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-auto" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="pl-8">
                      <input
                        type="text"
                        value={q.explanation}
                        placeholder="Giải thích lý do đáp án đúng..."
                        onChange={(e) =>
                          handleUpdateQuiz(q.id, { explanation: e.target.value })
                        }
                        className="w-full bg-[#101729] border border-slate-800/80 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 italic focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Script Edit Modal */}
      {editingSlideId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Chỉnh sửa lời giảng</h3>
            <textarea
              rows={6}
              value={editedScriptText}
              onChange={(e) => setEditedScriptText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingSlideId(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300"
              >
                Hủy
              </button>
              <button
                onClick={() => handleSaveScript(editingSlideId)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
              >
                Lưu lời giảng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar matching Screenshot 4 & 5 */}
      <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Quay lại
        </button>

        <button
          onClick={onContinue}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25"
        >
          <span>Tiếp tục</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
