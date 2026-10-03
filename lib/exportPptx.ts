import { LectureProject } from '@/types/presentation';

export async function exportToPowerPoint(project: LectureProject): Promise<void> {
  // Dynamically import pptxgenjs on client side
  const PptxGenJSModule = await import('pptxgenjs');
  // Handle default or named export
  const PptxGen = PptxGenJSModule.default || PptxGenJSModule;
  const pptx = new PptxGen();

  // 16:9 Widescreen Layout
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = project.title;
  pptx.subject = project.overview;
  pptx.author = 'SlidePro AI';
  pptx.company = 'SlidePro Education';

  // Define Theme Colors
  const COLOR_BG_DARK = '0F172A'; // Slate 900
  const COLOR_PRIMARY = '0284C7'; // Cyan 600
  const COLOR_ACCENT = '38BDF8'; // Sky 400
  const COLOR_TEXT_LIGHT = 'F8FAFC'; // Slate 50
  const COLOR_TEXT_MUTED = '94A3B8'; // Slate 400
  const COLOR_CARD_BG = '1E293B'; // Slate 800
  const COLOR_ACCENT_ORANGE = 'F97316'; // Orange 500

  // ================= 1. COVER SLIDE =================
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: COLOR_BG_DARK };

  // Decorative header band
  coverSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.15,
    fill: { color: COLOR_PRIMARY },
    line: { color: COLOR_PRIMARY }
  });

  // Category / Field Tag
  coverSlide.addText(project.field.toUpperCase(), {
    x: 1.0,
    y: 1.5,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Arial',
    color: COLOR_ACCENT,
    bold: true,
    charSpacing: 2
  });

  // Main Title
  coverSlide.addText(project.title, {
    x: 1.0,
    y: 2.0,
    w: 11.3,
    h: 1.8,
    fontSize: 32,
    fontFace: 'Arial',
    color: COLOR_TEXT_LIGHT,
    bold: true,
    valign: 'top',
    breakLine: true
  });

  // Overview / Subtitle
  coverSlide.addText(project.overview, {
    x: 1.0,
    y: 4.0,
    w: 11.0,
    h: 1.0,
    fontSize: 15,
    fontFace: 'Arial',
    color: COLOR_TEXT_MUTED,
    italic: true,
    breakLine: true
  });

  // Target audience badge & Metadata box
  coverSlide.addShape(pptx.ShapeType.roundRect, {
    x: 1.0,
    y: 5.4,
    w: 4.8,
    h: 0.9,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: '334155', width: 1 }
  });

  coverSlide.addText([
    { text: `Đối tượng: `, options: { bold: true, color: COLOR_ACCENT, fontSize: 13 } },
    { text: `${project.audience}\n`, options: { color: COLOR_TEXT_LIGHT, fontSize: 13 } },
    { text: `Quy mô: `, options: { bold: true, color: COLOR_TEXT_MUTED, fontSize: 11 } },
    { text: `${project.slides.length} slide bài giảng • ${project.quizzes.length} câu hỏi ôn tập`, options: { color: COLOR_TEXT_MUTED, fontSize: 11 } }
  ], {
    x: 1.2,
    y: 5.5,
    w: 4.4,
    h: 0.7,
    fontFace: 'Arial'
  });

  coverSlide.addNotes(`Slide mở đầu bài giảng: "${project.title}".\nLĩnh vực: ${project.field}.\nĐối tượng hướng tới: ${project.audience}.\n\nLời mở đầu gợi ý: "Xin nhiệt liệt chào mừng các bạn đến với buổi học hôm nay. Chúng ta sẽ cùng nghiên cứu nội dung chuyên sâu về ${project.title}."`);

  // ================= 2. CONTENT SLIDES =================
  project.slides.forEach((slideData, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: 'F8FAFC' }; // Light, high-readability slide background

    // Top primary bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.1,
      fill: { color: COLOR_PRIMARY },
      line: { color: COLOR_PRIMARY }
    });

    // Slide Header: Index and Title
    slide.addText(`PHẦN ${idx + 1} / ${project.slides.length}`, {
      x: 0.8,
      y: 0.5,
      w: 4.0,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLOR_PRIMARY,
      bold: true
    });

    slide.addText(slideData.title, {
      x: 0.8,
      y: 0.8,
      w: 11.5,
      h: 0.8,
      fontSize: 24,
      fontFace: 'Arial',
      color: '0F172A',
      bold: true,
      valign: 'middle'
    });

    // Content Box Left: Bullet Points
    const bulletItems = slideData.points.map((pt) => ({
      text: pt,
      options: {
        fontSize: 16,
        color: '334155',
        breakLine: true,
        bullet: { code: '25AA', color: COLOR_PRIMARY },
        spaceAfter: 12
      }
    }));

    slide.addText(bulletItems, {
      x: 0.8,
      y: 1.8,
      w: 7.6,
      h: 4.8,
      fontFace: 'Arial',
      valign: 'top',
      lineSpacing: 26
    });

    // Content Box Right: Key Highlights / Script Spotlight
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.8,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      rectRadius: 0.15,
      fill: { color: 'EFF6FF' },
      line: { color: 'BAE6FD', width: 1.5 }
    });

    slide.addText('GHI CHÚ TRỌNG TÂM', {
      x: 9.1,
      y: 2.1,
      w: 3.1,
      h: 0.3,
      fontSize: 12,
      fontFace: 'Arial',
      color: COLOR_PRIMARY,
      bold: true
    });

    slide.addText(
      slideData.script.length > 280
        ? slideData.script.substring(0, 277) + '...'
        : slideData.script,
      {
        x: 9.1,
        y: 2.5,
        w: 3.1,
        h: 3.8,
        fontSize: 13,
        fontFace: 'Arial',
        color: '1E3A8A',
        italic: true,
        lineSpacing: 20
      }
    );

    // Slide Footer
    slide.addText(`${project.title} • SlidePro Education`, {
      x: 0.8,
      y: 6.9,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: '94A3B8'
    });

    slide.addText(`Trang ${idx + 1}`, {
      x: 11.5,
      y: 6.9,
      w: 1.0,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: '94A3B8',
      align: 'right'
    });

    // IMPORTANT: Embed Speaker Notes (Lời giảng) directly into PowerPoint!
    slide.addNotes(
      `[LỜI GIẢNG BÀI - THỜI LƯỢNG ƯỚC TÍNH: ~${slideData.duration} GIÂY (${slideData.wordCount} TỪ)]\n\n${slideData.script}`
    );
  });

  // ================= 3. QUIZ SLIDES =================
  if (project.quizzes && project.quizzes.length > 0) {
    project.quizzes.forEach((q, qIdx) => {
      const qSlide = pptx.addSlide();
      qSlide.background = { color: COLOR_BG_DARK };

      qSlide.addText(`CÂU HỎI CỦNG CỐ KIẾN THỨC #${qIdx + 1}`, {
        x: 1.0,
        y: 0.6,
        w: 10.0,
        h: 0.4,
        fontSize: 13,
        fontFace: 'Arial',
        color: COLOR_ACCENT_ORANGE,
        bold: true
      });

      qSlide.addText(q.question, {
        x: 1.0,
        y: 1.2,
        w: 11.3,
        h: 1.4,
        fontSize: 22,
        fontFace: 'Arial',
        color: COLOR_TEXT_LIGHT,
        bold: true,
        breakLine: true
      });

      // Render 4 answer choices
      q.options.forEach((opt, optIdx) => {
        const row = Math.floor(optIdx / 2);
        const col = optIdx % 2;
        const posX = 1.0 + col * 5.8;
        const posY = 2.8 + row * 1.8;

        const letter = String.fromCharCode(65 + optIdx);

        qSlide.addShape(pptx.ShapeType.roundRect, {
          x: posX,
          y: posY,
          w: 5.5,
          h: 1.5,
          rectRadius: 0.12,
          fill: { color: COLOR_CARD_BG },
          line: { color: '334155', width: 1 }
        });

        qSlide.addText([
          { text: `${letter}. `, options: { bold: true, color: COLOR_ACCENT, fontSize: 16 } },
          { text: opt, options: { color: COLOR_TEXT_LIGHT, fontSize: 14 } }
        ], {
          x: posX + 0.3,
          y: posY + 0.2,
          w: 4.9,
          h: 1.1,
          fontFace: 'Arial',
          valign: 'middle',
          breakLine: true
        });
      });

      // Quiz Speaker Notes with Answer Key & Explanation
      qSlide.addNotes(
        `[ĐÁP ÁN VÀ HƯỚNG DẪN GIẢI THÍCH]\n\nĐáp án đúng: ${String.fromCharCode(65 + q.correctIndex)}. ${q.options[q.correctIndex]}\n\nGiải thích chi tiết:\n${q.explanation}`
      );
    });
  }

  // ================= 4. SUMMARY / END SLIDE =================
  const endSlide = pptx.addSlide();
  endSlide.background = { color: COLOR_BG_DARK };

  endSlide.addText('TỔNG KẾT BÀI HỌC', {
    x: 1.0,
    y: 2.2,
    w: 11.3,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: COLOR_ACCENT,
    bold: true,
    align: 'center'
  });

  endSlide.addText('Chúc các bạn học tập tốt và đạt kết quả cao!', {
    x: 1.0,
    y: 2.8,
    w: 11.3,
    h: 1.2,
    fontSize: 32,
    fontFace: 'Arial',
    color: COLOR_TEXT_LIGHT,
    bold: true,
    align: 'center'
  });

  endSlide.addText('Bài giảng được tối ưu và xuất tự động bởi SlidePro AI', {
    x: 1.0,
    y: 4.3,
    w: 11.3,
    h: 0.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: COLOR_TEXT_MUTED,
    italic: true,
    align: 'center'
  });

  // Write file out
  const sanitizedName = (project.title || 'SlidePro_BaiGiang')
    .replace(/[^\w\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '_');

  await pptx.writeFile({ fileName: `${sanitizedName}.pptx` });
}
