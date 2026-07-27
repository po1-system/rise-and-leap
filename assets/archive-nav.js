(() => {
  "use strict";

  const rules = [
    ["AI・自動化", /AI|OpenClaw|PO1|Gemini|ChatGPT|自動化|エージェント|ボット|Codex/i],
    ["案件獲得・営業", /案件|応募|面談|営業|収入|単価|求人|顧客|受注/i],
    ["開発・システム", /開発|システム|API|GAS|AppSheet|GitHub|実装|ダッシュボード|UI/i],
    ["情報設計・運用", /情報|記録|履歴|通知|Notion|Slack|Drive|LINE|報告|ログ|承認/i],
    ["目標・働き方", /目標|働き方|時間|成長|計画|キャリア|生活|半年|実践/i]
  ];
  const normalize = value => (value || "").replace(/\s+/g, " ").trim();

  const setupReadingTools = () => {
    const main = document.querySelector("main");
    if (!main) return;
    const sections = [...main.querySelectorAll(":scope > .feature, :scope > .section")]
      .filter(section => !section.classList.contains("closing") && !section.classList.contains("archive-navigation"))
      .map((section, index) => {
        const heading = section.querySelector("h2");
        if (!heading) return null;
        if (!section.id) section.id = `archive-section-${index + 1}`;
        return { section, heading, id: section.id, label: normalize(heading.textContent) };
      })
      .filter(Boolean);
    if (!sections.length) return;

    const progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-label", "議事録の読書進捗");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");
    progress.setAttribute("aria-valuenow", "0");
    progress.innerHTML = '<span class="reading-progress-bar"></span>';
    document.body.prepend(progress);

    const toc = document.createElement("nav");
    toc.className = "archive-toc";
    toc.setAttribute("aria-label", "この議事録の目次");
    const inner = document.createElement("div");
    inner.className = "archive-toc-inner";
    const label = document.createElement("span");
    label.className = "archive-toc-label";
    label.textContent = "On this page";
    const links = document.createElement("div");
    links.className = "archive-toc-links";
    sections.forEach(({ id, label: text }) => {
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = text;
      links.append(link);
    });
    inner.append(label, links);
    toc.append(inner);
    main.before(toc);

    let ticking = false;
    const update = () => {
      const start = main.offsetTop;
      const distance = Math.max(1, main.offsetHeight - window.innerHeight);
      const value = Math.max(0, Math.min(100, ((window.scrollY - start) / distance) * 100));
      progress.style.setProperty("--reading-progress", `${value}%`);
      progress.setAttribute("aria-valuenow", String(Math.round(value)));
      const marker = window.scrollY + Math.min(window.innerHeight * 0.3, 220);
      let activeId = sections[0].id;
      sections.forEach(({ section, id }) => {
        if (section.offsetTop <= marker) activeId = id;
      });
      links.querySelectorAll("a").forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`));
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  };

  const scoreRelated = (currentText, candidateTitle, distance) => {
    const themes = rules.filter(([, pattern]) => pattern.test(currentText)).map(([name]) => name);
    const candidateThemes = rules.filter(([, pattern]) => pattern.test(candidateTitle)).map(([name]) => name);
    const overlap = candidateThemes.filter(name => themes.includes(name)).length;
    return overlap * 10 - distance;
  };

  const makeSibling = (item, direction) => {
    const link = document.createElement("a");
    link.className = `archive-sibling ${direction}`;
    link.href = item.href;
    const label = document.createElement("span");
    label.textContent = direction === "previous" ? "← Previous Meeting" : "Next Meeting →";
    const title = document.createElement("strong");
    title.textContent = item.title;
    link.append(label, title);
    return link;
  };

  const setupNavigation = async () => {
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    if (!main || !footer) return;
    try {
      const response = await fetch("index.html");
      if (!response.ok) return;
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      const items = [...doc.querySelectorAll(".archive-item")].map(link => ({
        href: link.getAttribute("href"),
        date: link.querySelector("time")?.dateTime,
        title: normalize(link.querySelector("strong")?.textContent)
      })).sort((a, b) => a.date.localeCompare(b.date));
      const currentFile = window.location.pathname.split("/").pop();
      const currentIndex = items.findIndex(item => item.href === currentFile);
      if (currentIndex < 0) return;

      const navigation = document.createElement("section");
      navigation.className = "archive-navigation";
      navigation.setAttribute("aria-label", "前後と関連する議事録");
      navigation.innerHTML = '<div class="archive-navigation-head"><div><div class="section-kicker">Continue Reading</div><h2>記録をつないで読む。</h2></div></div>';
      const siblings = document.createElement("div");
      siblings.className = "archive-siblings";
      if (items[currentIndex - 1]) siblings.append(makeSibling(items[currentIndex - 1], "previous"));
      if (items[currentIndex + 1]) siblings.append(makeSibling(items[currentIndex + 1], "next"));
      navigation.append(siblings);

      const currentText = normalize(document.querySelector("main")?.textContent);
      const related = items
        .map((item, index) => ({ ...item, score: scoreRelated(currentText, item.title, Math.abs(index - currentIndex)) }))
        .filter((item, index) => index !== currentIndex && index !== currentIndex - 1 && index !== currentIndex + 1)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      if (related.length) {
        const relatedBlock = document.createElement("div");
        relatedBlock.className = "archive-related";
        relatedBlock.innerHTML = "<h3>同じテーマの記録</h3>";
        const links = document.createElement("div");
        links.className = "archive-related-links";
        related.forEach(item => {
          const link = document.createElement("a");
          link.href = item.href;
          link.innerHTML = `<time datetime="${item.date}">${item.date.replaceAll("-", ".")}</time><strong>${item.title}</strong>`;
          links.append(link);
        });
        relatedBlock.append(links);
        navigation.append(relatedBlock);
      }
      main.append(navigation);
    } catch (error) {
      console.warn("Archive navigation could not be loaded.", error);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    setupReadingTools();
    setupNavigation();
  });
})();
