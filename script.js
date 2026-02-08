const filters = document.querySelectorAll(".chip");
const posts = document.querySelectorAll(".post-card");
const searchInput = document.getElementById("searchInput");
const resetFilter = document.getElementById("resetFilter");
const openSaved = document.getElementById("openSaved");
const savedPanel = document.getElementById("savedPanel");
const closeSaved = document.getElementById("closeSaved");
const savedList = document.getElementById("savedList");
const saveButtons = document.querySelectorAll(".save-btn");

const savedPosts = new Set();
let activeFilter = "all";

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

    posts.forEach((post) => {
        const category = post.dataset.category;
        const text = post.textContent.toLowerCase();
        const matchesCategory = activeFilter === "all" || category === activeFilter;
        const matchesKeyword = text.includes(keyword);

        post.style.display = matchesCategory && matchesKeyword ? "flex" : "none";
    });
};

filters.forEach((chip) => {
    chip.addEventListener("click", () => {
        filters.forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
        activeFilter = chip.dataset.filter;
        applyFilters();
    });
});

searchInput.addEventListener("input", applyFilters);

resetFilter.addEventListener("click", () => {
    activeFilter = "all";
    filters.forEach((item) => item.classList.remove("active"));
    filters[0].classList.add("active");
    searchInput.value = "";
    applyFilters();
});

saveButtons.forEach((button) => {
    button.addEventListener("click", () => {
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
    });
});

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

applyFilters();
