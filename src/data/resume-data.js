export const resumeData = {
  zh: {
    labels: {
      targetPosition: "求职意向",
      age: "年 龄",
      gender: "性 别",
      phone: "电 话",
      email: "邮 箱",
      github: "Github",
      selfEvaluation: "自我评价",
      educationBackground: "教育背景",
      majorCourse: "主修课程",
      examResults: "考研成绩",
      projectExperience: "项目经历",
      internshipExperience: "实习经历",
      projectBackground: "项目背景",
      responsibilities: "主要职责",
      techStack: "技术栈",
      saveData: "保存修改",
      exportPDF: "导出 PDF",
      exportPNG: "导出图片 (PNG)",
      settingsPage1: "第一页排版",
      settingsPage2: "第二页排版",
      saving: "同步中...",
    saveSuccess: "您的简历数据已成功同步至 Lumi 云端服务器。",
      exportFailed: "导出失败，请确保后端服务已启动",
      prompt: "欣妍提示：已根据 A4 尺寸进行分页模拟，并支持黑白打印优化。每一页都配有统一的 Header 装饰。点击文字即可编辑。"
    },
    personal_info: {
      name: "钱卢骏",
      target_position: "前端开发 | AI 全栈开发 | 随时到岗",
      age: "23 岁",
      gender: "男",
      phone: "18012858611",
      email: "nathanstefanqian@gmail.com",
      github: "github.com/Nathanstefanqian",
      photo: "https://api.dicebear.com/7.x/avataaars/png?seed=Milo&backgroundColor=b6e3f4"
    },
    self_evaluation: [
      "1年**前端开发**经验，完整上线和拍约拍 B 端与 C 端，熟悉企业项目开发全流程，并可独立完成项目开发与落地工作。参与多次全国性软件开发比赛，并得到国赛一等奖",
      "具有 **Agent 全栈开发能力**，专注前端与 AI 的深度融合，深入实践基于  **Spec**  驱动的 AI 全栈协作与 **Vibe Coding** 开发模式。熟练使用 **Cursor**、**Trae** 等下一代 AI 辅助编程工具，具备极强的人机协作效率与工程落地速度。技术栈包含：NestJS、LangChain、RAG、Agent、React、Vue、Uniapp 等",
      "紧跟技术前沿，不仅熟悉基础的 **Function Calling** 工具调用(联网搜索)，还率先实践了最新的 **MCP** 协议与 **OpenClaw** Agent 框架，实现了 Agent 与外部工具集的标准化、插拔式连接，具备构建复杂 AI 交互系统的能力",
      "熟悉算法，并可以讲算法知识应用到实际企业项目开发中，完成 LeetCode 题目 200 余道"
    ],
    education_background: [
      {
        period: "2026-10 ~ 2029-03",
        school: "上海大学",
        major: "电子信息 (硕士)",
        skills: "AI Agent，计算机图形学，数字图像处理，AI 视频生成，AIGC 影视处理技术",
        exam_results: "2026 年全国研究生招生考试上海大学电子信息专业硕士初试成绩 393 总成绩 323.5 , 排名第一"
      },
      {
        period: "2021-09 ~ 2025-06",
        school: "南通大学",
        major: "软件工程 (本科)",
        skills: "Web 前端应用开发，数据结构，离散数学，操作系统，计算机网络，软件工程，数据库技术"
      }
    ],
    internship_experience: [
      {
        period: "2024-10 ~ 2025-06",
        company: "南京何尝摄影有限公司",
        position: "前端开发工程师 (实习)",
        projects: [
          {
            name: "和拍约拍顾客摄影师端 - 微信小程序 (Uniapp、uViewPlus、Pinia、OSS、Ping++)",
            project_background: "针对摄影约拍行业中订单管理混乱、摄影师与顾客信息不对称的行业痛点，开发并上线了一套闭环约拍系统。通过标准化订单流转与实时消息推送，解决线下预约流程繁琐、交付不及时的问题，实现了从下单到成片交付的全流程数字化管理。",
            details: [
              "独立 **0 ~ 1 完成并落地**整个项目，熟悉项目中所有模块的开发细节，并熟悉小程序从开发、测试、上线的完成方案",
              "构建整个复杂逻辑的**订单管理业务流程**，包括：接单、验券、摄影师上传、精修、评价等。并对接公众号订阅、短信通知",
              "基于 **QRCode** 生成验券二维码，并通过 **SSE** 接收服务端推送验券消息。",
              "独立构建 **日期+时间选择器** 组件，解决独特业务下的摄影预约的问题，并沉淀出可复用方案",
              "独立构建 **多图片选择器 + preview** 图片预览功能，解决 C 端用户在查看摄影图片时的业务流程问题，沉淀下可复用组件",
              "针对大量图片的展示问题，构建出**瀑布流 + 上拉加载 + 图片懒加载**的完整业务方案，可完成超复杂图片长列表的展示功能",
              "对接**阿里云 OSS 平台**，完成整个 **图片裁剪 + 图片压缩 + OSS 上传** 的完整业务流程",
              "通过 **异步加载 + 分包** 的方式，解决 OSS 包体积过大导致主包超过 2M 的问题",
              "基于自定义逻辑构建 **埋点 + 监控方案**，并对埋点监控数据进行分级处理，采用 **实时上报 + 统一上报** 的方案完成整个埋点业务",
              "基于 **ping++** 平台对接支付逻辑，支持：微信支付、支付宝、银行卡支付 等支付逻辑",
              "其他的微信原生 API 功能调用，如：微信登录、定位、用户信息获取、通知 等"
            ]
          },
          {
            name: "和拍传图平台 + 和拍管理系统 (Vue、Vite、ECharts)",
            details: [
              "针对登录业务，构建 **登录权限验证 + 白名单策略**，并对接 **短信验证码 + 人类行为验证** 功能，沉淀出完整的登录业务方案",
              "解决复杂 Table 的大量重复 **筛选栏** 问题，构建通用筛选栏功能，可通过可配置的方案，快速生成不同页面下的筛选字段",
              "设计并实现基于**RBAC模型**的权限控制系统，支持角色分配和权限管理，实现页面和按钮级别的权限控制",
              "针对搜索模块配合 **FuseJS** 实现模糊搜索能力，支持：英文搜索、拼音搜索 等。可在 数据搜索、路由检索 等业务下使用"
            ]
          },
          {
            name: "基于 Koa.js 的 Restful Api 服务 (Koa、MySQL)",
            details: [
              "基于 **Koa.js** 框架开发 RESTful API 服务，实现 **Sequelize ORM** 的数据持久化方案，构建了功能完整的内容管理系统后端服务",
              "设计并实现了基于 **RSA** 非对称加密的用户认证系统，集成了 **JWT token** 认证机制，实现基于 **SHA256 + Salt** 的密码存储方案",
              "实现了细粒度的权限控制系统，支持管理员和编辑两种角色的动态权限管理，实现文章内容的 **Markdown** 和富文本双模式编辑",
              "采用模块化的系统架构设计，实现了路由, 中间件, 核心业务逻辑的分层管理，并集成了 **Swagger** 文档自动生成功能"
            ]
          }
        ]
      }
    ],
    project_experience: [
      {
        project_name: "Lumi - 基于 RAG 的闭环审计 AI Agent 智能客服系统 (NestJS、Vue3、LangChain、RAG、Agent)",
        date: "2024.01 - 至今",
        role: "核心开发者",
        project_background: "针对摄影约拍场景下客诉纠纷多、极度依赖情绪价值以及传统客服复制粘贴效率低的痛点。深入实践 **Vibe Coding 范式**,构建基于 **RAG** 的**闭环审计 AI Agent** 智能客服平台。系统深入结合和拍约拍白皮书与高频 FAQ 话术库，实现大模型 24 小时秒级高质量答疑与情绪安抚。项目核心研究用户复杂意图匹配与大模型幻觉问题，通过**前置词典统一黑话**、**父子块检索**以及**生成 - 审计双 agent 机制**，将幻觉率大幅降低；同时，Agent 能够根据聊天上下文，在绝对合规的安全红线内，进行订单状态的自动化变更与人工客服对接，追求既能温柔聊天又不会跨越安全红线的业务闭环。",
        responsibilities: [
          "基于 **NestJS + Vue3** 全栈技术架构，以 **LangChain LCEL** 实现模块化 Agent 工作流，支持多模型(DeepSeek/Doubao) **动态路由**与 **SSE 流式输出**。引入意图识别与情绪识别机制，将 70% 的日常 FAQ、普通咨询流量自动路由分发至高性价比的 **Doubao-lite** 模型，而对于 30% 涉及改期、退款等高风险纠纷流，动态路由至逻辑严密的 **Doubao-pro** 模型，在保障复杂业务处理效果的同时大幅降低了 **Token 消耗成本**。",
          "构建 **RAG** 知识库系统，基于**向量数据库**建立私有知识库，针对不同数据源实施差异化切分策略：官方白皮书采用 Markdown 标题语义分块（保留 50-80 字符重叠度）；标准 FAQ 按 JSON 条目整对切分（零重叠防止污染）；SOP 方法论采用 **父子块机制** 保证步骤不被撕裂。统一集成 SiliconFlow 托管的 **BGE-M3** 多语言 Embedding 模型实现高精度语义搜索。",
          "设计**“生成-审计”**双 Agent 架构。 遇高风险纠纷场景时触发审计流，由 **Doubao-pro** 担任 Judge 模型，基于 **Ragas** 归因性指标（Faithfulness）实时溯源审计。若得分低于 0.8 红线则让生成模型启动 **Reflection（反思机制）**重试；若多次重试失败，则序列化记录 **Bad case** 日志并触发降级机制转人工处理，将大模型客诉幻觉率降低了 20%。",
          "实现基于**滑动窗口**与**多级摘要压缩**的 客服对话上下文管理 机制。 针对长对话导致的注意力损耗，设计阶梯式记忆管理：超出窗口后触发原子压缩（删去语气词、仅提炼陈述性业务事实）；跨天触发中期摘要（整合为连贯的故事线业务进展）；超 7 天转换为长期标签画像。",
          "通过 **Tracing 全链路快照**，实时将 Query、召回 Context 及最终 Prompt 序列化为 **JSON 快照**, 构建包含 100 组用户 query的离线黄金评测集，利用 **LLM-as-a-Judge** 橫向评测不同文档切分标准与模型分流策略下的 Faithfulness（忠实度）表现，数据驱动找出最优 RAG 设计",
          "集成基于 **Function Calling** (工具调用) 的自主执行能力，使 客服 Agent 能够根据用户需求动态决定并调用Tool，实时查询订单状态和业务流转信息. 同时关注并支持最新的 **MCP (Model Context Protocol)** 协议，实现了 Agent 与外部工具集的标准化、插拔式连接",
        ]
      }
    ]
  },
  en: {
    labels: {
      targetPosition: "Target Position",
      age: "Age",
      gender: "Gender",
      phone: "Phone",
      email: "Email",
      github: "Github",
      selfEvaluation: "Self Evaluation",
      educationBackground: "Education",
      majorCourse: "Major Courses",
      examResults: "Exam Results",
      projectExperience: "Project Experience",
      internshipExperience: "Internship Experience",
      projectBackground: "Background",
      responsibilities: "Responsibilities",
      techStack: "Tech Stack",
      saveData: "Save Changes",
      exportPDF: "Export PDF",
      exportPNG: "Export Images (PNG)",
      settingsPage1: "Page 1 Layout",
      settingsPage2: "Page 2 Layout",
      saving: "Saving...",
      saveSuccess: "Data saved to local storage! It will load automatically next time.",
      exportFailed: "Export failed. Please ensure the backend service is running.",
      prompt: "Tip: A4 pagination simulated with black & white print optimization. Each page has a unified header. Click text to edit."
    },
    personal_info: {
      name: "Lujun Qian (Nathan)",
      target_position: "Frontend Developer | AI Full-stack Developer | Available Immediately",
      age: "23 Years Old",
      gender: "Male",
      phone: "+86 18012858611",
      email: "nathanstefanqian@gmail.com",
      github: "github.com/Nathanstefanqian",
      photo: "/avatar.jpg"
    },
    self_evaluation: [
      "1 year of frontend development experience, successfully launched 'Hepai' B2B & B2C platforms. Familiar with the full lifecycle of enterprise projects and capable of independent development and deployment. Awarded National First Prize in several software development competitions.",
      "Proficient in **AI Agent full-stack development**, focusing on the deep integration of frontend and AI. Deeply understand and practice the **Vibecoding** development model. Expert in using next-gen AI tools like **Trae** for high-efficiency human-AI collaboration. Tech stack: NestJS, LangChain, RAG, Agent, React, Vue, Uniapp, etc.",
      "Stay at the forefront of technology; not only familiar with basic **Function Calling** but also pioneered the latest **MCP** (Model Context Protocol) and **OpenClaw** Agent frameworks. Achieved standardized, plug-and-play connections between Agents and external tools.",
      "Strong algorithmic foundation applied to real enterprise projects, with over 200 LeetCode problems solved."
    ],
    education_background: [
      {
        period: "2026-09 ~ 2029-06",
        school: "Shanghai University",
        major: "Electronic Information (Master)",
        skills: "AI Agent, Computer Graphics, Digital Image Processing, AI Video Generation, AIGC Film Processing.",
        exam_results: "Ranked 1st in the 2026 National Entrance Exam for Shanghai University (Score: 393/323.5)."
      },
      {
        period: "2021-09 ~ 2025-06",
        school: "Nantong University",
        major: "Software Engineering (Bachelor)",
        skills: "Web Frontend Development, Data Structures, Discrete Mathematics, Operating Systems, Computer Networks, Software Engineering, Database Technology."
      }
    ],
    internship_experience: [
      {
        period: "2024-10 ~ 2025-06",
        company: "Nanjing Hechang Photography Co., Ltd.",
        position: "Frontend Developer Intern",
        projects: [
          {
            name: "Hepai Photography Mini Program (Uniapp, uViewPlus, Pinia, OSS, Ping++)",
            project_background: "Developed a closed-loop photography booking system to address industry pain points like chaotic order management and information asymmetry. Standardized order flows and real-time messaging achieved full-process digital management from booking to delivery.",
            details: [
              "Independently completed the project from **0 to 1**, handling all development details and the full lifecycle from testing to launch.",
              "Built complex **order management workflows** including booking, coupon verification, photographer uploads, retouching, and reviews. Integrated WeChat Official Account subscriptions and SMS notifications.",
              "Implemented **QRCode** verification and used **SSE** (Server-Sent Events) for real-time status updates. Optimized QR generation logic to under 3 seconds.",
              "Developed custom **Date+Time Picker** components for unique booking scenarios, creating a reusable solution.",
              "Created a **Multi-image Picker + Preview** component to streamline the user experience for viewing photography portfolios.",
              "Solved large-scale image display issues with a robust **Waterfall Flow + Infinite Scroll + Lazy Loading** solution.",
              "Integrated **Alibaba Cloud OSS** for a seamless **Crop + Compress + Upload** workflow.",
              "Used **Asynchronous Loading + Sub-packaging** to keep the main bundle size under the 2MB limit.",
              "Designed a custom **Event Tracking + Monitoring** solution with hierarchical data reporting (Real-time + Batch).",
              "Integrated **Ping++** to support multiple payment methods: WeChat Pay, Alipay, and Bank Cards.",
              "Utilized native WeChat APIs for Login, Geolocation, User Info, and Notifications."
            ]
          },
          {
            name: "Hepai Image Platform & Admin System (Vue, Vite, ECharts)",
            details: [
              "Built a secure login system with **Permission Validation + Whitelist Policy**, integrated SMS codes and CAPTCHA.",
              "Developed a **Generic Filter Bar** for complex tables, enabling rapid generation of filter fields via configuration.",
              "Implemented an **RBAC (Role-Based Access Control)** system supporting page-level and button-level permissions.",
              "Integrated **FuseJS** for fuzzy search capabilities supporting English and Pinyin for data and route retrieval."
            ]
          },
          {
            name: "Restful API Service (Koa.js, MySQL)",
            details: [
              "Developed RESTful API services using **Koa.js** and **Sequelize ORM** for data persistence in a CMS backend.",
              "Implemented **RSA asymmetric encryption** for user authentication, integrated JWT tokens, and SHA256+Salt password storage.",
              "Achieved fine-grained permission control for Admin/Editor roles and supported Markdown/Rich-text editing.",
              "Adopted a modular architecture for routing, middleware, and business logic, with automated **Swagger** documentation."
            ]
          }
        ]
      }
    ],
    project_experience: [
      {
        project_name: "Lumi - Reliable RAG-based AI Agent Knowledge Base (NestJS, Vue3, LangChain, RAG, Agent)",
        project_background: "Addressed the 'hallucination' issue in LLMs for vertical domains. Researched and implemented a **RAG (Retrieval-Augmented Generation)** architecture with a closed-loop audit system to ensure source traceability and significantly improve reliability and accuracy.",
        responsibilities: [
          "Built a full-stack architecture using **NestJS + Vue3**, implementing modular Agent workflows with **LangChain LCEL**. Supported dynamic routing for multiple models (DeepSeek/OpenAI) and **SSE streaming output**.",
          "Constructed a RAG system using vector databases and integrated **BGE-M3** multi-language embeddings via **SiliconFlow** for high-precision semantic search.",
          "Designed a **'Generate-Audit' dual-Agent** architecture. Used a Judge model based on **RAGAS attribution scoring** to reduce hallucinations by 30%.",
          "Implemented **Sliding Window** and **Summary Compression** to handle long-context dialogues and mitigate LLM attention loss.",
          "Developed a **Role-Task-Constraint** structured prompt framework, combined with **Few-shot + CoT** to enhance reasoning stability.",
          "Conducted **LLM-as-a-Judge** prompt A/B testing. Used Tracing to serialize Query, Context, and Prompt into **JSON snapshots** for data-driven iteration.",
          "Integrated **Function Calling** capabilities allowing the Agent to dynamically invoke external APIs. Supported the **MCP** (Model Context Protocol) for standardized tool connections.",
          "Designed an adaptive workflow router combining **Tavily search** and vector DB retrieval to dynamically choose information paths based on intent.",
          "Built a multimodal vision pipeline using **Qwen-VL-Max** for feature extraction and semantic parsing, transitioning the system from text-only to multimodal interaction."
        ]
      }
    ]
  }
};
