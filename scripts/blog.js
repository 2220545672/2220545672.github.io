function loadBlogPost() {
    const path = window.location.pathname;
    if (path.endsWith('.md')) {
        const mdPath = path;
        // 修改重定向路径，使用相对路径
        window.location.href = './post.html?article=' + encodeURIComponent(mdPath);
    }
}

function loadMarkdownContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const article = urlParams.get('article');
    
    if (article) {
        // 移除开头的 ./ 以确保正确获取文件
        const cleanPath = article.replace(/^\.\//, '');
        fetch(cleanPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('文章加载失败');
                }
                return response.text();
            })
            .then(text => {
                document.getElementById('content').innerHTML = marked.parse(text);
                // 从 markdown 内容中提取标题
                const title = text.split('\n')[0].replace('# ', '');
                document.title = title;
            })
            .catch(error => {
                console.error('Error loading markdown:', error);
                document.getElementById('content').innerHTML = '<h1>文章加载失败</h1><p>抱歉，无法加载文章内容。</p>';
            });
    }
}