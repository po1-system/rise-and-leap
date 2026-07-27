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

  const renderTimeline = (items, timeline) => {
    timeline.replaceChildren();
    const changes = items.filter(item => item.change).sort((a, b) => a.date.localeCompare(b.date));
    changes.forEach(item => {
      const article = document.createElement("article");
      article.className = "change-entry reveal";
      const time = document.createElement("time");
      time.dateTime = item.date;
      time.textContent = item.date.replaceAll("-", ".");
      const title = document.createElement("h3");
      title.textContent = item.title;
      const text = document.createElement("p");
      text.textContent = item.change;
      article.append(time, title, text);
      timeline.append(article);
    });
    if (!changes.length) timeline.innerHTML = "<p class=\"archive-status\">変化の記録はまだありません。</p>";
    revealDynamic(timeline);
  };

  const setupArchive = async () => {
    const list = document.querySelector(".archive-list");
    const timeline = document.querySelector("#change-timeline");
    const status = document.querySelector("#archive-status");
    if (!list || !timeline || !status) return;
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

      const render = () => {
        const query = normalize(keyword.value).toLocaleLowerCase("ja");
        const filtered = items.filter(item =>
          (!query || item.searchText.includes(query)) &&
          (!month.value || item.month === month.value) &&
          (!member.value || item.members.includes(member.value)) &&
          (!theme.value || item.themes.includes(theme.value))
        );
        list.replaceChildren(...filtered.map(createCard));
        if (!filtered.length) {
          const empty = document.createElement("p");
          empty.className = "no-results";
          empty.textContent = "条件に一致する議事録はありません。";
          list.append(empty);
        }
        status.textContent = `${filtered.length}件 / 全${items.length}件`;
      };
      [keyword, month, member, theme].forEach(control => control.addEventListener(control === keyword ? "input" : "change", render));
      clear.addEventListener("click", () => {
        keyword.value = "";
        month.value = "";
        member.value = "";
        theme.value = "";
        render();
        keyword.focus();
      });
      render();
      renderTimeline(items, timeline);
    } catch (error) {
      console.error(error);
      status.textContent = "検索機能を読み込めませんでした。通常の一覧から閲覧できます。";
      timeline.innerHTML = "<p class=\"archive-status\">変化のタイムラインを読み込めませんでした。</p>";
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    setupReveal();
    setupMotion();
    setupArchive();
  });
})();
