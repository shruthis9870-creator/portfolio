const loader = document.getElementById("loader");
const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const typingText = document.getElementById("typingText");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const backToTop = document.getElementById("backToTop");
const skillTabs = document.querySelectorAll("[data-skill-tab]");
const skillPanels = document.querySelectorAll("[data-skill-panel]");

const typingPhrases = [
  "Student | Web Developer | AI & ML Enthusiast",
  "Future Software Engineer",
  "Healthcare Technology Learner",
  "Full-Stack Developer in Progress",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let countersStarted = false;

window.addEventListener("load", () => {
  setTimeout(() => {
    loader?.classList.add("hide");
  }, 650);
});

function typeHeroText() {
  if (!typingText) return;

  const currentPhrase = typingPhrases[phraseIndex];
  const visibleText = currentPhrase.slice(0, charIndex);
  typingText.textContent = visibleText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex += 1;
    setTimeout(typeHeroText, 72);
    return;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeHeroText, 1300);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeHeroText, 34);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeHeroText, 280);
}

typeHeroText();

function updateHeader() {
  const isScrolled = window.scrollY > 18;
  siteHeader?.classList.toggle("scrolled", isScrolled);
  backToTop?.classList.toggle("show", window.scrollY > 520);
}

window.addEventListener("scroll", updateHeader);
updateHeader();

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    if (navToggle) navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  if (themeToggle) {
    themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
}

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
applyTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
  localStorage.setItem("portfolio-theme", nextTheme);
  applyTheme(nextTheme);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  document.querySelectorAll(".counter").forEach((counter) => {
    const target = Number(counter.dataset.target || "0");
    const duration = 900;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      counter.textContent = String(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = String(target);
      }
    }

    requestAnimationFrame(tick);
  });
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      startCounters();
    }
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".mini-stats").forEach((stats) => {
  statsObserver.observe(stats);
});

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedTab = tab.dataset.skillTab;

    skillTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    skillPanels.forEach((panel) => {
      const isActive = panel.dataset.skillPanel === selectedTab;
      panel.classList.toggle("active", isActive);

      if (isActive) {
        panel.querySelectorAll(".reveal").forEach((card) => {
          card.classList.add("visible");
        });
      }
    });
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();

  if (formStatus) {
    formStatus.textContent = "Thank you. Your message has been prepared successfully.";
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
