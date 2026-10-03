import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { title, slides, count, audience } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback questions
      return NextResponse.json({
        quizzes: [
          {
            id: `q-${Date.now()}-1`,
            question: `Trong bài học về "${title || 'chủ đề này'}", luận điểm nào là trọng tâm nhất?`,
            options: [
              'Nắm vững nguyên lý cơ bản và phương pháp thực hành chính xác',
              'Chỉ cần ghi nhớ định nghĩa mà không cần liên hệ thực tế',
              'Bỏ qua các bước phân tích ban đầu',
              'Không có phương pháp cụ thể nào được khuyến nghị'
            ],
            correctIndex: 0,
            explanation: 'Theo nội dung bài giảng, việc hiểu rõ bản chất cốt lõi và vận dụng chính xác là điều kiện tiên quyết.'
          },
          {
            id: `q-${Date.now()}-2`,
            question: 'Khi triển khai ứng dụng nội dung vào thực tiễn, yếu tố nào cần được ưu tiên hàng đầu?',
            options: [
              'Tính chính xác, tính khả thi và tuân thủ quy trình chuẩn',
              'Tốc độ hoàn thành mà không cần quan tâm đến sai số',
              'Tự suy diễn ngoài phạm vi hướng dẫn chuyên môn',
              'Chỉ tập trung vào hình thức bên ngoài'
            ],
            correctIndex: 0,
            explanation: 'Quy trình chuẩn hóa và tính khả thi luôn là nguyên tắc số một được nhấn mạnh trong bài học.'
          }
        ]
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Bạn là chuyên gia khảo thí và soạn thảo ngân hàng đề thi trắc nghiệm sư phạm.
Hãy tạo ${count || 3} câu hỏi trắc nghiệm 4 lựa chọn (A, B, C, D) dựa trên nội dung bài giảng sau:
Chủ đề: ${title}
Đối tượng: ${audience || 'Sinh viên đại học'}
Nội dung slide & bài giảng:
${JSON.stringify(slides)}

Yêu cầu định dạng JSON:
{
  "quizzes": [
    {
      "id": "q-1",
      "question": "Nội dung câu hỏi ngắn gọn, chuẩn mực, kiểm tra mức độ hiểu sâu",
      "options": [
        "Lựa chọn A (Đáp án đúng nếu correctIndex = 0)",
        "Lựa chọn B gây nhiễu hợp lý",
        "Lựa chọn C",
        "Lựa chọn D"
      ],
      "correctIndex": 0,
      "explanation": "Giải thích chi tiết vì sao đáp án này đúng và liên hệ với slide nào trong bài giảng"
    }
  ]
}

LƯU Ý: Chỉ trả về JSON thuần túy, không có markdown codeblock hay văn bản khác.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    let jsonStr = responseText.replace(/```(?:json)?/gi, '').trim();
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Gemini Quiz API Error:', error);
    return NextResponse.json(
      { error: 'Không thể tạo câu hỏi trắc nghiệm bằng AI' },
      { status: 500 }
    );
  }
}
