const filtersContainer = document.querySelector('.filters');
const searchInput = document.getElementById("searchInput");
const resetFilter = document.getElementById("resetFilter");
const openSaved = document.getElementById("openSaved");
const savedPanel = document.getElementById("savedPanel");
const closeSaved = document.getElementById("closeSaved");
const savedList = document.getElementById("savedList");
const saveButtons = document.querySelectorAll(".save-btn");

const savedPosts = new Set();
let activeFilter = "all";

// Helper: escape HTML to avoid injection when injecting snippets
function escapeHtml(str){
    return String(str).replace(/[&<>"]+/g, function(s){
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]);
    });
}

const updateSavedList = () => {
    savedList.innerHTML = "";

    if (savedPosts.size === 0) {
        const empty = document.createElement("li");
        empty.textContent = "还没有收藏文章。";
        savedList.appendChild(empty);
        return;
    }

    savedPosts.forEach((title) => {
        const item = document.createElement("li");
        item.textContent = title;
        savedList.appendChild(item);
    });
};

const applyFilters = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const currentPosts = document.querySelectorAll('.post-card');

    currentPosts.forEach((post) => {
        const category = post.dataset.category;
        const text = post.textContent.toLowerCase();
        const matchesCategory = activeFilter === "all" || category === activeFilter;
        const matchesKeyword = text.includes(keyword);

        post.style.display = matchesCategory && matchesKeyword ? "flex" : "none";
    });
};

// Categories rendering and binding
function renderCategories(){
    const container = filtersContainer;
    if(!container) return;
    // load categories from storage or derive from posts
    let categories = JSON.parse(localStorage.getItem('cms_categories') || '[]');
    if(!categories || categories.length === 0){
        const posts = JSON.parse(localStorage.getItem('cms_posts') || '[]');
        const set = new Set();
        posts.forEach(p=> set.add(p.category || 'life'));
        categories = Array.from(set).filter(Boolean);
    }

    // rebuild chips (keep '全部' first)
    container.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'chip active';
    allBtn.dataset.filter = 'all';
    allBtn.textContent = '全部';
    container.appendChild(allBtn);

    categories.forEach(cat => {
        const b = document.createElement('button');
        b.className = 'chip';
        b.dataset.filter = cat;
        b.textContent = cat;
        container.appendChild(b);
    });

    bindCategoryChips();
}

function bindCategoryChips(){
    const chips = document.querySelectorAll('.chip');
    chips.forEach((chip) => {
        chip.removeEventListener('click', chip._handler);
        const handler = () => {
            document.querySelectorAll('.chip').forEach(item => item.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            applyFilters();
        };
        chip._handler = handler;
        chip.addEventListener('click', handler);
    });
}

searchInput.addEventListener("input", applyFilters);
searchInput.addEventListener("input", applyFilters);
// bind save buttons for current post list
function bindSaveButtons(){
    const saveButtons = document.querySelectorAll('#postList .save-btn');
    saveButtons.forEach((button) => {
        button.removeEventListener('click', button._saveHandler);
        const handler = () => {
            const card = button.closest(".post-card");
            const title = card.querySelector("h3").textContent;

            if (savedPosts.has(title)) {
                savedPosts.delete(title);
                button.textContent = "收藏";
            } else {
                savedPosts.add(title);
                button.textContent = "已收藏";
            }
            updateSavedList();
        };
        button._saveHandler = handler;
        button.addEventListener('click', handler);
    });
}

openSaved.addEventListener("click", () => {
    savedPanel.classList.add("active");
    savedPanel.setAttribute("aria-hidden", "false");
    updateSavedList();
});

closeSaved.addEventListener("click", () => {
    savedPanel.classList.remove("active");
    savedPanel.setAttribute("aria-hidden", "true");
});

savedPanel.addEventListener("click", (event) => {
    if (event.target === savedPanel) {
        savedPanel.classList.remove("active");
        savedPanel.setAttribute("aria-hidden", "true");
    }
});

// Render CMS content (posts & games) from localStorage and listen for changes

function renderCMSPosts(){
    const container = document.getElementById('postList');
    container.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('cms_posts') || '[]');
    if(!items || items.length === 0){
        const p = document.createElement('p');
        p.className = 'small';
        p.textContent = '暂无文章。可在后台发布。';
        container.appendChild(p);
        return;
    }

    items.forEach((p) => {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.dataset.category = p.category || 'life';
        const date = p.date || new Date().toISOString().split('T')[0];
        article.innerHTML = `
            <div>
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.body)}</p>
            </div>
            <div class="post-meta">
                <span>${escapeHtml(p.category)}</span>
                <span>${date}</span>
            </div>
            <button class="save-btn">收藏</button>
        `;
        container.appendChild(article);
    });
    bindSaveButtons();
    applyFilters();
    // update weekly recommendation after posts rendered
    pickWeeklyRecommendation();
}

