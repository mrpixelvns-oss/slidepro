import { LectureProject } from '@/types/presentation';

// Total quota capacity for demo tier: 1 GB (1024 MB)
export const TOTAL_STORAGE_CAPACITY_MB = 1024;

// Base platform system overhead (slide themes, font bundles, voice speech cache): 4.8 MB
export const BASE_SYSTEM_STORAGE_MB = 4.8;

/**
 * Parses file size string (e.g. '4.2 MB', '850 KB', '1.2 GB') to megabytes (MB)
 */
export function parseProjectSizeMb(fileSize?: string, slideCount: number = 3): number {
  if (!fileSize) {
    return Math.max(1.2, +(slideCount * 0.35).toFixed(1));
  }
  const clean = fileSize.trim();
  const match = clean.match(/^([\d.]+)\s*(MB|KB|GB)?/i);
  if (!match) {
    return Math.max(1.2, +(slideCount * 0.35).toFixed(1));
  }
  const val = parseFloat(match[1]);
  if (isNaN(val)) return 3.5;
  const unit = (match[2] || 'MB').toUpperCase();
  if (unit === 'KB') return +(val / 1024).toFixed(2);
  if (unit === 'GB') return +(val * 1024).toFixed(1);
  return +val.toFixed(1); // MB
}

/**
 * Calculates total storage used in MB across all saved lecture projects
 */
export function calculateTotalStorageMb(projects: LectureProject[]): number {
  const projectsTotal = (projects || []).reduce((acc, p) => {
    return acc + parseProjectSizeMb(p.fileSize, p.slides?.length || p.totalPages || 3);
  }, 0);
  return +(BASE_SYSTEM_STORAGE_MB + projectsTotal).toFixed(1);
}

/**
 * Formats storage info for UI display with animated percentage
 */
export function formatStorageDisplay(
  usedMb: number,
  totalMb: number = TOTAL_STORAGE_CAPACITY_MB
): {
  usedFormatted: string;
  totalFormatted: string;
  percentage: number;
} {
  const usedFormatted = usedMb >= 1024 ? `${(usedMb / 1024).toFixed(1)} GB` : `${usedMb} MB`;
  const totalFormatted = totalMb >= 1024 ? `${(totalMb / 1024).toFixed(0)} GB` : `${totalMb} MB`;
  // Guarantee a minimum visible sliver (1.5%) and cap at 100%
  const percentage = Math.min(100, Math.max(1.5, +((usedMb / totalMb) * 100).toFixed(2)));
  return { usedFormatted, totalFormatted, percentage };
}
