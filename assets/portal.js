(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const research = window.RiseLeapResearch || {};
  const fallbackMonths = {
    "2026-08": ["AUG 2026", "SAFE EXECUTION", "APPROVAL · EVALUATION · WORKFLOW", "成果を急がず、成果が自然に出る生活・安全・評価の基盤を整えた。"],
    "2026-07": ["JUL 2026", "HUMAN IN THE LOOP", "QUALITY · TRUST · SUPERVISION", "AIを影武者として使い、人間が品質と信頼を握る段階へ。"],
    "2026-06": ["JUN 2026", "MARKET SIGNALS", "CONTEXT · RESPONSE · FEEDBACK", "市場の反応と途中経過を、次の判断に変える仕組みを探った。"],
    "2026-05": ["MAY 2026", "THE WORKING NOTES", "PROCESS · INTENT · REUSE", "結果ではなく途中式を残し、使うほど賢くなる資産へ変えた。"],
    "2026-04": ["APR 2026", "CONTEXT", "MEMORY · OPENCLAW · CONTINUITY", "AIに説明し直さなくてよい、文脈を保つ業務基盤を再定義した。"],
    "2026-03": ["MAR 2026", "FIRST EXECUTION", "API · TEST · REPORT", "最初の自動処理を動かし、検証できる循環をつくった。"],
    "2026-02": ["FEB 2026", "AUTONOMY", "AGENT · HUMAN APPROVAL · STRUCTURE", "AI労働基盤を、人間の承認と再利用可能な構造で捉え始めた。"],
    "2026-01": ["JAN 2026", "THE FIRST QUESTION", "SELF-HELP · ACTION · AI", "AIを使って、人が自分で前へ進める環境をつくるところから始まった。"]
  };
  const storyDefinitions = research.stories || [];
  const monthDefinitions = research.months || fallbackMonths;
  const people = research.people || [];
  const quotes = research.quotes || [];
  const concepts = research.concepts || [];
  const escape = value => String(value).replace(/[&<>"]/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[character]));

  const itemForDate = (items, date) => items.find(item => item.date === date);

  const renderTimeTravel = items => {
    const container = document.querySelector("#time-travel-list");
    if (!container) return;
    const months = [...new Set(items.map(item => item.month))].sort().reverse();
    container.innerHTML = months.map((month, index) => {
      const [label, title, tags, copy] = monthDefinitions[month] || [month.replace("-", "."), "IN PROGRESS", "RESEARCH", "記録を読み返し、次の判断へつなげる。"];
      const featured = items.filter(item => item.month === month).sort((a, b) => b.date.localeCompare(a.date))[0];
      return `<article class="time-card" data-time-index="${index}"><div class="time-meta"><span>${label}</span><span>${String(index + 1).padStart(2, "0")}</span></div><div><h3>${title}</h3><p class="time-tags">${tags}</p><p>${copy}</p></div>${featured ? `<a href="${featured.href}" class="time-link"><span>${featured.date.replaceAll("-", ".")}</span><strong>${escape(featured.title)}</strong><b>→</b></a>` : ""}</article>`;
    }).join("");
  };

  const renderStories = items => {
    const container = document.querySelector("#stories-list");
    if (!container) return;
    const definitions = research.prototypeStories?.length ? storyDefinitions.filter(definition => research.prototypeStories.includes(definition.id)) : storyDefinitions;
    container.innerHTML = definitions.map(definition => {
      const anchorPoints = definition.dates.map(date => itemForDate(items, date)).filter(Boolean);
      const latestAnchor = definition.dates.at(-1);
      const futurePoints = items.filter(item => item.date > latestAnchor && definition.query.test([item.title, item.summary, item.shortSummary].join(" ")));
      const points = [...new Map([...anchorPoints, ...futurePoints].map(item => [item.date, item])).values()].sort((a, b) => a.date.localeCompare(b.date));
      return `<article class="story-track" id="story-${definition.id}"><div class="story-track-head"><span>STORY</span><h3>${definition.name}</h3><p>${definition.subtitle}</p></div><ol>${points.map((item, index) => `<li><a href="${item.href}"><time>${item.date.replaceAll("-", ".")}</time><strong>${escape(item.title)}</strong><i>${String(index + 1).padStart(2, "0")}</i></a></li>`).join("")}</ol></article>`;
    }).join("");
  };

  const renderPeople = items => {
    const cards = document.querySelector("#people-list");
    const detail = document.querySelector("#person-detail");
    if (!cards || !detail) return;
    cards.innerHTML = people.map(person => `<button class="person-command" type="button" data-person="${person.name}"><span>${person.role}</span><strong>${person.display}</strong><small>${person.verbs}</small></button>`).join("");
    const show = name => {
      const person = people.find(entry => entry.name === name) || people[0];
      const related = items.filter(item => item.members.includes(person.name)).sort((a, b) => a.date.localeCompare(b.date));
      const first = related[0];
      const latest = related.at(-1);
      detail.innerHTML = `<div class="person-detail-head"><span>${person.role.toUpperCase()}</span><h3>${person.display}</h3><p>${person.now}</p></div><div class="person-detail-grid"><div><span>INITIAL STATE</span><p>${first ? `${first.date.replaceAll("-", ".")} — ${escape(first.title)}` : "記録を読み込み中"}</p></div><div><span>TURNING POINT / EDITORIAL</span><p>${escape(person.quote)}</p></div><div><span>CURRENT STATE</span><p>${latest ? `${latest.date.replaceAll("-", ".")} — ${escape(latest.title)}` : person.now}</p></div><div><span>RELATED CONCEPTS</span><p>${person.concepts}</p></div></div><div class="person-trace">${related.map(item => `<a href="${item.href}"><time>${item.date.replaceAll("-", ".")}</time><span>${escape(item.title)}</span></a>`).join("")}</div>`;
      cards.querySelectorAll(".person-command").forEach(button => button.classList.toggle("is-active", button.dataset.person === person.name));
    };
    cards.addEventListener("click", event => {
      const button = event.target.closest("[data-person]");
      if (button) show(button.dataset.person);
    });
    show(people[0].name);
  };

  const renderQuotes = () => {
    const container = document.querySelector("#quote-wall");
    if (!container) return;
    container.innerHTML = quotes.map(entry => `<a href="${entry.href}" class="quote-wall-card"><span>${entry.date} · ${entry.speaker}</span><blockquote>“${entry.quote}”</blockquote><b>Read the meeting →</b></a>`).join("");
  };

  const renderKnowledge = () => {
    const map = document.querySelector("#knowledge-map");
    const panel = document.querySelector("#knowledge-panel");
    if (!map || !panel) return;
    map.innerHTML = concepts.map(([name, date, query, description], index) => `<button type="button" class="knowledge-command" data-concept="${index}" style="--orbit:${(index * 53) % 360}deg;--distance:${110 + (index % 3) * 32}px">${name}</button>`).join("");
    const show = index => {
      const [name, date, query, description] = concepts[index];
      panel.innerHTML = `<span>FIRST TRACE · ${date}</span><h3>${name}</h3><p>${description}</p><p class="knowledge-panel-note">関連人物とストーリーをたどり、アーカイブを絞り込めます。</p><button type="button" data-knowledge-search="${query}">関連議事録を探す →</button>`;
      map.querySelectorAll("button").forEach(node => node.classList.toggle("is-active", Number(node.dataset.concept) === index));
    };
    map.addEventListener("click", event => { const node = event.target.closest("[data-concept]"); if (node) show(Number(node.dataset.concept)); });
    panel.addEventListener("click", event => {
      const button = event.target.closest("[data-knowledge-search]");
      if (!button) return;
      const input = document.querySelector("#archive-keyword");
      if (!input) return;
      input.value = button.dataset.knowledgeSearch.split("|")[0];
      input.dispatchEvent(new Event("input", { bubbles: true }));
      document.querySelector("#archive")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
    show(0);
  };

  const renderPulse = items => {
    const latest = items.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
    document.querySelector("#now-meeting-count").textContent = String(items.length);
    document.querySelector("#system-latest").textContent = latest ? latest.date.replaceAll("-", ".") : "—";
    document.querySelector("#system-phase").textContent = monthDefinitions[latest?.month]?.[1] || "RESEARCH IN PROGRESS";
  };

  const setupScroll = () => {
    if (reduced || !window.gsap || !window.ScrollTrigger || window.innerWidth < 781) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.utils.toArray(".time-card, .story-track, .quote-wall-card").forEach(element => {
      window.gsap.fromTo(element, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: .65, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
    });
    const list = document.querySelector("#time-travel-list");
    if (list) window.gsap.to(list, { "--travel-progress": 1, ease: "none", scrollTrigger: { trigger: list, start: "top 74%", end: "bottom 58%", scrub: .55 } });
    window.ScrollTrigger.refresh();
  };

  document.addEventListener("archive:rendered", event => {
    const items = event.detail?.items || [];
    if (!items.length) return;
    renderPulse(items);
    renderTimeTravel(items);
    renderStories(items);
    renderPeople(items);
    renderQuotes();
    renderKnowledge();
    setupScroll();
  });
})();
