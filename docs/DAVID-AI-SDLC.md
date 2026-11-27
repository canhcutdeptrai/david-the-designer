# AI trong SDLC — Chiến lược chuyển đổi

> **Ghi chú tham khảo.** Đây là bản chép lại nội dung một báo cáo của OneMount, lấy từ <https://ai-sdlc.onemount.dev/sdlc/report/slide/>. Nội dung, số liệu và phương pháp trong file thuộc về OneMount và các tác giả của báo cáo. Đây không phải tác phẩm của chủ repo này (Van The Duy / David) và không thuộc portfolio; file chỉ được lưu để đọc và tra cứu.

Áp dụng AI trong vòng đời phát triển phần mềm (SDLC).

| | |
|---|---|
| Nguồn | Báo cáo của OneMount: <https://ai-sdlc.onemount.dev/sdlc/report/slide/> |
| Dạng gốc | Bộ 40 slide trên web (mỗi slide một đường dẫn riêng) |
| Ngày lấy nội dung | 2026-11-27 |
| Ngôn ngữ | Tiếng Việt, giữ nguyên văn |

File này chép lại toàn bộ chữ trên 40 slide theo đúng thứ tự trình chiếu. Cách đọc:

- Mỗi slide là một mục `## N. Tiêu đề`.
- Chữ trên slide được giữ nguyên văn, trừ dòng nhãn ở trang bìa và vài từ đã lược ở năm chỗ; bố cục (thẻ, cột, lưới) được chuyển thành tiêu đề, danh sách và bảng.
- Hai slide là sơ đồ (29 và 30): chỉ chép được nhãn chữ trong sơ đồ, không chép được các mũi tên nối.
- Slide 34 có công cụ bấm chọn; các kết quả ẩn sau lựa chọn đã được chép lại đầy đủ.
- Hình minh hoạ, biểu tượng và thanh tiến độ không có chữ nên không xuất hiện ở đây.

## Mục lục