function renderCMSGames(){
    const grid = document.querySelector('.works-grid');
    if(!grid) return;
    grid.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('cms_games') || '[]');
    if(!items || items.length === 0){
        const p = document.createElement('p');
        p.className = 'small';
        p.textContent = '暂无作品。可在后台添加。';
        grid.appendChild(p);
        return;
    }

    items.forEach((g) => {
        const article = document.createElement('article');
        article.className = 'work-card';
        article.dataset.title = g.title || '';
        article.dataset.desc = g.desc || '';
        article.innerHTML = `
            <div class="thumb"><img src="icon.svg" alt="${escapeHtml(g.title)} 缩略图"></div>
            <h3>${escapeHtml(g.title)}</h3>
            <p>${escapeHtml(g.desc)}</p>
            <div class="work-actions">
                <a class="button" href="${escapeHtml(g.download)}" download>下载</a>
                <a class="button" href="${escapeHtml(g.download)}">打开</a>
            </div>
        `;
        grid.appendChild(article);
    });
}

// 每周推荐：从 CMS 的文章中随机抽取一篇展示在 hero-card
function pickWeeklyRecommendation(){
    const hero = document.querySelector('.hero-card');
    if(!hero) return;
    const items = JSON.parse(localStorage.getItem('cms_posts') || '[]');
    if(items && items.length > 0){
        const idx = Math.floor(Math.random() * items.length);
        const p = items[idx];
        const title = p.title || '推荐文章';
        const excerpt = (p.body && p.body.length > 240) ? p.body.slice(0,240) + '...' : (p.body || '—');
        const date = p.date || new Date().toISOString().split('T')[0];
        hero.innerHTML = `
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(excerpt)}</p>
            <div class="meta">
                <span>📌 专栏精选</span>
                <span>${escapeHtml(date)}</span>
            </div>
        `;
    } else {
        // fallback 文案
        hero.innerHTML = `
            <h3>本周推荐</h3>
            <p>暂无可推荐文章。请在后台发布文章后刷新或稍等片刻。</p>
            <div class="meta">
                <span>📌 专栏精选</span>
                <span>—</span>
            </div>
        `;
    }
}

// react to storage changes from admin.html in other tabs
window.addEventListener('storage', (e) => {
    if(e.key === 'cms_posts') renderCMSPosts();
    if(e.key === 'cms_games') renderCMSGames();
    if (e.key === 'theme') {
        const t = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark', t === 'dark');
    }
});

// initial render
renderCMSPosts();
renderCMSGames();
// initial categories render
renderCategories();

// Theme toggle: persist preference and apply
const themeToggle = document.getElementById("themeToggle");
const root = document.body;
const savedTheme = localStorage.getItem("theme");

function applyTheme(theme) {
    if (theme === "dark") {
        root.classList.add("dark");
        themeToggle.textContent = "☀️";
    } else {
        root.classList.remove("dark");
        themeToggle.textContent = "🌙";
    }
}

// on load apply theme
document.addEventListener('DOMContentLoaded', function() {
    const t = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', t === 'dark');
});

// initialize theme
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    // respect system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = root.classList.contains('dark');
        const next = isDark ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
}

// Mobile nav toggle: toggle body.nav-open so CSS can show/hide .site-nav
const navToggle = document.getElementById('navToggle');
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const opened = document.body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
    // close nav when a link is clicked (mobile convenience)
    document.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', () => {
        if (document.body.classList.contains('nav-open')) {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }));
}

// Close mobile nav when clicking outside (only on small screens)
document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (window.innerWidth > 720) return;

    const nav = document.querySelector('.site-nav');
    const toggleMain = document.getElementById('navToggle');
    const toggleAdmin = document.getElementById('navToggle2');

    const clickedInsideNav = nav && nav.contains(e.target);
    const clickedToggle = (toggleMain && toggleMain.contains(e.target)) || (toggleAdmin && toggleAdmin.contains(e.target));

    if (!clickedInsideNav && !clickedToggle) {
        document.body.classList.remove('nav-open');
        if (toggleMain) toggleMain.setAttribute('aria-expanded', 'false');
        if (toggleAdmin) toggleAdmin.setAttribute('aria-expanded', 'false');
    }
});

// Works now link directly to dedicated pages; modal removed.

// Contact form handling (front-end only mock)
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    const contactName = document.getElementById("contactName");
    const contactEmail = document.getElementById("contactEmail");
    const contactPhone = document.getElementById("contactPhone");
    const contactMessage = document.getElementById("contactMessage");
    const contactSuccess = document.getElementById("contactSuccess");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        contactSuccess.setAttribute("aria-hidden", "false");

        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const phone = contactPhone ? contactPhone.value.trim() : '';
        const message = contactMessage.value.trim();

        if (!name || !email || !message) {
            contactSuccess.textContent = "请完整填写姓名、邮箱与消息后再发送。";
            contactSuccess.style.color = "#d23f3f";
            return;
        }

        // 保存到 localStorage 的 contacts（作为后台可见的联系记录）
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.unshift({ name, email, phone, message, date: new Date().toISOString() });
        localStorage.setItem('contacts', JSON.stringify(contacts));

        contactSuccess.textContent = "消息已发送，已保存到后台记录中。";
        contactSuccess.style.color = "var(--accent)";

        contactName.value = "";
        contactEmail.value = "";
        if (contactPhone) contactPhone.value = "";
        contactMessage.value = "";

        setTimeout(() => {
            contactSuccess.setAttribute("aria-hidden", "true");
            contactSuccess.textContent = "";
        }, 3000);
    });
}
// newsletter removed per request
