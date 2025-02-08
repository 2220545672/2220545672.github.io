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

    // 只在侧边栏内容区域使用 SimpleBar
    const sidebarContent = document.querySelector('.sidebar-content');
    if (sidebarContent) {
        new SimpleBar(sidebarContent, {
            autoHide: true,
            scrollbarMinSize: 40,
            timeout: 1000,
            clickOnTrack: false
        });
    }
};

window.onpopstate = function () {
    const article = new URLSearchParams(window.location.search).get('article');
    article ? loadArticle(article) : showHomePage();
};

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const showSidebarBtn = document.getElementById('show-sidebar-btn');
    
    const duration = 300; // 动画持续时间（毫秒）

    if (sidebar.classList.contains('hidden')) {
        // 显示侧边栏
        sidebar.classList.remove('hidden');
        sidebar.style.transform = 'translateX(0)';
        mainContent.classList.remove('ml-0');
        mainContent.classList.add('ml-64');
        showSidebarBtn.classList.add('hidden');
    } else {
        // 隐藏侧边栏
        sidebar.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            sidebar.classList.add('hidden');
            sidebar.style.transform = '';
        }, duration);
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-0');
        showSidebarBtn.classList.remove('hidden');
    }
} 