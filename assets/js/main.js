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