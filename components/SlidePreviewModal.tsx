'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  RotateCw,
  Download,
  Maximize2
} from 'lucide-react';
import { LectureProject } from '@/types/presentation';
import { exportToPowerPoint } from '@/lib/exportPptx';

interface SlidePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: LectureProject;
}

export default function SlidePreviewModal({
  isOpen,
  onClose,
  project,
}: SlidePreviewModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [rotation, setRotation] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const activeSlide = project.slides[currentSlideIndex] || project.slides[0];
  const totalSlides = project.slides.length;
  const slideDuration = activeSlide?.duration || 45;

  // Audio Speech Synthesis cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    onClose();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Next slide when audio completes
            if (currentSlideIndex < totalSlides - 1) {
              setCurrentSlideIndex((c) => c + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 100 / (slideDuration * 10);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlideIndex, totalSlides, slideDuration]);

  const togglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeSlide.script);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
      if (viVoice) utterance.voice = viVoice;

      utterance.onend = () => {
        if (currentSlideIndex < totalSlides - 1) {
          setCurrentSlideIndex((c) => c + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleDownloadPptx = async () => {
    setIsExporting(true);
    try {
      await exportToPowerPoint(project);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const currentSeconds = Math.round((progress / 100) * slideDuration);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#101729] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header matching Screenshot 8 */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0b101d] gap-2">
          <h2 className="text-xs sm:text-base font-bold text-white tracking-tight truncate">
            Xem trước – {project.title}
          </h2>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1.5 sm:p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Xoay slide"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadPptx}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Đang tạo...' : 'Tải PPTX'}</span>
            </button>

            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Display Canvas */}
        <div className="flex-1 bg-[#0b101b] p-3 sm:p-6 flex items-center justify-center overflow-auto min-h-[240px] sm:min-h-[360px]">
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-in-out',
            }}
            className="w-full max-w-2xl aspect-[16/9] bg-white rounded-xl shadow-2xl p-4 sm:p-8 flex flex-col justify-between text-slate-800 relative select-none"
          >
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between pb-1.5 sm:pb-2 mb-2 sm:mb-3 border-b-2 border-cyan-600">
                <span className="text-[10px] sm:text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                  {project.field}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                  Slide {currentSlideIndex + 1} / {totalSlides}
                </span>
              </div>

              <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 mb-2 sm:mb-4 leading-tight line-clamp-2">
                {activeSlide.title}
              </h3>

              {/* Bullet Points */}
              <div className="space-y-1.5 sm:space-y-2.5">
                {activeSlide.points.slice(0, 3).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-xs bg-cyan-600 shrink-0 mt-1 sm:mt-1.5" />
                    <span className="line-clamp-2">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Footer */}
            <div className="pt-2 sm:pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
              <span className="font-semibold text-slate-600 truncate max-w-[200px]">{project.title}</span>
              <span>SlidePro Education</span>
            </div>
          </div>
        </div>

        {/* Live Narration Script Subtitle bar (shows what voice is saying) */}
        <div className="bg-[#0e1629] px-4 sm:px-6 py-2 border-t border-slate-800/80 text-xs text-slate-300 italic line-clamp-2">
          <strong className="text-amber-400 not-italic mr-1.5">Lời giảng:</strong>
          &ldquo;{activeSlide.script}&rdquo;
        </div>

        {/* Bottom Audio Player Bar matching Screenshot 8 */}
        <div className="p-3 sm:p-4 bg-[#0a0f1d] border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
          {/* Audio Play & Timeline */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full sm:max-w-md">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white flex items-center justify-center shrink-0 shadow-md transition-colors"
              aria-label={isPlaying ? 'Dừng phát' : 'Phát thuyết trình'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <span className="text-[11px] sm:text-xs font-mono text-slate-400 w-16 sm:w-20 shrink-0">
              {formatTime(currentSeconds)} / {formatTime(slideDuration)}
            </span>

            {/* Scrubber Progress Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                setProgress(newProgress);
              }}
              className="flex-1 h-2 bg-slate-800 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all"
            >
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-cyan-500 rounded-full transition-all duration-100"
              />
            </div>

            <Volume2 className="w-4 h-4 text-slate-400 shrink-0 hidden xs:block" />
          </div>

          {/* Slide Navigation Buttons matching Screenshot 8 */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 text-xs w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            <span className="text-slate-300 font-semibold text-xs text-center">
              Slide {currentSlideIndex + 1}/{totalSlides}
            </span>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === totalSlides - 1}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
