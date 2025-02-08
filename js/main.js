function showHomePage() {
    document.getElementById('home-page').classList.remove('hidden');
    document.getElementById('article-page').classList.add('hidden');
    document.title = '我的博客';
    history.pushState({}, '', './');
}

window.onload = function () {
    loadArticleList();
    const article = new URLSearchParams(window.location.search).get('article');
    if (article) {
        loadArticle(article);
    } else {
        showHomePage();
    }
};

window.onpopstate = function () {
    const article = new URLSearchParams(window.location.search).get('article');
    article ? loadArticle(article) : showHomePage();
};

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (sidebar.classList.contains('hidden')) {
        // 显示侧边栏
        sidebar.classList.remove('hidden');
        mainContent.classList.remove('ml-0');
        mainContent.classList.add('ml-64');
    } else {
        // 隐藏侧边栏
        sidebar.classList.add('hidden');
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-0');
    }
} 