document.addEventListener('DOMContentLoaded', () => {
    const allBirds = [
        {
            id: 'sparrow',
            name: 'スズメ',
            pageUrl: 'sparrow.html',
            imageUrl: 'https://source.unsplash.com/400x300/?sparrow'
        },
        {
            id: 'crow',
            name: 'ハシブトガラス',
            pageUrl: 'crow.html',
            imageUrl: 'https://source.unsplash.com/400x300/?crow'
        },
        {
            id: 'mejiro',
            name: 'メジロ',
            pageUrl: 'mejiro.html',
            imageUrl: 'https://source.unsplash.com/400x300/?white-eye-bird'
        },
        {
            id: 'tit',
            name: 'シジュウカラ',
            pageUrl: 'tit.html',
            imageUrl: 'https://source.unsplash.com/400x300/?japanese-tit'
        }
    ];

    const recommendGrid = document.getElementById('recommend-grid');
    if (!recommendGrid) {
        return; // おすすめセクションがないページでは何もしない
    }

    // 現在のページの鳥を特定
    const currentPagePath = window.location.pathname;
    const currentBirdId = allBirds.find(bird => currentPagePath.includes(bird.pageUrl))?.id || null;

    // 現在の鳥を除外したリストを作成
    let birdsForRecommendation = allBirds.filter(bird => bird.id !== currentBirdId);

    // 配列をシャッフル（Fisher-Yates shuffle）
    for (let i = birdsForRecommendation.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [birdsForRecommendation[i], birdsForRecommendation[j]] = [birdsForRecommendation[j], birdsForRecommendation[i]];
    }

    // おすすめとして表示する鳥の数（最大3羽）
    const numberOfRecommendations = Math.min(3, birdsForRecommendation.length);
    const recommendedBirds = birdsForRecommendation.slice(0, numberOfRecommendations);

    // HTMLを生成して挿入
    recommendedBirds.forEach(bird => {
        const cardHtml = `
            <a href="${bird.pageUrl}" class="card-link">
                <div class="bird-card">
                    <img src="${bird.imageUrl}" alt="${bird.name}">
                    <div class="bird-card-content">
                        <h3>${bird.name}</h3>
                    </div>
                </div>
            </a>
        `;
        recommendGrid.innerHTML += cardHtml;
    });
});
