'use client';

import React, { useState } from 'react';
import {
  RotateCw,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import {
  LectureProject,
  KnowledgeUnit,
  Slide
} from '@/types/presentation';
import {
  LECTURE_FIELDS,
  LEARNER_AUDIENCES,
  LECTURE_TYPES
} from '@/lib/sampleData';

interface Step2OutlineProps {
  project: LectureProject;
  onUpdateProject: (updated: LectureProject) => void;
  onContinue: () => void;
  onOpenRecharge: () => void;
  balance?: number;
}

export default function Step2Outline({
  project,
  onUpdateProject,
  onContinue,
  onOpenRecharge,
  balance = 20000,
}: Step2OutlineProps) {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState<'units' | 'edit' | 'preview'>('edit');
  const [rotationDegrees, setRotationDegrees] = useState<Record<number, number>>({
    0: 0,
    1: 0,
    2: 0,
  });

  const currentUnit = project.units[selectedUnitIndex] || project.units[0];
  const activeSlide = project.slides[previewSlideIndex] || project.slides[0];

  // Accurately compute total question count across all knowledge units
  const totalQuestionCount = project.units.reduce(
    (sum, u) => sum + (Number(u.questionCount) || 0),
    0
  ) || project.quizzes.length;

  const handleRotate = () => {
    setRotationDegrees((prev) => ({
      ...prev,
      [previewSlideIndex]: ((prev[previewSlideIndex] || 0) + 90) % 360,
    }));
  };

  const handleUpdateUnit = (field: keyof KnowledgeUnit, value: any) => {
    const updatedUnits = [...project.units];
    updatedUnits[selectedUnitIndex] = {
      ...updatedUnits[selectedUnitIndex],
      [field]: value,
    };
    onUpdateProject({
      ...project,
      units: updatedUnits,
    });
  };

  const handleAddUnit = () => {
    const newUnit: KnowledgeUnit = {
      id: `unit-${Date.now()}`,
      title: `Chuyên đề ${project.units.length + 1}: Mở rộng kiến thức`,
      type: 'theory',
      startSlide: 1,
      endSlide: project.slides.length || project.totalPages || 3,
      mainContent: '- Nội dung mở rộng phân tích chuyên sâu\n- Các trường hợp ứng dụng thực tế',
      questionCount: 2,
    };
    onUpdateProject({
      ...project,
      units: [...project.units, newUnit],
    });
    setSelectedUnitIndex(project.units.length);
    setMobileTab('edit');
  };

  const handleDeleteUnit = (index: number) => {
    if (project.units.length <= 1) return;
    const updated = project.units.filter((_, i) => i !== index);
    onUpdateProject({
      ...project,
      units: updated,
    });
    setSelectedUnitIndex(Math.max(0, index - 1));
  };

  const currentRotation = rotationDegrees[previewSlideIndex] || 0;

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="space-y-4 sm:space-y-5">
        {/* Title & Overview Banner matching Screenshot 2 */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Duyệt dàn ý
          </h1>
          <div className="bg-[#121a2d] border border-slate-800 rounded-xl p-3 sm:p-3.5 text-xs text-slate-300">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Tổng quan
            </span>
            <p className="leading-relaxed text-slate-200">
              {project.overview}
            </p>
          </div>
        </div>

        {/* Thông tin bài giảng Bar */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-500">
            <span>Thông tin bài giảng</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Lĩnh vực */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">LĨNH VỰC</span>
              <select
                value={project.field}
                onChange={(e) =>
                  onUpdateProject({ ...project, field: e.target.value })
                }
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
              >
                {LECTURE_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Đối tượng người học */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">ĐỐI TƯỢNG NGƯỜI HỌC</span>
              <select
                value={project.audience}
                onChange={(e) =>
                  onUpdateProject({ ...project, audience: e.target.value })
                }
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
              >
                {LEARNER_AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Tổng câu hỏi - dynamically calculated */}
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Tổng {totalQuestionCount} câu hỏi trắc nghiệm</span>
            </div>
          </div>
        </div>

        {/* Mobile View Switcher (< lg) */}
        <div className="lg:hidden flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
          <button
            onClick={() => setMobileTab('units')}
            className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[40px] ${
              mobileTab === 'units'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>Đơn vị ({project.units.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('edit')}
            className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[40px] ${
              mobileTab === 'edit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Soạn chi tiết</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[40px] ${
              mobileTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 shrink-0" />
            <span>Xem slide</span>
          </button>
        </div>

        {/* 3-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Đơn vị kiến thức list (width 3 cols) */}
          <div className={`${mobileTab === 'units' ? 'block' : 'hidden'} lg:block lg:col-span-3 bg-[#0d1424] border border-slate-800 rounded-xl p-3 space-y-2`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5" />
                <span>{project.units.length} Đơn vị kiến thức</span>
              </div>
              <button
                onClick={handleAddUnit}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-slate-800"
                title="Thêm đơn vị mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {project.units.map((unit, idx) => (
                <div
                  key={unit.id || idx}
                  onClick={() => {
                    setSelectedUnitIndex(idx);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setMobileTab('edit');
                    }
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all border text-left min-h-[50px] ${
                    selectedUnitIndex === idx
                      ? 'bg-blue-950/40 border-blue-500/70 text-white shadow-sm ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold line-clamp-1">
                      {idx + 1}. {unit.title}
                    </span>
                    {project.units.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUnit(idx);
                        }}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1 min-h-[32px] min-w-[32px] flex items-center justify-center rounded"
                        title="Xoá phần này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Slide {unit.startSlide}–{unit.endSlide || project.slides.length || project.totalPages}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Edit Form for Current Unit (width 4 cols) */}
          <div className={`${mobileTab === 'edit' ? 'block' : 'hidden'} lg:block lg:col-span-4 bg-[#0d1424] border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-semibold text-slate-200">
                <span className="text-amber-500">Đơn vị kiến thức:</span> Đơn vị{' '}
                {selectedUnitIndex + 1}/{project.units.length} • slide{' '}
                {currentUnit?.startSlide || 1}–{currentUnit?.endSlide || project.slides.length || project.totalPages}
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  disabled={selectedUnitIndex === 0}
                  onClick={() => setSelectedUnitIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:text-white hover:bg-slate-800 disabled:opacity-30"
                  aria-label="Phần trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={selectedUnitIndex === project.units.length - 1}
                  onClick={() =>
                    setSelectedUnitIndex((prev) =>
                      Math.min(project.units.length - 1, prev + 1)
                    )
                  }
                  className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:text-white hover:bg-slate-800 disabled:opacity-30"
                  aria-label="Phần tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Field: Tiêu đề */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Tiêu đề</label>
              <input
                type="text"
                value={currentUnit?.title || ''}
                onChange={(e) => handleUpdateUnit('title', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Field: Loại */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Loại</label>
              <select
                value={currentUnit?.type || 'theory'}
                onChange={(e) => handleUpdateUnit('type', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {LECTURE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fields: Slide bắt đầu & kết thúc */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Slide bắt đầu
                </label>
                <input
                  type="number"
                  min={1}
                  max={project.slides.length || project.totalPages}
                  value={currentUnit?.startSlide || 1}
                  onChange={(e) =>
                    handleUpdateUnit('startSlide', parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Slide kết thúc
                </label>
                <input
                  type="number"
                  min={1}
                  max={project.slides.length || project.totalPages || 50}
                  value={currentUnit?.endSlide ?? (project.slides.length || project.totalPages || 1)}
                  onChange={(e) =>
                    handleUpdateUnit('endSlide', parseInt(e.target.value) || project.slides.length)
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Field: Nội dung chính */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                Nội dung chính
              </label>
              <textarea
                rows={5}
                value={currentUnit?.mainContent || ''}
                onChange={(e) => handleUpdateUnit('mainContent', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
              />
            </div>

            {/* Field: Số câu hỏi */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
                <span>Số câu hỏi</span>
                <span className="text-[11px] text-cyan-400">Tự động đồng bộ đề thi</span>
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={currentUnit?.questionCount ?? 3}
                onChange={(e) =>
                  handleUpdateUnit('questionCount', Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Column 3: Slide Preview & Rotation Tool (width 5 cols) */}
          <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex-col justify-between min-h-[440px]`}>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                  {previewSlideIndex + 1}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Slide {previewSlideIndex + 1}/{project.slides.length}
                </span>
              </div>

              {/* ROTATE BUTTON */}
              <button
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                title="Xoay slide 90 độ"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Xoay ({currentRotation}°)</span>
              </button>
            </div>

            {/* Slide Viewer Canvas */}
            <div className="my-3 sm:my-4 bg-white rounded-lg p-3 sm:p-4 shadow-inner flex items-center justify-center min-h-[260px] sm:min-h-[290px] max-h-[380px] overflow-hidden relative">
              <div
                style={{
                  transform: `rotate(${currentRotation}deg)`,
                  transition: 'transform 0.3s ease-in-out',
                }}
                className="w-full h-full flex flex-col justify-center items-center text-slate-800 p-2 text-center select-none"
              >
                {activeSlide?.thumbnailUrl ? (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeSlide.thumbnailUrl}
                      alt={`Slide ${previewSlideIndex + 1}`}
                      className="max-h-[300px] max-w-full object-contain mx-auto rounded shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 py-2 w-full flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-2 line-clamp-2">
                        {activeSlide?.title || `Slide ${previewSlideIndex + 1}`}
                      </div>
                      <div className="text-left text-xs space-y-1.5 px-2 sm:px-3 text-slate-700">
                        {activeSlide?.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-1.5">
                            <span className="text-cyan-700 font-bold">•</span>
                            <span className="line-clamp-2">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 flex justify-between">
                      <span>SlidePro Slide View</span>
                      <span>Trang {previewSlideIndex + 1}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail pagination selector buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 border-t border-slate-800 max-h-24 overflow-y-auto">
              {project.slides.map((_, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setPreviewSlideIndex(sIdx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    previewSlideIndex === sIdx
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 active:bg-slate-600'
                  }`}
                >
                  {sIdx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar matching Screenshot 2 */}
      {(() => {
        const totalSlides = project.slides.length || project.totalPages || 1;
        const slideCost = totalSlides * 1000;
        const isInsufficient = balance < slideCost;
        const shortage = Math.max(0, slideCost - balance);

        return (
          <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">
                  Chi phí bài giảng ({totalSlides} slide x 1.000 đ):
                </span>
                <strong className="text-amber-400 text-sm">{slideCost.toLocaleString('vi-VN')} đ</strong>
              </div>

              {/* Balance Alert Box */}
              {isInsufficient ? (
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300">
                  <span className="text-[11px] sm:text-xs leading-tight">
                    Số dư không đủ ({balance.toLocaleString('vi-VN')} đ). Cần nạp thêm {shortage.toLocaleString('vi-VN')} đ
                  </span>
                  <button
                    onClick={onOpenRecharge}
                    className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0 min-h-[30px]"
                  >
                    <CreditCard className="w-3 h-3" />
                    Nạp tiền
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Số dư khả dụng: <strong>{balance.toLocaleString('vi-VN')} đ</strong> (Đủ điều kiện)</span>
                </div>
              )}
            </div>

            <button
              onClick={isInsufficient ? onOpenRecharge : onContinue}
              className={`min-h-[44px] px-6 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isInsufficient
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25'
                  : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-500/25'
              }`}
            >
              {isInsufficient ? (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Nạp thêm {shortage.toLocaleString('vi-VN')} đ</span>
                </>
              ) : (
                <>
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        );
      })()}
    </div>
  );
}
