(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const research = window.RiseLeapResearch || {};
  const escape = value => String(value || "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
  const featuredTitles = {
    "2026-08-21": "AIを安全に動かすための承認設計と、高品質なAI出力を生む評価データベース"
  };
  let archiveItems = [];

  const dateLabel = date => String(date || "").replaceAll("-", ".");
  const membersLabel = item => item.members?.map(name => name.replace("中村", "").replace("木場", "")).join(" / ") || "健太郎 / 和雄 / 晏門";

  const renderLatest = items => {
    const sorted = items.slice().sort((a, b) => b.date.localeCompare(a.date));
    const latest = sorted[0];
    const previous = sorted[1];
    if (!latest) return;
    const title = featuredTitles[latest.date] || latest.title;
    document.querySelector("#latest-date").dateTime = latest.date;
    document.querySelector("#latest-date").textContent = dateLabel(latest.date);
    document.querySelector("#latest-title").textContent = title;
    document.querySelector("#latest-summary").textContent = latest.shortSummary || latest.summary;
    document.querySelector("#latest-members").textContent = membersLabel(latest);
    document.querySelector("#latest-themes").textContent = latest.themes?.join(" / ") || "AI Research";
    const open = document.querySelector("#latest-open");
    open.href = latest.href;
    const previousLink = document.querySelector("#latest-previous");
    previousLink.href = previous?.href || "#recent";
    previousLink.querySelector("span").textContent = previous ? dateLabel(previous.date) : "—";
    document.querySelector("#system-latest").textContent = dateLabel(latest.date);
    document.querySelector("#now-meeting-count").textContent = `${items.length} SESSIONS`;
  };

  const renderNow = () => {
    const container = document.querySelector("#now-ledger");
    if (!container) return;
    const current = [
      ["01", "KENTARO", "Safe AI Execution", "Approval Validation → Controlled Execution"],
      ["02", "KAZUO", "Workflow & Career", "Missiona → HR → Workflow Improvement"],
      ["03", "AMON", "AI Quality", "Prompt → Evaluation Data → Quality Database"]
    ];
    container.innerHTML = current.map(([number, name, title, copy]) => `<article class="now-entry"><span>${number} / ${name}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join("");
  };

  const renderRecent = items => {
    const container = document.querySelector("#recent-list");
    if (!container) return;
    container.innerHTML = items.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(item => `<a class="recent-row" href="${item.href}"><time datetime="${item.date}">${dateLabel(item.date)}</time><strong>${escape(item.title)}</strong><span class="recent-context">${escape(membersLabel(item))} · ${escape(item.themes?.join(" / ") || "Research")}</span><span class="arrow" aria-hidden="true">→</span></a>`).join("");
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
    document.querySelectorAll(".evolution-steps li, .timeline-os .time-card").forEach(node => observer.observe(node));
  };

  const init = items => {
    archiveItems = items || [];
    renderLatest(archiveItems);
    renderNow();
    renderRecent(archiveItems);
    setupCommand();
    setupHeader();
    setupReactiveRows();
  };

  document.addEventListener("archive:rendered", event => init(event.detail?.items || []), { once: true });
})();
