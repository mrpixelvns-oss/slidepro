import { LectureProject } from '@/types/presentation';

export const SLIDE_UNIT_PRICE = 1000; // 1.000 đ / 1 slide bài giảng

export const SAMPLE_PROJECTS: LectureProject[] = [
  {
    id: 'sample-medical',
    title: 'Sinh lý bệnh và chẩn đoán lâm sàng chèn ép tim',
    fileName: 'Sinh_ly_benh_chen_ep_tim.pdf',
    fileSize: '4.2 MB',
    totalPages: 3,
    field: 'Khoa học sự sống & Sức khoẻ',
    audience: 'Sinh viên đại học/cao đẳng',
    overview: 'Bài giảng trình bày về cơ chế sinh lý bệnh cùng các triệu chứng lâm sàng (cơ năng và thực thể) để chẩn đoán hội chứng chèn ép tim.',
    voice: 'Nữ trẻ',
    voiceSpeed: 1,
    status: 'analyzed',
    createdAt: '2026-10-01',
    units: [
      {
        id: 'unit-1',
        title: 'Sinh lý bệnh và chẩn đoán lâm sàng chèn ép tim',
        type: 'theory',
        startSlide: 1,
        endSlide: 3,
        mainContent: `- Cơ chế sinh lý bệnh của chèn ép tim
- Triệu chứng cơ năng (khó thở, nặng ngực, lo sợ)
- Triệu chứng thực thể (tĩnh mạch cổ nổi, tiếng tim mờ xa xăm, mạch nghịch)
- Tiêu chuẩn chẩn đoán cận lâm sàng và siêu âm tim`,
        questionCount: 3,
      }
    ],
    slides: [
      {
        id: 's-1',
        pageNumber: 1,
        title: 'Đại cương và Cơ chế sinh lý bệnh chèn ép tim',
        points: [
          'Chèn ép tim cấp là tình trạng cấp cứu nội khoa - ngoại khoa tim mạch.',
          'Sự tích tụ dịch trong khoang màng ngoài tim làm tăng áp lực trong khoang.',
          'Gây cản trở đổ đầy tâm thất trong thời kỳ tâm trương, giảm thể tích tống máu.',
          'Hậu quả: Giảm cung lượng tim nghiêm trọng và tụt huyết áp động mạch.'
        ],
        script: 'Chào các bạn, hôm nay chúng ta sẽ cùng tìm hiểu bài giảng về Chèn ép tim cấp. Mục tiêu chính của bài học là giúp các bạn nắm vững sinh lý bệnh, nhận biết chính xác các triệu chứng cơ năng và thực thể, đặc biệt là tam chứng Beck, dấu hiệu mạch nghịch cũng như tiêu chuẩn chẩn đoán trên siêu âm tim cấp cứu.',
        duration: 57,
        wordCount: 157,
        rotation: 0
      },
      {
        id: 's-2',
        pageNumber: 2,
        title: 'Triệu chứng lâm sàng: Cơ năng và Thực thể',
        points: [
          'Triệu chứng cơ năng: Khó thở tăng dần khi nằm, đau tức ngực sau xương ức, cảm giác lo sợ hoảng hốt.',
          'Tam chứng Beck điển hình: Tụt huyết áp động mạch, Tĩnh mạch cổ nổi to, Tiếng tim mờ xa xăm.',
          'Dấu hiệu mạch nghịch (Pulsus paradoxus): Huyết áp tâm thu giảm trên 10 mmHg khi hít vào sâu.',
          'Nhịp tim nhanh phản xạ, da tái lạnh vã mồ hôi do suy tuần hoàn cấp.'
        ],
        script: 'Chuyển sang phần chẩn đoán lâm sàng, chúng ta cần phân biệt rõ triệu chứng cơ năng và triệu chứng thực thể. Về triệu chứng cơ năng, bệnh nhân có cảm giác nặng ngực dữ dội như có vật nặng chèn ép ngay trước tim, kèm theo khó thở. Một điểm đặc trưng là tình trạng khó thở và nặng ngực tăng lên khi nằm đầu bằng. Về thực thể, hãy luôn nhớ tam chứng Beck: tụt huyết áp, tĩnh mạch cổ nổi và tiếng tim mờ xa xăm.',
        duration: 62,
        wordCount: 168,
        rotation: 0
      },
      {
        id: 's-3',
        pageNumber: 3,
        title: 'Cận lâm sàng & Tiêu chuẩn chẩn đoán xác định',
        points: [
          'Điện tâm đồ (ECG): Điện thế thấp lan tỏa ở các chuyển đạo ngoại vi, hiện tượng luân phiên điện học (Electrical alternans).',
          'X-quang ngực thẳng: Bóng tim to dạng "bình nước", phổi sáng do giảm tưới máu.',
          'Siêu âm tim (Tiêu chuẩn vàng): Khoang màng ngoài tim nhiều dịch, dấu hiệu đè sụp nhĩ phải thời kỳ cuối tâm trương và thất phải đầu tâm trương.',
          'Xử trí khẩn cấp: Chọc hút màng ngoài tim giải áp cấp cứu dưới hướng dẫn siêu âm.'
        ],
        script: 'Tại slide thứ ba, chúng ta xem xét cận lâm sàng và chẩn đoán xác định. Siêu âm tim qua thành ngực là tiêu chuẩn vàng, cho phép định lượng dịch màng ngoài tim và phát hiện dấu hiệu đè sụp thành tự do thất phải trong thì tâm trương. Trên điện tâm đồ, các bạn chú ý dấu hiệu luân phiên điện thế phức bộ QRS. Khi đã xác định chèn ép tim, chỉ định can thiệp chọc dò màng ngoài tim giải áp là tối khẩn cấp.',
        duration: 68,
        wordCount: 182,
        rotation: 0
      }
    ],
    quizzes: [
      {
        id: 'q-1',
        question: 'Tam chứng Beck trong hội chứng chèn ép tim bao gồm các dấu hiệu nào sau đây?',
        options: [
          'Huyết áp tụt, tĩnh mạch cổ nổi, tiếng tim mờ xa xăm',
          'Huyết áp tăng, tĩnh mạch cổ xẹp, tiếng tim đập mạnh',
          'Sốt cao, đau ngực kiểu màng phổi, tiếng cọ màng tim',
          'Khó thở khi gắng sức, phù hai chi dưới, gan to'
        ],
        correctIndex: 0,
        explanation: 'Tam chứng Beck kinh điển gồm 3 dấu hiệu: Tụt huyết áp động mạch (do giảm cung lượng tim), Tĩnh mạch cổ nổi (tăng áp lực tĩnh mạch trung tâm), và Tiếng tim mờ xa xăm (do dịch bao quanh màng ngoài tim).'
      },
      {
        id: 'q-2',
        question: 'Dấu hiệu mạch nghịch (Pulsus paradoxus) được định nghĩa là:',
        options: [
          'Huyết áp tâm thu giảm > 10 mmHg trong thì hít vào',
          'Huyết áp tâm thu tăng > 10 mmHg trong thì hít vào',
          'Huyết áp tâm trương giảm > 20 mmHg trong thì thở ra',
          'Nhịp tim chậm dưới 50 lần/phút khi bệnh nhân hít sâu'
        ],
        correctIndex: 0,
        explanation: 'Mạch nghịch là sự sụt giảm huyết áp tâm thu vượt quá 10 mmHg trong thì hít vào bình thường, xuất hiện do sự tương tác giữa hai tâm thất khi màng ngoài tim bị căng cứng.'
      },
      {
        id: 'q-3',
        question: 'Phương pháp cận lâm sàng nào được coi là tiêu chuẩn vàng nhanh chóng và chính xác nhất để chẩn đoán chèn ép tim tại giường?',
        options: [
          'Siêu âm tim',
          'Điện tâm đồ 12 chuyển đạo',
          'Chụp X-quang phổi thẳng',
          'Xét nghiệm định lượng men tim Troponin I'
        ],
        correctIndex: 0,
        explanation: 'Siêu âm tim tại giường là tiêu chuẩn vàng vì cho phép đánh giá ngay lập tức lượng dịch khoang màng ngoài tim và các dấu hiệu huyết động như đè sụp nhĩ phải, thất phải.'
      }
    ]
  },
  {
    id: 'sample-ai',
    title: 'Nhập môn Trí tuệ nhân tạo và Machine Learning',
    fileName: 'Intro_AI_Machine_Learning.pdf',
    fileSize: '3.8 MB',
    totalPages: 3,
    field: 'Công nghệ thông tin',
    audience: 'Sinh viên đại học/cao đẳng',
    overview: 'Tổng quan nền tảng về Trí tuệ nhân tạo, phân loại Học máy có giám sát, không giám sát, học tăng cường và ứng dụng thực tiễn của Generative AI.',
    voice: 'Nam truyền cảm',
    voiceSpeed: 1,
    status: 'analyzed',
    createdAt: '2026-10-01',
    units: [
      {
        id: 'unit-ai-1',
        title: 'Nền tảng Trí tuệ nhân tạo & Machine Learning',
        type: 'theory',
        startSlide: 1,
        endSlide: 3,
        mainContent: `- Khái niệm AI, ML và Deep Learning
- Ba nhóm phương pháp học máy chính: Supervised, Unsupervised, Reinforcement Learning
- Mạng nơ-ron nhân tạo và xu hướng Generative AI hiện đại`,
        questionCount: 2,
      }
    ],
    slides: [
      {
        id: 's-ai-1',
        pageNumber: 1,
        title: 'Tổng quan: AI, Học máy và Học sâu',
        points: [
          'AI (Trí tuệ nhân tạo): Phạm trù rộng lớn mô phỏng tư duy thông minh của con người.',
          'Machine Learning (Học máy): Tập con của AI, tập trung vào thuật toán tự học từ dữ liệu.',
          'Deep Learning (Học sâu): Sử dụng mạng nơ-ron nhiều tầng phỏng theo vỏ não sinh học.',
          'Mối quan hệ phân cấp: AI ⊃ Machine Learning ⊃ Deep Learning.'
        ],
        script: 'Xin chào các bạn học viên, trong bài học mở đầu hôm nay chúng ta sẽ làm rõ bức tranh tổng thể về Trí tuệ nhân tạo. Rất nhiều người thường nhầm lẫn giữa AI, Machine Learning và Deep Learning. Thực chất đây là các tập hợp lồng nhau, trong đó Học sâu là hạt nhân tạo nên bước đột phá lớn nhất của kỷ nguyên số hiện nay.',
        duration: 52,
        wordCount: 140,
        rotation: 0
      },
      {
        id: 's-ai-2',
        pageNumber: 2,
        title: 'Phân loại các phương pháp Học máy chủ đạo',
        points: [
          'Học có giám sát (Supervised Learning): Dữ liệu có nhãn đầu ra (Hồi quy, Phân loại).',
          'Học không giám sát (Unsupervised Learning): Tìm kiếm cấu trúc ẩn trong dữ liệu (Phân cụm, Giảm số chiều).',
          'Học tăng cường (Reinforcement Learning): Học thông qua tương tác môi trường và hàm phần thưởng.',
          'Self-supervised Learning: Phương pháp nền tảng huấn luyện các mô hình ngôn ngữ lớn (LLM).'
        ],
        script: 'Bước sang slide thứ hai, chúng ta xem xét ba nhánh học máy kinh điển. Hãy hình dung Học có giám sát giống như học sinh có giáo viên sửa bài theo đáp án, Học không giám sát giống như tự khám phá quy luật trong kho sách khổng lồ, và Học tăng cường giống như một kỳ thủ học đánh cờ qua thắng thua từng nước đi.',
        duration: 58,
        wordCount: 155,
        rotation: 0
      },
      {
        id: 's-ai-3',
        pageNumber: 3,
        title: 'Xu hướng Generative AI và Ứng dụng thực tiễn',
        points: [
          'Sự bùng nổ của kiến trúc Transformer và mô hình nền tảng đa phương thức (Multimodal).',
          'Ứng dụng xử lý ngôn ngữ tự nhiên, tạo ảnh, sinh mã lập trình và phân tích khoa học.',
          'Thách thức đạo đức: Bản quyền dữ liệu, ảo giác thông tin (Hallucination) và an toàn AI.',
          'Tương lai: Tự động hóa thông minh (Agentic AI) giải quyết các tác vụ phức tạp.'
        ],
        script: 'Ở slide cuối cùng, chúng ta khám phá làn sóng Generative AI và các mô hình Agent thông minh. Những mô hình như Gemini không chỉ đơn thuần trả lời câu hỏi mà còn có khả năng lập kế hoạch, viết mã và phân tích dữ liệu đa phương tiện từ văn bản đến hình ảnh và video.',
        duration: 50,
        wordCount: 135,
        rotation: 0
      }
    ],
    quizzes: [
      {
        id: 'q-ai-1',
        question: 'Thuật toán phân loại thư rác (Spam / Not Spam) dựa trên tập email đã gán nhãn thuộc phương pháp học máy nào?',
        options: [
          'Học có giám sát (Supervised Learning)',
          'Học không giám sát (Unsupervised Learning)',
          'Học tăng cường (Reinforcement Learning)',
          'Học truyền giao diện (Transfer Interface)'
        ],
        correctIndex: 0,
        explanation: 'Vì dữ liệu huấn luyện đã có sẵn nhãn (Spam hoặc Not Spam) để mô hình so sánh và tối ưu hóa hàm mất mát, đây là bài toán Học có giám sát điển hình.'
      },
      {
        id: 'q-ai-2',
        question: 'Kiến trúc nơ-ron nền tảng đứng sau sự thành công của hầu hết các Mô hình ngôn ngữ lớn (LLM) hiện nay là:',
        options: [
          'Transformer',
          'Perceptron cổ điển',
          'Hopfield Network',
          'Radial Basis Function'
        ],
        correctIndex: 0,
        explanation: 'Kiến trúc Transformer với cơ chế Self-Attention ra mắt năm 2017 đã trở thành nền tảng cốt lõi của toàn bộ các LLM hiện đại.'
      }
    ]
  }
];

