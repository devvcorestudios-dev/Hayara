/* ==========================================================
   HYARA UNISEX SALON — interactions
   ========================================================== */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Image fallback: swap broken <img> with branded art ---------- */
  window.imgFallback = function (img) {
    img.onerror = null;
    if (img.dataset.swapped) return;
    img.dataset.swapped = "1";
    img.src =
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">' +
          '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#F8F2EA"/><stop offset="1" stop-color="#EFE3D2"/></linearGradient></defs>' +
          '<rect width="800" height="800" fill="url(#g)"/>' +
          '<circle cx="400" cy="400" r="180" fill="none" stroke="#C47779" stroke-width="1.5" opacity=".5"/>' +
          '<circle cx="400" cy="400" r="120" fill="none" stroke="#D9A7A7" stroke-width="1" opacity=".4"/>' +
          '<text x="400" y="435" font-size="120" text-anchor="middle" fill="#C47779" font-family="Georgia">H.</text>' +
          '<text x="400" y="560" font-size="22" text-anchor="middle" fill="#8A7563" letter-spacing="8" font-family="Georgia">HYARA</text>' +
          "</svg>"
      );
  };

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("done");
    document.body.classList.add("loaded");
  }
  if (preloader) {
    window.addEventListener("load", () => setTimeout(hidePreloader, 450));
    setTimeout(hidePreloader, 3500); // safety
  }

  /* ---------- Custom cursor ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .ig-tile, .service-card, .price-card, .why-card, input, select, textarea, summary")) {
        ring.classList.add("grow");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .ig-tile, .service-card, .price-card, .why-card, input, select, textarea, summary")) {
        ring.classList.remove("grow");
      }
    });
  }

  /* ---------- Header: scrolled + hide-on-scroll ---------- */
  const header = $("#siteHeader");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    if (progress) progress.style.width = (y / (document.documentElement.scrollHeight - innerHeight)) * 100 + "%";
    if (header) {
      header.classList.toggle("scrolled", y > 40);
      header.classList.toggle("hidden-nav", y > 320 && y > lastY && !header.classList.contains("menu-open"));
    }
    if (toTop) toTop.classList.toggle("show", y > 700);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if (toTop) toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile menu ---------- */
  const hamburger = $("#hamburger");
  const navLinks = $("#navLinks");
  function closeMenu() {
    if (hamburger) hamburger.classList.remove("open");
    if (navLinks) navLinks.classList.remove("open");
    if (header) header.classList.remove("menu-open");
    document.body.style.overflow = "";
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  }
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      header.classList.toggle("menu-open", open);
      hamburger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });
    window.addEventListener("resize", () => { if (innerWidth > 960) closeMenu(); });
  }
/* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const d = en.target.getAttribute("data-delay") || 0;
          en.target.style.setProperty("--d", d);
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = $$(".count");
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = +el.dataset.count || 0;
        const suffix = el.dataset.suffix || "";
        const dur = 1800;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        countIO.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countIO.observe(c));

  /* ---------- Services tabs ---------- */
  const tabBtns = $$(".tab-btn");
  const panels = $$(".tab-panel");
  function activateTab(name) {
    tabBtns.forEach((b) => {
      const on = b.dataset.tab === name;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", String(on));
    });
    panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
  }
  tabBtns.forEach((b) => b.addEventListener("click", () => activateTab(b.dataset.tab)));

  /* ---------- 3D tilt ---------- */
  if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$("[data-tilt]").forEach((card) => {
      let raf = null;
      card.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "perspective(800px) rotateX(" + -py * 6 + "deg) rotateY(" + px * 6 + "deg) translateY(-4px)";
          raf = null;
        });
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
/* ==========================================================
     INSTAGRAM GALLERY
     Tries to fetch @hyaraunisexsalon's live profile via
     public endpoints (through CORS relays), then falls back
     to a curated showcase if Instagram blocks anonymous access.
     ========================================================== */
  const IG_USER = "hyaraunisexsalon";
  const IG_BASE = "https://www.instagram.com/";
  const gridEl = $("#igGrid");

  const IG_FALLBACK = [
    { tag: "hair artistry",  img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop", cap: "That ✨ after-glow shine… #HyaraHair" },
    { tag: "salon interiors",img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop", cap: "Your luxury corner of Indore ✨ #HyaraIndore" },
    { tag: "gentlemen",      img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop", cap: "Sharp fades, sharper you. #HyaraGrooming" },
    { tag: "skin glow",      img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop", cap: "Glow therapy, loading… #HyaraSkin" },
    { tag: "make-up",        img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop", cap: "Soft glam, strong energy. #HyaraMakeup" },
    { tag: "barbering",      img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop", cap: "The royal shave ritual ♨️ #HyaraBarber" },
    { tag: "nails",          img: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=800&auto=format&fit=crop", cap: "Nail art therapy 💅 #HyaraNails" },
    { tag: "bridal",         img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop", cap: "Bridal dreams, done. 👰 #HyaraBridal" },
    { tag: "spa rituals",    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop", cap: "Me-time, taken seriously. #HyaraSpa" }
  ];

  function igTileHtml(item, i) {
    const url = item.url || (IG_BASE + IG_USER + "/");
    return (
      '<a class="ig-tile" href="' + url + '" target="_blank" rel="noopener" data-lb="' + i + '" aria-label="Open on Instagram">' +
        '<img src="' + item.img + '" alt="' + item.cap.replace(/[<>&"]/g, "") + '" loading="lazy" onerror="imgFallback(this)" />' +
        '<span class="ig-overlay">' +
          "<p>" + item.cap + "</p>" +
          '<span class="ig-meta">' +
            '<span class="ig-handle">@' + IG_USER + "</span>" +
            '<span class="ig-stats">' + (item.likes != null ? "♥ " + item.likes : "") + (item.comments != null ? "  💬 " + item.comments : "") + "</span>" +
          "</span>" +
        "</span>" +
      "</a>"
    );
  }

  function renderIG(items, live) {
    if (!gridEl) return;
    gridEl.innerHTML = items.map(igTileHtml).join("");
    if (live) { console.info("[Hyara] Live Instagram feed loaded from @" + IG_USER + "."); }
    wireLightbox(items);
  }

  /* Try the public profile-info endpoint through several CORS relays */
  async function fetchIGProfile() {
    const endpoint =
      "https://www.instagram.com/api/v1/users/web_profile_info/?username=" + IG_USER;
    const relays = [
      (u) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
      (u) => "https://corsproxy.io/?url=" + encodeURIComponent(u),
      (u) => "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u)
    ];
    for (const relay of relays) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(relay(endpoint), { signal: ctrl.signal });
        clearTimeout(timer);
        const json = await res.json();
        if (json && json.data && json.data.user) return json.data.user;
      } catch (err) { /* try next relay */ }
    }
    return null;
  }

  function extractItems(user) {
    const lists = [];
    const t = user.edge_owner_to_timeline_media && user.edge_owner_to_timeline_media.edges;
    const r = user.edge_felix_video_timeline && user.edge_felix_video_timeline.edges;
    if (Array.isArray(t)) lists.push(...t);
    if (Array.isArray(r)) lists.push(...r);
    const seen = new Set(); const out = [];
    for (const { node } of lists) {
      if (!node || !node.shortcode || seen.has(node.shortcode)) continue;
      seen.add(node.shortcode);
      let cap = "";
      const cc = node.edge_media_to_caption;
      if (cc && cc.edges && cc.edges[0]) cap = cc.edges[0].node.text || "";
      out.push({
        img: node.display_url || "",
        cap: cap.slice(0, 120) || "A little Hyara magic ✨",
        url: IG_BASE + "p/" + node.shortcode + "/",
        likes: node.edge_liked_by ? node.edge_liked_by.count : null,
        comments: node.edge_media_to_comment ? node.edge_media_to_comment.count : null
      });
      if (out.length >= 9) break;
    }
    return out;
  }

  async function loadInstagram() {
    if (!gridEl) return;
    const user = await fetchIGProfile();
    const items = user ? extractItems(user) : [];
    renderIG(items.length >= 3 ? items : IG_FALLBACK, items.length >= 3);
  }
  loadInstagram();
/* ---------- Lightbox ---------- */
  let lbItems = [], lbIndex = 0;
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCap = $("#lbCap");
  const lbClose = $("#lbClose");
  const lbPrev = $("#lbPrev");
  const lbNext = $("#lbNext");

  function wireLightbox(items) {
    lbItems = items;
    $$(".ig-tile", gridEl).forEach((tile) => {
      tile.addEventListener("click", (e) => {
        e.preventDefault();
        lbIndex = +tile.dataset.lb || 0;
        openLB();
      });
    });
  }
  function openLB() {
    if (!lbItems[lbIndex]) return;
    const it = lbItems[lbIndex];
    lbImg.src = it.img;
    let capHtml = it.cap;
    if (it.url) capHtml += ' &nbsp;·&nbsp; <a href="' + it.url + '" target="_blank" rel="noopener">open on Instagram ↗</a>';
    lbCap.innerHTML = capHtml;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLB() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function stepLB(n) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + n + lbItems.length) % lbItems.length;
    openLB();
  }
  if (lbClose) lbClose.addEventListener("click", closeLB);
  if (lbPrev) lbPrev.addEventListener("click", () => stepLB(-1));
  if (lbNext) lbNext.addEventListener("click", () => stepLB(1));
  if (lightbox) {
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLB(); });
    let lbTouchX;
    lightbox.addEventListener("touchstart", (e) => { lbTouchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 40) stepLB(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeLB(); closeMenu(); }
    if (lightbox.classList.contains("open")) {
      if (e.key === "ArrowLeft") stepLB(-1);
      if (e.key === "ArrowRight") stepLB(1);
    }
  });

  /* ---------- Testimonials carousel ---------- */
  const track = $("#carTrack");
  const carousel = $("#carousel");
  const dotsWrap = $("#carDots");
  let slideIdx = 0, autoTimer = null;
  const slides = track ? $$(".slide", track) : [];

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Go to review " + (i + 1));
      b.addEventListener("click", () => { goSlide(i); restartAuto(); });
      dotsWrap.appendChild(b);
    });
    syncDots();
  }
  function syncDots() {
    if (!dotsWrap) return;
    $$("button", dotsWrap).forEach((b, i) => b.classList.toggle("active", i === slideIdx));
  }
  function goSlide(i) {
    slideIdx = (i + slides.length) % slides.length;
    if (track) track.style.transform = "translateX(" + -slideIdx * 100 + "%)";
    syncDots();
  }
  function restartAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (slides.length > 1 && !reduced) autoTimer = setInterval(() => goSlide(slideIdx + 1), 6000);
  }
  if (track && slides.length) {
    $("#prevBtn").addEventListener("click", () => { goSlide(slideIdx - 1); restartAuto(); });
    $("#nextBtn").addEventListener("click", () => { goSlide(slideIdx + 1); restartAuto(); });
    let tx = null;
    track.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { goSlide(dx < 0 ? slideIdx + 1 : slideIdx - 1); restartAuto(); }
    }, { passive: true });
    if (carousel) {
      carousel.addEventListener("mouseenter", () => { if (autoTimer) clearInterval(autoTimer); });
      carousel.addEventListener("mouseleave", restartAuto);
    }
    document.addEventListener("visibilitychange", () => { if (document.hidden && autoTimer) clearInterval(autoTimer); else restartAuto(); });
    buildDots();
    restartAuto();
  }