1. [AI trong SDLC](#1-ai-trong-sdlc)
2. [Nội dung trình bày](#2-nội-dung-trình-bày)
3. [Cấp độ áp dụng AI](#3-cấp-độ-áp-dụng-ai)
4. [Mục tiêu & Phạm vi POC](#4-mục-tiêu--phạm-vi-poc)
5. [Bức tranh đo lường các dự án](#5-bức-tranh-đo-lường-các-dự-án)
6. [Deliverables](#6-deliverables)
7. [Quy trình SDLC tích hợp AI](#7-quy-trình-sdlc-tích-hợp-ai)
8. [Framework Spec-Driven Development](#8-framework-spec-driven-development)
9. [Thư viện Skills & Rules AI dùng chung](#9-thư-viện-skills--rules-ai-dùng-chung)
10. [Khung Governance — 5 Nguyên tắc cốt lõi](#10-khung-governance--5-nguyên-tắc-cốt-lõi)
11. [LLM · Platform · Skills — 3 tầng](#11-llm--platform--skills--3-tầng)
12. [LLM · PLATFORM · SKILLS](#12-llm--platform--skills)
13. [Hạ tầng LLM Gateway](#13-hạ-tầng-llm-gateway)
14. [So sánh tool AI coding](#14-so-sánh-tool-ai-coding)
15. [Hướng dẫn sử dụng AI chung](#15-hướng-dẫn-sử-dụng-ai-chung)
16. [Khung quyết định](#16-khung-quyết-định)
17. [Cấu trúc đội ngũ](#17-cấu-trúc-đội-ngũ)
18. [Phân loại sản phẩm](#18-phân-loại-sản-phẩm)
19. [Ma trận quyết định](#19-ma-trận-quyết-định)
20. [Phân nhóm đội ngũ theo năng lực AI](#20-phân-nhóm-đội-ngũ-theo-năng-lực-ai)
21. [Next Action](#21-next-action)
22. [Benefit của hai hướng chuyển đổi](#22-benefit-của-hai-hướng-chuyển-đổi)
23. [Đầu tư cần thiết cho chuyển đổi](#23-đầu-tư-cần-thiết-cho-chuyển-đổi)
24. [4 KPI cốt lõi đo AI trong SDLC](#24-4-kpi-cốt-lõi-đo-ai-trong-sdlc)
25. [Lộ trình & action](#25-lộ-trình--action)
26. [Kết luận & Đề xuất](#26-kết-luận--đề-xuất)
27. [Phụ lục](#27-phụ-lục)
28. [Nguồn tham khảo](#28-nguồn-tham-khảo)
29. [Workflow SDLC AI — Diagram gốc](#29-workflow-sdlc-ai--diagram-gốc)
30. [SDD Framework — Diagram gốc](#30-sdd-framework--diagram-gốc)
31. [PRISM — Chuyển dịch cách làm việc](#31-prism--chuyển-dịch-cách-làm-việc)
32. [PRISM — Cách vận hành thực tế](#32-prism--cách-vận-hành-thực-tế)
33. [PRISM — Cấu trúc thư mục project](#33-prism--cấu-trúc-thư-mục-project)
34. [Áp dụng PRISM theo loại dự án](#34-áp-dụng-prism-theo-loại-dự-án)
35. [Greenfield L3 · Vừa & nhỏ](#35-greenfield-l3--vừa--nhỏ)
36. [Greenfield L3 · Lớn](#36-greenfield-l3--lớn)
37. [Brownfield L2 · BAU / ít thay đổi](#37-brownfield-l2--bau--ít-thay-đổi)
38. [Brownfield L3 · Vừa & nhỏ](#38-brownfield-l3--vừa--nhỏ)
39. [Brownfield L3 · Lớn](#39-brownfield-l3--lớn)
40. [Cảm ơn & Q&A](#40-cảm-ơn--qa)

---

## 1. AI trong SDLC

Chiến lược ứng dụng AI vào toàn bộ vòng đời phát triển phần mềm.

---

## 2. Nội dung trình bày

*Agenda · Số trên slide: 2*

Tổng quan & Kết quả POC

#### 3 · Cấp độ áp dụng AI

#### 4 · Mục tiêu & Phạm vi POC

#### 5 · Bức tranh đo lường các dự án

Deliverables

#### Phần I — Deliverables

**6 Mở phần**

#### 7 · Quy trình SDLC tích hợp AI

#### 8 · Framework Spec-Driven Development

#### 9 · Thư viện Skills & Rules AI dùng chung

#### 10 · Khung Governance — 6 trụ cột

#### 11 · LLM · Platform · Skills — 3 tầng

#### 12 · LLM · Platform · Skills — Architecture blueprint

#### 13 · Hạ tầng LLM Gateway

#### 14 · So sánh tool AI coding

#### 15 · Hướng dẫn sử dụng AI chung

Khung quyết định

#### Phần II — Khung quyết định

**16 Mở phần**

#### 17 · Cấu trúc đội ngũ

#### 18 · Phân loại sản phẩm

#### 19 · Ma trận quyết định

#### 20 · Phân nhóm đội ngũ theo năng lực AI

Next Action

#### Phần III — Next Action

**21 Mở phần**

#### 26 · Benefit chuyển đổi L1→L2 / L1→L3

#### 27 · Đầu tư cho chuyển đổi

#### 28 · Đo đạc các chỉ số

#### 29 · Lộ trình & action

#### 30 · Kết luận & Đề xuất

Phụ lục

#### Phụ lục

**31 Mở phần**

#### 32 · Nguồn tham khảo

#### 33 · Workflow — Diagram gốc

#### 34 · SDD Framework — Diagram gốc

#### 35 · PRISM — Chuyển dịch cách làm việc

#### 36 · PRISM — Cách vận hành thực tế

#### 37 · PRISM — Cấu trúc thư mục project

#### 38 · Áp dụng PRISM theo loại dự án

#### 39 · Runbook — Greenfield L3 vừa & nhỏ

#### 40 · Runbook — Greenfield L3 lớn

#### 41 · Runbook — Brownfield L2

#### 42 · Runbook — Brownfield L3 vừa & nhỏ

#### 43 · Runbook — Brownfield L3 lớn

---

## 3. Cấp độ áp dụng AI

*Tổng quan · Cấp độ áp dụng · Số trên slide: 3*

Khung 4 cấp độ trưởng thành — từ Shadow đến AI-Native — kết hợp góc nhìn tổ chức, quy trình và mức tự chủ AI. Giúp lãnh đạo định vị sản phẩm và chọn bước tiến phù hợp với rủi ro. Tham khảo từ SAE Levels of Autonomy và thực tiễn ngành tính đến Q2/2026.

Mức

#### L1

Shadow / Tự phát

Cá nhân & rời rạc — chưa có chuẩn

- Mỗi người tự chọn tool, dùng tài khoản cá nhân
- Output AI nằm ngoài luồng review & bảo mật
- Không policy, không gate, không đo lường

Mức

#### L2

Tool-first · AI-Assisted

Tool & thư viện skills/rules dùng chung

- Bộ tool chính (Copilot, Codex, Claude, Cursor) truy cập qua LLM gateway
- Skills · rules · hooks · commands được công ty curate
- Cá nhân prompt AI để tăng tốc task của mình
- Quy trình & cấu trúc đội ngũ vẫn giữ nguyên

Mức

#### L3

Workflow-first · AI-Augmented

AI chạy theo framework — người duyệt từng gate

- AI đóng gói trong framework Spec-Driven (SDD)
- Người dùng prompt ngắn, AI hỏi để định hướng
- AI tự chạy spec → code → test theo từng giai đoạn
- Người duyệt kết quả mỗi gate, can thiệp khi cần
- Mindset PO / Dev / QC: chuyển từ người làm sang người review chất lượng output AI

Mức

#### L4

AI-Native · Agentic

AI tự chạy end-to-end — người feedback vòng ngoài

- Người chỉ đưa đề bài (spec / yêu cầu) ban đầu
- AI chạy trọn quy trình spec → code → test, không cần prompt trung gian
- Tương tác qua vòng feedback — đánh giá rồi AI chạy lượt mới
- Con người can thiệp trực tiếp chỉ khi sự cố / rủi ro cao

Khung tham khảo từ SAE Levels of Autonomy & các báo cáo ngành.

→ Xem nguồn tham khảo →

---

## 4. Mục tiêu & Phạm vi POC

*Tổng quan · Mục tiêu & Phạm vi POC · Số trên slide: 4*

POC 8 tuần (4 sprints) — chuẩn hoá việc sử dụng AI trong SDLC, biến AI thành năng lực chung có harness, không chỉ là tool cá nhân.

Cấp độ mục tiêu

#### Cấp độ L3 — Workflow-first

AI-Augmented

Đưa OneMount từ L1 (Shadow) lên L2 / L3 — biến AI từ tool cá nhân thành năng lực chuẩn hoá của tổ chức: chất lượng đầu ra đến từ spec + test + gate + harness, không phụ thuộc kỷ luật từng người.

→ Khung 4 cấp độ →

Tại sao chuẩn hoá — rủi ro khi giữ L1

Hiện trạng OneMount nằm ở L1 (Shadow) — mỗi người dùng AI riêng, tài khoản cá nhân, không có chính sách / gate / đo lường.

- 01 Thất thoát dữ liệu & bí mật kinh doanh khi prompt model public
- 02 Tri thức phân mảnh — prompt / skill ai biết người nấy, không tái sử dụng
- 03 Không đo được ROI — không biết AI giúp tiết kiệm bao nhiêu, ở đâu
- 04 Khó audit & tuân thủ — chưa có quy chuẩn ghi nhận / kiểm chứng output AI

Lộ trình L1 → L2 → L3 · chưa L4

- L2 Tool-first. Chuẩn hoá bộ tool + skills/rules dùng chung qua LLM gateway — giải bài toán kiểm soát & tái sử dụng ngắn hạn.
- L3 Workflow-first. AI đi vào workflow theo framework SDD, người duyệt từng gate — biến AI thành năng lực tổ chức.
- L4 AI-Native. Chưa đặt mục tiêu — chất lượng output AI chưa đủ ổn định để chạy không người duyệt; policy · harness · telemetry còn mới, đội ngũ chưa quen vận hành agent end-to-end.

#### 01 · Guideline & Governance

**Sprint 1**

- 01 Ban hành Data Governance & AI Policy
- 02 Định nghĩa AI Workflow & RACI con người ↔ AI
- 03 Thiết lập KPI Framework đo tác động AI

#### 02 · Framework & Tools — chuẩn hoá quy trình

**Sprint 1 – 2**

- 01 Đánh giá AI Coding Tools theo collaboration & khả năng kiểm soát
- 02 Curate thư viện Skills · Rules · Templates dùng chung
- 03 Xây AI SDLC Framework theo hướng Spec-Driven

#### 03 · Triển khai thử nghiệm

**Sprint 3**

- 01 Setup LLM gateway · tool adapters · meta-repo
- 02 Áp dụng AI SDLC Framework · Skills · Rules lên các dự án pilot
- 03 Thu thập feedback và cải thiện framework

#### 04 · Kết luận (Go / No-Go)

**Sprint 4**

- 01 Tiếp tục thu thập feedback & lặp cải thiện framework
- 02 So sánh chỉ số trước / sau khi áp dụng AI
- 03 Hoàn thiện hướng dẫn, quy định, Governance
- 04 Tổng kết — đề xuất Go / No-Go

---

## 5. Bức tranh đo lường các dự án

*Kết quả · Tổng hợp đo lường · Số trên slide: 5*

6 dự án (5 Greenfield, 1 Brownfield) trải từ L2 đến L4. Cùng một bộ chỉ số: năng suất (cảm quan), throughput, sản lượng code, độ phủ test — đối chiếu với chuẩn nền trước AI.

| Dự án | Tăng năng suất (cảm quan) | US / member / sprint | ELOC / dev / sprint | Code coverage | CC / method | Chi phí AI / người / tháng |
|---|---|---|---|---|---|---|
| Chuẩn trước khi áp dụng AI Trung bình các dự án trước đây | — | 0.3 ~ 0.5 đo tại OM | Chưa đo norme VN 1.000~1.500 | 0 ~ 50% đo tại OM | ~2 đo tại OM | — |
| AAM MAG Greenfield L3 Framework SDLC AI | ×2 8 → 4 sprint (22 -> 11 Man-Month) | 2.4 | 7.500 | 56% | ~2 | $150 ~ $300 5.5 mans |
| Consent Management Greenfield L4 Framework SDLC AI | ×2 ~ ×6 90 → 45 Man-Month | 19 | 25.000 | 52% | ~2 | ~$3.200 * 1 man |
| Staff App for GB Greenfield L2 Skills tự xây | ×1.5 26.8 → 14.39 Man-Month | 2.5 | 6.000 | 67% | ~2 | $125 7 mans |
| Nexa Brownfield L2 Chưa dùng skills | — xem note ở dưới | — | — | — | — | $25 |
| KeyStone Greenfield L2 Skills tự xây | Đang đo chưa có baseline | — | — | — | — | $125 |
| Health App Greenfield L3 Framework SDLC AI | Đang đo đang sắp xếp lại team | — | — | — | — | — |

Kết luận

- L2 chỉ là bước đệm để mọi người làm quen — đích đến ngắn hạn là tiến lên L3.
- L3 cùng Framework SDD (Spec-Driven Development) là mô hình mục tiêu trong ngắn hạn.
- Đội nhỏ gọn, linh hoạt mới phát huy hết hiệu quả.
- Kiến trúc tách bạch, độc lập để mỗi team chạy được độc lập, không dẫm chân nhau.
- Framework / Skills giúp số đông (chưa thành thạo AI) đạt năng suất ×1.5 – ×3, chất lượng không đổi.
- Với người đã thành thạo AI (nhóm quan trọng nhất), năng suất có thể đạt ≥ ×5.
- Mức áp dụng càng cao (tiến tới L4), throughput càng bứt phá.
- Tích hợp vẫn là nút thắt — code nhanh, nhưng phối hợp người & tài liệu thì không; thiếu tài liệu là chậm như xưa.

Xem thêm:

→ Định nghĩa cấp độ L2 / L3 →

→ Cấu trúc đội ngũ theo L2 / L3 →

Ghi chú theo dự án

- AAM MAG: PRD + Prototype ×2.5 · Mockup ×2 · Unit test ×10 · Viết test case ×3 · Script automation ×5.
- Consent Management: Ban đầu 3 dev + 1 SA. Nay 1 SA chạy full nên không cần 3 dev; SA kiêm luôn PO + Design — chỉ còn Project Manager + Tester (không bỏ được). Theo vai trò: ~6 người (3 dev + SA + PO + Design) → 1 người ⇒ lý thuyết ≈ ×6; kế hoạch nhân sự ước tính ×2 (thận trọng). Đã xong 70% phase 1 trong 3.5 tuần.
- Staff App for GB: Code AI gen tương đương 70–80% phần dev tự viết, dev chỉ sửa lại; tốc độ review nhanh hơn ~×2.
- Nexa: Tối ưu lẻ: MoM ×3 · viết PRD ×1.3 · PRD-Figma ×5. Chưa có số năng suất tổng nên không đưa vào cột.
- KeyStone: PRD/FSD xong 1 tuần sau chốt scope; DAB0/DAB1 thông qua trong 1 tháng; epics/stories đầy đủ trên Jira sau 2 ngày. Mới qua 1.5 sprint nên chưa đo.
- Health App: Đang áp dụng; team/scope đang sắp xếp lại, đa số nhân sự chưa quen cách làm mới nên chưa đo được.

Định nghĩa chỉ số & chuẩn nền

- Tăng năng suất là đánh giá cảm quan của team, chưa phải số đo chuẩn hoá.
- US / member / sprint có thể chênh tuỳ cách team estimate story point — đối chiếu tương đối, không so tuyệt đối giữa các dự án.
- ELOC (Effective Lines of Code) = số dòng code trung bình thay đổi mỗi sprint.
- CC / method = Cyclomatic Complexity mỗi hàm — số nhánh điều khiển độc lập trung bình; càng thấp càng dễ test & bảo trì. Giữ ổn định ≈ 2 ở tất cả dự án ⇒ AI không làm code rối hơn.
- Chuẩn nền: US/member/sprint & code coverage đo thực tế tại OM; ELOC norme 1.000–1.500 là mức trung bình dự kiến chung ở VN (chưa đo tại OM).
- *Consent Management: ~$3.200 là giá ước tính cho cả dự án (1 người, solo) — thực tế đang dùng miễn phí qua Codex Enterprise (free, fast mode).

---

## 6. Deliverables

*Phần I*

Bộ tài sản chuẩn bị sẵn cho việc triển khai AI trong SDLC — workflow, framework, guideline, hạ tầng dùng chung.

**9 deliverables · sẵn sàng triển khai**

**Nội dung phần này**

1. 7 Quy trình SDLC tích hợp AI Quy trình end-to-end (Product → Release)
2. 8 Framework Spec-Driven Development SDD — Spec-Driven Development
3. 9 Thư viện Skills & Rules AI dùng chung Bộ skills · rules · commands · hooks dùng chung
4. 10 Khung Governance — 6 trụ cột Bảo mật, trách nhiệm, chi phí, audit, phân quyền, quan sát
5. 11 LLM · Platform · Skills — 3 tầng
6. 12 LLM · Platform · Skills — Architecture blueprint
7. 13 Hạ tầng LLM Gateway Hạ tầng truy cập model dùng chung
8. 14 So sánh tool AI coding Copilot · Claude Code · Codex · Cursor
9. 15 Hướng dẫn sử dụng AI chung Setup môi trường · tổ chức repo · best practices

---

## 7. Quy trình SDLC tích hợp AI

*Deliverable · 01 · Số trên slide: 7*

6 phase theo SDLC Standard — mỗi phase có vai trò người, AI agent, output cụ thể và gate phê duyệt. AI làm công việc chính của từng phase; người validate trước khi approve. Deployment & Maintenance chưa integrate AI workflow ở giai đoạn này.

01 Phase · 6 outputs

#### Product

Requirement

Thu thập business context, viết PRD chuẩn enterprise.

**Outputs**

- prd-v{X}.md
- epics-v{X}.md
- user-stories-v{X}.md
- glossary-v{X}.md
- personas-v{X}.md
- market-research-v{X}.md

Human PO / BA — interview, refine, validate user story

AI BA Skills · ask comprehensive, draft, refine

**Gate**

PM approve product

02 Phase · 1 output

#### Design

UI / UX · Song song với Architecture

Wireframe, mockup, design system từ Product package.

**Outputs**

- design-v{X}.md

Human Designer — finalize, validate design

AI Design Tools · generate wireframe, mockup, UI system

**Gate**

Designer + PO approve

03 Phase · 8 outputs

#### Architecture

System Design · Song song với Design

SAD đầy đủ: schema, API, sequence, NFR — 8 artifacts.

**Outputs**

- architecture-v{X}.md
- sequence-v{X}.md
- erd-v{X}.md
- adr-v{X}.md
- data-flow-v{X}.md
- api-specs-v{X}.md
- events-v{X}.md
- nfr-v{X}.md

Human SA / TechLead — review, trade-offs, validate

AI Architect Agent · generate SAD, schema, API, events

**Gate**

SA + DAB approve architecture

04 Phase · 1 output

#### Plan

Implementation · Song song với Test

Phasing, breakdown, sequencing — chia delivery slices.

**Outputs**

- implementation-plan-v{X}.md

Human TL / Dev Lead — review, fine-tune, validate

AI Coding Agent (Planning Mode) · phasing, task breakdown

**Gate**

TL approve plan

05 Phase · 2 outputs

#### Test

Quality Assurance · Song song với Plan

Test plan + cases — manual exploratory + automation.

**Outputs**

- test-plan-v{X}.md
- test-cases-v{X}.md

Human QC — exploratory, sign-off Go / No-Go

AI Test Agent + Review Agent + Security scan

**Gate**

QC Lead approve test

06 Phase · 2 outputs

#### Implement

Code theo task group

AI code theo TGx.x; sau mỗi task group validate spec & quality riêng.

**Outputs**

- Source code theo TGx.x
- Unit / integration tests

Human TL / Devs — code review, validate từng TG

AI Coding Agent · start implement TGx.x, code, test, fix

**Gate**

mỗi TG spec + quality clean → approve implement

Sơ đồ cross-functional flowchart đầy đủ:

→ Xem diagram gốc →

---

## 8. Framework Spec-Driven Development

*Deliverable · 02 · Số trên slide: 8*

Workflow của SDD Framework: phase tuần tự với gate người duyệt, parallel ở Design × Architecture và Plan × Test, kết thúc bằng Orbit sealed → mở orbit mới. Validate là audit read-only chạy trước Approve.

#### START

Ý tưởng / Tài liệu

start · import · 01

#### Product

DRAFT · ⟲ · APPROVED

approve product

approve product

#### 02 · Design

DRAFT · ⟲ · APPROVED

approve design · 03

#### Architecture

DRAFT · ⟲ · APPROVED

approve arch

**Gate**

#### READY

P + D + A APPROVED

#### 04 · Plan

DRAFT · ⟲ · APPROVED

approve plan · 05

#### Test

DRAFT · ⟲ · APPROVED

approve test · 06

#### Implement

Validate spec/quality per TG

DRAFT · ⟲ · APPROVED

start implement TGx.x

test approved + all TG spec/quality clean

#### ORBIT SEALED

approve implement

orbit-v{X} sealed

**Next orbit**

#### orbit-v{X+1}

Plan / Test / Implement open

**Legend**

DRAFT — đang chỉnh sửa

APPROVED — đã chốt

Gate — điều kiện chuyển phase

Orbit sealed — chốt version

**Ops Control**

status

resume [phase | pack]

continue · diff [phase]

pick: 1 / orbit-v2 / slug

**Change Packs**

start change: [item]

feedback: [changes]

approve changes

Pack id: v{X.Y.Z}-slug

**Validate gates**

validate user story → approve product

validate design → approve design

validate architecture → approve arch

validate plan → approve plan

validate test → approve test

validate implementation TGx.x (spec + quality) → approve implement

Sơ đồ workflow đầy đủ với DRAFT/APPROVED states, ops & change packs:

→ Xem diagram gốc →

---

## 9. Thư viện Skills & Rules AI dùng chung

*Deliverable · 03 · Số trên slide: 9*

Bộ artefact được collect và curate ở cấp công ty — các team plug-in vào tool của mình thay vì tự build lại. Mỗi loại có chuẩn đóng gói, review và versioning.

#### 01 · Skills

Bộ năng lực đóng gói (Claude Code skills…)

#### 02 · Rules

.cursorrules · agent rules · per-tool

#### 03 · Slash Commands

Lệnh tắt tái sử dụng trong chat

#### 04 · Subagents

Agent chuyên dụng theo task

#### 05 · Hooks

Pre/Post-tool events, validate output

#### 06 · Prompts & Templates

Thư viện prompt + template chuẩn

---

## 10. Khung Governance — 5 Nguyên tắc cốt lõi

*Deliverable · 04 · Số trên slide: 10*

Trích từ Quy định Quản trị Dữ liệu triển khai AI trong PTSP. Áp dụng bắt buộc trên toàn Tập đoàn, xuyên suốt mọi giai đoạn SDLC.

Nguyên tắc

#### NT1

#### Trách nhiệm Giải trình

Human Accountability — AI là Copilot, con người là Pilot

- 01 Người dùng AI là người duyệt cuối và chịu 100% trách nhiệm output
- 02 AI không sở hữu code/PRD/test case — không copy-paste blind
- 03 Mọi PR/PRD AI sinh ra phải qua review trước khi commit

Nguyên tắc

#### NT2

#### Phân loại Dữ liệu & Zero Trust

Data Privacy — mặc định không tin Public AI

- 01 Phân loại dữ liệu (RED/ORANGE/YELLOW/GREEN) trước khi dùng AI
- 02 Chỉ GREEN (Public) được phép vào Public AI
- 03 Từ YELLOW (Internal) trở lên: bắt buộc Enterprise AI có ZDR + DPA

Nguyên tắc

#### NT3

#### Bảo vệ IP & Quản trị Vendor

IP & Vendor Management — không cho train trên dữ liệu của ta

- 01 Hợp đồng vendor bắt buộc: Opt-out of Training hoặc Zero Data Retention
- 02 Bắt buộc DPA theo GDPR Điều 28 và Nghị định 356/2025/NĐ-CP
- 03 Pháp chế rà soát và phê duyệt hợp đồng trước khi triển khai

Nguyên tắc

#### NT4

#### Minh bạch & Truy vết Toàn trình

Transparency & Traceability — biết ai làm gì, khi nào, ở đâu

- 01 Audit Trail ưu tiên tự động qua API log của Enterprise AI
- 02 Log: User ID, timestamp, tool, giai đoạn SDLC, cấp phân loại dữ liệu
- 03 Ghi thủ công chỉ là phương án dự phòng

Nguyên tắc

#### NT5

#### Tuân thủ Pháp lý & Đạo đức AI

Legal & Ethical Compliance — value không đi kèm rủi ro pháp lý

- 01 Tuân thủ EU AI Act, GDPR, Luật BVDLCN 2025, Luật AI 2025, NĐ 356
- 02 Rà soát bias / vi phạm đạo đức trước khi golive
- 03 Chặn AI chèn mã copyleft (GPL/AGPL) vào sản phẩm thương mại

**Ma trận cho phép · 4 cấp phân loại dữ liệu**

Tham chiếu: Quy Định Phân Loại Dữ Liệu của Tập đoàn

RED · Mật

Cấm tuyệt đối mọi AI ngoài kênh được duyệt riêng

ORANGE · Nhạy cảm

Chỉ Enterprise AI có ZDR + DPA, đã sanitize

YELLOW · Nội bộ

Enterprise AI (Business/Team/Enterprise plan)

GREEN · Công khai

Cho phép Public AI

Nguyên tắc vàng: "Khi nghi ngờ, hãy nâng cấp" — không chắc dữ liệu thuộc cấp nào, xử lý theo cấp cao hơn. Bản cá nhân (Free / Plus / Pro / Max / Pro+) bị cấm cho dữ liệu từ Internal trở lên.

---

## 11. LLM · Platform · Skills — 3 tầng

*Khái niệm · Phân tầng · Số trên slide: 11*

Ví như: LLM là động cơ, Platform là chiếc xe, Skills/Rules là cách lái. Platform là orchestrator agent — nhận lệnh, tự chọn tool/agent, gọi LLM lặp đến khi xong.

LAYER 3 Org cài lên platform · file markdown + script · quản lý version bằng git như code

Skills · Agents · Workflows · Rules · Hooks · Commands

▼ install on platform ▼

LAYER 2 Platform = Orchestrator Agent · phần mềm chạy LLM trên máy / repo

#### Claude Code

IDE CLI

#### OpenAI Codex

IDE CLI

#### GitHub Copilot

IDE CLI

**User**

#### Prompt

"thêm endpoint /users"

**Vòng ReAct — lặp đến khi xong**

01 · Analyze · 02 · Plan · ↑ · ↻ · ↓ · 04 · Reflect · ← · 03 · Execute

**Output**

#### Result

code · file · PR

**Trong loop, platform gọi**

Built-in Tools · Memory · Hook & command framework · Sub-agents có sẵn

Layer 3 Skills · Workflows · Rules · Custom sub-agents / hooks / commands

Layer 1 LLM (gọi mỗi vòng Execute)

▼ gọi API model — token in / token out ▼

LAYER 1 LLM — model thuần · nhận prompt, trả token. Không tool, không file, không quy trình.

Claude (Sonnet / Opus) GPT Gemini ...

✗ Anti-pattern — dùng LLM trực tiếp (chat.com / API raw) bỏ qua Layer 2 = mất orchestrator, mất Layer 3, mất governance.

**LLM ≠ AI agent**

LLM chỉ dự đoán token. Không tool, không file, không quy trình.

**Platform là cốt lõi**

Claude Code, Codex, Copilot (IDE & CLI) đều là orchestrator agent — workflow nằm ở đây, không phải ở LLM.

**Dùng đúng platform**

Dùng LLM trực tiếp (chat.com, API raw) bỏ qua bộ platform = mất orchestrator, mất Layer 3, mất governance.

---

## 12. LLM · PLATFORM · SKILLS

*✱*

✱

USER ra lệnh · Platform = orchestrator agent · dùng Skills/Rules cài lên + gọi LLM lặp → OUTPUT

Layer 3 · Org Config

◆ Skills · on-demand · ◆ Sub-agents · specialized · ◆ Workflows · reusable · ◆ Rules · governance · ◆ Hooks · auto-run · ◆ Commands · shortcuts

file markdown + script · quản lý version bằng git như code

▼ install on platform

**Layer 2 platforms · chọn 1 trong 3**

#### Claude Code

IDE CLI

#### OpenAI Codex

IDE CLI

#### GitHub Copilot

IDE CLI

▼ any of these realizes Layer 2 below

▶ User

#### Prompt

"thêm endpoint /users"

→ lệnh

Layer 2 · Platform · Orchestrator Agent

⏣ Master Loop · ReAct cycle

01 · Analyze · đọc intent · 02 · Plan · chọn tool · ↑ · ↻ · ↓ · 04 · Reflect · đánh giá · ← · 03 · Execute · gọi tool/LLM

↻ mỗi vòng · ↑ uses Layer 3 (Skills/Rules) · ↓ calls Layer 1 (LLM) · lặp đến khi xong

→ kết quả

★ Output

#### Result

code · file · PR

▼ calls LLM (every step in loop)

Layer 1 · LLM · model thuần

▣ Claude · Anthropic · ▣ GPT · OpenAI · ▣ Gemini · Google

▣ ...

khác

nhận prompt, trả token · không tool, không truy cập file, không quy trình

1 lệnh user → platform tự gọi LLM nhiều vòng, đọc Skills/Rules, sửa file, chạy test, tạo PR. Bỏ Layer 2 = mất orchestrator + Layer 3 + governance.

---

## 13. Hạ tầng LLM Gateway

*Deliverable · 05 · Số trên slide: 11*

Kiến trúc tham chiếu

Apps · IDE plugin · Skills · CI/CD bots

↓

LLM Gateway

↓

| Provider 1 | Provider 2 | Provider 3 |
|---|---|---|
| Self-host | Embedding | Vector DB |

#### 01 · Auth & Policy

#### 02 · Routing đa model

#### 03 · Rate-limit & Quota

#### 04 · Caching & RAG

#### 05 · Observability

#### 06 · FinOps

> Trên slide gốc, các ô nội dung của slide này đang để trống (chỉ có khung và tiêu đề), nên không có thêm chữ để chép.

---

## 14. So sánh tool AI coding

*Deliverable · 06 · Số trên slide: 12*

So sánh 3 AI coding tools đang được đánh giá — dữ liệu tháng 4/2026.

01 Business / Enterprise

#### GitHub Copilot

- **Models:** All models mới nhất — OpenAI, Anthropic, Google
- **Context window:** 200K – 400K

**Điểm mạnh**

- Multi-model, không phụ thuộc 1 nhà cung cấp
- Hỗ trợ chạy thêm agent Claude Code & Codex
- Base price thấp nhất trong nhóm
- Dashboard monitoring đầy đủ
- Tốc độ nhanh do chạy local

**Lưu ý**

- Từ 01/06/2026 chuyển sang tính theo token (thay vì tính theo chat messages)
- Cộng đồng ít hơn, không nhiều hướng dẫn cho các tools / mcp kết nối

02 Team / Enterprise

#### Claude Code

- **Models:** Anthropic — Sonnet 4.6, Opus 4.7
- **Context window:** 200K – 1M

**Điểm mạnh**

- Context window lớn nhất, ít lost-context
- Mạnh về kiến trúc, thiết kế, tài liệu
- Chất lượng tốt nhất khi thiếu context
- Cộng đồng lớn mạnh, nhiều tools hỗ trợ

**Lưu ý**

- Chỉ model Anthropic — phụ thuộc 1 nhà cung cấp
- Giới hạn 5h / tuần có thể làm gián đoạn công việc
- Pricing cao theo token

03 Plus / Business

#### OpenAI Codex

- **Models:** OpenAI — GPT-5.5, GPT-5.4, GPT-5.3-Codex
- **Context window:** 256K – 400K

**Điểm mạnh**

- Mạnh cho việc tạo ảnh design
- Giá có thể negotiate, rẻ hơn Claude
- Plugin Codex cho Claude Code

**Lưu ý**

- Mới, đang dần đuổi kịp 2 tools còn lại
- Pricing đã tăng so với ngày xưa, nhưng vẫn có thể negotiate

Kết luận

Chất lượng đầu ra giữa 3 tools tương đương nhau ở các bài toán thực tế khi sử dụng SDD framework — lựa chọn cụ thể không phải yếu tố quyết định. Bắt buộc trang bị ≥ 2 tools hoặc 1 tool như Copilot để team có thể switch qua lại theo bài toán, tránh phụ thuộc 1 nhà cung cấp và linh hoạt khi pricing/policy thay đổi. Giai đoạn đầu: lựa chọn Claude + Codex

Pricing không liệt kê chi tiết do đang biến động: Copilot chuyển sang token-based từ 01/06/2026; Codex điều chỉnh Business/Plus. Verify tại docs.github.com · claude.ai/pricing · openai.com/codex.

---

## 15. Hướng dẫn sử dụng AI chung

*Deliverable · 07 · Số trên slide: 13*

Tài liệu hướng dẫn dùng chung cho mọi vai trò: từ cài đặt môi trường, tổ chức repo theo framework, đến best practices khi làm việc cùng AI.

Phần A

#### Cài đặt môi trường

Setup Git, VS Code, Node.js/npm (doc-viewer), Python (PRISM), tài khoản AI, extension & CLI, model config, GitLab SSH.

- 01 Cài Git · VS Code
- 02 Cài Node.js + npm — chạy doc-viewer xem tài liệu local
- 03 Cài Python — chạy các script của PRISM
- 04 Tạo tài khoản Claude / Codex / GitHub Copilot
- 05 Cài extension AI + CLI · cấu hình effort / model
- 06 GitLab + SSH key công ty

Phần B

#### Tổ chức Repo & Meta-Repo

Cấu trúc meta-repo theo SDD Framework, cài PRISM / BMAD adapter cho 4 tool.

- 01 Vì sao cần meta-repo
- 02 Cấu trúc meta-repo theo SDD
- 03 Cài PRISM trên meta-repo

Phần C

#### Best practices khi làm việc với AI

Prompt patterns, quản lý session & memory, kỷ luật review output AI.

- 01 Chat thế nào — prompt patterns
- 02 Quản lý session & memory bằng file Markdown
- 03 Review output AI có kỷ luật

Claude + Codex — dùng model nào cho việc nào (05-2026) Map đầu việc → model

- Kiến trúc · Sản phẩm · Test case Ưu tiên Opus cho tư duy; Codex cross-check để bắt blind spot Claude Opus 4.7, GPT 5.5
- Dev · Script test · Run test Mạnh ở implement theo plan + chạy/iterate test nhanh GPT 5.5, GPT 5.4, Opus - Sonnet 4.6
- Design · Vẽ ảnh Sinh ảnh / mock UI / design asset tốt nhất hiện tại GPT 5.5, GPT 5.4

---

## 16. Khung quyết định

*Phần II*

Ba mô hình đội ngũ, ba trục phân loại sản phẩm — và ma trận quyết định để map sản phẩm vào cấp độ AI phù hợp.

**4 slides · quyết định triển khai**

**Nội dung phần này**

1. 17 Cấu trúc đội ngũ Truyền thống / Lean / Solo Product Builder
2. 18 Phân loại sản phẩm Lifecycle × Size × Bảo mật
3. 19 Ma trận quyết định 3×3 + filter bảo mật
4. 20 Phân nhóm đội ngũ theo năng lực AI AI maturity × Domain × Seniority

---

## 17. Cấu trúc đội ngũ

*Khung quyết định · 01 · Số trên slide: 15*

Nâng cấp độ AI = tái phân bổ vai trò trong squad. Mỗi card mô tả 1 squad; một sản phẩm thực tế có thể gồm nhiều squad — và 1 squad có thể ôm nhiều sản phẩm.

**Dịch chuyển cách làm · vai trò · năng lực**

Số lượng giảm theo độ chín của việc sử dụng AI, nhưng trọng tâm dịch chuyển từ execute sang spec / review / orchestrate.

#### ~11

**người / squad**

Truyền thống

#### ~6

**người / squad**

AI-driven

#### 1–2

**người / squad**

Solo Builder

Phù hợp L1 – L2 ≈ 11 người · AC shared / squad

#### Mô hình truyền thống

Đội đầy đủ — phân vai rõ, nhiều handoff

**Thành phần · 1 squad**

PO · PO · TO · Dev · Dev · Dev · Dev · Dev · QC · QC · UX · AI · AI

**+ shared resources**

PM · AC

**Cách làm việc**

- **Vòng lặp:** Sprint weeks–months. Ceremony đầy đủ, nhiều meeting để align.
- **Handoff:** PO → Dev → QC tuần tự. Bàn giao chủ yếu qua họp & trao đổi miệng — ma sát cao, nhiều waiting time.
- **Vai AI:** Công cụ cá nhân cho dev — ngoài workflow chung.

**Điểm mạnh**

- Phân vai rõ — phù hợp compliance / audit
- Rủi ro phân tán qua nhiều layer review
- Dễ scale theo headcount, dễ thay người

**Đánh đổi**

- Velocity thấp — nhiều waiting time giữa handoff
- Chi phí coordination & ceremony cao
- AI khó phát huy — context truyền tay qua nhiều vai trò, dễ mất ngữ cảnh

Budget AI tool $80–125 / người / tháng

Cost AI thấp · headcount cost cao

Phù hợp L3 6 + AI · DEV + AC shared / squad

#### Mô hình AI-driven (lean)

Đội tinh gọn — AI “execute” chính

**Thành phần · 1 squad**

PO · -1 · TO · Dev · -4 · Dev · QC · QC · UX · AI · AI

**+ shared resources**

DEV · PM · AC

**Cách làm việc**

- **Vòng lặp:** Sprint days-weeks. Ceremony đầy đủ, giảm trao đổi để align.
- **Handoff:** Thứ tự không đổi. Khác biệt: bàn giao qua document/spec → giảm ma sát.
- **Vai AI:** AI dẫn dắt workflow và thực thi; người duyệt & review.
- **Ownership:** Mỗi repo / application nhỏ chỉ 1 người nắm — tránh dẫm chân nhau khi AI sinh code song song.

**Điểm mạnh**

- Throughput tăng mạnh khi team thuần thục
- Chi phí coordination thấp, quyết định nhanh
- Team tập trung vào spec / architecture / review / output
- Ownership rõ ràng — 1 repo / app = 1 owner, AI sinh code không conflict

**Đánh đổi**

- Đòi hỏi team members chất lượng cao - không thay bằng quantity
- Cần đầu tư harness, prompt / skill library
- Rủi ro tập trung vào ít người — cần knowledge sharing
- Thời gian đầu, sẽ cần nhiều QC để đảm bảo chất lượng

Budget AI tool $150–300 / người / tháng

Breakeven < 3 tháng nếu senior playbook đúng

Phù hợp L3 – L4 1 -> 2 + AI · other roles shared

#### Mô hình Solo Product Builder

1 -> 2 product builder + nguồn lực khác dùng chung

**Thành phần · 1 squad**

PB · PB · AI · AI

**+ shared resources**

UX · PM · DEV · QC · AC

**Cách làm việc**

- **Vòng lặp:** Sprint hours-days. Giảm mạnh ceremony, meeting. Tốc độ get stakeholder feedback nhanh.
- **Handoff:** Không còn handoff. 1 builder + AI gói trọn pipeline dưới guardrail SA + AC.
- **Vai AI:** AI dẫn dắt workflow và thực thi; người duyệt & review.

**Điểm mạnh**

- Throughput cao nhất ở scope spec → code → test
- SA tập trung qua Council — minimize waste
- Match AI maturity tốt nhất, builder làm trọn vai trò sản phẩm

**Đánh đổi**

- Product builder = single point — risk burnout, knowledge concentration
- Đòi hỏi codebase architecture đã ổn định, patterns rõ
- AC phải chặt chẽ, tổng quan, để kiểm soát rủi ro

Budget AI tool TBD / builder / tháng

Autonomy cao = token tiêu thụ nhiều — cần forecast

---

## 18. Phân loại sản phẩm

*Khung quyết định · 02 · Số trên slide: 16*

Ba trục để định vị sản phẩm: vòng đời, quy mô và tính chất bảo mật dữ liệu — toạ độ ba trục quyết định cấp độ AI phù hợp.

#### 01 · Chu kỳ phát triển (Lifecycle)

Mức độ active — quyết định việc ứng dụng AI trong SDLC

G · Greenfield

Sản phẩm mới · chưa có code legacy

Sản phẩm mới, MVP đang xây từ đầu

B · Brownfield

Đang phát triển · feature mới đều

Sản phẩm chính đang scale, thêm tính năng đều

M

Maintenance / EOL

Chỉ duy trì · bug fix + security

Sản phẩm cũ, ít investment, sắp sunset

#### 02 · Quy mô (Size)

Codebase + team size — quyết định việc áp dụng AI ntn

S · Small

1–6 members · < 100 KLOC · 1 domain

Microservice, internal tool, mobile app đơn

M · Medium

6–20 members · 100–500 KLOC · multi-domain

SaaS B2B, sản phẩm có 3–5 module

L · Large

20+ members · > 500 KLOC · domain phức tạp

Hệ thống core, monolith 5+ năm tuổi, multi-product

#### 03 · Tính chất bảo mật của sản phẩm

Data có được phép đưa lên AI cloud hay không

C

Đưa được lên Cloud

Public · internal · có DPA

Hầu hết tất cả sản phẩm thương mại, bắt buộc Business/Enterprise Plan

O

Bắt buộc phải On-Prem

Bí mật · không gửi cloud được

Core banking, KYC raw, encryption keys → on-prem AI / VPC only, hoặc skip AI

Cách dùng: mỗi sản phẩm có toạ độ Lifecycle · Size · Bảo mật → tra ma trận slide tiếp theo để chọn cấp độ AI. Một sản phẩm phức tạp có nhiều module với toạ độ khác nhau — tra matrix theo từng module để chọn level phù hợp.

---

## 19. Ma trận quyết định

*Khung quyết định · 03 · Số trên slide: 17*

Ma trận 3×3 chọn cấp độ AI dựa trên Lifecycle × Size. Hover chữ (i) để xem lý do chi tiết từng cell. Trục Bảo mật xem slide trước.

#### Small

1–6 members · 1 domain

#### Medium

6–20 members · multi-domain

#### Large

20+ members · domain phức tạp

#### Greenfield

Sản phẩm mới · i

#### L3

Greenfield ưu tiên

Mới + nhỏ. Greenfield mặc định L3 — đặt nền tảng AI workflow từ đầu rẻ nhất, không có legacy patterns cần unlearn. Spec-driven culture build ngay từ ngày đầu.

i

#### L3

Sweet spot

Mới + medium. Đầu tư harness, prompt library, spec-driven culture từ ngày đầu — ROI cao nhất ở greenfield. Đây là điểm pilot mô hình lean lý tưởng.

i

#### L3

Modules độc lập

Mới + lớn. L3 với harness + AI platform team từ đầu. Chia module độc lập ngay từ design — mỗi team ôm module riêng có thể adopt L3 song song, tránh coupling cản trở rollout.

#### Brownfield

Đang phát triển

i

#### L3

Dễ chuyển đổi nhất

Đang phát triển + nhỏ. Codebase tractable, team unified → ít coordination overhead, change spread nhanh. Đây là entry point lý tưởng để pilot L3 trên brownfield — đầu tư nhỏ, học nhanh, mở đường cho sản phẩm lớn hơn.

i

#### L2 / L3

Sweet spot — mix

Đang phát triển + medium. Đa số sản phẩm B2B SaaS ở VN rơi vào đây. Mix theo team: team mature & module độc lập có thể đi thẳng L3; team còn brownfield phức tạp giữ L2 baseline trước rồi tiến L3 sau. ROI ~6 tháng nếu senior playbook đúng.

i

#### L2 / L3

Mix theo team

Đang phát triển + lớn. Mix theo team: team ôm module độc lập có thể adopt L3 từng phần; team share codebase phức tạp tạm giữ L2 đến khi tách module rõ. Cần AI platform team + eval pipeline. Khi team mature có thể tiến L4 ở module độc lập nhất.

#### Maintenance

Duy trì / EOL · i

#### L2 / —

L2 hoặc skip

Maintenance + nhỏ. Bug fix lẻ tẻ — AI cá nhân (L2) là đủ, hoặc skip hoàn toàn nếu volume thấp. Không đầu tư re-architect workflow vì không pay off.

i

#### L2 / —

L2 hoặc skip

Maintenance + trung bình. AI cá nhân (L2) cho bug fix, security patches, doc updates. Có thể không áp dụng AI nếu chỉ còn maintenance window nhỏ trước EOL. Spec layer không pay off vì ít feature mới.

i

#### L2 / —

L2 hoặc skip

Maintenance + lớn. Bug fix, security patches qua AI cá nhân (L2), hoặc skip nếu hệ thống chuẩn bị EOL. Khi team mature có thể nâng cấp đặc thù cho cleanup tech debt — beyond baseline matrix, xem Levels slide.

**Nguyên tắc 1**

#### Active = ưu tiên L3

Greenfield mặc định L3. Brownfield từ Medium trở lên mix L2 / L3 theo team. Maintenance là L2 hoặc skip — ít feature mới, không pay off đầu tư workflow.

**Nguyên tắc 2**

#### Small = dễ chuyển đổi nhất

Codebase tractable, team unified → ít coordination overhead. Brownfield/Small là entry point lý tưởng để pilot L3 trước khi rollout sản phẩm lớn.

**Nguyên tắc 3**

#### Large cần module độc lập

Team ôm module riêng → adopt L3; team share codebase phức tạp giữ L2. B/L mix L2/L3 theo team. Greenfield/Large chia module độc lập từ design.

---

## 20. Phân nhóm đội ngũ theo năng lực AI

*Khung quyết định · 04 · Số trên slide: 18*

Ma trận 3 chiều: AI maturity × Domain breadth × Seniority Jr+Mid / Sr. 18 ô — 4 nhóm chiến lược cho quy hoạch đội ngũ (mỗi nhóm khác chức năng, khác cách quản lý): Scale · Tinh hoa · Chiến lược · Training pipeline.

#### Specialist

Chuyên sâu 1 lĩnh vực (Dev / QC / UX / PO / BA)

#### T-shaped

Primary role + side skills 1–2 lĩnh vực khác

#### Full-stack thinking

Cover Product + Tech + Test + System cùng lúc

**Jr+Mid**

**Senior**

**Jr+Mid**

**Senior**

**Jr+Mid**

**Senior**

#### Mới làm quen

Chỉ chat / ad-hoc, chưa nắm các kĩ năng sử dụng AI hiệu quả

#### 01 · Đang học chuyên môn

→ Truyền thống (L1–L2)

#### 02 · Senior AI laggard

→ Truyền thống (L1–L2)

#### 03 · Đang mở rộng

→ Truyền thống (L1–L2)

#### 04 · Senior broad, AI mới

→ Truyền thống (L1–L2)

05 · hiếm · 06 · hiếm

#### Vận hành thành thạo

Dùng AI + các tools bổ trợ (skills / commands / MCP), biết cách khai thác hiệu quả

#### 07 · Specialist Op (Jr+Mid)

→ Truyền thống (L1–L2) · Lean (L3)

#### 08 · Specialist Operator

→ Truyền thống (L1–L2) · Lean (L3)

#### 09 · Lean Squad (talent)

→ Lean (L3)

#### 10 · Squad Lean Member

→ Lean (L3)

11 · hiếm · 12 ★

#### Polyvalent Operator

→ Lean (L3)

#### Dẫn dắt / Champion

Build skills / commands / MCP cho team dùng, mentor & dẫn dắt thực hành AI

13 · hiếm · 14 ★

#### Domain Champion

→ Truyền thống (L1–L2) · Lean (L3)

15 · hiếm · 16 ★

#### AI Champion / Lean Lead

→ Lean (L3)

17 · hiếm · 18 ★

#### Solo Product Builder

→ Solo Product Builder (L3–L4)

**4 nhóm chiến lược · mỗi nhóm khác chức năng & cách quản lý**

07 08 09 10

#### Scale · squad delivery

Đội ngũ chính để phát triển mô hình Lean squad, giúp scale công ty.

14 16 ★

#### Tinh hoa · leadership

Dẫn dắt squad, design AI experience, mentor Scale group.

12 18 ★

#### Chiến lược · framework / critical

Assign cho framework công ty hoặc sản phẩm quan trọng — không để làm routine.

01 02 03 04

#### Training pipeline

Nguồn lực cho các sản phẩm truyền thống. Đồng thời là pipeline cung cấp nguồn lực cho Scale group. Trọng tâm 1-2 tháng đầu khi adopt AI: training prompt + skills / commands / MCP để chuyển lên Vận hành.

---

## 21. Next Action

*Phần III*

Bước tiếp theo: chỉ số nào dùng để đo tác động, đề xuất hành động và lộ trình triển khai.

**5 slides · hành động tiếp theo**

**Nội dung phần này**

1. 26 Benefit chuyển đổi L1→L2 / L1→L3 Benefit hai hướng L1→L2 / L1→L3
2. 27 Đầu tư cho chuyển đổi 4 trụ cột đầu tư cho chuyển đổi
3. 28 Đo đạc các chỉ số Chỉ số đo lường tác động AI
4. 29 Lộ trình & action Lộ trình triển khai — 5 mốc + 1 review (≤ 12 tuần)
5. 30 Kết luận & Đề xuất Đề xuất & lộ trình tiếp theo

---

## 22. Benefit của hai hướng chuyển đổi

*Next Action · 03 · Số trên slide: 24*

So sánh giá trị mỗi nhánh mang lại: L1 → L2 là bước nền tảng, ít rủi ro, lan rộng nhanh. L1 → L3 là bước transformation, ROI cao hơn nhưng yêu cầu đầu tư & senior playbook.

Track A · L1 → L2 Ramp-up 1–2 tháng / squad

#### AI-Assisted · tool & skill chung

Đưa AI ra khỏi shadow IT, chuẩn hoá tool & thư viện skills — cấu trúc đội ngũ không đổi.

**Mức độ rủi ro**

Thấp — không thay đổi quy trình lõi

**Bảo mật & Compliance**

#### Hết shadow IT — output AI đi qua gateway, log đủ

- Tài khoản công ty thay cho cá nhân, audit trail đầy đủ
- Data đi qua LLM Gateway — DLP, redaction, policy tập trung
- License hợp lệ cho codebase thương mại

**Năng suất cá nhân**

#### Mỗi member nhanh hơn ở task quen thuộc

- Skill / command / hook curate sẵn — không phải tự build
- IDE + chat AI tích hợp luồng làm việc hiện tại
- Code review nhẹ tay hơn với AI bổ trợ

**Đội ngũ & Đào tạo**

#### Pipeline training prompt + skills cho toàn team

- Champion mentor lan toả trong squad
- Jr/Mid dùng AI ngay, không cần senior gate
- Là bước đệm để pilot L3 ở squad đã sẵn sàng về năng lực

**Đo lường**

#### Có số liệu nền để quyết định bước tiếp

- Token usage, tool adoption, cost / dev theo dõi được
- Baseline metrics để so sánh khi nâng L3

Track B · L1 → L3 Ramp-up 2–3 tháng / squad · cần senior playbook

#### Workflow-Augmented · Spec-driven

Tái cấu trúc squad theo mô hình lean — AI dẫn dắt workflow, người duyệt mỗi gate.

**Mức độ rủi ro**

Trung bình — thay các thức tư duy & tốc độ

**Throughput & Time-to-market**

#### Throughput tăng bậc — sprint days, không weeks

- AI tự chạy spec → code → test theo SDD framework
- Giảm handoff PO ↔ Dev ↔ QC, ít waiting time
- Iteration nhanh — feedback stakeholder nhanh

**Cấu trúc đội ngũ**

#### Lean squad ~6 người + AI (giảm từ ~11)

- Vai trò dịch chuyển sang spec / review / orchestrate
- Senior tập trung architecture & guardrail, không micro-execute
- Hấp thụ growth product mà không cần tăng headcount tuyến tính
- Mindset shift: từ "code mọi thứ" → "viết spec & review AI", từ ownership task → ownership outcome

**Chất lượng & Governance**

#### Gate review chuẩn hoá, ít drift

- Spec là single source — code & test sinh có truy vết
- Validation gate tại mỗi giai đoạn
- Tech debt cleanup nhanh gọn

**Chi phí & ROI**

#### AI cost cao hơn nhưng nguồn lực cần giảm

- AI cost ~$150–300 / dev / Size Medium
- Đặt nền cho L4 ở module độc lập về sau

∞

**Optimize · cải thiện liên tục**

Cải thiện skills / framework + governance + đào tạo để nâng cao năng lực — rollout được mass cho L3 và chuẩn bị công cụ hướng dần đến L4.

---

## 23. Đầu tư cần thiết cho chuyển đổi

*Next Action · 04 · Số trên slide: 25*

4 trụ cột đầu tư song song. L2 cần nền tảng tooling + training + governance + process AI-aware. L3 cộng thêm harness, senior playbook và spec-driven workflow.

#### 01 · Tooling & License

Hạ tầng AI dùng chung — LLM Gateway, IDE seats, harness

**Cho L2**

- LLM Gateway Cấp tài khoản công ty qua gateway, DLP + audit log, phân quota theo team.
- IDE & Chat seats Copilot / Cursor / Claude / Codex license business plan cho toàn bộ dev.
- MCP & extensions MCP servers cơ bản (codebase, ticketing, docs) cho team dùng chung.

**Cộng thêm cho L3**

- Spec / SDD harness Framework Spec-Driven Development triển khai trong repo, hook + command sẵn cho squad lean.
- Eval pipeline Hạ tầng eval cho prompt / agent — gate trước khi rollout skill chung.
- Token budget cao hơn Squad L3 tiêu thụ ~1.5–3× squad L2 — cần forecast & alert ngân sách.

#### 02 · Training & Enablement

Pipeline đưa người từ casual → operator → champion

**Cho L2**

- Onboarding AI cơ bản 1–2 tuần workshop: prompt, skill, command, hook, MCP. Toàn bộ DEV / QC / PO / UI.
- Skill library starter kit Bộ skill / command / rules được curate cho task phổ biến: review, test gen, refactor.
- Champion mỗi squad Mỗi squad có 1 champion phụ trách lan toả, giải đáp, gom feedback.

**Cộng thêm cho L3**

- Senior playbook L3 Đào tạo senior về spec-driven, gate review, AI orchestration — hands-on 4–6 tuần.
- Rotate qua pilot squad Đưa Jr/Mid qua pilot squad L3 để build năng lực polyvalent.
- AI Champion community Group chat giữa các champion — trao đổi, hỏi đáp và chia sẻ skill / prompt / cách làm hay.
- Mindset shift Đội ngũ phải đổi cách làm: từ "code mọi thứ" → "viết spec & review AI", từ ownership task → ownership outcome. Không thay đổi được bằng training thuần — build qua thực hành tại pilot squad.

#### 03 · Platform Team & Governance

Đội ngũ duy trì hạ tầng AI + khung quản trị 6 trụ cột

**Cho L2**

- AI Platform team (lean) 2–4 người: vận hành gateway, license, monitoring, security review tool mới.
- Governance baseline Policy DLP, data classification, license scope, IP — áp dụng toàn công ty.
- Security review tools Gate cho mỗi tool mới đi vào ecosystem — đánh giá data flow & compliance.

**Cộng thêm cho L3**

- AI Platform team mở rộng Thêm eval engineer + skill curator để duy trì SDD harness, MCP, thư viện skill chung và review chất lượng spec ở squad L3.

#### 04 · Process & Spec-driven Workflow

Thay đổi cách làm — từ ceremony nặng sang spec → AI → review

**Cho L2**

- Đo lường adoption Dashboard cycle-time, AI usage / dev, cost / squad — baseline trước khi nâng L3.

**Cộng thêm cho L3**

- Spec là single source Mọi feature bắt đầu từ spec — AI sinh code & test theo SDD framework, output có truy vết, gate người duyệt. Spec đồng bộ lên tool quản lý hiện tại (Jira / Confluence / Wiki).
- Tài liệu chuẩn hoá & up-to-date Spec / wiki / code doc của product L3 phải được rà soát, chuẩn hoá và cập nhật định kỳ — AI dùng tài liệu làm ngữ cảnh, doc lỗi thời = output lỗi. Là prerequisite trước khi squad nâng L3.
- Sprint days–weeks Tốc độ release nhanh, feedback stakeholder nhanh.

---

## 24. 4 KPI cốt lõi đo AI trong SDLC

*Đo lường · Số trên slide: 28*

Đo baseline trước khi rollout AI → so sánh sau 1–3 tháng → điều chỉnh target theo quý. Mục tiêu chia theo cấp độ áp dụng AI: L2 (AI-assisted) và L3 (AI-Augmented).

01 Productivity

#### Throughput per Member

**Công thức 1**

US hoàn thành trong sprint ÷ số member trong team

**Công thức 2**

LOC trung bình ÷ số member trong team

Chuẩn hoá theo đầu người để so sánh được giữa các team khác quy mô và giữa các sprint. Phản ánh trực tiếp tốc độ giao việc — chỉ số đầu tiên cần theo khi rollout AI, không bị bóp méo khi team thay đổi quy mô.

Công cụ · Jira (Scrum board) Tần suất · Mỗi sprint

**Baseline**

0.2 – 0.4 (example) US/người/sprint

**Baseline**

200 – 400 (example) LOC/dev/ngày

**L2 · 3 tháng**

0.3 – 0.5 (≈ +30%)

**L2 · 3 tháng**

500 – 1000 LOC/dev/ngày

**L3 · 3 tháng**

1.0 – 1.6 (≈ ×4)

**L3 · 3 tháng**

2000 – 5000 LOC/dev/ngày

02 Quality

#### Leakage

**Công thức**

Bug phát hiện trên Production ÷ tổng số bug × 100%

Đo khả năng “chặn bug” của quy trình trước khi lọt ra khách hàng. Counter-metric của Throughput — chống trường hợp tăng tốc bằng cách cắt test; Throughput tăng mà Leakage tăng theo thì là thất bại.

Công cụ · Jira (bug data) Tần suất · Mỗi sprint

**Baseline**

5%

**L2 · 3 tháng**

≤ 5%

**L3 · 3 tháng**

≤ 5%

03 Quality

#### Complexity

**Đo trực tiếp từ tool**

Cyclomatic Complexity trung bình của codebase / module, theo dõi riêng AI-generated vs hand-written. Bảo vệ tính bảo trì dài hạn — rủi ro lớn nhất khi rollout AI coding là code chạy được nhưng phình ra, ai vào sửa cũng khổ.

Công cụ · GitLab · SonarQube Tần suất · Mỗi sprint

**Baseline**

12 (trung bình)

**L2 · 3 tháng**

≤ 10

**L3 · 3 tháng**

≤ 10

04 Quality

#### Test Coverage

**Đo trực tiếp từ tool**

% dòng / nhánh logic được test tự động bao phủ; ưu tiên branch coverage thay vì line coverage. Là chỉ số AI hỗ trợ rõ nhất qua auto-generate test, và là điều kiện cần để dám refactor / cho AI tự sửa code mà vẫn an toàn.

Công cụ · GitLab · SonarQube Tần suất · Mỗi sprint

**Baseline**

55%

**L2 · 3 tháng**

≥ 95%

**L3 · 3 tháng**

≥ 95%

Đang cân nhắc Hữu ích theo chuẩn DORA, nhưng chưa đo được ngay — cần thống nhất nguồn data trước khi đưa vào KPI chính thức.

MTTR (Mean Time To Recovery)

Σ thời gian khôi phục ÷ số lần incident

Cần xác định nguồn data incident thống nhất (incident log / on-call channel) trước khi đo.

Change Failure Rate

Số release gây rollback / hotfix ÷ tổng số release × 100%

Cần định nghĩa rõ thế nào là “failure” và tag được release tương ứng trong GitLab.

---

## 25. Lộ trình & action

*Next Action · Lộ trình · Số trên slide: 28*

Lộ trình triển khai sau PoC — 5 mốc chính + 1 mốc review · tối đa 12 tuần.

#### T0

01 Kick off

#### Map L2 / L3 & Number license estimated

**Actions**

- HoE đánh giá cần L2 / L3 hay không cho từng product theo Decision Matrix
- Với product map L3: HoE review lại assignment người–repo, tái phân bổ để mỗi repo / application nhỏ chỉ 1 người nắm — tránh dẫm chân nhau khi AI sinh code song song
- HoE Dựa vào L2 / L3 matrix, đăng ký số lượng member cần mua license
- Với product map L3: HoE rà soát & chuẩn hoá lại tài liệu (spec / wiki / code doc) — cập nhật up-to-date để AI có ngữ cảnh chạy đúng, doc lỗi thời = output lỗi

**Output gate**

L2 / L3 mapped · L3 ownership reassigned · Docs standardized · License estimated

#### T + 1w

02 Procurement

#### Mua sắm license · setup token cap

**Actions**

- Procurement license Claude / Codex / Copilot theo headcount L2 / L3
- Setup limit token / spending cap per user trên admin console (Claude · Codex) — tránh runaway cost
- AI champion list confirmed per team

**Output gate**

Tools licensed · Per-user token cap configured · Champions named

#### T + 2w

03 Transition kick-off

#### License sẵn · teams bắt đầu chuyển đổi

**Actions**

- Teams nhận license · chính thức bắt đầu chuyển đổi từ thời điểm này
- LLM Gateway production-ready (dùng chung mọi team)
- Central training cho AI champions, sau đó champions cascade về team
- Teams kick off

**Output gate**

Gateway live · Champions trained · All teams started transition

#### T + 6w

04 L1 → L2 deadline

#### L2 baseline live trên scope

**Actions**

- Các squad đã chọn L2 đạt baseline trên scope đã map (4 tuần sau kick-off)
- Bắt đầu đo đạc metrics từ lúc team apply

**Output gate**

L2 baseline reached · Metrics tracking started

#### T + 10w

05 L1 → L3 deadline

#### Full operation · mix L2 / L3

**Actions**

- Các squad đã chọn L3 đạt baseline trên scope đã map (8 tuần sau kick-off)
- Tổng hợp dữ liệu metrics L2 / L3 — chuẩn bị review T+12w

**Output gate**

L3 baseline reached · Metrics data aggregated

06 Metrics review

#### T + 12w

#### Review metrics · plan next action

**Actions**

- Review với từng team: L2 / L3 baseline đã đạt chưa, impact thế nào
- Báo cáo tổng hợp · đề xuất plan kế tiếp

**Output gate**

Review report submitted · Next plan approved

Draft proposal: theme · action · output gate do AI đề xuất theo deck context. HoT validate envelope & ngày kick-off thực tế; Heads tự chọn approach và pace cho team mình trong envelope tối đa 12 tuần.

---

## 26. Kết luận & Đề xuất

*Kết luận · Số trên slide: 27*

Quyết định cần thông qua

1. 01
2. 02
3. 03

Lộ trình · F1

#### Giai đoạn 1

#### F2 · Giai đoạn 2

#### F3 · Giai đoạn 3

> Trên slide gốc, các ô nội dung của slide này đang để trống (chỉ có khung và tiêu đề), nên không có thêm chữ để chép.

---

## 27. Phụ lục

*Phụ lục*

Nguồn tham khảo, cấu trúc PRISM và runbook adoption theo từng loại dự án — dành cho người xem muốn biết phải setup gì và chạy thao tác nào.

**Tham chiếu kỹ thuật**

**Nội dung phần này**

1. 32 Nguồn tham khảo Các nguồn đã trích dẫn
2. 33 Workflow — Diagram gốc File nguồn để chỉnh sửa
3. 34 SDD Framework — Diagram gốc File nguồn để chỉnh sửa
4. 35 PRISM — Chuyển dịch cách làm việc
5. 36 PRISM — Cách vận hành thực tế Commands · output · phase gates
6. 37 PRISM — Cấu trúc thư mục project .prism · docs · submodule · Living Truth
7. 38 Áp dụng PRISM theo loại dự án Cây quyết định chọn L2/L3 và mô hình ①/②
8. 39 Runbook — Greenfield L3 vừa & nhỏ Setup + lệnh chạy cho dự án mới vừa & nhỏ
9. 40 Runbook — Greenfield L3 lớn Setup module/meta-repo cho dự án mới lớn
10. 41 Runbook — Brownfield L2 Freedom mode cho BAU / ít thay đổi
11. 42 Runbook — Brownfield L3 vừa & nhỏ Onboard PROD → guided cho dự án vừa & nhỏ
12. 43 Runbook — Brownfield L3 lớn Pilot module + big meta-repo cho dự án lớn

---

## 28. Nguồn tham khảo

*Phụ lục · Số trên slide: A*

Khung 4 cấp độ áp dụng AI trong SDLC (Shadow → Tool-first → Workflow-first → AI-Native) được tổng hợp dựa trên tham chiếu tiêu chuẩn SAE J3016 (gốc ngành ô tô) và các báo cáo / sản phẩm thực tiễn của Thoughtworks, Gartner, Anthropic, GitHub, Microsoft cùng các bài phân tích cộng đồng.

#### Nguồn cảm hứng khung level

Mô hình 5 cấp độ tự chủ — gốc từ ngành ô tô tự lái

- SAE International SAE J3016 — Levels of Driving Automation Tiêu chuẩn gốc 6 cấp độ (L0–L5) tự chủ — được cộng đồng AI engineering mượn ý tưởng https://www.sae.org/standards/content/j3016_202104/
- SAE International SAE Levels of Driving Automation — Visual chart https://legacy.sae.org/binaries//content/assets/cm/content/blog/sae-j3016-visual-chart_5.3.21.pdf

#### Vendors & Analysts

Báo cáo & sản phẩm chính thức từ các hãng lớn

- Thoughtworks AI and software delivery — Looking Glass 2026 https://www.thoughtworks.com/en-us/insights/looking-glass/looking-glass-2026/AI-and-software-delivery
- Thoughtworks AI-assisted software delivery (Decoder) https://www.thoughtworks.com/en-us/insights/decoder/a/ai-assisted-software-delivery
- Gartner AI Maturity Model & Roadmap Toolkit Tổng quát cho doanh nghiệp, không riêng SDLC https://www.gartner.com/en/chief-information-officer/research/ai-maturity-model-toolkit
- Gartner Critical Capabilities for AI Code Assistants https://www.gartner.com/en/documents/6953766
- Anthropic Measuring AI agent autonomy in practice https://www.anthropic.com/news/measuring-agent-autonomy
- Anthropic Claude Code auto mode: a safer way to skip permissions https://www.anthropic.com/engineering/claude-code-auto-mode
- GitHub Octoverse 2026 — AI leads TypeScript to #1 https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
- Microsoft An AI-led SDLC with Azure & GitHub https://techcommunity.microsoft.com/blog/appsonazureblog/an-ai-led-sdlc-building-an-end-to-end-agentic-software-development-lifecycle-wit/4491896

#### Community frameworks

Các bài viết cộng đồng đã đề xuất khung 5 cấp tương tự

- Swarmia Blog Five levels of AI coding agent autonomy https://www.swarmia.com/blog/five-levels-ai-agent-autonomy/
- Tessl Blog The 5 levels of AI agent autonomy: learning from self-driving cars https://tessl.io/blog/the-5-levels-of-ai-agent-autonomy-learning-from-self-driving-cars/

#### Source files

Sơ đồ gốc render trực tiếp ở phụ lục

- OneMount /docs Workflow SDLC AI — Cross-functional flowchart (drawio XML) Slide 03 tóm tắt 6 phase; phụ lục B render diagram đầy đủ qua drawio viewer /slide/workflow-source
- OneMount /docs SDD Framework — Workflow diagram (drawio XML) Slide 05 tóm tắt orbit cycle; phụ lục C render diagram đầy đủ với DRAFT/APPROVED gates /slide/framework-source

Lưu ý: chưa có công ty nào (GitHub, Thoughtworks, Gartner, Anthropic) publish chính thức một “khung cấp độ SDLC AI” như chuẩn — các nguồn trên là tham khảo & cảm hứng.

→ ← Quay lại Cấp độ AI

---

## 29. Workflow SDLC AI — Diagram gốc

*Phụ lục · Số trên slide: B*

Sơ đồ cross-functional flowchart đầy đủ. Render trực tiếp từ file XML — kéo / zoom / lightbox bằng toolbar góc dưới phải. Slide tóm tắt ở số 03.

[ Text Outline ]

Text Outline

[ × ]

docs/workflow-sdlc-ai/workflow.xml

→ ← Quay lại slide tóm tắt

### Nội dung trong sơ đồ

Slide này là một sơ đồ (draw.io). Dưới đây là toàn bộ nhãn chữ trong sơ đồ, theo thứ tự xuất hiện trong file; các nhãn rẽ nhánh YES / NO / OK đã được lược. Quan hệ mũi tên giữa các khối không thể hiện được ở dạng chữ, xem slide gốc để thấy luồng.

- AI-Augmented SDLC — Cross-Functional Flowchart (2026)
- 👤 Human
- 🤖 AI
- 📦 Output
- ⚙️ Core
- 📋 REQUIREMENT
- 1. PO / BA Collect business context Stakeholder interviews
- 2. BA Agent Draft / Update PRD EPIC, User Stories Acceptance Criteria Cross-check consistency
- 3. PO Review & Refine PRD Add domain knowledge
- 4. Product Manager Review & Approve final PRD → Handoff to Design
- 🏗️ DESIGN (UI + SYSTEM)
- 1. SA / TechLead Define technical requirements: Context, Constraints, Tech Stack, NFRs, Security, ..
- 2. Architect Agent Generate SAD: Architecture, DB schema, sequence, API,...
- 3. SA / TechLead Review SAD, Feedback, Trade-offs
- 4. SA / TechLead + DAB Architecture Review Board — Approve
- ① Coding Agent Phasing / Breakdown tasks (Planning Mode) Define Test cases
- 💻 IMPLEMENTATION
- ③ Coding Agent Generate code, Refactor code Fix issues/ Unit Test
- ④ Developers / QC Review & Approve code Complex logic, tuning Review testcase/update testcase
- ⑦ Review Agent Auto Review, Security, Design Patterns, perf
- ⑨ Developer / TechLead Final Code Review in Gitlab / Pipelines runs / Approve merge, deploy on QC env
- 🧪 TESTING
- ① QC Exploratory Manual Testing UX, cross-browser
- ② Test Agent Writes and "executes" automated tests on QC
- ③ QC Lead Sign-off Test Results → Go / No-Go
- 🚀 DEPLOYMENT
- 🔄 SDD Framework Build→Measure→Analyze→Decide
- 📚 Prompt Library Skills / Agents
- 🧠 AI Orchestrator (Dev Tools) Agent routing, context mgmt
- 📖 Knowledge Base (RAG) Docs, patterns, lessons learned
- 🛡️ Guardrails Approval gates, AI validation
- 📊 Metrics Loop Accuracy, cycle time, quality
- Approved ?
- Approve?
- 1. Designer UI UX Requirements & Wireframe, Mockup Detailed UI, Design system
- 2. Design Tools Generate Wireframe, Mockup, UI, Design System
- 4. Design Reviewer / PO Review, Approve
- Approved?
- ② TechLead / Developers / QCs Review plan, update, fine tune Complete logic / test plan Chia scope để sau đó review
- ② TechLead / Developers Chuẩn bị Product & Technical Documents
- MAINTENANCE
- ⑧ Security Scan vul & compliance, leak,...
- Gemini said 🛠️ Tools
- Đẩy manual trên confluence / jira: đánh versioning đầy đủ Đang đánh giá việc review / feedback trên Notion
- Đẩy file md manual trên confluence (kèm version), gắn link vào jira File Figma vẫn nằm trong Figma
- Đẩy manual trên confluence: đánh versioning đầy đủ Feedback trên Confluence
- Đưa toàn bộ file mds từ trước vào gitlab. Nếu Requirement cần thay đổi do vấn đề kĩ thuật hoặc cần được clear ra thêm => update files tương ứng và lưu trữ version mới lên Confluence, rồi add lại vào gitlab Tạo / Update file Implemnetation Plan và Test Cases, lưu trữ lên gitlab. Code được gen ra xong kiểm tra và self test như thường. Commit mỗi lần AI gen để tránh mất code
- Dùng postman / python trong TH run script Playwright/ Robot Framework/ Appium
- 3 Designer Review, Finalize
- 📦 Output 📦 Harness
- ⑧ Test Agent Generate test cases , integration, e2e
- PRD_v1.md
- Epics_v1.md
- Glossary_v1.md
- SAD / SAD.md
- API-Specs.md
- DB-Schema.md
- Sequences Diagrams.xml
- Implementation Plan.md
- Test cases.md
- User Stories_v1.md
- Designs / Wireframe
- Design System.md
- Data Flows.md
- Integration Flows.md
- Source code
- Unit / Integration tests
- PRD, EPIC, US Templates
- BA Skills / Agents
- Technical Document Templates
- Technical (BE, FE, Architecture, ...) Skills / Agents
- Design System Template
- Technical (BE, FE, Architecture, Testing, ...) Skills / Agents
- Plan / Test cases Templates

---

## 30. SDD Framework — Diagram gốc

*Phụ lục · Số trên slide: C*

Sơ đồ workflow đầy đủ với DRAFT / APPROVED gates, parallel branches, orbit cycle, ops control & change packs. Render trực tiếp từ file XML. Slide tóm tắt ở số 05.

[ Text Outline ]

Text Outline

[ × ]

docs/sdd-framework/diagram.xml

→ ← Quay lại slide tóm tắt

### Nội dung trong sơ đồ

Slide này là một sơ đồ (draw.io). Dưới đây là toàn bộ nhãn chữ trong sơ đồ, theo thứ tự xuất hiện trong file; các nhãn rẽ nhánh YES / NO / OK đã được lược. Quan hệ mũi tên giữa các khối không thể hiện được ở dạng chữ, xem slide gốc để thấy luồng.

- START: Ý tưởng / Tài liệu
- PRODUCT DRAFT
- start product import product
- feedback product validate user story
- product approved gate
- PRODUCT APPROVED
- approve product
- DESIGN DRAFT
- ARCHITECTURE DRAFT
- start/import design early (Product DRAFT exists)
- start arch import arch
- feedback design validate design
- feedback arch validate architecture
- DESIGN APPROVED
- ARCHITECTURE APPROVED
- approve design (requires product approved)
- approve arch
- READY (Product + Des + Arch APPROVED)
- PLAN DRAFT
- TEST DRAFT
- start plan import plan
- start test import test
- feedback plan validate plan
- feedback test validate test
- PLAN APPROVED
- TEST APPROVED
- approve plan
- approve test
- IMPLEMENTATION (Code + Unit tests)
- start implement
- feedback implement: ... validate implementation --mode spec validate implementation --mode quality
- CURRENT SPRINT SEALED (Implementation accepted)
- approve implement (test approved + spec/quality clean)
- NEXT SPRINT PLAN / TEST / IMPLEMENT OPEN
- sprint-v{X} sealed
- OPS CONTROL
- status resume [phase|pack] continue diff [phase] pick: 1 / sprint-v2 / slug
- CHANGE PACKS (Open sprints, 1 selected pack)
- start change: [item] feedback: [changes] validate changes approve changes Pack id: vX.Y.Z-slug Pick: 1 / sprint / slug
- CHÚ GIẢI STYLE
- Luồng SDLC chính
- Luồng Quản lý (Ops)
- Luồng Thay đổi (Change)
- Trạng thái DRAFT (WIP)
- Trạng thái APPROVED
- new sprint (Product + Design approved; no DRAFT pack)
- NEW SPRINT OPEN (sprint-v{X+1}: Product / Design) Architecture OPEN Plan / Test / Implement = BLOCKED

---

## 31. PRISM — Chuyển dịch cách làm việc

*Phụ lục · Số trên slide: D*

Trước đây mỗi vai trò dùng một tool ngoài không kiểm soát (AI rải rác, Figma, draw.io, Confluence), nối với nhau bằng copy-paste thủ công. Nay tập trung vào VS Code — mọi đầu ra đi qua PRISM (versioned · review · approve · Living Truth). Riêng Design và test manual phần lớn vẫn nằm ngoài luồng.

| Giai đoạn · Role | Trước đây Tool rải rác ngoài · nối bằng copy-paste | Với PRISM Tập trung VS Code · đầu ra qua PRISM |
|---|---|---|
| 01 Product PO | Dùng AI rải rác bên ngoài, rồi copy thủ công vào Confluence. AI ngoài Confluence | Chạy PRISM, review ngay trên VS Code, rồi sync lên Confluence. VS Code PRISM Confluence |
| 02 Design UX Lead | Làm trên Figma — hoặc dùng AI khác rồi copy kết quả vào Figma. AI ngoài Figma | Một phần nhỏ làm qua PRISM trên VS Code; phần lớn vẫn ở Figma. PRISM Figma phần lớn vẫn ngoài luồng |
| 03 Architecture Tech Lead | Vẽ kiến trúc trên draw.io (Confluence), trình DAB phê duyệt. draw.io Confluence DAB | Kiến trúc sinh & review trên VS Code qua PRISM. VS Code PRISM |
| 04 Plan & chia task Team | Cả team họp planning chung, rồi cùng nhau chia task. Họp team | PRISM lập plan & chia task — thực tế chỉ 1 người vận hành. VS Code PRISM |
| 05 Test & Implement Dev / QA | Chạy code & viết test sau khi đã chia task. Manual | Test sinh qua PRISM rồi chạy; test manual phần lớn vẫn ngoài luồng. PRISM Test manual phần manual vẫn ngoài luồng |

**Điểm chuyển dịch cốt lõi**

Thay vì rải việc qua nhiều tool ngoài không kiểm soát, nối với nhau bằng copy-paste thủ công → tập trung vào VS Code, mọi đầu ra đi qua PRISM: được versioned, review/approve và merge vào Living Truth.

**Vẫn nằm ngoài luồng**

Design và test manual phần lớn vẫn ở ngoài PRISM — chỉ một phần nhỏ được đưa vào.

Đây là phần con người giữ quyền chủ động, không ép vào luồng.

**Chú giải**

VS Code trong VS Code + PRISM — kiểm soát

AI ngoài tool ngoài — không kiểm soát

Xem cách PRISM vận hành chi tiết:

→ PRISM — Cách vận hành thực tế →

---

## 32. PRISM — Cách vận hành thực tế

*Phụ lục · Số trên slide: E*

Mỗi sprint mở 1 sprint folder /docs/sprint-v{X}/ (X = số sprint). 6 phase chạy lần lượt: AI gõ lệnh chuẩn (hoặc import khi đã có tài liệu sẵn) → sinh proposal trong sprint folder → role chuyên trách review/approve. Sau khi seal sprint, proposal merge tự động sang Living Truth ở /docs/{phase}/ — AI không bao giờ ghi trực tiếp.

| Phase · Role | AI commands (gõ tuần tự) | Output sprint folder trong /docs/sprint-v{X}/ | Sau seal → Living Truth trong /docs/ |
|---|---|---|---|
| 01 Product PO / Stakeholder | 1. start product \| import product 2. feedback product: ... 3. validate user story 4. approve product | product/sprint-brief-v{X}.md product/proposals/prd-v{X}.md product/proposals/glossary-v{X}.md product/proposals/personas-v{X}.md product/proposals/market-research-v{X}.md product/proposals/epics/{slug}-v{X}.md | product/prd.md product/glossary.md product/personas.md product/market-research.md product/epics/{slug}.md 4 file + N epic |
| 02 Design UX Lead / PO ∥ Architecture | 1. start design \| import design 2. feedback design: ... 3. validate design 4. approve design | design/proposals/design-system-v{X}.md | design/design-system.md 1 file |
| 03 Architecture Architect / Tech Lead ∥ Design | 1. start arch \| import arch 2. feedback architecture: ... 3. validate architecture 4. approve arch | architecture/sprint-brief-v{X}.md architecture/proposals/architecture-v{X}.md architecture/proposals/nfr-v{X}.md architecture/proposals/sequence-v{X}.md architecture/proposals/erd-v{X}.md architecture/proposals/adr-v{X}.md architecture/proposals/data-flow-v{X}.md architecture/proposals/api-specs-v{X}.md architecture/proposals/events-v{X}.md architecture/proposals/project-reference-v{X}.md | architecture/architecture.md architecture/nfr.md architecture/sequence.md architecture/erd.md architecture/adr.md architecture/data-flow.md architecture/api-specs.md architecture/events.md architecture/project-reference.md 9 file |
| 04 Plan Tech Lead / Dev Lead ∥ Test yêu cầu P + D + A APPROVED | 1. start plan \| import plan 2. feedback plan: ... 3. validate plan 4. approve plan | planning/implementation-plan-v{X}.md | — KHÔNG merge — sprint-only mãi mãi |
| 05 Test QA Lead ∥ Plan | 1. start test \| import test 2. feedback test: ... 3. validate test 4. approve test | testing/test-plan-v{X}.md testing/proposals/test-cases-v{X}.md testing/generated/test-cases-*.tsv test-plan & generated chỉ sprint-only | testing/test-cases.md 1 file · test-plan không merge |
| 06 Implement Dev yêu cầu Test APPROVED | 1. start implement TG1.1 2. feedback implement: fix TG1.1 gaps 3. validate implementation --mode spec TG1.1 4. validate implementation --mode quality TG1.1 5. repeat TG1.2, TG1.3... 6. approve implement ≡ sprint seal | (không sinh proposal markdown) Code + unit test viết vào repo theo từng task group Evidence spec/quality cho từng TGx.x | Khi approve implement chạy: mọi proposal + change-pack delta của 5 phase trên được merge tự động vào Living Truth. ★ sprint seal |

**Gate dependency**

Product → Design ∥ Arch → Plan ∥ Test → Implement

TGx.x = task group. Mỗi TG phải chạy start implement TGx.x, validate spec TGx.x và validate quality TGx.x riêng; chỉ approve implement khi toàn bộ TG sạch.

Sau mỗi lượt start, yêu cầu AI tự review / tự test 3-5 vòng: so lại spec, edge case, traceability, test impact và diff code. Chỉ chuyển sang validate / approve khi AI tự báo không còn điểm miss lớn.

Nếu thấy thiếu/sai ở DRAFT hoặc code, không approve ngay: dùng feedback [phase]: ... hoặc feedback implement: ..., rồi re-run validate tương ứng.

**2-Tier model**

Tier 1 · /docs/sprint-v{X}/ — nơi AI ghi proposal & working

Tier 2 · /docs/{product,design,architecture,testing}/ — Living Truth

Hệ thống tự động chặn AI ghi trực tiếp Tier 2.

**Import — khi đã có tài liệu sẵn**

Team đã có brief / SAD / wireframe / test plan từ trước? AI import thay vì viết lại từ đầu.

1. Bỏ file vào /docs/inbox/
2. Gõ import [phase] thay cho start [phase]
3. AI đọc, chuẩn hoá thành proposal trong sprint folder
4. File nguồn chuyển sang /docs/inbox/processed/

Áp dụng cho Product · Design · Architecture · Plan · Test. Implement không có import.

**Bug code lane · độc lập sprint**

Khi code đã seal/accepted nhưng chạy sai spec, mở bug code trước khi sửa: start bug: <symptom> → feedback bug: ... → validate bug <bug-slug> → approve bug <bug-slug>. Hotfix production dùng cùng lane với severity urgent; nếu fix làm đổi spec, route doc-impact qua start change: ....

Xem flow gate & orbit:

→ Framework Spec-Driven Development →

---

## 33. PRISM — Cấu trúc thư mục project

*Phụ lục · Số trên slide: F*

Bản rút gọn theo source sdlc-framework/prism v2.2.1: chỉ giữ các tầng cần giải thích khi demo — framework guides, QA toolkit, project docs, Living Truth, sprint working area và repo code con. Các phần điều phối/đóng gói nội bộ được lược bỏ.

**Layer 0**

#### Project meta-repo root — workspace mở bằng AI tool

Đây là repo điều phối và cũng là working directory chính của AI. Khi code, AI mở/chạy ở root meta-repo để thấy đủ PRISM docs + nhiều repo con cùng lúc; không chat riêng từng repo con như trước. Code thật vẫn được edit qua path repo con như `services/...`, `frontends/...`.

```
<project-meta>/
├─ .prism/                                      # quy trình PRISM + standards để AI làm đúng flow
├─ qa-tools/                                    # Skills QA: test plan, test case, evidence, tool integration
├─ prism-config.md                              # project đang chạy guided/freedom, sprint hiện tại, quality profile
├─ CLAUDE.md                                    # default adapter cho Claude Code
├─ AGENTS.md                                    # default adapter cho Codex / agent-style tools
├─ .github/
│  └─ copilot-instructions.md                   # default adapter cho GitHub Copilot
├─ .cursor/
│  └─ rules/
│     └─ prism.mdc                              # default adapter cho Cursor
├─ docs/                                        # tài liệu dự án, Living Truth, sprint working area
├─ services/                                    # repo con backend, AI sửa từ root meta-repo bằng path này
│  ├─ api/                                      # code API/service
│  ├─ payment/                                  # code service payment
│  └─ worker/                                   # code background jobs / consumers
└─ frontends/                                   # repo con frontend, AI vẫn sửa từ root meta-repo
   ├─ web/                                      # code web app
   └─ mobile/                                   # code mobile app nếu có
```

**Layer 1**

#### .prism/ — framework PRISM, không sửa tay

Giữ lại engine điều phối cốt lõi để người xem hiểu PRISM chạy được bằng command/gate, đồng thời vẫn tách rõ phase guide, standards và brownfield skill. Các phần đóng gói/release nội bộ vẫn được lược bỏ khỏi slide.

```
.prism/
├─ core/
│  ├─ orchestrator.md                           # map lệnh start/validate/approve/status sang đúng phase và gate
│  ├─ freedom-router.md                         # luật chạy freedom mode khi không cần đủ gate L3
│  ├─ sprint-manager.md                         # mở sprint, seal sprint, reflect sprint cho brownfield
│  ├─ version-manager.md                        # route proposal vào Living Truth và quản lý version/sprint folder
│  ├─ change-manager.md                         # change pack khi tài liệu đã approve cần sửa trong sprint
│  ├─ bug-manager.md                            # bug code lane: start bug, validate bug, approve bug, doc impact
│  ├─ import-validator.md                       # import tài liệu/code-derived material vào proposal đúng phase
│  ├─ safety-guard.md                           # nguyên tắc an toàn khi AI sửa file, chạy lệnh, dùng git
│  ├─ status-format.md                          # format status chuẩn để team biết đang ở phase/gate nào
│  ├─ phase-quality-standards.md                # tiêu chí chất lượng chung cho mọi phase
│  ├─ phase-product.md                          # cách AI viết/validate PRD, epic, story, AC, glossary, persona
│  ├─ phase-design.md                           # cách AI viết/validate screen, flow, state, component, asset
│  ├─ phase-architecture.md                     # cách AI viết/validate C4, NFR, API, event, data, ADR
│  ├─ phase-plan.md                             # cách AI chia task, dependency, repo impact, sequencing
│  ├─ phase-test.md                             # cách AI viết test plan, test cases, functional/SIT export
│  ├─ phase-implement.md                        # cách AI code theo TGx.x, lấy evidence, validate spec + quality từng TG
│  └─ standards/
│     ├─ architecture-principles.md             # boundary, cohesion, coupling, dependency, operability principles
│     ├─ architecture-solution-standards.md     # C4, API/event contract, data, NFR, deployment readiness checklist
│     ├─ coding-standards-ai.md                 # AI coding: scope control, traceability, safe edits, review hygiene
│     ├─ coding-standards-backend.md            # backend: API design, service layer, data access, errors, logging
│     ├─ coding-standards-frontend.md           # frontend: components, state, accessibility, UX states, tests
│     ├─ security-standards.md                  # auth, secrets, threat model, data protection, abuse cases
│     ├─ devsecops-standards.md                 # CI/CD, scanning, release controls, environment hygiene
│     ├─ iot-standards.md                       # device, telemetry, connectivity, OTA, edge constraints
│     ├─ testing-standards.md                   # coverage, test levels, evidence, defect and regression expectations
│     └─ unit-test-standards.md                 # unit test style, isolation, mocks, assertions, maintainability
│
└─ skills/
   └─ discover-code/                            # brownfield: đọc code PROD, sinh inventory và baseline as-built
```

**Layer 1b**

#### qa-tools/ — QA toolkit đóng kèm project

Dùng cho test planning, test case generation, test evidence và tích hợp công cụ QA. PRISM dùng `docs/testing` làm Living Truth; `qa-tools` là bộ mẫu/helper để QA vận hành nhanh hơn.

```
qa-tools/
└─ sdlc-testing-skills/
   ├─ references/                               # checklist, policy, taxonomy, export format
   │  ├─ test-plan-template.md                   # mục tiêu test, scope, approach, environment, risk
   │  ├─ tc-template.tsv                         # format export functional test case
   │  ├─ sit-template.tsv                        # format export SIT test case
   │  ├─ automation-framework-policy.md          # tiêu chí chọn automation và cách chạy automation
   │  ├─ accessibility-checklist.md              # checklist accessibility cho UI flow
   │  ├─ owasp-checklist.md                      # checklist security testing
   │  └─ performance-baseline.md                 # baseline/threshold cho performance testing
   ├─ template/                                  # mẫu tài liệu QA có thể dùng lại
   │  ├─ Test Plan                               # master/sprint/regulatory test plan
   │  ├─ Test Design                             # high-level cases, data, API/UI testing guide
   │  ├─ Test Case and Test Data                 # test case và test data format
   │  ├─ Test Execution                          # execution information source
   │  ├─ Test Report                             # release/go-live/sprint test report
   │  ├─ Automation Testing                      # automation plan, criteria, run guide, result
   │  ├─ Performance Testing                     # performance plan, result, guide
   │  ├─ Security Testing                        # security request, scan, review, pentest report
   │  └─ OAT                                     # operational acceptance checklist
   └─ tools/                                     # helper tích hợp hệ thống QA
      ├─ Jira helpers                            # tạo/cập nhật bug, issue, subtask
      ├─ QMetry helpers                          # đẩy/cập nhật testcase và execution status
      ├─ Confluence helpers                      # fetch/push/sync QA pages
      └─ Document converters                     # chuyển đổi markdown/html/docx
```

**Layer 2**

#### docs/ — project artifacts + Living Truth

Đây là nơi người đọc cần nhìn kỹ nhất. `docs/` chứa tài liệu nguồn để import, Living Truth đã seal, backlog, bug lane và các sprint working area. AI không ghi trực tiếp vào Living Truth ở guided mode.

```
docs/
├─ inbox/                                      # tài liệu thô để AI import vào PRISM
│  ├─ product.md                               # PRD/BRD/epic/user story cũ
│  ├─ design.md                                # Figma note, wireframe text, UI spec cũ
│  ├─ architecture.md                          # SAD/ADR/API/event/NFR cũ
│  ├─ test-cases.md                            # test plan / test cases cũ
│  └─ processed/                               # file nguồn sau khi import xong
│
├─ codebase-map.md                             # brownfield: inventory repo, code area, entry point, responsibility
├─ product-backlog.md                          # backlog ngoài sprint nếu team muốn giữ ở meta-repo
│
├─ bugs/                                       # bug code lane, độc lập với sprint
│  └─ BUG-{slug}/
│     ├─ bug-report.md                         # symptom, impact, severity, root cause, fix scope, doc impact
│     └─ validate-bug.md                       # regression checks, evidence, blocker list cho bug fix
│
├─ product/                                    # Living Truth: Product
│  ├─ prd.md                                   # problem, goals, scope, constraints, business rules, success metrics
│  ├─ glossary.md                              # business terms, definitions, aliases, examples, ownership
│  ├─ personas.md                              # user groups, needs, behaviours, permissions, pain points
│  ├─ market-research.md                       # context, competitor/benchmark notes, assumptions, evidence
│  ├─ assets/                                  # ảnh/file tham chiếu cho product
│  └─ epics/
│     ├─ {epic-slug}.md                        # epic goal, feature list, user stories, acceptance criteria
│     └─ ...
│
├─ design/                                     # Living Truth: Design
│  ├─ design-system.md                         # screens, flows, states, components, content rules, UX decisions
│  └─ assets/                                  # screenshots, wireframes, design references
│
├─ architecture/                               # Living Truth: Architecture
│  ├─ architecture.md                          # system context, containers, components, responsibilities, dependencies
│  ├─ nfr.md                                   # performance, availability, security, compliance, scalability targets
│  ├─ sequence.md                              # key flows, service interactions, sync/async behaviour, failure paths
│  ├─ erd.md                                   # entities, relationships, ownership, lifecycle, data constraints
│  ├─ adr.md                                   # decisions, options considered, rationale, consequences
│  ├─ data-flow.md                             # data sources, processing, storage, trust boundaries, sensitive data
│  ├─ api-specs.md                             # endpoints, payloads, validation, errors, auth, versioning
│  ├─ events.md                                # event contracts, producers/consumers, topics, retry/idempotency
│  ├─ project-reference.md                     # repo map, service ownership, build/test/deploy references
│  └─ assets/
│     ├─ c4-model.drawio                       # source diagram C4
│     ├─ dfd-{flow}.drawio                     # source data-flow diagram
│     └─ ...
│
├─ testing/                                    # Living Truth: Testing
│  ├─ test-cases.md                            # functional/SIT cases, preconditions, steps, expected results, data needs
│  └─ assets/                                  # QA evidence/assets
│
├─ sprint-v1/                                  # chi tiết bên dưới
├─ sprint-v2/
│  └─ ...
└─ sprint-v3/
   └─ ...
```

**Layer 3**

#### docs/sprint-v1/ — working area AI được phép ghi trong sprint

Sprint folder chứa bản nháp và bằng chứng làm việc của sprint. Khi sprint seal, nội dung đã approve mới đi vào Living Truth; các bản nháp vẫn ở đây để audit lại.

```
docs/sprint-v1/
├─ product/
│  ├─ sprint-brief-v1.md                        # bối cảnh sprint, scope, decision đang mở
│  ├─ assets/
│  │  └─ {file}.{png|pdf|drawio|xml|...}         # file product dùng trong sprint
│  └─ proposals/
│     ├─ prd-v1.md                              # draft problem, scope, rules, metrics
│     ├─ glossary-v1.md                         # draft terms/definitions
│     ├─ personas-v1.md                         # draft user groups/needs
│     ├─ market-research-v1.md                  # draft evidence/benchmark
│     └─ epics/
│        ├─ {epic-slug}-v1.md                   # draft epic, features, stories, AC
│        └─ ...
│
├─ design/
│  ├─ assets/
│  │  └─ screen-{name}.png                       # screenshot / wireframe / figma export
│  └─ proposals/
│     └─ design-system-v1.md                     # draft screens, flows, states, components
│
├─ architecture/
│  ├─ sprint-brief-v1.md                         # architecture rationale và decision cho sprint
│  ├─ assets/
│  │  ├─ c4-model.drawio                         # C4 source nếu sprint dùng C4
│  │  ├─ dfd-{flow}.drawio                       # data-flow diagram source
│  │  └─ ...
│  └─ proposals/
│     ├─ architecture-v1.md                       # draft context/container/component view
│     ├─ nfr-v1.md                                # draft quality attributes/targets
│     ├─ sequence-v1.md                           # draft runtime flows/failure paths
│     ├─ erd-v1.md                                # draft data model/entities
│     ├─ adr-v1.md                                # draft technical decisions/rationale
│     ├─ data-flow-v1.md                          # draft data movement/trust boundaries
│     ├─ api-specs-v1.md                          # draft API contracts/errors/auth
│     ├─ events-v1.md                             # draft event contracts/retry/idempotency
│     └─ project-reference-v1.md                  # draft repo/service/build references
│
├─ planning/
│  └─ implementation-plan-v1.md                   # task groups TGx.x, dependency, repo impact, sequencing
│
├─ testing/
│  ├─ test-plan-v1.md                             # test objective, scope, approach, risks
│  ├─ assets/
│  │  └─ {qa-evidence-or-input}.{png|csv|pdf|...}
│  ├─ proposals/
│  │  └─ test-cases-v1.md                         # draft test cases, steps, expected results
│  └─ generated/
│     ├─ test-cases-functional-v1.tsv             # functional test case export
│     └─ test-cases-sit-v1.tsv                    # SIT test case export
│
└─ changes/                                      # correction pack khi tài liệu đã approve cần sửa
   └─ {change-slug}/
      ├─ change-request.md                       # reason, scope, status
      ├─ impact-matrix.md                        # tài liệu/phase/code area bị ảnh hưởng
      └─ {phase}-delta.md                        # bản sửa theo phase bị ảnh hưởng
```

**Layer 4**

#### Repo code thật — repo con được sửa từ meta-repo

Repo con vẫn giữ lifecycle build/test/deploy riêng. Điểm thay đổi là AI làm việc tại `<project-meta>` để đọc docs, contract và nhiều repo con trong cùng context, rồi sửa file code dưới `services/...` hoặc `frontends/...`.

```
# Working rule khi implement:
#   cd <project-meta>
#   AI đọc docs/ + .prism/ + nhiều repo con rồi sửa path repo con từ đây.
#
services/
├─ api/                                          # backend/API service
│  ├─ src/                                      # business logic, API handlers, integrations
│  ├─ tests/                                    # unit/integration tests
│  └─ ...
├─ payment/                                      # payment domain service
│  └─ ...
└─ worker/                                       # async jobs / consumers
   └─ ...

frontends/
├─ web/                                          # web app
│  ├─ src/                                      # pages, components, state, API client
│  ├─ tests/                                    # UI/unit/e2e tests
│  └─ ...
└─ mobile/                                       # mobile app nếu có
   └─ ...
```

→ PRISM — Cách vận hành thực tế →

→ Adoption playbook →

---

## 34. Áp dụng PRISM theo loại dự án

*Phụ lục · Hướng dẫn cho đội ngũ · Số trên slide: G*

Công cụ tương tác xác định mô hình tổ chức phù hợp theo loại dự án, kèm các bước triển khai. Cột phải là tham chiếu: dịch chuyển cách làm việc, lựa chọn L2/L3 và kiểm soát bảo mật.

**Nguyên tắc cốt lõi**

Điều chỉnh tổ chức đội ngũ, cách làm việc và cấu trúc repo để khớp mô hình — không điều chỉnh mô hình theo hoàn cảnh. Tuân thủ mô hình giúp triển khai nhanh và chính xác; uốn mô hình theo từng tình huống dẫn đến chậm trễ và sai sót.

**Xác định mô hình theo dự án**

1 Loại dự án?

Mới — Greenfield

phát triển mới từ đầu

Đang chạy — Brownfield

đã có code trên PROD

Hoàn tất các câu hỏi để xác định mô hình tổ chức phù hợp và các bước chuẩn bị.

① một meta-repo · ② big meta-repo + phân chia đội

**Dịch chuyển cách làm việc**

| Khía cạnh | Trước đây | Với PRISM |
|---|---|---|
| Vai trò người ↔ AI | Người đưa ra giải pháp, AI thực thi | AI dẫn dắt thực thi; người xác định bài toán, cung cấp context và review mỗi phase |
| Năng lực trọng tâm | Đưa ra giải pháp đúng | Xác định bài toán đúng, đủ context và năng lực review |
| Nơi lưu tài liệu | Phân tán trên Confluence, chat, máy cá nhân | Tập trung trên git meta-repo + submodule |
| Chốt quyết định | Trao đổi bằng lời / chat, có thể không lưu lại | Ghi nhận vào tài liệu git và commit — không thống nhất bằng lời ngoài luồng |
| Tổ chức repo / đội | Tùy đội, nhiều người cùng tác động một repo | Meta-repo điều phối · một owner/repo · đội ~6 người + AI |

**Lựa chọn L2 hay L3**

L3 · guided: có gate, phê duyệt từng phase, Living Truth versioned — phù hợp đội nhóm / enterprise / yêu cầu audit. L2 · freedom: lược bỏ gate, chỉnh sửa tài liệu trực tiếp — vẫn giữ template & chất lượng của guided.

Freedom là lựa chọn một chiều (không thể quay lại guided trong cùng project); khi chưa chắc chắn, nên chọn guided.

**Gate bắt buộc — bảo mật**

Chỉ data-class mới giới hạn AI. Module bắt buộc On-Prem cần hạ tầng LLM Gateway; nếu chưa có thì giới hạn ở L1 hoặc không áp dụng AI cho module đó. Mức độ trọng yếu được xử lý bằng review, không dùng để chặn AI.

**Cơ chế PRISM · bug & hotfix**

Đặt tài liệu / contract vào docs/inbox/ → import [phase] (audit, sinh bản DRAFT) → validate → approve. PRISM không tự quét code — contract do AI sinh trước rồi đưa vào inbox.

Sửa lỗi code đã seal (guided): start bug: ghi bug record trước khi sửa code → fix kèm regression test → feedback bug nếu cần chỉnh scope/fix → validate bug → approve bug. Bug độc lập sprint, không chặn seal.

Hotfix production = bug severity urgent: start bug: [HOTFIX] … → fix trên branch hotfix/… → feedback bug nếu cần → validate/approve bug. Tác động tài liệu (nếu có) định tuyến qua start change:.

**Tổng quan — toàn bộ hướng tổ chức**

Mọi tình huống đều quy về hai mô hình tổ chức chuẩn (① / ②); BAU là ngoại lệ chủ đích → L2 / không áp dụng. Greenfield dựng từ đầu, brownfield onboard từ PROD — đều hội tụ về ① / ②.

**Cây quyết định**

Dự án MỚI — Greenfield · phát triển từ đầu

└─ Nhỏ · thường 1-19 người → ① Một meta-repo

└─ Lớn · nhiều module / đội → ② Big meta-repo + phân chia đội Đang hoàn thiện

Dự án ĐANG CHẠY — Brownfield · onboard từ PROD, không chỉnh sửa code

└─ BAU — ít thay đổi (mọi quy mô) → L2 / không áp dụng

└─ Đang phát triển

└─ Ít repo · các repo liên quan nhau → ① Một meta-repo

└─ Nhiều repo · nhiều module / đội → ② Big meta-repo + phân chia đội Đang hoàn thiện

**Hai mô hình tổ chức chuẩn**

#### ①

#### Một meta-repo

L3 · guided

Hợp nhất toàn bộ repo liên quan và tài liệu vào MỘT meta-repo. Không phụ thuộc khối lượng code — chỉ cần liên quan là hợp nhất; áp dụng cả với monolith liên kết chặt, không tách code.

Đội ngũ: Một đội (~6 người + AI) phụ trách toàn bộ · mỗi repo/app một owner

Mới Dự án quy mô nhỏ: dựng meta-repo + submodule, cài PRISM guided, chạy 6 phase từ đầu.

Đang chạy Ít repo: thực hiện onboarding từ PROD để dựng Living Truth baseline, sau đó phát triển tiếp.

#### ②

#### Big meta-repo + phân chia lại đội

Đang hoàn thiện L3 / module

Nhiều module độc lập (mỗi module là ①) + một big meta-repo liên kết TÀI LIỆU (không liên kết code) để có bức tranh tổng thể. Mỗi module có PRISM riêng, sprint song song.

Đội ngũ: Phân chia đội theo các meta-repo độc lập — mỗi đội vận hành theo ①

Mới Dự án quy mô lớn: phân tách module độc lập ngay từ phase design (không cần onboarding do chưa có PROD).

Đang chạy Nhiều repo: sinh contract từng repo → tập hợp vào big meta-repo để chốt baseline tổng thể → phân chia lại đội; mỗi meta-repo vận hành theo ①.

Điều phối cross-team: Một big meta-repo nằm trên các meta-repo để điều phối đầu việc và tính năng cross-team.

**Onboarding từ PROD → Living Truth baseline (brownfield)**

**Quy tắc bắt buộc**

Trong toàn bộ giai đoạn dựng baseline: chỉ đọc code PROD và biên soạn lại tài liệu, không chỉnh sửa code. Hoàn tất baseline rồi mới phát triển tiếp.

1. Tập hợp toàn bộ tài liệu liên quan vào một nơi — kể cả tài liệu phân tán, lỗi thời hoặc không đầy đủ
2. Lấy code PROD làm nguồn chuẩn (source of truth) — đã vận hành thực tế, đáng tin hơn tài liệu cũ
3. Sinh API / event contract và mô tả vai trò từng repo: backend cung cấp / tiêu thụ gì; mobile gọi API và tiêu thụ event nào; các luồng tích hợp
4. Dựng baseline theo mô hình đã chọn — ① hợp nhất vào một meta-repo, sinh / cập nhật PRD và tài liệu kiến trúc (chủ yếu là cập nhật); ② tập hợp contract vào big meta-repo rồi phân chia đội theo các meta-repo độc lập
5. validate → approve để chốt một bản Living Truth baseline hoàn chỉnh
6. Hoàn tất baseline → phát triển tiếp theo PRISM (6 phase có gate)

**BAU — ít thay đổi**

Dự án ít thay đổi (bug fix / patch): nếu dùng AI thì bắt buộc áp dụng L2 (freedom mode) — không có lựa chọn khác; hoặc không áp dụng AI.

Vấn đề đã biết Nhiều người cùng làm trên một repo

Khi nhiều thành viên cùng làm trong một meta-repo và làm vượt phần việc của mình (ví dụ: PO biên soạn luôn phần kiến trúc), các thay đổi chồng lấn phải được hợp nhất (merge) thủ công.

**Hiện tại**

Phối hợp bằng giao tiếp giữa các thành viên để tránh chồng lấn phần việc.

**Định hướng**

Đưa toàn bộ thao tác lên một giao diện chung trên cloud — khi đó việc hợp nhất thủ công không còn là vấn đề.

→ Ma trận quyết định →

→ PRISM — Cách vận hành thực tế →

### Công cụ tương tác: các câu hỏi và kết quả

Trên trang, phần "Xác định mô hình theo dự án" là một công cụ bấm chọn. Mỗi tổ hợp câu trả lời cho ra một thẻ kết quả; các thẻ này không hiện sẵn nên được chép lại đầy đủ ở đây.

**Câu hỏi**

1. Loại dự án? — *Mới — Greenfield* (phát triển mới từ đầu) hoặc *Đang chạy — Brownfield* (đã có code trên PROD)
2. Nếu Mới: Quy mô? — *Nhỏ* (thường 1-19 người · 1 domain) hoặc *Lớn* (thường 20+ người · nhiều domain)
2. Nếu Đang chạy: Còn phát triển hay BAU? — *Đang phát triển* (còn phát triển tính năng mới) hoặc *BAU — ít thay đổi* (chỉ bug fix / patch)
3. Nếu Đang phát triển: Số lượng repo? — *Ít repo* (các repo liên quan nhau) hoặc *Nhiều repo* (nhiều module / đội)

**Kết quả: Dự án mới · Nhỏ** — L3 · guided · mô hình ①

- Đội ngũ: Đội ~6 người + AI · mỗi repo/app một owner
- Dựng meta-repo + submodule code, cài đặt PRISM (guided). Thiết lập nền tảng AI workflow ngay từ đầu.
- Các bước:
  1. Chạy 6 phase có gate — phê duyệt từng phase trước khi tiếp tục
  2. Seal sprint → hợp nhất vào Living Truth
  3. Mở sprint kế tiếp bằng lệnh new sprint
- Lệnh: `start/import → feedback → validate → approve … → start implement TGx.x → feedback implement → validate spec/quality TGx.x → approve implement (seal)`

**Kết quả: Dự án mới · Lớn** — L3 · mô hình ② · Đang hoàn thiện

- Đội ngũ: Mỗi đội phụ trách một module
- Phân tách module độc lập ngay từ phase design. Mỗi module là một meta-repo, vận hành như dự án mới quy mô nhỏ.
- Các bước:
  1. Thiết kế ranh giới module ngay từ đầu — không cần onboarding PROD (chưa có code)
  2. Mỗi module chạy 6 phase độc lập như dự án quy mô nhỏ
  3. Điều phối nhiều module qua big meta-repo (liên kết tài liệu, không liên kết code)
- Ghi chú: Áp dụng mô hình ② nhưng không cần bước onboarding do là dự án greenfield.

**Kết quả: Đang chạy · BAU — ít thay đổi** — L2 · freedom / không áp dụng

- Ít thay đổi: chủ yếu bug fix, security patch, chỉnh sửa nhỏ. Chỉ hai lựa chọn — dùng AI thì áp dụng L2 (freedom mode), không có phương án khác; hoặc không áp dụng AI.
- Các bước:
  1. Dùng AI → áp dụng L2: dựng meta-repo, thiết lập freedom mode (không gate, chỉnh sửa tài liệu trực tiếp)
  2. Không dùng AI → giữ nguyên quy trình hiện hữu
  3. Không đầu tư L3 — ít tính năng mới nên không tương xứng chi phí

**Kết quả: Đang chạy · Ít repo → ① Một meta-repo** — L3 · guided · mô hình ①

- Đội ngũ: Một đội (~6 người + AI) phụ trách toàn bộ · mỗi repo/app một owner
- Hợp nhất toàn bộ repo liên quan và tài liệu vào một meta-repo. Áp dụng cho cả monolith liên kết chặt — không tách code.
- Quy tắc bắt buộc: Trong toàn bộ giai đoạn dựng baseline: chỉ đọc code PROD và biên soạn lại tài liệu, không chỉnh sửa code. Hoàn tất baseline rồi mới phát triển tiếp.
- Các bước: sáu bước "Onboarding từ PROD → Living Truth baseline" ở trên, với bước 4 là: Dựng baseline: hợp nhất vào một meta-repo, sinh / cập nhật PRD và tài liệu kiến trúc (chủ yếu là cập nhật)

**Kết quả: Đang chạy · Nhiều repo → ② Big meta-repo** — L3 / module · mô hình ② · Đang hoàn thiện

- Đội ngũ: Phân chia đội theo các meta-repo độc lập — mỗi đội vận hành theo mô hình ①
- Sinh contract cho từng repo → tập hợp vào big meta-repo (bức tranh tổng thể) → phân chia lại đội theo các meta-repo độc lập.
- Quy tắc bắt buộc: Trong toàn bộ giai đoạn dựng baseline: chỉ đọc code PROD và biên soạn lại tài liệu, không chỉnh sửa code. Hoàn tất baseline rồi mới phát triển tiếp.
- Các bước: sáu bước "Onboarding từ PROD → Living Truth baseline" ở trên, với bước 4 là: Dựng baseline: tập hợp contract vào big meta-repo rồi phân chia đội theo các meta-repo độc lập
- Ghi chú: Sau khi phân chia, mỗi meta-repo vận hành độc lập theo mô hình ① — PRISM riêng, sprint song song, tránh tắc nghẽn ở giới hạn một lần implement mỗi sprint.

---

## 35. Greenfield L3 · Vừa & nhỏ

*Phụ lục · Adoption runbook · Số trên slide: H1*

Case đã chốt: một meta-repo chứa PRISM và các repo code bằng submodule. AI mở workspace tại meta-repo để thấy đủ context và sửa được nhiều repo con trong cùng một lượt.

**L3 guided · mô hình ①**

**Command runbook**

**Setup project · chỉ câu lệnh**

```bash
mkdir <project-meta>
cd <project-meta>
git init
unzip prism-v2.x.zip
./.prism/setup.sh
git submodule add <api.git> services/api
git submodule add <web.git> frontends/web
git submodule update --init --recursive
git add .
git commit -m "chore: scaffold PRISM guided meta-repo"
```

**Lưu ý thao tác**

- Mở AI tại root meta-repo, không mở riêng từng repo con.
- Sau mỗi start ... hoặc start implement TGx.x, yêu cầu AI tự review / tự test 3-5 vòng: spec, edge case, traceability, test impact, diff code.
- Nếu draft/code còn thiếu hoặc validate có blocker, dùng feedback [phase]: ... hoặc feedback implement: ..., rồi re-run validate trước khi approve.
- TGx.x = task group; mỗi TG phải chạy start implement TGx.x, rồi validate spec + quality cho đúng TG đó.
- Bug code đã accepted/sealed không đi qua start implement; mở lane riêng bằng start bug: <symptom> → feedback bug: ... → validate bug <bug-slug> → approve bug <bug-slug> .
- Living Truth chỉ được cập nhật khi approve implement (seal sprint).

**Lệnh chạy trong tool AI**

| Phase | Mục tiêu | Lệnh / thao tác |
|---|---|---|
| Product | Làm rõ hoặc import existing requirement, user story, AC | `start product` · `import product` · `feedback product: ...` · `validate user story` · `approve product` |
| Design | Chốt screen, flow, state, design-system | `start design` · `feedback design: ...` · `validate design` · `approve design` |
| Architecture | Chốt C4/API/NFR/ADR trước khi plan | `start arch` · `feedback architecture: ...` · `validate architecture` · `approve arch` |
| Plan | Chia task, repo scope, dependency | `start plan` · `feedback plan: ...` · `validate plan` · `approve plan` |
| Test | Chốt coverage, test cases, handoff QA | `start test` · `feedback test: ...` · `validate test` · `approve test` |
| Implement | Code theo từng task group, validate từng TG, rồi seal | `start implement TG1.1` `feedback implement: fix TG1.1 gaps` `validate implementation --mode spec TG1.1` `validate implementation --mode quality TG1.1` `start implement TG1.2` `validate implementation --mode spec TG1.2` `validate implementation --mode quality TG1.2` `approve implement` |
| Bug code | Defect trong code đã accepted/sealed, độc lập sprint | `start bug: <symptom>` · `fix code trong scope bug` · `feedback bug: <adjustment>` · `validate bug <bug-slug>` · `approve bug <bug-slug>` |

**Chuỗi thao tác theo phase**

0 Tạo meta-repo, cài PRISM guided, add submodule code.

1 Chạy Product → Design → Architecture đến trạng thái approved.

2 Chạy Plan và Test từ spec đã approve.

3 Implement theo TGx.x trong meta-repo; code nằm trong submodule tương ứng.

4 Sau mỗi TG: validate spec + quality cho đúng TG đó, cuối sprint mới approve implement.

---

## 36. Greenfield L3 · Lớn

*Phụ lục · Adoption runbook · Số trên slide: H2*

Đang hoàn thiện: dự kiến có một big-meta repo ở ngoài để draft solution high-level, module map, integration contracts và cross-feature. Bên trong là các module/team meta-repo chạy PRISM guided riêng; chỉ module meta-repo mới include code repos.

**L3 module · solution WIP**

**Command runbook**

**Setup project dự kiến · chỉ câu lệnh**

```bash
mkdir <big-meta>
cd <big-meta>
git init
unzip prism-v2.x.zip
./.prism/setup.sh
git submodule add <checkout-meta.git> modules/checkout-meta
git submodule add <loyalty-meta.git> modules/loyalty-meta
git submodule update --init --recursive
git add .
git commit -m "chore: scaffold PRISM big-meta repo"
cd ..
mkdir <module-meta>
cd <module-meta>
git init
unzip prism-v2.x.zip
./.prism/setup.sh
git submodule add <module-service.git> services/<module-service>
git submodule add <module-ui.git> frontends/<module-ui>
git add .
git commit -m "chore: scaffold PRISM module meta-repo"
```

**Đang hoàn thiện**

- Đã có hướng big-meta + module meta-repo, nhưng flow vận hành chi tiết chưa viết xong.
- Cần hoàn thiện cách big-meta đọc/tổng hợp thông tin từ module meta-repo.
- Cần hoàn thiện flow cross-module feature/contract từ big-meta xuống từng module.

**Lệnh chạy dự kiến**

| Phase | Mục tiêu | Lệnh / thao tác |
|---|---|---|
| Big-meta | Draft solution high-level, module map, contract, cross-feature | `start product` · `start arch` · `validate architecture` · `approve arch` |
| Integration plan | Planning high-level cho tích hợp module/API/event | `start plan` · `validate plan` · `approve plan` |
| Link modules | Big-meta link tới PRISM meta con, không include code | `git submodule update --remote modules/<module-meta>` · `status` · `check updates` |
| Module planning | Module/team meta-repo làm guided planning, chưa đi vào code ở runbook này | `start product` · `start design` · `start arch` · `start plan` · `validate plan` · `approve plan` |
| Cross-module | Thay đổi API/event/cross-feature điều phối qua big-meta | `start change: update API/event contract` · `validate changes` · `approve changes` |

**Chuỗi thao tác theo phase**

A Big-meta draft solution high-level: system overview, module boundary, service ownership, API/event contract, cross-feature.

B Big-meta làm planning high-level cho tích hợp: module dependency, API/event contract, sequencing, cross-feature impact.

C Big-meta link tới các module/team meta-repo để đọc status/decision mới nhất; không include service code.

D Module/team meta-repo là PRISM guided home; trong đó mới add submodule code repos team/module sở hữu.

E Runbook này dừng ở planning tích hợp, chưa đi tới Test/Implementation; phần delivery sẽ thuộc module flow sau khi integration plan rõ.

---

## 37. Brownfield L2 · BAU / ít thay đổi

*Phụ lục · Adoption runbook · Số trên slide: H3*

Áp dụng khi sản phẩm đã chạy PROD nhưng chủ yếu bug fix, patch, security fix hoặc exploration. Dùng PRISM freedom để AI có context/template chuẩn, nhưng người dùng có thể gõ tự nhiên, không phải nhớ lệnh `start ...` / gate L3.

**L2 freedom**

**Command runbook**

**Setup project · chỉ câu lệnh**

```bash
mkdir <project-meta>
cd <project-meta>
git init
unzip prism-v2.x.zip
./.prism/setup.sh --style freedom
git submodule add <legacy-repo.git> services/<legacy-repo>
git submodule update --init --recursive
cp <old-docs> docs/inbox/
git add .
git commit -m "chore: install PRISM freedom"
```

**Lưu ý thao tác**

- freedom = người dùng gõ gì cũng được miễn rõ intent/scope; bảng trên là ví dụ prompt, không phải command bắt buộc.
- Không cần gõ start ..., validate ..., approve ...; nếu ai quen cú pháp PRISM thì vẫn dùng được, nhưng không bắt buộc.
- L2 không enforce gate và không block seal; người dùng tự quyết định khi nào cần self-review, self-test hoặc checkpoint.
- Sau khi AI sửa một lượt, nên nói rõ: tự review / tự test 3-5 vòng để giảm miss, nhưng đây là best practice, không phải gate.
- Bug code chỉ cần nói rõ triệu chứng, expected/actual, phạm vi sửa; không cần mở lane bằng start bug như L3.
- Nếu scope bắt đầu lớn hoặc có nhiều thay đổi cross-repo, chuyển sang runbook brownfield L3.
- Không cố onboard toàn hệ thống nếu chỉ xử lý một patch nhỏ.

**Ví dụ câu nói tự nhiên trong freedom**

| Nhu cầu | Mục tiêu | Lệnh / thao tác |
|---|---|---|
| Context | Đưa tài liệu/code cũ vào context khi cần | `Đọc services/api và tóm tắt current flow giúp tôi.` · `Đưa tài liệu cũ trong docs/inbox vào context dự án.` · `So sánh tài liệu cũ với code đang chạy và chỉ ra gap.` · `...` |
| Product / Design | Bổ sung hoặc chỉnh spec/flow ở mức nhẹ | `Cập nhật mô tả requirement cho patch này.` · `Ghi lại flow màn hình hiện tại theo code/tài liệu cũ.` · `Bổ sung acceptance note cho case BAU này.` · `...` |
| Arch / Plan | Ghi nhận kiến trúc/kế hoạch khi patch có ảnh hưởng | `Ghi lại API/dependency bị ảnh hưởng bởi patch này.` · `Chia checklist sửa nhỏ để tôi review trước khi làm.` · `Nêu rủi ro cross-repo nếu sửa file này.` · `...` |
| Test / QA | Tự kiểm tra regression hoặc test impact | `Liệt kê regression cần tự test trước khi merge.` · `Sau khi sửa, tự review và tự test 3-5 vòng.` · `Viết checklist QA ngắn cho bug/patch này.` · `...` |
| Implement / Patch | Sửa nhỏ theo scope BAU | `Sửa lỗi này trong phạm vi services/api thôi.` · `Patch security config này, đừng mở rộng scope.` · `Sau khi sửa, giải thích diff và các bước đã test.` · `...` |
| Bug code | Defect trong code PROD | `Đây là bug: endpoint checkout trả 500 khi giỏ hàng rỗng.` · `Fix bug này và thêm regression check nếu phù hợp.` · `Kiểm tra doc-impact: đây là bug code hay đổi requirement?` · `...` |
| Session | Xem trạng thái hoặc tiếp tục phiên làm việc | `Việc lúc nãy đang ở đâu rồi?` · `Tiếp tục phần patch đang làm dở.` · `Tóm tắt trạng thái và next step cho tôi.` · `...` |

**Cách dùng tự chủ**

A Gõ tự nhiên theo nhu cầu: đọc context, cập nhật doc, exploration, patch, bug code hoặc test impact.

B Không cần nhớ cú pháp start ..., validate ..., approve ...; Freedom tự route theo intent.

C Có thể yêu cầu AI tự review / tự test nếu muốn, nhưng L2/freedom không block như gate.

D Commit tài liệu/code theo quy trình hiện hữu; không seal Living Truth chặt như L3.

---

## 38. Brownfield L3 · Vừa & nhỏ

*Phụ lục · Adoption runbook · Số trên slide: H4*

Case đã chốt: hợp nhất các repo liên quan vào một meta-repo, dùng discover-code để số hoá code PROD + tài liệu hiện có, đưa vào Living Truth bằng reflect sprint, rồi phát triển tiếp theo guided L3.

**L3 guided · mô hình ①**

**Command runbook**

**Setup project · chỉ câu lệnh**

```bash
mkdir <project-meta>
cd <project-meta>
git init
unzip prism-v2.x.zip
./.prism/setup.sh
git submodule add <api.git> services/api
git submodule add <worker.git> services/worker
git submodule add <web.git> frontends/web
git submodule update --init --recursive
cp <old-docs> docs/inbox/
git add .
git commit -m "chore: scaffold brownfield PRISM guided"
```

**Lưu ý thao tác**

- Whole System = số hoá toàn bộ codebase hiện tại một lần để khởi tạo Living Truth; dùng khi Living Truth còn rỗng, chưa có sprint đang dở và working tree sạch.
- Incremental = số hoá từng area theo nhu cầu; dùng khi project đã chạy PRISM một phần, hoặc chỉ cần govern area cũ trước khi sửa/xoá/xây tiếp.
- Reflect sprint = sprint đặc biệt để đưa hiện trạng code PROD vào Living Truth: chỉ chứa reflected docs, không trộn feature mới, không build code mới.
- discover-code là thành phần duy nhất đọc code để số hoá hiện trạng; PRISM chỉ import/assign ID/seal, không tự reverse-document code.
- Import đi theo thứ tự Product → Design → Architecture; cả ba phần phải cùng mô tả một phạm vi hiện trạng.
- WHY/KPI/NFR/rationale code không cung cấp thì route thành deferred risk/open question; không hỏi dev đoán và không bịa.
- AI vẫn chạy ở root meta-repo để đọc đủ docs và nhiều submodule một lúc.
- Bug code sau baseline dùng start bug: <symptom> → feedback bug: ... → validate bug <bug-slug> → approve bug <bug-slug>; nếu fix đổi spec thì mở thêm start change: ... .
- Sau baseline seal, mọi thay đổi mới phải đi qua start / validate / approve như guided; implement validate theo từng TGx.x.

**Lệnh chạy số hoá → guided L3**

| Phase | Mục tiêu | Lệnh / thao tác |
|---|---|---|
| Discover-code | Số hoá Whole System hoặc Incremental | `discover-code full whole system \| discover-code full <area>` |
| Product | Import as-built requirement / PRD slice | `import product` · `validate user story` · `approve product` |
| Design | Import current UI/flow hoặc Design-N/A | `import design` · `validate design` · `approve design` |
| Architecture | Import current architecture / contracts / NFR | `import arch` · `validate architecture` · `approve arch` |
| Seal reflect | Seal baseline vào Living Truth | `approve implement` |
| Normal L3 | Sau reflect seal, phát triển như guided L3 | `new sprint` `start product: <feature/change>` `start design` `start arch` `start plan` `start test` `start implement TG1.1` `validate implementation --mode spec TG1.1` `validate implementation --mode quality TG1.1` `approve implement` |
| Bug code | Defect sau khi baseline đã vào Living Truth | `start bug: <symptom>` · `feedback bug: ...` · `validate bug <bug-slug>` · `approve bug <bug-slug>` |

**Chuỗi thao tác theo phase**

1 Chọn Whole System nếu LT rỗng và code đủ nhỏ; chọn Incremental nếu chỉ govern area cũ sắp sửa/xoá/xây tiếp.

2 Chạy discover-code để đưa as-built bundle vào docs/inbox/; AI/PRISM mở reflect sprint khi cần.

3 Trong reflect sprint, import lần lượt Product → Design → Architecture; mỗi phase validate rồi approve.

4 approve implement trong reflect chỉ để seal baseline vào Living Truth; không chạy Test lane, không build code.

5 Sau seal, feature/change mới chạy guided L3 bình thường; implement theo TGx.x và validate từng TG.

---

## 39. Brownfield L3 · Lớn

*Phụ lục · Adoption runbook · Số trên slide: H5*

Đang hoàn thiện: tránh big-bang toàn hệ thống. Dự kiến big-meta repo ở ngoài giữ current-system high-level, module map, dependency/contract và cross-feature; từng module meta-repo chạy PRISM guided/reflect riêng, chỉ module meta-repo mới include code repos.

**L3 module · solution WIP**

**Command runbook**

**Setup project dự kiến · chỉ câu lệnh**

```bash
mkdir <big-meta>
cd <big-meta>
git init
unzip prism-v2.x.zip
./.prism/setup.sh
git submodule add <payment-meta.git> modules/payment-meta
git submodule add <order-meta.git> modules/order-meta
git submodule update --init --recursive
git add .
git commit -m "chore: scaffold PRISM big meta-repo"
cd ..
mkdir <module-meta>
cd <module-meta>
git init
unzip prism-v2.x.zip
./.prism/setup.sh
git submodule add <owned-service.git> services/<owned-service>
git submodule add <owned-app.git> frontends/<owned-app>
git submodule update --init --recursive
cp <old-docs> docs/inbox/
git add .
git commit -m "chore: scaffold brownfield module meta-repo"
```

**Đang hoàn thiện**

- Rollout theo wave/module nào trước, và điều kiện một module được nâng từ L2 lên L3.
- Cần hoàn thiện cách big-meta đọc/tổng hợp thông tin từ module meta-repo.
- Cần hoàn thiện flow cross-module feature/contract từ big-meta xuống từng module.

**Lệnh chạy đề xuất (WIP)**

| Phase | Mục tiêu | Lệnh / thao tác |
|---|---|---|
| Big-meta map | Map system hiện tại ở high level, không đọc code trực tiếp | `import arch` · `validate architecture` · `approve arch` |
| Link modules | Big-meta link module meta-repo để nắm status/decision mới nhất | `git submodule update --remote modules/<module-meta>` · `status` · `check updates` |
| Module reflect | Reflect baseline từ PROD trong từng module meta-repo | `discover-code full <module-area>` `import product` `import design` `import arch` `validate user story` `validate design` `validate architecture` `approve implement` |
| Feature L3 | Chạy guided trong module đã onboard, implement theo TG | `new sprint` `start product` `start design` `start arch` `start plan` `start test` `start implement TG1.1` `validate implementation --mode spec TG1.1` `validate implementation --mode quality TG1.1` `approve implement` |
| Cross-module | Đổi contract/cross-feature thì điều phối qua big-meta | `start change: update contract` · `validate changes` · `approve changes` |

**Chuỗi thao tác theo phase**

A Big-meta giữ system overview, module ownership, dependency, contract và cross-feature; không include service code.

B Big-meta link tới module meta-repo để điều phối và nắm tình hình cập nhật.

C Triển khai theo module/wave có boundary rõ; mỗi module meta-repo reflect baseline từ PROD bằng discover-code.

D Module mature thì chạy L3 guided; module chưa mature giữ L2 hoặc reflect thêm theo wave.

E Cross-module change được draft/review ở big-meta, implementation vẫn nằm trong module meta-repo.

---

## 40. Cảm ơn & Q&A

*Thank you*