export const LECTURE_FIELDS = [
  'Khoa học sự sống & Sức khoẻ',
  'Công nghệ thông tin & Khoa học dữ liệu',
  'Kinh tế & Quản trị kinh doanh',
  'Khoa học tự nhiên & Kỹ thuật',
  'Khoa học xã hội & Nhân văn',
  'Sư phạm & Giáo dục',
  'Ngoại ngữ & Kỹ năng mềm',
  'Khác'
];

export const LEARNER_AUDIENCES = [
  'Sinh viên đại học/cao đẳng',
  'Học sinh phổ thông (THPT)',
  'Học sinh THCS & Tiểu học',
  'Chuyên viên / Người đi làm',
  'Học viên sau đại học',
  'Đại chúng (Mọi lứa tuổi)'
];

export const LECTURE_TYPES = [
  { value: 'theory', label: 'Lý thuyết' },
  { value: 'practice', label: 'Thực hành' },
  { value: 'summary', label: 'Tổng kết / Ôn tập' },
  { value: 'discussion', label: 'Thảo luận chuyên đề' }
];

export const VOICE_OPTIONS = [
  { id: 'female-young', name: 'Nữ trẻ (Hà Nội)', lang: 'vi-VN', gender: 'female' },
  { id: 'female-south', name: 'Nữ nhẹ nhàng (Miền Nam)', lang: 'vi-VN', gender: 'female' },
  { id: 'male-inspiring', name: 'Nam truyền cảm (Hà Nội)', lang: 'vi-VN', gender: 'male' },
  { id: 'male-pro', name: 'Nam đĩnh đạc (Miền Nam)', lang: 'vi-VN', gender: 'male' }
];