/* ---------- Booking form ---------- */
  const form = $("#bookingForm");
  const successBox = $("#formSuccess");
  const submitBtn = form ? $(".btn-submit", form) : null;
  const WA_NUMBER = "919800000000"; // TODO: replace with the salon's real WhatsApp number

  function setErr(field, msg) {
    const wrap = field.closest(".field");
    const errEl = wrap ? $(".err", wrap) : null;
    if (wrap) wrap.classList.toggle("invalid", !!msg);
    if (errEl) errEl.textContent = msg || "";
  }

  if (form) {
    const fName = $("#bName"), fPhone = $("#bPhone");
    const fService = $("#bService"), fDate = $("#bDate"), fTime = $("#bTime");

    function validate() {
      let ok = true;
      const name = fName.value.trim();
      if (name.length < 2) { setErr(fName, "Please tell us your name."); ok = false; }
      else setErr(fName, "");
      const phone = fPhone.value.trim();
      if (!/^\+?[\d\s\-()]{10,15}$/.test(phone)) { setErr(fPhone, "Enter a valid phone / WhatsApp number."); ok = false; }
      else setErr(fPhone, "");
      if (!fService.value) { setErr(fService, "Pick the ritual you'd love."); ok = false; }
      else setErr(fService, "");
      if (!fTime.value) { setErr(fTime, "Choose a time slot."); ok = false; }
      else setErr(fTime, "");
      if (!fDate.value) setErr(fDate, "Choose your preferred date.");
      else {
        const picked = new Date(fDate.value + "T23:59:59");
        const today = new Date(); today.setHours(23, 59, 59, 0);
        if (picked < today) { setErr(fDate, "Date can't be in the past."); ok = false; }
        else setErr(fDate, "");
      }
      return ok;
    }

    // Clear error as the user fixes the field
    [fName, fPhone, fService, fDate, fTime].forEach((f) => {
      f.addEventListener(f.tagName === "SELECT" ? "change" : "input", () => {
        const wrap = f.closest(".field");
        if (wrap && wrap.classList.contains("invalid")) validate();
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;

      const msg =
        "Hi Hyara! ✨ I'd like to book an appointment.\n" +
        "Name: " + fName.value.trim() + "\n" +
        "Service: " + fService.value + "\n" +
        "Date: " + fDate.value + "\n" +
        "Time: " + fTime.value + (fPhone.value.trim() ? "\nPhone: " + fPhone.value.trim() : "");
      const waLink =
        "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
      if (submitBtn) submitBtn.disabled = true;
      if (successBox) {
        successBox.hidden = false;
        successBox.innerHTML =
          '<span class="success-icon">✦</span>' +
          "<span>Shine on! Your request is in — we'll confirm your slot within the hour. " +
          '<a href="' + waLink + '" target="_blank" rel="noopener">Confirm instantly on WhatsApp →</a></span>';
        successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      console.info("[Hyara] Booking requested:", msg);
    });
  }

  /* ---------- Misc ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();