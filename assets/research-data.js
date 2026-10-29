/*
 * Curated research metadata.
 *
 * Archive pages remain the source of truth for meeting text, dates, members,
 * themes, and search. Add an entry to `meetingNotes` only when a meeting needs
 * a curated connection, quote, or story placement in the exploration layer.
 */
window.RiseLeapResearch = Object.freeze({
  stories: [
    { id: "openclaw", name: "OPENCLAW STORY", subtitle: "承認設計から、Dotsとの役割分担へ", query: /OpenClaw|承認|文脈|API|自動処理|要件|Dots/i, dates: ["2026-02-06", "2026-02-20", "2026-03-06", "2026-04-30", "2026-06-11", "2026-08-21", "2026-09-04", "2026-09-11", "2026-10-15", "2026-10-22", "2026-10-29"] },
    { id: "kazuo", name: "KAZUO CAREER STORY", subtitle: "経験を学習に変え、新しいクライアント業務へ", query: /案件|応募|面談|ミショナ|人事|キャリア|直接応募|DX/i, dates: ["2026-01-16", "2026-03-27", "2026-05-14", "2026-06-18", "2026-08-13", "2026-08-21", "2026-09-04", "2026-09-11", "2026-10-01", "2026-10-29"] },
    { id: "thinking", name: "AI THINKING STORY", subtitle: "AI能力の検証から、相手の課題を起点にする実践へ", query: /逆算|途中式|文脈|評価|承認|AI|課題/i, dates: ["2026-01-30", "2026-04-30", "2026-05-14", "2026-06-04", "2026-07-31", "2026-08-21", "2026-09-04", "2026-09-11", "2026-09-17", "2026-10-01", "2026-10-15", "2026-10-22", "2026-10-29"] }
  ],
  prototypeStories: [],
  currentResearch: [
    { id: "kentaro", number: "01", display: "KENTARO", title: "AI Execution & Records", keywords: ["Dots", "OpenClaw", "Simulation"] },
    { id: "kazuo", number: "02", display: "KAZUO", title: "Client Work & DX", keywords: ["After-school DX", "Trial", "Business Context"] },
    { id: "amon", number: "03", display: "AMON", title: "Understand Before Build", keywords: ["Client Context", "Preparation", "AI Roles"] }
  ],
  months: {
    "2026-10": ["OCT 2026", "RECOVERY & EXECUTION", "DOTS · CLIENT WORK · EXECUTION", "経験から行動を再設計し、新規案件とAI業務基盤の役割分担へ進んだ。編集上の月別整理。"],
    "2026-09": ["SEP 2026", "EXPERIMENT & REASSESSMENT", "REQUIREMENTS · CREATION · COST", "AIの進化に合わせて要件を問い直し、制作と収益化の検証を広げた。編集上の月別整理。"],
    "2026-08": ["AUG 2026", "SAFE EXECUTION", "APPROVAL · EVALUATION · WORKFLOW", "成果を急がず、成果が自然に出る生活・安全・評価の基盤を整えた。"],
    "2026-07": ["JUL 2026", "HUMAN IN THE LOOP", "QUALITY · TRUST · SUPERVISION", "AIを影武者として使い、人間が品質と信頼を握る段階へ。"],
    "2026-06": ["JUN 2026", "MARKET SIGNALS", "CONTEXT · RESPONSE · FEEDBACK", "市場の反応と途中経過を、次の判断に変える仕組みを探った。"],
    "2026-05": ["MAY 2026", "THE WORKING NOTES", "PROCESS · INTENT · REUSE", "結果ではなく途中式を残し、使うほど賢くなる資産へ変えた。"],
    "2026-04": ["APR 2026", "CONTEXT", "MEMORY · OPENCLAW · CONTINUITY", "AIに説明し直さなくてよい、文脈を保つ業務基盤を再定義した。"],
    "2026-03": ["MAR 2026", "FIRST EXECUTION", "API · TEST · REPORT", "最初の自動処理を動かし、検証できる循環をつくった。"],
    "2026-02": ["FEB 2026", "AUTONOMY", "AGENT · HUMAN APPROVAL · STRUCTURE", "AI労働基盤を、人間の承認と再利用可能な構造で捉え始めた。"],
    "2026-01": ["JAN 2026", "THE FIRST QUESTION", "SELF-HELP · ACTION · AI", "AIを使って、人が自分で前へ進める環境をつくるところから始まった。"]
  },
  people: [
    { id: "kentaro", name: "中村健太郎", display: "KENTARO", role: "Builder", verbs: "Build / Experiment / Visualize", now: "Dots / OpenClaw / Simulation / Approval Records", quote: "要件を問い直し、AI処理と業務状態の管理を分担する段階へ。", concepts: "模擬環境 · 状態管理 · 承認履歴" },
    { id: "kazuo", name: "中村和雄", display: "KAZUO", role: "Operator", verbs: "Work / Apply / Improve", now: "After-school DX / Business Partner Trial / Client Work", quote: "契約終了後の行動再設計から、新たなクライアント業務への対応へ。", concepts: "学童DX · トライアル受諾 · 業務理解" },
    { id: "amon", name: "木場晏門", display: "AMON", role: "Architect", verbs: "Design / Question / Structure", now: "Client Context / Preparation / AI Roles", quote: "ツールを提案する前に、相手の既存環境と課題を理解する。", concepts: "課題理解 · 事前学習 · 役割分担" }
  ],
  spaceTopics: [
    { label: "OpenClaw", owner: "kentaro", x: 17, y: 28, depth: 1, href: "2026-10-29.html" },
    { label: "Approval", owner: "kentaro", x: 77, y: 21, depth: 3, href: "2026-09-04.html" },
    { label: "Context", owner: "kentaro amon", x: 82, y: 55, depth: 2, href: "2026-04-30.html" },
    { label: "Memory", owner: "kentaro", x: 17, y: 70, depth: 2, href: "2026-06-11.html" },
    { label: "Missiona", owner: "kazuo", x: 32, y: 85, depth: 3, href: "2026-08-13.html" },
    { label: "Career Lab", owner: "kazuo", x: 54, y: 91, depth: 2, href: "2026-09-11.html" },
    { label: "Workflow", owner: "kazuo", x: 71, y: 84, depth: 1, href: "2026-08-13.html" },
    { label: "Career", owner: "kazuo", x: 8, y: 49, depth: 3, href: "2026-08-21.html" },
    { label: "AI Quality", owner: "amon", x: 91, y: 40, depth: 1, href: "2026-08-21.html" },
    { label: "Evaluation Database", owner: "amon", x: 50, y: 13, depth: 2, href: "2026-08-21.html" },
    { label: "Requirement Reassessment", owner: "kentaro amon", x: 61, y: 44, depth: 2, href: "2026-09-11.html" },
    { label: "Direct Outreach", owner: "kazuo", x: 39, y: 63, depth: 2, href: "2026-10-01.html" },
    { label: "Dots", owner: "kentaro amon", x: 35, y: 40, depth: 2, href: "2026-10-22.html" },
    { label: "Client Context", owner: "kazuo amon", x: 68, y: 68, depth: 1, href: "2026-10-29.html" }
  ],
  quotes: [
    { date: "2026.10.29", speaker: "会議を象徴する一文（編集）", quote: "AIでできることを提案する前に、相手が本当に解決したい問題を知る。", href: "2026-10-29.html" },
    { date: "2026.10.22", speaker: "会議を象徴する一文（編集）", quote: "自律的に動くAIには、実行能力だけでなく、進捗と結果を管理する仕組みが必要になる。", href: "2026-10-22.html" },
    { date: "2026.10.15", speaker: "会議を象徴する一文（編集）", quote: "AIを使うことが目的だった1年から、AIと仕事を動かす次の1年へ。", href: "2026-10-15.html" },
    { date: "2026.10.01", speaker: "会議を象徴する一文（編集）", quote: "失敗を自分の評価で終わらせず、次の行動を変える材料にする。", href: "2026-10-01.html" },
    { date: "2026.09.17", speaker: "会議を象徴する一文（編集）", quote: "できることが増えた今、何を成果につなげるかが問われる。", href: "2026-09-17.html" },
    { date: "2026.09.11", speaker: "奮起と躍進の集い", quote: "AIが変わったなら、やり方だけでなく、目的と要件も問い直す。", href: "2026-09-11.html" },
    { date: "2026.08.21", speaker: "晏門さん", quote: "欲しい結果を直接取りに行くより、その結果が出る構造を先に作る。", href: "2026-08-21.html" },
    { date: "2026.08.13", speaker: "健太郎さん", quote: "予定が空いたら人生を入れるのではなく、人生を先に決めて、その中に仕事を入れる。", href: "2026-08-13.html" },
    { date: "2026.04.30", speaker: "健太郎さん", quote: "AIを速くするだけでは仕事は速くならない。仕事の文脈を、説明し直さなくてよい状態にする。", href: "2026-04-30.html" }
  ],
  concepts: [
    ["成果・再現性・コスト", "2026.09", "再現性", "能力を試すだけでなく、成果と利用コストを確認する"],
    ["行動と市場の反応", "2026.10", "一次返信", "応募・接触と相手の反応から、次の行動を変える"],
    ["AIと仕事を進める", "2026.10", "Dots", "学習から、プロジェクトの進捗と実行を支える段階へ"],
    ["依頼と完了の違い", "2026.10", "完了", "依頼受付と完了結果を分け、進捗を追い続ける"],
    ["相手の現状と課題", "2026.10", "学童", "ツールを提案する前に、既存環境と課題を理解する"],
    ["AI処理と業務状態の分担", "2026.10", "役割分担", "DotsのAI処理と、OpenClawの状態・承認・結果管理を組み合わせる"],
    ["自助モデル", "2026.01", "AI", "人が自分で前へ進める環境"], ["途中式", "2026.05", "途中式", "意図・仮説・判断・修正を残す"], ["文脈", "2026.04", "OpenClaw", "AIと仕事の背景を共有し続ける"], ["逆算", "2026.06", "目標", "未来から届く構造を設計する"], ["自分軸", "2026.08", "時間", "人生を先に決めて仕事を配置する"], ["承認の正当性", "2026.08", "承認", "誰が何を認めたかを照合する"], ["評価データベース", "2026.08", "評価", "人間の評価をAIの学習資産にする"], ["やりたかった度", "2026.09", "Career Lab", "本人の評価を案件探索の学習データにする"], ["AIに埋めさせない安全性", "2026.09", "Approval", "不足した記録を推測で補完せず停止する"], ["能力から課題を選ばない", "2026.09", "会社|課題", "現在の能力ではなく、変えるべき課題から設計する"], ["要件再評価", "2026.09", "Astra|OpenClaw|要件", "AI能力の変化に合わせて、必要な仕様を問い直す"]
  ],
  meetingNotes: {
    "2026-10-29": { importance: 5, stories: ["openclaw", "kazuo", "thinking"], concepts: ["相手の現状と課題", "AI処理と業務状態の分担"], connectsTo: ["2026-10-01", "2026-10-22"] },
    "2026-10-22": { importance: 5, stories: ["openclaw", "thinking"], concepts: ["依頼と完了の違い"], connectsTo: ["2026-09-11", "2026-10-15"] },
    "2026-10-15": { importance: 4, stories: ["openclaw", "thinking"], concepts: ["AIと仕事を進める"], connectsTo: ["2026-09-17"] },
    "2026-10-01": { importance: 5, stories: ["kazuo", "thinking"], concepts: ["行動と市場の反応"], connectsTo: ["2026-09-11"] },
    "2026-09-17": { importance: 4, stories: ["thinking"], concepts: ["成果・再現性・コスト"], connectsTo: ["2026-09-11"] },
    "2026-09-11": { importance: 5, stories: ["openclaw", "kazuo", "thinking"], concepts: ["能力から課題を選ばない", "要件再評価"], connectsTo: ["2026-09-04", "2026-08-21"] },
    "2026-09-04": { importance: 5, stories: ["openclaw", "kazuo", "thinking"], concepts: ["やりたかった度", "AIに埋めさせない安全性"], connectsTo: ["2026-08-21"] },
    "2026-08-21": { importance: 5, stories: ["openclaw", "thinking"], concepts: ["承認の正当性", "評価データベース"], connectsTo: ["2026-08-13", "2026-07-31"] },
    "2026-08-13": { importance: 5, stories: ["kazuo"], concepts: ["自分軸", "Workflow"], connectsTo: ["2026-07-31"] },
    "2026-07-31": { importance: 4, stories: ["thinking"], concepts: ["AI Quality", "Human in the loop"], connectsTo: ["2026-07-24"] },
    "2026-06-11": { importance: 4, stories: ["openclaw"], concepts: ["Context", "Memory"], connectsTo: ["2026-06-04"] },
    "2026-04-30": { importance: 5, stories: ["openclaw", "thinking"], concepts: ["Context"], connectsTo: ["2026-03-06"] },
    "2026-03-06": { importance: 5, stories: ["openclaw"], concepts: ["OpenClaw"], connectsTo: ["2026-02-20"] },
    "2026-02-20": { importance: 5, stories: ["openclaw"], concepts: ["Autonomy", "Human approval"], connectsTo: ["2026-02-06"] },
    "2026-01-16": { importance: 4, stories: ["kazuo", "thinking"], concepts: ["自助モデル"], connectsTo: [] }
  }
});
