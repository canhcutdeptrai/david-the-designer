// Chuỗi song ngữ viết dạng { en: '…', vi: '…' }. Chuỗi thường (tên riêng, tên công cụ)
// dùng chung cho cả hai ngôn ngữ. Mô tả từng trường: docs/DATA-MODEL.md
window.PORTFOLIO_DATA = {
  person: {
    name: 'Van The Duy',
    preferredName: 'David',
    initials: 'VD',
    title: 'Product Designer · Business Analyst · Solution Consultant',
    location: { en: 'Hanoi, Vietnam', vi: 'Hà Nội, Việt Nam' },
    languages: { en: 'Vietnamese · English', vi: 'Tiếng Việt · Tiếng Anh' },
    email: 'vantheduy2000@gmail.com',
    summary: 'I turn complex workflows into clear, scalable digital products — connecting user experience, business requirements, and technical delivery.',
    yearsProduct: '5+ years',
    yearsBA: '3+ years'
  },
  capabilities: [
    {
      id: 'design',
      number: '01',
      title: { en: 'Product & UX Design', vi: 'Thiết kế sản phẩm & UX' },
      icon: 'draw',
      statement: {
        en: 'Translate complex, data-heavy workflows into usable web and mobile experiences.',
        vi: 'Chuyển các quy trình phức tạp, nhiều dữ liệu thành trải nghiệm web và mobile dễ dùng.'
      },
      skills: [
        { en: 'UX strategy', vi: 'Chiến lược UX' },
        { en: 'User flows', vi: 'User flow' },
        { en: 'Wireframes', vi: 'Wireframe' },
        { en: 'Interactive prototypes', vi: 'Prototype tương tác' },
        { en: 'Usability testing', vi: 'Kiểm thử khả dụng' },
        { en: 'Responsive design', vi: 'Thiết kế responsive' }
      ]
    },
    {
      id: 'analysis',
      number: '02',
      title: { en: 'Business Analysis', vi: 'Phân tích nghiệp vụ' },
      icon: 'account_tree',
      statement: {
        en: 'Turn stakeholder needs into structured requirements, workflows, and delivery-ready decisions.',
        vi: 'Biến nhu cầu của các bên liên quan thành yêu cầu có cấu trúc, quy trình và quyết định sẵn sàng triển khai.'
      },
      skills: [
        { en: 'Requirement analysis', vi: 'Phân tích yêu cầu' },
        'BRD / FRD / SRS',
        'BPMN & UML',
        { en: 'User stories', vi: 'User story' },
        { en: 'Traceability', vi: 'Truy vết yêu cầu' },
        'UAT'
      ]
    },
    {
      id: 'ai',
      number: '03',
      title: { en: 'AI-enabled Solution Design', vi: 'Thiết kế giải pháp ứng dụng AI' },
      icon: 'psychology',
      statement: {
        en: 'Use AI-assisted research, prototyping, and workflow automation to accelerate responsible product delivery.',
        vi: 'Dùng AI hỗ trợ nghiên cứu, dựng prototype và tự động hoá quy trình để đẩy nhanh việc đưa sản phẩm ra một cách có trách nhiệm.'
      },
      skills: [
        { en: 'AI-assisted discovery', vi: 'Khám phá có AI hỗ trợ' },
        { en: 'Rapid prototyping', vi: 'Prototype nhanh' },
        'Prompt engineering',
        { en: 'Workflow automation', vi: 'Tự động hoá quy trình' },
        { en: 'Agentic AI concepts', vi: 'Khái niệm Agentic AI' },
        { en: 'Solution framing', vi: 'Định hình giải pháp' }
      ]
    },
    {
      id: 'systems',
      number: '04',
      title: { en: 'Systems & Data UX', vi: 'UX cho hệ thống & dữ liệu' },
      icon: 'insights',
      statement: {
        en: 'Design dashboards, monitoring tools, design systems, and operational interfaces that stay clear under complexity.',
        vi: 'Thiết kế dashboard, công cụ giám sát, design system và giao diện vận hành luôn rõ ràng dù hệ thống phức tạp.'
      },
      skills: [
        { en: 'Dashboard UX', vi: 'UX dashboard' },
        { en: 'Data visualization', vi: 'Trực quan hoá dữ liệu' },
        { en: 'Design systems', vi: 'Design system' },
        'Accessibility',
        { en: 'API integration', vi: 'Tích hợp API' },
        { en: 'SQL & data modeling', vi: 'SQL & mô hình dữ liệu' }
      ]
    }
  ],
  projects: [
    {
      slug: 'beetrade',
      title: 'BeeTrade AI Trading Platform',
      shortTitle: 'AI trading platform',
      timeframe: { en: '2024 — Present', vi: '2024 — Hiện tại' },
      role: 'Product Design Lead · Product Consultant · Business Analyst',
      disciplines: ['design', 'analysis', 'ai', 'systems'],
      visual: 'market',
      summary: {
        en: 'A data-heavy trading experience spanning market monitoring, order management, wallet flows, portfolio tracking, reporting, and realtime dashboards.',
        vi: 'Trải nghiệm giao dịch nhiều dữ liệu, bao gồm theo dõi thị trường, quản lý lệnh, luồng ví, theo dõi danh mục, báo cáo và dashboard thời gian thực.'
      },
      challenge: {
        en: 'Bring multiple high-density trading workflows into a coherent product experience while keeping business logic, interface behavior, and implementation aligned.',
        vi: 'Đưa nhiều quy trình giao dịch mật độ thông tin cao về một trải nghiệm sản phẩm thống nhất, đồng thời giữ cho logic nghiệp vụ, hành vi giao diện và phần triển khai khớp nhau.'
      },
      contributions: [
        {
          en: 'Defined requirements and end-to-end workflows across trading, wallet, transaction, reporting, and monitoring modules.',
          vi: 'Xác định yêu cầu và quy trình đầu-cuối cho các module giao dịch, ví, lịch sử giao dịch, báo cáo và giám sát.'
        },
        {
          en: 'Designed realtime dashboards, market monitoring, position tracking, and portfolio experiences for web platforms.',
          vi: 'Thiết kế dashboard thời gian thực, màn theo dõi thị trường, theo dõi vị thế và danh mục cho nền tảng web.'
        },
        {
          en: 'Built reusable design-system components and interaction patterns for data-heavy workflows.',
          vi: 'Xây dựng các component design system và mẫu tương tác dùng lại được cho quy trình nhiều dữ liệu.'
        },
        {
          en: 'Worked with Product, Engineering, BA, and QA on business-logic validation, API behavior, UAT, release planning, and product iteration.',
          vi: 'Phối hợp với Product, Engineering, BA và QA để kiểm chứng logic nghiệp vụ, hành vi API, UAT, kế hoạch phát hành và các vòng cải tiến sản phẩm.'
        },
        {
          en: 'Applied AI-assisted workflows to research, UX exploration, prototyping, documentation, and design iteration.',
          vi: 'Áp dụng quy trình có AI hỗ trợ vào nghiên cứu, khám phá UX, dựng prototype, viết tài liệu và các vòng lặp thiết kế.'
        }
      ],
      deliverables: [
        { en: 'Requirement map', vi: 'Bản đồ yêu cầu' },
        { en: 'End-to-end trading flows', vi: 'Luồng giao dịch đầu-cuối' },
        { en: 'Realtime dashboard UX', vi: 'UX dashboard thời gian thực' },
        { en: 'Design system', vi: 'Design system' },
        { en: 'Interaction specifications', vi: 'Đặc tả tương tác' },
        { en: 'UAT support', vi: 'Hỗ trợ UAT' }
      ],
      outcomes: [
        {
          en: 'Established a reusable product language for complex trading and monitoring modules.',
          vi: 'Thiết lập một ngôn ngữ sản phẩm dùng lại được cho các module giao dịch và giám sát phức tạp.'
        },
        {
          en: 'Connected UX decisions with requirements and API logic throughout delivery.',
          vi: 'Gắn quyết định UX với yêu cầu và logic API trong suốt quá trình triển khai.'
        },
        {
          en: 'Supported iterative validation through UAT and cross-functional review.',
          vi: 'Hỗ trợ kiểm chứng lặp qua UAT và các buổi review liên phòng ban.'
        }
      ],
      disclosure: {
        en: 'Public CV summary. Product screens, metrics, and confidential implementation details are intentionally omitted.',
        vi: 'Tóm tắt từ CV công khai. Màn hình sản phẩm, số liệu và chi tiết triển khai bảo mật được chủ động lược bỏ.'
      }
    },
    {
      slug: 'western-harbour',
      title: 'Western Harbour Tunnel System',
      shortTitle: 'Control-room monitoring',
      timeframe: { en: 'Oct 2023 — Apr 2025', vi: '10/2023 — 04/2025' },
      role: 'UX Consultant · Business Analyst',
      disciplines: ['design', 'analysis', 'systems'],
      visual: 'control',
      summary: {
        en: 'Realtime HMI and monitoring workflows for an infrastructure control-room environment with strong governance, accessibility, and audit requirements.',
        vi: 'Giao diện HMI và quy trình giám sát thời gian thực cho môi trường phòng điều khiển hạ tầng, với yêu cầu chặt chẽ về quản trị, accessibility và kiểm toán.'
      },
      challenge: {
        en: 'Convert operational traffic standards and control-room procedures into functional requirements and interfaces that remain legible during realtime monitoring.',
        vi: 'Chuyển các tiêu chuẩn vận hành giao thông và quy trình phòng điều khiển thành yêu cầu chức năng và giao diện vẫn dễ đọc trong lúc giám sát thời gian thực.'
      },
      contributions: [
        {
          en: 'Converted operational standards into functional requirements, workflows, and implementation-ready documentation.',
          vi: 'Chuyển tiêu chuẩn vận hành thành yêu cầu chức năng, quy trình và tài liệu sẵn sàng triển khai.'
        },
        {
          en: 'Designed HMI screens and monitoring experiences for realtime control-room operations.',
          vi: 'Thiết kế màn hình HMI và trải nghiệm giám sát cho vận hành phòng điều khiển thời gian thực.'
        },
        {
          en: 'Coordinated requirements across operational, engineering, and delivery stakeholders.',
          vi: 'Điều phối yêu cầu giữa các bên vận hành, kỹ thuật và triển khai.'
        },
        {
          en: 'Applied usability, information hierarchy, accessibility, ISO, and WCAG considerations to interface decisions.',
          vi: 'Áp dụng các cân nhắc về tính khả dụng, phân cấp thông tin, accessibility, ISO và WCAG vào quyết định giao diện.'
        },
        {
          en: 'Maintained documentation supporting governance and audit activities.',
          vi: 'Duy trì tài liệu phục vụ hoạt động quản trị và kiểm toán.'
        }
      ],
      deliverables: [
        { en: 'Functional workflows', vi: 'Quy trình chức năng' },
        { en: 'HMI interface design', vi: 'Thiết kế giao diện HMI' },
        { en: 'Monitoring information architecture', vi: 'Kiến trúc thông tin giám sát' },
        { en: 'Accessibility guidance', vi: 'Hướng dẫn accessibility' },
        { en: 'System documentation', vi: 'Tài liệu hệ thống' }
      ],
      outcomes: [
        {
          en: 'Created a clearer bridge between operational standards and implementable system behavior.',
          vi: 'Tạo cầu nối rõ ràng hơn giữa tiêu chuẩn vận hành và hành vi hệ thống có thể triển khai.'
        },
        {
          en: 'Supported consistent monitoring workflows across a complex realtime environment.',
          vi: 'Hỗ trợ quy trình giám sát nhất quán trong một môi trường thời gian thực phức tạp.'
        },
        {
          en: 'Produced structured documentation for stakeholder review and audit support.',
          vi: 'Tạo bộ tài liệu có cấu trúc cho các bên liên quan review và phục vụ kiểm toán.'
        }
      ],
      disclosure: {
        en: 'Public CV summary. Operational screens and infrastructure-sensitive details are not shown.',
        vi: 'Tóm tắt từ CV công khai. Không hiển thị màn hình vận hành và các chi tiết nhạy cảm về hạ tầng.'
      }
    },
    {
      slug: 'sme-transformation',
      title: { en: 'Thanh Hoa SME Digital Transformation', vi: 'Chuyển đổi số cho SME tại Thanh Hoá' },
      shortTitle: 'SME digital transformation',
      timeframe: { en: '2025 — Present', vi: '2025 — Hiện tại' },
      role: 'Digital Transformation Consultant · Business Analyst',
      disciplines: ['analysis', 'ai', 'design'],
      visual: 'journey',
      summary: {
        en: 'Digital experience and operations work for local hospitality, tourism, media, and service businesses in Thanh Hoa.',
        vi: 'Công việc về trải nghiệm số và vận hành cho các doanh nghiệp lưu trú, du lịch, truyền thông và dịch vụ tại Thanh Hoá.'
      },
      challenge: {
        en: 'Help small businesses move from fragmented customer touchpoints and manual operations toward clearer journeys, digital workflows, and practical adoption roadmaps.',
        vi: 'Giúp doanh nghiệp nhỏ chuyển từ các điểm chạm khách hàng rời rạc và vận hành thủ công sang hành trình rõ ràng hơn, quy trình số và lộ trình áp dụng khả thi.'
      },
      contributions: [
        {
          en: 'Analyzed customer journeys, service workflows, and operational processes across several SME contexts.',
          vi: 'Phân tích hành trình khách hàng, quy trình dịch vụ và quy trình vận hành ở nhiều bối cảnh SME.'
        },
        {
          en: 'Designed website structures, digital touchpoints, reporting dashboards, and implementation roadmaps.',
          vi: 'Thiết kế cấu trúc website, điểm chạm số, dashboard báo cáo và lộ trình triển khai.'
        },
        {
          en: 'Identified practical opportunities for CRM, automation, AI-assisted operations, and future SaaS adoption.',
          vi: 'Xác định cơ hội thực tế cho CRM, tự động hoá, vận hành có AI hỗ trợ và việc áp dụng SaaS về sau.'
        },
        {
          en: 'Coordinated implementation activities between business owners and delivery teams.',
          vi: 'Điều phối hoạt động triển khai giữa chủ doanh nghiệp và đội thực hiện.'
        },
        {
          en: 'Applied AI-assisted development and automation concepts to improve delivery speed and operational efficiency.',
          vi: 'Áp dụng phát triển có AI hỗ trợ và các ý tưởng tự động hoá để tăng tốc độ triển khai và hiệu quả vận hành.'
        }
      ],
      deliverables: [
        { en: 'Customer journey', vi: 'Hành trình khách hàng' },
        { en: 'Service workflow', vi: 'Quy trình dịch vụ' },
        { en: 'Website structure', vi: 'Cấu trúc website' },
        { en: 'Digital roadmap', vi: 'Lộ trình số hoá' },
        { en: 'Automation opportunity map', vi: 'Bản đồ cơ hội tự động hoá' },
        { en: 'Reporting concept', vi: 'Ý tưởng báo cáo' }
      ],
      outcomes: [
        {
          en: 'Turned broad digital-transformation goals into prioritized, actionable initiatives.',
          vi: 'Biến mục tiêu chuyển đổi số chung chung thành các sáng kiến có thứ tự ưu tiên và làm được ngay.'
        },
        {
          en: 'Connected customer-facing experience with internal operational improvements.',
          vi: 'Kết nối trải nghiệm phía khách hàng với cải tiến vận hành nội bộ.'
        },
        {
          en: 'Created a foundation for CRM, automation, and future SaaS adoption.',
          vi: 'Tạo nền tảng cho CRM, tự động hoá và việc áp dụng SaaS về sau.'
        }
      ],
      disclosure: {
        en: 'Client names and operational details are grouped and generalized for privacy.',
        vi: 'Tên khách hàng và chi tiết vận hành được gộp nhóm và khái quát hoá để bảo vệ quyền riêng tư.'
      }
    },
    {
      slug: 'tribe-fintech',
      title: 'Tribe Fintech Integration',
      shortTitle: 'Fintech API integration',
      timeframe: { en: 'Apr 2022 — Apr 2023', vi: '04/2022 — 04/2023' },
      role: 'Business Analyst · UX Consultant',
      disciplines: ['analysis', 'systems'],
      visual: 'api',
      summary: {
        en: 'Business and technical analysis for third-party API integrations, feature feasibility, and delivery documentation in a fintech product context.',
        vi: 'Phân tích nghiệp vụ và kỹ thuật cho việc tích hợp API bên thứ ba, đánh giá tính khả thi của tính năng và tài liệu triển khai trong bối cảnh sản phẩm fintech.'
      },
      challenge: {
        en: 'Translate third-party API capabilities and constraints into viable product workflows, integration requirements, and stakeholder decisions.',
        vi: 'Chuyển khả năng và giới hạn của API bên thứ ba thành quy trình sản phẩm khả thi, yêu cầu tích hợp và quyết định cho các bên liên quan.'
      },
      contributions: [
        {
          en: 'Evaluated third-party APIs, integration models, business workflows, and feature feasibility.',
          vi: 'Đánh giá API bên thứ ba, mô hình tích hợp, quy trình nghiệp vụ và tính khả thi của tính năng.'
        },
        {
          en: 'Defined functional requirements, integration approaches, and supporting technical documentation.',
          vi: 'Xác định yêu cầu chức năng, hướng tích hợp và tài liệu kỹ thuật đi kèm.'
        },
        {
          en: 'Conducted risk analysis for new features and supported stakeholder review.',
          vi: 'Phân tích rủi ro cho tính năng mới và hỗ trợ các buổi review với các bên liên quan.'
        },
        {
          en: 'Worked with developers to clarify customized API workflows and delivery considerations.',
          vi: 'Làm việc với lập trình viên để làm rõ các luồng API tuỳ biến và những điểm cần lưu ý khi triển khai.'
        }
      ],
      deliverables: [
        { en: 'API assessment', vi: 'Đánh giá API' },
        { en: 'Integration workflow', vi: 'Quy trình tích hợp' },
        { en: 'Functional requirements', vi: 'Yêu cầu chức năng' },
        { en: 'Risk considerations', vi: 'Các cân nhắc rủi ro' },
        { en: 'Stakeholder review material', vi: 'Tài liệu review cho các bên liên quan' }
      ],
      outcomes: [
        {
          en: 'Improved clarity around integration feasibility and technical dependencies.',
          vi: 'Làm rõ hơn tính khả thi của việc tích hợp và các phụ thuộc kỹ thuật.'
        },
        {
          en: 'Provided a structured basis for implementation and stakeholder review.',
          vi: 'Cung cấp cơ sở có cấu trúc cho việc triển khai và review với các bên liên quan.'
        },
        {
          en: 'Reduced ambiguity between product requirements and third-party API behavior.',
          vi: 'Giảm sự mơ hồ giữa yêu cầu sản phẩm và hành vi của API bên thứ ba.'
        }
      ],
      disclosure: {
        en: 'Public CV summary. Vendor details and internal integration documentation are omitted.',
        vi: 'Tóm tắt từ CV công khai. Thông tin nhà cung cấp và tài liệu tích hợp nội bộ được lược bỏ.'
      }
    }
  ],
  experience: [
    {
      period: { en: '2024 — Present', vi: '2024 — Hiện tại' },
      title: 'UX/UI Design Lead · Product Consultant · Business Analyst',
      organization: 'EGS Software · BeeTrade Technologies',
      summary: {
        en: 'Leading product design and business analysis for AI-enabled, enterprise, fintech, and realtime dashboard products.',
        vi: 'Dẫn dắt thiết kế sản phẩm và phân tích nghiệp vụ cho các sản phẩm ứng dụng AI, doanh nghiệp, fintech và dashboard thời gian thực.'
      }
    },
    {
      period: '2022 — 2024',
      title: 'UX/UI Designer · Business Analyst',
      organization: 'VMO Holding · VINOVA',
      summary: {
        en: 'Delivered end-to-end web and mobile UX, workflows, requirements, prototypes, design systems, and Agile delivery documentation.',
        vi: 'Thực hiện trọn vẹn UX web và mobile, quy trình, yêu cầu, prototype, design system và tài liệu triển khai theo Agile.'
      }
    },
    {
      period: '2020 — 2022',
      title: 'UX/UI Designer',
      organization: 'ProX Global · ITS Global · Antien.vn',
      summary: {
        en: 'Designed responsive interfaces, dashboards, landing pages, operational workflows, and reusable visual assets.',
        vi: 'Thiết kế giao diện responsive, dashboard, landing page, quy trình vận hành và bộ tài sản hình ảnh dùng lại được.'
      }
    },
    {
      period: { en: '2022 — Present', vi: '2022 — Hiện tại' },
      title: {
        en: 'Independent Product & Digital Transformation Consultant',
        vi: 'Tư vấn độc lập về sản phẩm & chuyển đổi số'
      },
      organization: {
        en: 'Selected enterprise and SME engagements',
        vi: 'Một số dự án với doanh nghiệp lớn và SME'
      },
      summary: {
        en: 'Consulting on workflow analysis, monitoring dashboards, digital touchpoints, solution framing, and AI-assisted delivery.',
        vi: 'Tư vấn về phân tích quy trình, dashboard giám sát, điểm chạm số, định hình giải pháp và triển khai có AI hỗ trợ.'
      }
    }
  ],
  education: [
    { en: 'FPT International Academy — Information Technology', vi: 'FPT International Academy — Công nghệ thông tin' },
    { en: 'National Economics University — Business Administration', vi: 'Đại học Kinh tế Quốc dân — Quản trị kinh doanh' },
    { en: 'Arena Multimedia — Communication Design', vi: 'Arena Multimedia — Thiết kế truyền thông' }
  ],
  certifications: [
    'International Programmer — Aptech',
    'Google UX Design — Coursera',
    'Business Analysis and Process Management — Coursera'
  ],
  tools: ['Figma', 'FigJam', 'Jira', 'Confluence', 'Postman', 'SQL', 'Excel', 'GitHub', 'Cursor', 'Claude', 'ChatGPT', 'Photoshop', 'Illustrator'],
  activities: [
    { en: 'Founder & President — VMO Music Club', vi: 'Sáng lập & Chủ nhiệm — VMO Music Club' },
    { en: 'Volunteer — PMI Vietnam Chapter, Event Committee', vi: 'Tình nguyện viên — PMI Vietnam Chapter, Ban sự kiện' },
    { en: 'Aptech Full Scholarship Recipient', vi: 'Học bổng toàn phần Aptech' }
  ]
};
