(() => {
  "use strict";

  document.documentElement.classList.add("art-ready");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const research = window.RiseLeapResearch || {};
  const escape = value => String(value || "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
  const featuredTitles = {
    "2026-10-29": ["新たな案件への一歩と、", "AI業務基盤の役割分担"],
    "2026-09-11": ["AIが変わったなら、", "目的と要件も問い直す"],
    "2026-09-04": ["履歴と評価を、", "AIが次の判断へつなぐ"],
    "2026-08-21": ["AIを安全に動かすための", "承認設計と、高品質な", "AI出力を生む", "評価データベース"]
  };
  let archiveItems = [];

  const dateLabel = date => String(date || "").replaceAll("-", ".");
  const membersLabel = item => item.members?.map(name => name.replace("中村", "").replace("木場", "")).join(" / ") || "健太郎 / 和雄 / 晏門";

  const renderLatest = items => {
    const sorted = items.slice().sort((a, b) => b.date.localeCompare(a.date));
    const latest = sorted[0];
    const previous = sorted[1];
    if (!latest) return;
    const featuredTitle = featuredTitles[latest.date];
    const title = featuredTitle ? featuredTitle.join("") : latest.title;
    document.querySelector("#latest-date").dateTime = latest.date;
    document.querySelector("#latest-date").textContent = dateLabel(latest.date);
    const titleElement = document.querySelector("#latest-title");
    titleElement.textContent = title;
    if (featuredTitle) titleElement.innerHTML = featuredTitle.map(line => `<span>${escape(line)}</span>`).join("");
    document.querySelector("#latest-summary").textContent = latest.shortSummary || latest.summary;
    document.querySelector("#latest-members").textContent = membersLabel(latest);
    document.querySelector("#latest-themes").textContent = latest.themes?.join(" / ") || "AI Research";
    const open = document.querySelector("#latest-open");
    open.href = latest.href;
    const previousLink = document.querySelector("#latest-previous");
    previousLink.href = previous?.href || "#recent";
    previousLink.querySelector("span").textContent = previous ? dateLabel(previous.date) : "—";
    document.querySelector("#system-latest").textContent = dateLabel(latest.date);
    document.querySelector("#now-meeting-count").textContent = String(items.length);
    document.querySelector("#now-meeting-date").textContent = dateLabel(latest.date);
    const month = latest.date.slice(0, 7);
    document.querySelector("#system-phase").textContent = research.months?.[month]?.[1] || "RESEARCH IN PROGRESS";
    document.querySelector("#now").dataset.period = `${month.slice(5)} / ${month.slice(0, 4)}`;
    document.querySelector(".latest-copy").dataset.issue = `LATEST / ${String(items.length).padStart(3, "0")}`;
    const monthLabel = new Date(`${latest.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();
    document.querySelector(".visual-issue").textContent = `VOL. ${String(items.length).padStart(3, "0")} / ${monthLabel}`;
  };

  const renderNow = () => {
    const container = document.querySelector("#now-ledger");
    if (!container) return;
    const current = (research.currentResearch || []).map(person => [person.id, person.number, person.display, person.title, person.keywords]);
    container.innerHTML = `<div class="now-canvas-visual" aria-hidden="true"><img src="assets/featured-journey.jpg" alt=""><span>COLLECTIVE<br>RESEARCH</span></div><div class="now-lines" aria-hidden="true"><i></i><i></i><i></i></div>${current.map(([id, number, name, title, keywords]) => `<article class="now-person-node now-${id}" data-now-person="${id}" tabindex="0"><span>${number} / ${name}</span><h3>${title}</h3><div class="now-keywords">${keywords.map(keyword => `<em>${keyword}</em>`).join("")}</div></article>`).join("")}<p class="now-canvas-note">Hover or focus a person to trace the active research thread.</p>`;
    const focus = id => id ? container.dataset.focus = id : container.removeAttribute("data-focus");
    container.querySelectorAll("[data-now-person]").forEach(node => {
      node.addEventListener("mouseenter", () => focus(node.dataset.nowPerson));
      node.addEventListener("focus", () => focus(node.dataset.nowPerson));
      node.addEventListener("mouseleave", () => focus(""));
      node.addEventListener("blur", () => focus(""));
    });
  };

  const renderRecent = items => {
    const container = document.querySelector("#recent-list");
    if (!container) return;
    const recent = items.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    container.innerHTML = recent.map((item, index) => `<a class="recent-row" href="${item.href}" data-recent-index="${index}" data-recent-date="${escape(dateLabel(item.date))}" data-recent-theme="${escape(item.themes?.slice(0, 2).join(" / ") || "Research")}"><time datetime="${item.date}">${dateLabel(item.date)}</time><strong>${escape(item.title)}</strong><span class="recent-context">${escape(membersLabel(item))} · ${escape(item.themes?.join(" / ") || "Research")}</span><span class="arrow" aria-hidden="true">→</span></a>`).join("");
    const preview = document.querySelector("#recent-preview");
    if (!preview) return;
    const updatePreview = row => {
      const index = Number(row.dataset.recentIndex || 0);
      preview.style.setProperty("--recent-index", String(index));
      preview.style.setProperty("--recent-x", `${50 + index * 3}%`);
      preview.style.setProperty("--recent-scale", String(1.02 + index * .006));
      document.querySelector("#recent-preview-date").textContent = row.dataset.recentDate || "";
      document.querySelector("#recent-preview-theme").textContent = row.dataset.recentTheme || "RESEARCH";
      preview.classList.remove("is-changing");
      window.requestAnimationFrame(() => preview.classList.add("is-changing"));
    };
    container.querySelectorAll(".recent-row").forEach(row => {
      row.addEventListener("mouseenter", () => updatePreview(row));
      row.addEventListener("focus", () => updatePreview(row));
    });
    if (container.firstElementChild) updatePreview(container.firstElementChild);
  };

  const openArchiveSearch = (query = "") => {
    const input = document.querySelector("#archive-keyword");
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    document.querySelector("#archive")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const setupCommand = () => {
    const dialog = document.querySelector("#command-palette");
    const opener = document.querySelector("#command-search-open");
    const input = document.querySelector("#command-input");
    const results = document.querySelector("#command-results");
    if (!dialog || !input || !results) return;
    const close = () => dialog.close?.();
    const render = query => {
      const needle = String(query || "").trim().toLocaleLowerCase("ja");
      const all = needle ? archiveItems.filter(item => [item.date, item.title, item.searchText, ...(item.members || []), ...(item.themes || [])].join(" ").toLocaleLowerCase("ja").includes(needle)) : archiveItems.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
      if (!all.length) { results.innerHTML = '<p class="command-empty">該当する記録がありません。別の語句で試してください。</p>'; return; }
      results.innerHTML = all.slice(0, 12).map(item => `<button type="button" class="command-result" data-command-query="${escape(needle)}" data-command-href="${escape(item.href)}"><time>${dateLabel(item.date)}</time><strong>${escape(item.title)}</strong><span>${escape(item.themes?.[0] || "SESSION")} →</span></button>`).join("");
    };
    const show = () => { if (!dialog.open) dialog.showModal?.(); render(""); window.setTimeout(() => input.focus(), 0); };
    opener?.addEventListener("click", show);
    document.querySelectorAll("[data-command-launch]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); show(); }));
    input.addEventListener("input", () => render(input.value));
    results.addEventListener("click", event => {
      const result = event.target.closest("[data-command-href]");
      if (!result) return;
      close();
      openArchiveSearch(result.dataset.commandQuery || "");
    });
    document.addEventListener("keydown", event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); show(); }
      if (event.key === "Escape" && dialog.open) close();
    });
  };

  const setupHeader = () => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("os-scrolled", window.scrollY > 36);
    window.addEventListener("scroll", update, { passive: true });
    update();
  };

  const setupReactiveRows = () => {
    if (reduced || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle("is-in-view", entry.isIntersecting)), { threshold: .25 });
    document.querySelectorAll(".evolution-steps li, .timeline-os .time-card, .now-canvas, .recent-editorial, .people-layout, .knowledge-layout").forEach(node => observer.observe(node));
  };

  const setupEditorialMotion = () => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const visual = document.querySelector(".latest-visual");
    const image = visual?.querySelector("img");
    if (!visual || !image) return;
    visual.addEventListener("pointermove", event => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      image.style.transform = `scale(1.035) translate(${x * 7}px, ${y * 7}px)`;
    });
    visual.addEventListener("pointerleave", () => image.style.transform = "");
  };

  const init = items => {
    archiveItems = items || [];
    renderLatest(archiveItems);
    renderNow();
    renderRecent(archiveItems);
    setupCommand();
    setupHeader();
    setupReactiveRows();
    setupEditorialMotion();
  };

  document.addEventListener("archive:rendered", event => init(event.detail?.items || []), { once: true });
})();
