(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopQuery = window.matchMedia("(min-width: 781px)");
  let changeLineTrigger;

  const canAnimate = () => !reducedMotion && window.gsap && window.ScrollTrigger;

  const animateCards = () => {
    if (!canAnimate()) return;
    const cards = window.gsap.utils.toArray(".weekly-card, .latest-grid, .member, .meeting, .archive-tools, .theme-map, .month-review, .archive-card");
    cards.filter(card => !card.dataset.scrollMotionReady).forEach((card, index) => {
      card.dataset.scrollMotionReady = "true";
      window.gsap.fromTo(card,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          delay: Math.min((index % 3) * 0.06, 0.12),
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true }
        }
      );
    });
  };

  const setupChangeLine = () => {
    if (!canAnimate()) return;
    const line = document.querySelector("#change-timeline");
    if (!line || !line.querySelector(".change-entry")) return;
    changeLineTrigger?.kill();
    window.gsap.set(line, { "--timeline-progress": 0.03 });
    changeLineTrigger = window.gsap.to(line, {
      scrollTrigger: {
        trigger: line,
        start: "top 76%",
        end: "bottom 58%",
        scrub: 0.45
      },
      "--timeline-progress": 1,
      duration: 1,
      ease: "none"
    }).scrollTrigger;
    window.gsap.fromTo(line.querySelectorAll(".change-entry"),
      { autoAlpha: 0, x: -18 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: line, start: "top 74%", once: true }
      }
    );
  };

  const setupHero = () => {
    const hero = document.querySelector(".hero-visual");
    const image = hero?.querySelector(".hero-parallax-image");
    const copy = hero?.querySelector(".hero-scroll-copy");
    const meta = hero?.querySelector(".hero-meta");
    if (!hero || !image || !copy) return;

    window.gsap.to(image, {
      yPercent: 13,
      scale: 1.1,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.75 }
    });
    window.gsap.to(copy, {
      scale: 0.72,
      y: -96,
      autoAlpha: 0.08,
      transformOrigin: "left bottom",
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.7 }
    });
    if (meta) {
      window.gsap.to(meta, {
        y: -30,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "20% top", end: "72% top", scrub: 0.5 }
      });
    }
  };

  const setupJourneyStage = () => {
    const section = document.querySelector(".scroll-journey");
    const stage = section?.querySelector(".scroll-journey-sticky");
    const months = section ? [...section.querySelectorAll(".journey-month")] : [];
    const fill = section?.querySelector(".journey-progress-fill");
    const label = section?.querySelector(".journey-progress-label");
    if (!section || !stage || months.length < 2 || !fill || !label) return;

    const labels = months.map(month => month.querySelector("time")?.textContent.replace("2026.", "") || "");
    window.gsap.set(months.slice(1), { autoAlpha: 0, y: 34 });
    const transitions = months.length - 1;
    const sequence = window.gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top+=94",
        end: () => `+=${transitions * 620}`,
        pin: stage,
        pinSpacing: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const active = Math.min(transitions, Math.round(self.progress * transitions));
          label.textContent = labels[active] || "";
        }
      }
    });
    sequence.to(fill, { scaleX: 1, duration: transitions, ease: "none" }, 0);
    months.slice(1).forEach((month, index) => {
      const position = index + 1;
      sequence.to(months[index], { autoAlpha: 0, y: -30, duration: 0.38, ease: "power1.in" }, position - 0.08);
      sequence.to(month, { autoAlpha: 1, y: 0, duration: 0.58, ease: "power2.out" }, position);
    });
  };

  const setupDesktopScroll = () => {
    if (!canAnimate() || !desktopQuery.matches) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    document.documentElement.classList.add("gsap-scroll-ready");
    setupHero();
    setupJourneyStage();
    animateCards();
    setupChangeLine();
    window.ScrollTrigger.refresh();
  };

  const setupMobileScroll = () => {
    if (reducedMotion || !window.gsap) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        window.gsap.to(entry.target, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: true });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    window.gsap.utils.toArray(".journey-month, .weekly-card, .member").forEach(element => {
      if (element.dataset.mobileMotionReady) return;
      element.dataset.mobileMotionReady = "true";
      window.gsap.set(element, { autoAlpha: 0, y: 18 });
      observer.observe(element);
    });
  };

  document.addEventListener("archive:rendered", () => {
    if (desktopQuery.matches) {
      animateCards();
      setupChangeLine();
      window.ScrollTrigger?.refresh();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (!canAnimate()) return;
    if (desktopQuery.matches) setupDesktopScroll();
    else setupMobileScroll();
  });
})();
