let currentPage = 1;
const articlesPerPage = 5;
let isLoading = false;
let hasMore = true;
let articleCache = new Map(); // 用于缓存文章内容

function loadArticleList() {
    fetch('./posts/articles.json')
        .then(response => response.json())
        .then(data => {
            window.articleData = data; // 保存文章数据
            const blogList = document.querySelector('.blog-list');
            const articles = data.articles.slice(0, articlesPerPage);
            blogList.innerHTML = articles.map(article => renderArticle(article)).join('');

            // 添加滚动监听
            window.addEventListener('scroll', handleScroll);
            hasMore = data.articles.length > articlesPerPage;

            // 预加载最新的文章
            if (data.articles.length > 0) {
                prefetchArticle(data.articles[0].file);
            }
        })
        .catch(error => {
            console.error('文章列表加载失败:', error);
            document.querySelector('.blog-list').innerHTML = `
                <div class="p-12 text-center">
                    <h3 class="text-xl font-bold mb-2 text-gray-800">加载文章列表失败</h3>
                    <p class="text-gray-600">请检查网络连接或稍后重试</p>
                </div>
            `;
        });
}

function renderArticle(article) {
    return `
        <article class="p-8 md:p-12 hover:bg-blue-50/50 transition-all duration-300">
            <h2 class="text-3xl font-bold mb-4">
                <a href="#" onclick="loadArticle('${article.file}'); return false;" 
                   class="text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    ${article.title}
                </a>
            </h2>
            <div class="text-sm text-gray-500 mb-4">发布于 ${article.date}</div>
            <p class="text-gray-600 mb-6 leading-relaxed">${article.excerpt}</p>
            <a href="#" onclick="loadArticle('${article.file}'); return false;" 
               class="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1 shadow-md">
                继续阅读
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
            </a>
        </article>
    `;
}

function handleScroll() {
    if (isLoading || !hasMore) return;

    const articles = document.querySelectorAll('.blog-list article');
    if (articles.length < 2) return;

    const secondLastArticle = articles[articles.length - 2];
    const rect = secondLastArticle.getBoundingClientRect();

    if (rect.bottom <= window.innerHeight) {
        loadMoreArticles();
    }
}

function loadMoreArticles() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    const start = currentPage * articlesPerPage;
    const end = start + articlesPerPage;
    const articles = window.articleData.articles.slice(start, end);

    if (articles.length > 0) {
        const blogList = document.querySelector('.blog-list');
        const newContent = articles.map(article => renderArticle(article)).join('');
        blogList.insertAdjacentHTML('beforeend', newContent);

        currentPage++;
        hasMore = end < window.articleData.articles.length;
    } else {
        hasMore = false;
    }

    isLoading = false;
}

function prefetchArticle(path) {
    if (articleCache.has(path)) return;

    fetch(path)
        .then(response => response.ok ? response.text() : Promise.reject('文章加载失败'))
        .then(text => {
            articleCache.set(path, {
                content: text,
                parsedContent: marked.parse(text)
            });
        })
        .catch(error => {
            console.error('预加载文章失败:', error);
        });
}

function loadArticle(path) {
    // 如果文章已缓存，直接使用缓存内容
    if (articleCache.has(path)) {
        const cached = articleCache.get(path);
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = cached.parsedContent;
        highlightCode(contentDiv);
        updateUIForArticle(cached.content, path);
        return;
    }

    fetch(path)
        .then(response => response.ok ? response.text() : Promise.reject('文章加载失败'))
        .then(text => {
            // 缓存新加载的文章
            articleCache.set(path, {
                content: text,
                parsedContent: marked.parse(text)
            });

            const parsedContent = marked.parse(text);
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = parsedContent;
            highlightCode(contentDiv);
            updateUIForArticle(text, path);
        })
        .catch(error => {
            console.error(error);
            document.getElementById('content').innerHTML = `
                <h1 class="text-2xl font-bold text-red-600">文章加载失败</h1>
                <p class="text-gray-600">抱歉，无法加载文章内容。</p>
            `;
            document.getElementById('home-page').classList.add('hidden');
            document.getElementById('article-page').classList.remove('hidden');
        });
}

function highlightCode(container) {
    container.querySelectorAll('pre code').forEach((block) => {
        const language = block.className.replace('language-', '');
        if (Prism.languages[language]) {
            block.innerHTML = Prism.highlight(
                block.textContent,
                Prism.languages[language],
                language
            );
        }
    });
}

function updateUIForArticle(text, path) {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('article-page').classList.remove('hidden');
    document.title = text.split('\n')[0].replace('# ', '');
    history.pushState({}, '', `?article=${encodeURIComponent(path)}`);
}

function loadFullArticle(path) {
    fetch(path)
        .then(response => response.ok ? response.text() : Promise.reject('文章加载失败'))
        .then(text => {
            const parsedContent = marked.parse(text);
            document.getElementById('content').innerHTML = parsedContent;
            // 处理代码高亮
            document.querySelectorAll('pre code').forEach((block) => {
                const language = block.className.replace('language-', '');
                if (Prism.languages[language]) {
                    block.innerHTML = Prism.highlight(
                        block.textContent,
                        Prism.languages[language],
                        language
                    );
                }
            });
        });
} 