(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = window.matchMedia("(min-width: 781px)");
  const canAnimate = () => !reducedMotion && Boolean(window.gsap && window.ScrollTrigger);

  const setupPointerLight = () => {
    const section = document.querySelector(".documentary-intro");
    if (!section || reducedMotion || !desktop.matches) return;
    section.addEventListener("pointermove", event => {
      const box = section.getBoundingClientRect();
      section.style.setProperty("--pointer-x", `${((event.clientX - box.left) / box.width) * 100}%`);
      section.style.setProperty("--pointer-y", `${((event.clientY - box.top) / box.height) * 100}%`);
    }, { passive: true });
  };

  const setupActHistory = () => {
    const section = document.querySelector(".act-history");
    const cards = section ? [...section.querySelectorAll(".act-card")] : [];
    const fill = section?.querySelector(".act-rail-fill");
    const label = section?.querySelector(".act-rail-label");
    if (!section || cards.length < 2 || !fill || !label) return;

    if (!canAnimate() || !desktop.matches) {
      cards.forEach(card => { card.style.removeProperty("opacity"); card.style.removeProperty("visibility"); });
      return;
    }

    const transitions = cards.length - 1;
    window.gsap.set(cards.slice(1), { autoAlpha: 0, y: 24 });
    const timeline = window.gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top+=88",
        end: () => `+=${transitions * 560}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          label.textContent = `ACT ${String(Math.min(cards.length, Math.round(self.progress * transitions) + 1)).padStart(2, "0")}`;
        }
      }
    });
    timeline.to(fill, { scaleX: 1, duration: transitions, ease: "none" }, 0);
    cards.slice(1).forEach((card, index) => {
      const position = index + 1;
      timeline.to(cards[index], { autoAlpha: 0, y: -30, duration: 0.35, ease: "power1.in" }, position - 0.06);
      timeline.to(card, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, position);
    });
  };

  const setupEvolution = () => {
    const lanes = [...document.querySelectorAll(".evolution-lane")];
    if (!lanes.length) return;
    lanes.forEach(lane => {
      const button = lane.querySelector("button");
      if (!button) return;
      button.addEventListener("click", () => {
        const willFocus = !lane.classList.contains("is-focused");
        lanes.forEach(other => {
          other.classList.remove("is-focused");
          other.querySelector("button")?.setAttribute("aria-pressed", "false");
        });
        if (willFocus) {
          lane.classList.add("is-focused");
          button.setAttribute("aria-pressed", "true");
        }
      });
    });

    if (!canAnimate()) return;
    lanes.forEach(lane => {
      window.gsap.to(lane, {
        "--lane-progress": 1,
        ease: "none",
        scrollTrigger: { trigger: lane, start: "top 78%", end: "bottom 55%", scrub: 0.55 }
      });
      window.gsap.fromTo(lane.querySelectorAll(".evolution-step"), { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: { trigger: lane, start: "top 78%", once: true }
      });
    });
  };

  const setupKnowledge = () => {
    const detail = document.querySelector("#knowledge-detail");
    const nodes = [...document.querySelectorAll(".knowledge-node")];
    if (!detail || !nodes.length) return;
    const title = detail.querySelector("strong");
    const copy = detail.querySelector("span");
    nodes.forEach(node => {
      node.addEventListener("click", () => {
        const active = node.classList.contains("is-active");
        nodes.forEach(item => item.classList.remove("is-active"));
        if (active) {
          detail.hidden = true;
          return;
        }
        node.classList.add("is-active");
        title.textContent = `${node.textContent.replace(/\s+/g, " ").trim()} — ${node.dataset.origin}`;
        copy.textContent = `${node.dataset.detail} 「関連議事録を探す」を選ぶと、アーカイブをこの概念で絞り込みます。`;
        const search = document.createElement("button");
        search.type = "button";
        search.className = "knowledge-search";
        search.textContent = "関連議事録を探す →";
        search.addEventListener("click", () => {
          const input = document.querySelector("#archive-keyword");
          if (!input) return;
          input.value = node.dataset.query || node.dataset.term || node.textContent.trim();
          input.dispatchEvent(new Event("input", { bubbles: true }));
          document.querySelector("#archive")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        }, { once: true });
        detail.querySelector(".knowledge-search")?.remove();
        detail.append(search);
        detail.hidden = false;
      });
    });
  };

  const setupScenes = () => {
    if (!canAnimate()) return;
    const quote = document.querySelector(".documentary-quote blockquote");
    if (quote) {
      window.gsap.fromTo(quote, { autoAlpha: 0, y: 34, filter: "blur(8px)" }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: quote, start: "top 78%", once: true }
      });
    }
    document.querySelectorAll(".current-card, .knowledge-universe").forEach(element => {
      window.gsap.fromTo(element, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 86%", once: true }
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (canAnimate()) window.gsap.registerPlugin(window.ScrollTrigger);
    setupPointerLight();
    setupActHistory();
    setupEvolution();
    setupKnowledge();
    setupScenes();
    window.ScrollTrigger?.refresh();
  });
})();
