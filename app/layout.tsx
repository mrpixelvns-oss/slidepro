import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SlidePro - Tạo Slide Bài Giảng từ PDF',
  description: 'Ứng dụng thông minh chuyển đổi tài liệu PDF thành bài giảng slide sinh động, tự động phân tích dàn ý, tạo kịch bản thuyết trình và xuất định dạng PowerPoint (.pptx) chuẩn xác.',
  openGraph: {
    title: 'SlidePro - Tạo Slide Bài Giảng từ PDF',
    description: 'Ứng dụng thông minh chuyển đổi tài liệu PDF thành bài giảng slide sinh động, tự động phân tích dàn ý, tạo kịch bản thuyết trình và xuất định dạng PowerPoint (.pptx) chuẩn xác.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SlidePro - Tạo Slide Bài Giảng từ PDF',
    description: 'Ứng dụng thông minh chuyển đổi tài liệu PDF thành bài giảng slide sinh động, tự động phân tích dàn ý, tạo kịch bản thuyết trình và xuất định dạng PowerPoint (.pptx) chuẩn xác.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#0b101b] text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
