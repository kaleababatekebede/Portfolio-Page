/* ==========================================================================
   Kaleab's portfolio — behavior layer.
   Kept deliberately dependency-free: this is a static site, no build step,
   no framework. Everything below is plain DOM stuff so it's easy to read
   and easy to change later.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------- Scroll Progress & Stethoscope ---------------------------- */
  const scrollProgress = document.getElementById("scroll-progress");
  const stethoscope = document.getElementById("stethoscope");
  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
    stethoscope.style.transform = `translateY(-50%) rotate(${scrolled * 0.5}deg)`;
  });

  /* ---------------------------- Theme toggle ---------------------------- *
   * Starts from LIGHT THEME by default, then can be flipped by hand.
   * Deliberately NOT persisted (no localStorage) — each visit starts fresh.
   * If you want it to remember a visitor's choice once this is live on
   * real hosting, that's an easy one-line add.
   * ------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
  }
  // Default to the visitor's OS preference, as advertised in the HTML
  // comment above — falls back to light if that preference isn't dark.
  setTheme(prefersDark.matches ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  /* ---------------------------- Parallax Effect ---------------------------- */
  const blobs = document.querySelectorAll(".hero-blob");
  const vitalsHero = document.querySelector(".vitals-hero");

  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    if (blobs[0]) {
      blobs[0].style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    }
    if (blobs[1]) {
      blobs[1].style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    }
    if (vitalsHero) {
      vitalsHero.style.transform = `translateX(${x * 15}px)`;
    }
  });

  /* ------------------------------ Mobile nav ----------------------------- */
  const navHeader = document.getElementById("site-nav");
  const navBurger = document.getElementById("nav-burger");
  const navLinks = document.getElementById("nav-links");

  navBurger.addEventListener("click", () => {
    navHeader.classList.toggle("menu-open");
  });
  navLinks
    .querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () =>
        navHeader.classList.remove("menu-open"),
      ),
    );

  // subtle shadow/border once you've actually scrolled, not from pixel one
  window.addEventListener("scroll", () => {
    navHeader.classList.toggle("scrolled", window.scrollY > 12);
  });

  /* --------------------------- Scroll reveals ---------------------------- */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ------------------------------ Skills shelf ---------------------------- *
   * One row of devicon classes, duplicated once so the CSS marquee loop
   * (translateX 0 -> -50%) is seamless. Edit this array to change
   * what shows up — that's it, no other code to touch.
   * ------------------------------------------------------------------- */
  const SKILLS = [
    { name: "HTML", icon: "devicon-html5-plain colored" },
    { name: "CSS", icon: "devicon-css3-plain colored" },
    { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
    { name: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
    { name: "JavaScript", icon: "devicon-javascript-plain colored" },
    { name: "Git", icon: "devicon-git-plain colored" },
    { name: "React", icon: "devicon-react-original colored" },
    { name: "Node.js", icon: "devicon-nodejs-plain colored" },
    { name: "MySQL", icon: "devicon-mysql-plain colored" },
    { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
    { name: "Express", icon: "devicon-express-original" },
    { name: "Redis", icon: "devicon-redis-plain colored" },
    { name: "Figma", icon: "devicon-figma-plain colored" },
  ];

  function buildMarquee(container, skills, rowClass) {
    const doubled = [...skills, ...skills]; // duplicate for the seamless loop
    container.innerHTML = doubled
      .map((s) => {
        const glyph = s.icon
          ? `<i class="${s.icon}" aria-hidden="true"></i>`
          : `<span aria-hidden="true">${s.emoji}</span>`;
        return `
        <div class="skill-chip ${rowClass}" title="${s.name}">
          ${glyph}
        </div>`;
      })
      .join("");
  }

  buildMarquee(document.getElementById("skills-marquee"), SKILLS, "");

  /* ------------------------------ Back-to-top FAB ------------------------- */
  const scrollFab = document.getElementById("scroll-fab");
  if (scrollFab) {
    window.addEventListener("scroll", () => {
      scrollFab.classList.toggle("show", window.scrollY > 480);
    });
    scrollFab.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------- Toast --------------------------------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ------------------------------ Resume button ---------------------------- *
   * The linked PDF is a friendly placeholder (see /resume/README.txt).
   * Once the real CV is ready, just drop it in at that same path and this
   * button needs zero code changes.
   * ------------------------------------------------------------------- */
  const resumeBtn = document.getElementById("resume-btn");
  resumeBtn.addEventListener("click", () => {
    showToast("📄 Resume Downloaded.");
  });

  /* ------------------------------ Contact form ----------------------------- *
   * No backend here, so this opens the visitor's email client with the
   * message pre-filled. Honest about what it does in the form-note under
   * the button. Swap this for a real form endpoint (Formspree, a small
   * serverless function, etc.) whenever there's a backend to send it to.
   * ------------------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const message = document.getElementById("cf-message").value.trim();

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:kaleababatekebede@gmail.com?subject=${subject}&body=${body}`;

    formSuccess.classList.add("show");
    setTimeout(() => formSuccess.classList.remove("show"), 5000);
  });

  /* ---------------------------- Typing Animation ---------------------------- */
  const typingChip = document.getElementById("typing-chip");
  if (typingChip) {
    const roles = [
      "Fullstack Developer",
      "AI Powered Applications",
      "Medical Doctor",
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingChip.textContent =
          charIndex > 0 ? currentRole.substring(0, charIndex - 1) : "";
        charIndex = Math.max(0, charIndex - 1);
      } else {
        typingChip.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Small pause before typing next
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }

  /* ---------------------------- Smooth Scroll for Anchor Links ---------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  /* ---------------------------- Active Nav Links ---------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLink = document.querySelectorAll(".nav-links a");

  const highlightNav = () => {
    const scrollY = window.pageYOffset;
    const atBottom =
      window.innerHeight + scrollY >=
      document.documentElement.scrollHeight - 2;

    sections.forEach((section, i) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 200;
      const sectionId = section.getAttribute("id");
      const isLast = i === sections.length - 1;

      const inRange =
        scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;

      if (inRange || (isLast && atBottom)) {
        navLink.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };
  window.addEventListener("scroll", highlightNav);
  highlightNav();

  /* ------------------------------ Console easter egg ----------------------- */
  console.log(
    "%c🩺 Vitals: stable.  %c</> Build: passing.",
    "color:#0f8b8d;font-weight:600;font-size:13px;",
    "color:#ee6a55;font-weight:600;font-size:13px;",
  );
  console.log(
    "%cLooking at the source? Say hi: kaleababatekebede@gmail.com",
    "color:#71827b;font-size:12px;",
  );
})();
