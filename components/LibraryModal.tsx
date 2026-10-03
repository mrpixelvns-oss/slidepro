'use client';

import React, { useState } from 'react';
import { FolderKanban, Download, Eye, Clock, Trash2, Plus, HardDrive, FileText, AlertTriangle, X } from 'lucide-react';
import { LectureProject } from '@/types/presentation';
import { exportToPowerPoint } from '@/lib/exportPptx';
import { calculateTotalStorageMb, formatStorageDisplay } from '@/lib/storageUtils';

interface LibraryModalProps {
  projects: LectureProject[];
  onSelectProject: (project: LectureProject) => void;
  onOpenPreview: (project: LectureProject) => void;
  onNewLecture: () => void;
  onDeleteProject?: (projectId: string) => void;
}

export default function LibraryModal({
  projects,
  onSelectProject,
  onOpenPreview,
  onNewLecture,
  onDeleteProject,
}: LibraryModalProps) {
  const [projectToDelete, setProjectToDelete] = useState<LectureProject | null>(null);

  const handleDownload = async (p: LectureProject, e: React.MouseEvent) => {
    e.stopPropagation();
    await exportToPowerPoint(p);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete && onDeleteProject) {
      onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const storage = formatStorageDisplay(calculateTotalStorageMb(projects));

  return (
    <div className="flex-1 p-3.5 sm:p-6 max-w-6xl mx-auto w-full space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <span>Kho bài giảng của tôi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý các bài giảng PDF đã chuyển đổi sang slide và xuất file PowerPoint (.pptx).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="px-3 py-1.5 min-h-[38px] rounded-xl bg-[#0d1424] border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-400">Dung lượng:</span>
            <strong className="text-cyan-300 font-semibold">{storage.usedFormatted}</strong>
            <span className="text-slate-500">/ {storage.totalFormatted}</span>
          </div>

          <button
            onClick={onNewLecture}
            className="flex-1 sm:flex-initial min-h-[38px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài giảng mới</span>
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#0d1424] border border-slate-800 rounded-3xl space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">Chưa có bài giảng nào</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hãy tải lên tài liệu PDF hoặc dùng bài giảng mẫu để bắt đầu tạo slide bài giảng chuyên nghiệp.
          </p>
          <button
            onClick={onNewLecture}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài giảng đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="bg-[#0d1424] border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:shadow-xl group flex flex-col justify-between space-y-3.5"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-400 border border-blue-800/60 font-semibold text-[10px]">
                    {proj.field}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {proj.createdAt}
                    </span>
                    {onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(proj);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:bg-red-950/30 transition-colors"
                        title="Xóa bài giảng giải phóng dung lượng"
                        aria-label="Xóa bài giảng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1.5">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {proj.overview}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-slate-300 font-medium truncate">
                    {proj.slides.length} slide • {proj.quizzes.length} câu hỏi
                  </div>
                  <div className="text-[11px] text-cyan-400/90 font-medium flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-cyan-400/70 shrink-0" />
                    <span>Dung lượng: {proj.fileSize || '3.5 MB'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPreview(proj);
                    }}
                    className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
                    title="Xem trước trình chiếu"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={(e) => handleDownload(proj, e)}
                    className="px-2.5 py-1.5 min-h-[36px] rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600/30 active:bg-blue-600/40 border border-blue-500/30 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    title="Tải tệp PowerPoint (.pptx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PPTX</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-app safe deletion confirmation modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setProjectToDelete(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-1">Xác nhận xóa bài giảng?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bạn có chắc muốn xóa <strong className="text-white">&ldquo;{projectToDelete.title}&rdquo;</strong>? Thao tác này sẽ giải phóng khoảng <span className="text-cyan-300 font-semibold">{projectToDelete.fileSize || '3.5 MB'}</span> dung lượng.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-md shadow-red-600/20"
              >
                Xóa bài giảng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
