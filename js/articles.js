function loadArticleList() {
    fetch('./posts/articles.json')
        .then(response => response.json())
        .then(data => {
            const blogList = document.querySelector('.blog-list');
            blogList.innerHTML = data.articles.map(article => `
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
            `).join('');
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

function loadArticle(path) {
    fetch(path)
        .then(response => response.ok ? response.text() : Promise.reject('文章加载失败'))
        .then(text => {
            const parsedContent = marked.parse(text);
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = parsedContent;
            // 处理代码块高亮
            contentDiv.querySelectorAll('pre code').forEach((block) => {
                const language = block.className.replace('language-', '');
                if (Prism.languages[language]) {
                    block.innerHTML = Prism.highlight(
                        block.textContent,
                        Prism.languages[language],
                        language
                    );
                }
            });
            document.getElementById('home-page').classList.add('hidden');
            document.getElementById('article-page').classList.remove('hidden');
            document.title = text.split('\n')[0].replace('# ', '');
            history.pushState({}, '', `?article=${encodeURIComponent(path)}`);
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