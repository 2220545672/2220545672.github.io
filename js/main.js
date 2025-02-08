function showHomePage() {
    document.getElementById('home-page').classList.remove('hidden');
    document.getElementById('article-page').classList.add('hidden');
    document.title = '我的博客';
    history.pushState({}, '', './');
}

// 检查系统主题和本地存储的主题设置
function initTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// 切换夜间模式
function toggleDarkMode() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

window.onload = function () {
    initTheme();
    loadArticleList();
    const article = new URLSearchParams(window.location.search).get('article');
    if (article) {
        loadArticle(article);
    } else {
        showHomePage();
    }

    // 初始化所有需要自定义滚动条的元素
    document.querySelectorAll('[data-simplebar]').forEach(element => {
        new SimpleBar(element, {
            autoHide: true,
            scrollbarMinSize: 40
        });
    });
};

window.onpopstate = function () {
    const article = new URLSearchParams(window.location.search).get('article');
    article ? loadArticle(article) : showHomePage();
};

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const showSidebarBtn = document.getElementById('show-sidebar-btn');
    
    if (sidebar.classList.contains('hidden')) {
        // 显示侧边栏
        sidebar.classList.remove('hidden');
        mainContent.classList.remove('ml-0');
        mainContent.classList.add('ml-64');
        showSidebarBtn.classList.add('hidden');
    } else {
        // 隐藏侧边栏
        sidebar.classList.add('hidden');
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-0');
        showSidebarBtn.classList.remove('hidden');
    }
} 