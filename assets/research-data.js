/*
 * Curated research metadata.
 *
 * Archive pages remain the source of truth for meeting text, dates, members,
 * themes, and search. Add an entry to `meetingNotes` only when a meeting needs
 * a curated connection, quote, or story placement in the exploration layer.
 */
window.RiseLeapResearch = Object.freeze({
  stories: [
    { id: "openclaw", name: "OPENCLAW STORY", subtitle: "AIを安全に動かすまで", query: /OpenClaw|承認|文脈|API|自動処理/i, dates: ["2026-02-06", "2026-02-20", "2026-03-06", "2026-04-30", "2026-06-11", "2026-08-21", "2026-09-04"] },
    { id: "kazuo", name: "KAZUO CAREER STORY", subtitle: "仕事に入り、改善を実績に変えるまで", query: /案件|応募|面談|ミショナ|人事|キャリア|生活/i, dates: ["2026-01-16", "2026-03-27", "2026-05-14", "2026-06-18", "2026-08-13", "2026-08-21", "2026-09-04"] },
    { id: "thinking", name: "AI THINKING STORY", subtitle: "考え方を仕組みへ変えるまで", query: /逆算|途中式|文脈|評価|承認|AI/i, dates: ["2026-01-30", "2026-04-30", "2026-05-14", "2026-06-04", "2026-07-31", "2026-08-21", "2026-09-04"] }
  ],
  prototypeStories: ["openclaw"],
  months: {
    "2026-09": ["SEP 2026", "LEARNING FROM HISTORY", "CAREER LAB · APPROVAL · EVALUATION", "履歴と評価を使い、AIが次の判断へ進める基盤を実装した。"],
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
    { id: "kentaro", name: "中村健太郎", display: "KENTARO", role: "Builder", verbs: "Build / Experiment / Visualize", now: "OpenClaw / Approval / Execution / Archive", quote: "AIを速くするだけでは仕事は速くならない。", concepts: "OpenClaw · 承認 · 実更新" },
    { id: "kazuo", name: "中村和雄", display: "KAZUO", role: "Operator", verbs: "Work / Apply / Improve", now: "Career Lab / Job Data / Workflow / HR", quote: "人生を先に決めて、その中に仕事を入れる。", concepts: "キャリアラボ · 評価 · 改善" },
    { id: "amon", name: "木場晏門", display: "AMON", role: "Architect", verbs: "Design / Question / Structure", now: "Evaluation Data / Context / Quality / Structure", quote: "欲しい結果を直接取りに行くより、その構造を先に作る。", concepts: "文脈 · 評価DB · 構造" }
  ],
  spaceTopics: [
    { label: "OpenClaw", owner: "kentaro", x: 17, y: 28, depth: 1, href: "2026-08-21.html" },
    { label: "Approval", owner: "kentaro", x: 77, y: 21, depth: 3, href: "2026-09-04.html" },
    { label: "Context", owner: "kentaro amon", x: 82, y: 55, depth: 2, href: "2026-04-30.html" },
    { label: "Memory", owner: "kentaro", x: 17, y: 70, depth: 2, href: "2026-06-11.html" },
    { label: "Missiona", owner: "kazuo", x: 32, y: 85, depth: 3, href: "2026-08-13.html" },
    { label: "Career Lab", owner: "kazuo", x: 54, y: 91, depth: 2, href: "2026-09-04.html" },
    { label: "Workflow", owner: "kazuo", x: 71, y: 84, depth: 1, href: "2026-08-13.html" },
    { label: "Career", owner: "kazuo", x: 8, y: 49, depth: 3, href: "2026-08-21.html" },
    { label: "AI Quality", owner: "amon", x: 91, y: 40, depth: 1, href: "2026-08-21.html" },
    { label: "Evaluation Database", owner: "amon", x: 50, y: 13, depth: 2, href: "2026-08-21.html" }
  ],
  quotes: [
    { date: "2026.08.21", speaker: "晏門さん", quote: "欲しい結果を直接取りに行くより、その結果が出る構造を先に作る。", href: "2026-08-21.html" },
    { date: "2026.08.13", speaker: "健太郎さん", quote: "予定が空いたら人生を入れるのではなく、人生を先に決めて、その中に仕事を入れる。", href: "2026-08-13.html" },
    { date: "2026.04.30", speaker: "健太郎さん", quote: "AIを速くするだけでは仕事は速くならない。仕事の文脈を、説明し直さなくてよい状態にする。", href: "2026-04-30.html" }
  ],
  concepts: [
    ["自助モデル", "2026.01", "AI", "人が自分で前へ進める環境"], ["途中式", "2026.05", "途中式", "意図・仮説・判断・修正を残す"], ["文脈", "2026.04", "OpenClaw", "AIと仕事の背景を共有し続ける"], ["逆算", "2026.06", "目標", "未来から届く構造を設計する"], ["自分軸", "2026.08", "時間", "人生を先に決めて仕事を配置する"], ["承認の正当性", "2026.08", "承認", "誰が何を認めたかを照合する"], ["評価データベース", "2026.08", "評価", "人間の評価をAIの学習資産にする"], ["やりたかった度", "2026.09", "Career Lab", "本人の評価を案件探索の学習データにする"], ["AIに埋めさせない安全性", "2026.09", "Approval", "不足した記録を推測で補完せず停止する"]
  ],
  meetingNotes: {
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
