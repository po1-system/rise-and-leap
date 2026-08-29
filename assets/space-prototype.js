(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const research = window.RiseLeapResearch || {};
  const root = document.querySelector(".research-space");
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));

  const renderSpace = () => {
    const topics = document.querySelector("#space-topics");
    const people = document.querySelector("#space-people");
    const quote = document.querySelector("#prototype-quote");
    if (!topics || !people || !quote) return;
    topics.innerHTML = (research.spaceTopics || []).map(topic => `<a class="space-topic depth-${topic.depth}" href="${topic.href}" data-owner="${topic.owner}" style="--x:${topic.x}%;--y:${topic.y}%"><span>${escape(topic.label)}</span><i aria-hidden="true"></i></a>`).join("");
    people.innerHTML = (research.people || []).map((person, index) => `<button class="space-person-node node-${index + 1}" type="button" data-space-person="${person.id}" aria-controls="people"><span>${String(index + 1).padStart(2, "0")}</span><strong>${person.display}</strong><small>${person.role}</small></button>`).join("");
    const highlightedQuote = research.quotes?.find(entry => entry.date === "2026.04.30") || research.quotes?.[0];
    if (highlightedQuote) quote.innerHTML = `<a href="${highlightedQuote.href}"><span>${highlightedQuote.date} · ${escape(highlightedQuote.speaker)}</span><blockquote>“${escape(highlightedQuote.quote)}”</blockquote><b>TRACE THIS MOMENT <i aria-hidden="true">→</i></b></a>`;
  };

  const setupFocus = () => {
    if (!root) return;
    const setFocus = id => root.dataset.focus = id || "";
    const nodeList = document.querySelector("#space-people");
    nodeList?.addEventListener("pointerover", event => { const button = event.target.closest("[data-space-person]"); if (button) setFocus(button.dataset.spacePerson); });
    nodeList?.addEventListener("pointerout", event => { if (event.target.closest("[data-space-person]")) setFocus(""); });
    nodeList?.addEventListener("focusin", event => { const button = event.target.closest("[data-space-person]"); if (button) setFocus(button.dataset.spacePerson); });
    nodeList?.addEventListener("focusout", () => setFocus(""));
    nodeList?.addEventListener("click", event => {
      const button = event.target.closest("[data-space-person]");
      if (!button) return;
      const person = research.people?.find(entry => entry.id === button.dataset.spacePerson);
      document.querySelector(`#people-list [data-person="${person?.name}"]`)?.click();
      document.querySelector("#people")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  };

  const setupMode = () => document.querySelectorAll("[data-view-mode]").forEach(button => button.addEventListener("click", () => {
    const mode = button.dataset.viewMode;
    document.documentElement.dataset.viewMode = mode;
    document.querySelectorAll("[data-view-mode]").forEach(control => control.classList.toggle("is-active", control === button));
    document.querySelector(mode === "read" ? "#archive" : "#now")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }));

  const setupMotion = () => {
    if (!root || reduced || window.innerWidth < 781) return;
    let queued = false;
    root.addEventListener("pointermove", event => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        const bounds = root.getBoundingClientRect();
        root.style.setProperty("--pointer-x", `${Math.round(((event.clientX - bounds.left) / bounds.width - .5) * 28)}px`);
        root.style.setProperty("--pointer-y", `${Math.round(((event.clientY - bounds.top) / bounds.height - .5) * 22)}px`);
        queued = false;
      });
    }, { passive: true });
    root.addEventListener("pointerleave", () => { root.style.setProperty("--pointer-x", "0px"); root.style.setProperty("--pointer-y", "0px"); });
    if (!window.gsap || !window.ScrollTrigger) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: .55 } })
      .to(".space-photo", { scale: 1.12, yPercent: 10, filter: "blur(3px)", ease: "none" }, 0)
      .to(".space-intro", { yPercent: -16, autoAlpha: .18, ease: "none" }, 0)
      .to(".space-people", { scale: .88, yPercent: -12, autoAlpha: .42, ease: "none" }, 0)
      .to(".space-topics", { yPercent: 10, autoAlpha: .34, ease: "none" }, 0);
  };

  const init = () => { renderSpace(); setupFocus(); setupMode(); setupMotion(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
