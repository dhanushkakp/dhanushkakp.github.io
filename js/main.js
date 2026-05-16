document.documentElement.classList.add("js");

const themeStorageKey = "dp-theme";
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("section[id]");
const themeColorMeta = document.querySelector("meta[name='theme-color']");

const getPreferredTheme = () => {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (theme) => {
    root.dataset.theme = theme;

    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(theme === "light"));
        themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    }

    if (themeColorMeta) {
        themeColorMeta.setAttribute("content", theme === "light" ? "#f3efe5" : "#10131d");
    }
};

applyTheme(getPreferredTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
        window.localStorage.setItem(themeStorageKey, nextTheme);
        applyTheme(nextTheme);
    });
}

if (navToggle && header) {
    navToggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

for (const link of navLinks) {
    link.addEventListener("click", () => {
        if (!header || !header.classList.contains("nav-open")) {
            return;
        }

        header.classList.remove("nav-open");
        navToggle?.setAttribute("aria-expanded", "false");
    });
}

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    }, {
        threshold: 0.16
    });

    for (const item of revealItems) {
        revealObserver.observe(item);
    }
} else {
    for (const item of revealItems) {
        item.classList.add("is-visible");
    }
}

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }

            const id = entry.target.getAttribute("id");
            for (const link of navLinks) {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            }
        }
    }, {
        rootMargin: "-35% 0px -45% 0px",
        threshold: 0
    });

    for (const section of sections) {
        sectionObserver.observe(section);
    }
}

const syncHeaderState = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 16);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, {passive: true});
