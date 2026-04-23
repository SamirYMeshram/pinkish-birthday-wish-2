const preloader = document.getElementById("preloader");
const preloaderPetals = document.getElementById("preloaderPetals");
const cursorGlow = document.getElementById("cursorGlow");
const particlesWrap = document.getElementById("ambientParticles");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const modeToggle = document.getElementById("modeToggle");
const scrollProgress = document.getElementById("scrollProgress");
const siteHeader = document.getElementById("siteHeader");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdownMessage");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createPreloaderPetal() {
  const petal = document.createElement("span");
  petal.className = "preloader__petal";
  petal.textContent = Math.random() > 0.5 ? "♡" : "✦";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${5 + Math.random() * 5}s`;
  petal.style.setProperty("--x-drift", `${-40 + Math.random() * 80}px`);
  preloaderPetals.appendChild(petal);

  window.setTimeout(() => petal.remove(), 11000);
}

function createAmbientParticle() {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.textContent = Math.random() > 0.34 ? "♡" : "✦";
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.animationDuration = `${8 + Math.random() * 8}s`;
  particle.style.animationDelay = `${Math.random() * 2}s`;
  particle.style.fontSize = `${12 + Math.random() * 14}px`;
  particle.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
  particlesWrap.appendChild(particle);

  window.setTimeout(() => particle.remove(), 17000);
}

function hidePreloader() {
  if (!preloader) return;
  preloader.classList.add("is-hidden");
  document.body.classList.add("is-ready");
}

window.addEventListener("load", () => {
  if (!prefersReducedMotion) {
    for (let i = 0; i < 16; i += 1) {
      window.setTimeout(createPreloaderPetal, i * 160);
    }

    window.setInterval(createPreloaderPetal, 520);
    window.setInterval(createAmbientParticle, 900);

    for (let i = 0; i < 10; i += 1) {
      window.setTimeout(createAmbientParticle, 280 * i);
    }
  }

  window.setTimeout(hidePreloader, prefersReducedMotion ? 200 : 1650);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

function getNextBirthday() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let nextBirthday = new Date(currentYear, 3, 23, 0, 0, 0, 0);

  if (now > nextBirthday) {
    nextBirthday = new Date(currentYear + 1, 3, 23, 0, 0, 0, 0);
  }

  return nextBirthday;
}

function updateCountdown() {
  const now = new Date();
  const nextBirthday = getNextBirthday();
  const diff = nextBirthday - now;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    countdownMessage.textContent = "Happy Birthday, Puru. Today is a soft little celebration of your beautiful existence.";
    return;
  }

  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;

  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / hourMs);
  const minutes = Math.floor((diff % hourMs) / minuteMs);
  const seconds = Math.floor((diff % minuteMs) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  const options = { day: "numeric", month: "long", year: "numeric" };
  countdownMessage.textContent = `Every second brings us closer to ${nextBirthday.toLocaleDateString("en-IN", options)} — another beautiful day to celebrate My Puru.`;
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

if (!prefersReducedMotion) {
  document.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    cursorGlow.style.opacity = "1";
    cursorGlow.style.left = `${clientX}px`;
    cursorGlow.style.top = `${clientY}px`;

    const xPercent = (clientX / window.innerWidth - 0.5) * 2;
    const yPercent = (clientY / window.innerHeight - 0.5) * 2;

    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 8);
      layer.style.transform = `translate3d(${xPercent * depth}px, ${yPercent * depth}px, 0)`;
    });
  });

  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

tiltCards.forEach((card) => {
  if (prefersReducedMotion) return;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const targetId = `#${entry.target.id}`;
      const matchingLink = document.querySelector(`.nav a[href="${targetId}"]`);
      if (!matchingLink) return;

      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
        matchingLink.classList.add("is-active");
      }
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;
  siteHeader.classList.toggle("is-scrolled", scrollTop > 10);
}

updateScrollUI();
document.addEventListener("scroll", updateScrollUI, { passive: true });

modeToggle.addEventListener("click", () => {
  const isActive = modeToggle.classList.toggle("is-active");
  document.body.classList.toggle("is-romantic", isActive);
  modeToggle.setAttribute("aria-pressed", String(isActive));

  const text = modeToggle.querySelector(".mode-toggle__text");
  text.textContent = isActive ? "Romantic Mode On" : "Romantic Mode";

  if (isActive && !prefersReducedMotion) {
    for (let i = 0; i < 8; i += 1) {
      window.setTimeout(createAmbientParticle, i * 120);
    }
  }
});
