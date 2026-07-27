(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themeRules = [
    ["AI・自動化", /AI|OpenClaw|PO1|Gemini|ChatGPT|自動化|エージェント|ボット|Codex/i],
    ["案件獲得・営業", /案件|応募|面談|営業|収入|単価|求人|顧客|受注/i],
    ["開発・システム", /開発|システム|API|GAS|AppSheet|GitHub|実装|ダッシュボード|UI/i],
    ["情報設計・運用", /情報|記録|履歴|通知|Notion|Slack|Drive|LINE|報告|ログ|承認/i],
    ["目標・働き方", /目標|働き方|時間|成長|計画|キャリア|生活|半年|実践/i]
  ];
  const memberNames = ["木場晏門", "中村健太郎", "中村和雄"];
  const unique = values => [...new Set(values.filter(Boolean))];
  const normalize = value => (value || "").replace(/\s+/g, " ").trim();

  const setupReveal = () => {
    const targets = [...document.querySelectorAll(".section-head, .latest-grid, .member, .meeting, .journey-row, .hero-note")];
    targets.forEach((target, index) => {
      target.classList.add("reveal");
      if (target.classList.contains("journey-row")) target.style.setProperty("--reveal-index", index % 8);
    });
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(target => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    targets.forEach(target => observer.observe(target));
  };

  const setupMotion = () => {
    if (reducedMotion) return;
    const header = document.querySelector(".site-header");
    const heroImage = document.querySelector(".hero-visual img");
    let previousY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("header-hidden", y > previousY && y > 180);
      if (heroImage && y < 900) heroImage.style.transform = `translate3d(0,${Math.min(y * 0.045, 28)}px,0) scale(1.025)`;
      previousY = y;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  };

  const findChangeText = doc => {
    const heading = [...doc.querySelectorAll(".section-head h2")].find(node => normalize(node.textContent).includes("前回からの変化"));
    return normalize(heading?.closest(".section")?.querySelector(".content-card p")?.textContent);
  };

  const fetchArchive = async href => {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(href);
        if (response.ok) return response;
        lastError = new Error(`${href}: ${response.status}`);
      } catch (error) {
        lastError = error;
      }
      await new Promise(resolve => window.setTimeout(resolve, 350 * (attempt + 1)));
    }
    throw lastError;
  };

  const parseArchive = async link => {
    const response = await fetchArchive(link.href);
    const doc = new DOMParser().parseFromString(await response.text(), "text/html");
    const date = link.querySelector("time")?.dateTime || link.querySelector("time")?.textContent.replaceAll(".", "-");
    const title = normalize(link.querySelector("strong")?.textContent);
    const heroFooter = [...doc.querySelectorAll(".hero-footer > div")];
    const attendeeText = normalize(heroFooter.find(node => /Members|Attendees/i.test(node.querySelector("span")?.textContent || ""))?.textContent);
    const members = memberNames.filter(name => attendeeText.includes(name));
    const summary = normalize(doc.querySelector("#summary .content-card p")?.textContent);
    const shortSummary = normalize(doc.querySelector("#summary .aside-card p")?.textContent);
    const topics = [...doc.querySelectorAll(".topic")].map(topic => normalize(topic.textContent));
    const searchText = normalize([title, summary, shortSummary, ...topics].join(" "));
    return {
      href: link.getAttribute("href"),
      date,
      month: date?.slice(0, 7),
      title,
      members,
      themes: themeRules.filter(([, pattern]) => pattern.test(searchText)).map(([name]) => name),
      summary,
      shortSummary,
      change: findChangeText(doc),
      searchText: searchText.toLocaleLowerCase("ja")
    };
  };

  const minimalArchive = link => {
    const date = link.querySelector("time")?.dateTime || link.querySelector("time")?.textContent.replaceAll(".", "-");
    const title = normalize(link.querySelector("strong")?.textContent);
    return {
      href: link.getAttribute("href"),
      date,
      month: date?.slice(0, 7),
      title,
      members: [],
      themes: [],
      summary: "",
      shortSummary: "詳細は議事録ページでご確認ください。",
      change: "",
      searchText: title.toLocaleLowerCase("ja")
    };
  };

  const loadArchives = async links => {
    const items = [];
    for (let index = 0; index < links.length; index += 5) {
      const batchLinks = links.slice(index, index + 5);
      const results = await Promise.allSettled(batchLinks.map(parseArchive));
      results.forEach((result, resultIndex) => {
        if (result.status === "fulfilled") {
          items.push(result.value);
        } else {
          console.warn(result.reason);
          items.push(minimalArchive(batchLinks[resultIndex]));
        }
      });
    }
    return items;
  };

  const makeChip = text => {
    const span = document.createElement("span");
    span.className = "chip";
    span.textContent = text;
    return span;
  };

  const createCard = item => {
    const article = document.createElement("article");
    article.className = "archive-card";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "archive-card-head";
    button.setAttribute("aria-expanded", "false");
    const panelId = `archive-panel-${item.date}`;
    button.setAttribute("aria-controls", panelId);
    const time = document.createElement("time");
    time.dateTime = item.date;
    time.textContent = item.date.replaceAll("-", ".");
    const title = document.createElement("strong");
    title.textContent = item.title;
    const toggle = document.createElement("span");
    toggle.className = "archive-toggle";
    toggle.setAttribute("aria-hidden", "true");
    toggle.textContent = "+";
    button.append(time, title, toggle);

    const body = document.createElement("div");
    body.className = "archive-card-body";
    body.id = panelId;
    const inner = document.createElement("div");
    const content = document.createElement("div");
    content.className = "archive-card-content";
    const chips = document.createElement("div");
    chips.className = "archive-chips";
    [...item.members, ...item.themes].forEach(value => chips.append(makeChip(value)));
    const summary = document.createElement("p");
    summary.textContent = item.shortSummary || item.summary;
    const read = document.createElement("a");
    read.className = "archive-read";
    read.href = item.href;
    read.innerHTML = "<span>議事録の全文を読む</span><span aria-hidden=\"true\">→</span>";
    content.append(chips, summary, read);
    inner.append(content);
    body.append(inner);
    article.append(button, body);
    button.addEventListener("click", () => {
      const open = article.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });
    return article;
  };

  const populateSelect = (select, values, formatter = value => value) => {
    values.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = formatter(value);
      select.append(option);
    });
  };

  const revealDynamic = container => {
    const targets = [...container.querySelectorAll(".reveal")];
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(node => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    targets.forEach(node => observer.observe(node));
  };

  const shortText = (text, length = 86) => {
    const normalized = normalize(text);
    if (normalized.length <= length) return normalized;
    const sentence = normalized.match(/^.{1,86}?[。！？]/)?.[0];
    return sentence || `${normalized.slice(0, length)}…`;
  };

  const renderPulse = items => {
    const meetings = document.querySelector("#pulse-meetings");
    const period = document.querySelector("#pulse-period");
    const theme = document.querySelector("#pulse-theme");
    const next = document.querySelector("#pulse-next");
    if (!meetings || !period || !theme || !next || !items.length) return;
    meetings.textContent = `${items.length}回`;
    const dates = items.map(item => new Date(`${item.date}T00:00:00`)).sort((a, b) => a - b);
    const months = Math.max(1, Math.round((dates.at(-1) - dates[0]) / 2629800000) + 1);
    period.textContent = `約${months}か月`;
    const latestThemes = items.slice(0, 3).flatMap(item => item.themes);
    const themeCounts = latestThemes.reduce((map, name) => map.set(name, (map.get(name) || 0) + 1), new Map());
    theme.textContent = [...themeCounts].sort((a, b) => b[1] - a[1])[0]?.[0] || "AI・実践";
    const today = new Date();
    let daysUntilFriday = (5 - today.getDay() + 7) % 7;
    if (daysUntilFriday === 0 && today.getHours() >= 5) daysUntilFriday = 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    next.textContent = `${nextFriday.getMonth() + 1}/${nextFriday.getDate()} 金`;
  };

  const renderThemeMap = (items, container, onSelect) => {
    container.replaceChildren();
    const counts = themeRules.map(([name]) => [name, items.filter(item => item.themes.includes(name)).length]);
    const max = Math.max(...counts.map(([, count]) => count), 1);
    counts.forEach(([name, count]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-node";
      button.style.setProperty("--node-size", `${96 + Math.round((count / max) * 40)}px`);
      button.innerHTML = `<span>${name}<small>${count} records</small></span>`;
      button.addEventListener("click", () => onSelect(name));
      container.append(button);
    });
  };

  const renderTimeline = (items, timeline) => {
    timeline.replaceChildren();
    const changes = items.filter(item => item.change).sort((a, b) => a.date.localeCompare(b.date));
    changes.forEach(item => {
      const details = document.createElement("details");
      details.className = "change-entry reveal";
      const summary = document.createElement("summary");
      const time = document.createElement("time");
      time.dateTime = item.date;
      time.textContent = item.date.replaceAll("-", ".");
      const titleWrap = document.createElement("div");
      titleWrap.className = "change-title";
      const title = document.createElement("h3");
      title.textContent = item.title;
      const lead = document.createElement("p");
      lead.textContent = shortText(item.change);
      titleWrap.append(title, lead);
      const more = document.createElement("span");
      more.className = "change-more";
      more.setAttribute("aria-hidden", "true");
      more.textContent = "+";
      summary.append(time, titleWrap, more);
      const full = document.createElement("p");
      full.className = "change-full";
      full.textContent = item.change;
      details.append(summary, full);
      timeline.append(details);
    });
    if (!changes.length) timeline.innerHTML = "<p class=\"archive-status\">変化の記録はまだありません。</p>";
    revealDynamic(timeline);
  };

  const renderMonthly = (items, container) => {
    container.replaceChildren();
    const groups = items.reduce((map, item) => {
      if (!map.has(item.month)) map.set(item.month, []);
      map.get(item.month).push(item);
      return map;
    }, new Map());
    [...groups].sort((a, b) => b[0].localeCompare(a[0])).forEach(([month, monthItems], index) => {
      const details = document.createElement("details");
      details.className = "month-review";
      if (index === 0) details.open = true;
      const counts = themeRules.map(([name]) => [name, monthItems.filter(item => item.themes.includes(name)).length]).sort((a, b) => b[1] - a[1]);
      const dominant = counts[0]?.[0] || "研究と実践";
      const finalChange = [...monthItems].sort((a, b) => b.date.localeCompare(a.date)).find(item => item.change)?.change;
      const summary = document.createElement("summary");
      summary.innerHTML = `<time>${month.replace("-", ".")}</time><h3>${dominant}</h3><span class="month-review-count">${monthItems.length} records</span>`;
      const body = document.createElement("div");
      body.className = "month-review-body";
      const text = document.createElement("p");
      text.textContent = finalChange ? shortText(finalChange, 130) : `${monthItems.length}回の対話を記録しました。`;
      const links = document.createElement("div");
      links.className = "month-review-links";
      monthItems.forEach(item => {
        const link = document.createElement("a");
        link.href = item.href;
        link.innerHTML = `<span>${item.title}</span><span aria-hidden="true">→</span>`;
        links.append(link);
      });
      body.append(text, links);
      details.append(summary, body);
      container.append(details);
    });
  };

  const setupArchive = async () => {
    const list = document.querySelector(".archive-list");
    const timeline = document.querySelector("#change-timeline");
    const monthly = document.querySelector("#monthly-grid");
    const themeMap = document.querySelector("#theme-map");
    const status = document.querySelector("#archive-status");
    const loadMore = document.querySelector("#load-more");
    if (!list || !timeline || !monthly || !themeMap || !status || !loadMore) return;
    const sourceLinks = [...list.querySelectorAll("a.archive-item")];
    try {
      const items = await loadArchives(sourceLinks);
      const keyword = document.querySelector("#archive-keyword");
      const month = document.querySelector("#archive-month");
      const member = document.querySelector("#archive-member");
      const theme = document.querySelector("#archive-theme");
      const clear = document.querySelector("#clear-filters");
      populateSelect(month, unique(items.map(item => item.month)).sort().reverse(), value => `${value.slice(0, 4)}年${Number(value.slice(5))}月`);
      populateSelect(member, memberNames.filter(name => items.some(item => item.members.includes(name))));
      populateSelect(theme, themeRules.map(([name]) => name));

      const storageKey = "rise-leap-archive-filters";
      const params = new URLSearchParams(window.location.search);
      let stored = {};
      try {
        stored = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
      } catch {
        stored = {};
      }
      keyword.value = params.get("q") ?? stored.q ?? "";
      month.value = params.get("month") ?? stored.month ?? "";
      member.value = params.get("member") ?? stored.member ?? "";
      theme.value = params.get("theme") ?? stored.theme ?? "";
      let visibleLimit = 6;

      const saveFilters = () => {
        const state = { q: keyword.value, month: month.value, member: member.value, theme: theme.value };
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(state));
        } catch {
          // Storage may be disabled; URL state still works.
        }
        const url = new URL(window.location.href);
        Object.entries(state).forEach(([key, value]) => value ? url.searchParams.set(key, value) : url.searchParams.delete(key));
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      };

      const render = ({ persist = true } = {}) => {
        const query = normalize(keyword.value).toLocaleLowerCase("ja");
        const filteredMode = Boolean(query || month.value || member.value || theme.value);
        const filtered = items.filter(item =>
          (!query || item.searchText.includes(query)) &&
          (!month.value || item.month === month.value) &&
          (!member.value || item.members.includes(member.value)) &&
          (!theme.value || item.themes.includes(theme.value))
        );
        const displayed = filteredMode ? filtered : filtered.slice(0, visibleLimit);
        list.replaceChildren(...displayed.map(createCard));
        if (!filtered.length) {
          const empty = document.createElement("p");
          empty.className = "no-results";
          empty.textContent = "条件に一致する議事録はありません。";
          list.append(empty);
        }
        status.textContent = filteredMode ? `${filtered.length}件 / 全${items.length}件` : `${displayed.length}件表示 / 全${items.length}件`;
        loadMore.classList.toggle("is-visible", !filteredMode && displayed.length < items.length);
        if (!filteredMode && displayed.length < items.length) {
          loadMore.textContent = `さらに${Math.min(6, items.length - displayed.length)}件表示`;
        }
        if (persist) saveFilters();
      };
      [keyword, month, member, theme].forEach(control => control.addEventListener(control === keyword ? "input" : "change", () => {
        visibleLimit = 6;
        render();
      }));
      clear.addEventListener("click", () => {
        keyword.value = "";
        month.value = "";
        member.value = "";
        theme.value = "";
        visibleLimit = 6;
        render();
        keyword.focus();
      });
      loadMore.addEventListener("click", () => {
        visibleLimit += 6;
        render({ persist: false });
      });
      renderThemeMap(items, themeMap, selectedTheme => {
        theme.value = selectedTheme;
        visibleLimit = 6;
        render();
        document.querySelector("#archive-keyword")?.focus({ preventScroll: true });
        document.querySelector("#archive")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      });
      render({ persist: false });
      renderPulse(items);
      renderTimeline(items, timeline);
      renderMonthly(items, monthly);
    } catch (error) {
      console.error(error);
      status.textContent = "検索機能を読み込めませんでした。通常の一覧から閲覧できます。";
      timeline.innerHTML = "<p class=\"archive-status\">変化のタイムラインを読み込めませんでした。</p>";
      monthly.innerHTML = "<p class=\"archive-status\">月次レビューを読み込めませんでした。</p>";
      themeMap.innerHTML = "<p class=\"archive-status\">テーマを読み込めませんでした。</p>";
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    setupReveal();
    setupMotion();
    setupArchive();
  });
})();
