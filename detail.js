document.addEventListener('DOMContentLoaded', () => {
    const birdDetailContainer = document.getElementById('bird-detail-container');
    let allBirds = [];

    // URLから鳥のIDを取得 (e.g., ?id=sparrow)
    const params = new URLSearchParams(window.location.search);
    const currentBirdId = params.get('id');

    if (!currentBirdId) {
        displayError('鳥のIDが指定されていません。');
        return;
    }

    // JSONファイルから鳥のデータを取得
    fetch('birds.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allBirds = data.birds;
            const currentBird = allBirds.find(bird => bird.id === currentBirdId);

            if (currentBird) {
                displayBirdDetails(currentBird);
                displayRecommendations(currentBirdId);
            } else {
                displayError('指定された鳥が見つかりませんでした。');
            }
        })
        .catch(error => {
            console.error('鳥のデータの読み込みに失敗しました:', error);
            displayError('鳥のデータの読み込みに失敗しました。');
        });

    // 鳥の詳細を表示する関数
    function displayBirdDetails(bird) {
        document.title = `${bird.nameJP} - 野鳥と出会う日々`; // ページのタイトルを更新

        let detailHtml = `
            <div class="bird-title-area">
                <h1>${bird.nameJP}</h1>
                <p class="bird-name-en">${bird.nameEN}</p>
                <p class="bird-name-sci"><i>${bird.nameSCI}</i></p>
            </div>
        `;

        bird.descriptions.forEach((desc, index) => {
            detailHtml += `
                <div class="bird-detail-section">
                    ${bird.detailImages[index] ? `<img src="${bird.detailImages[index]}" alt="${bird.nameJP}の写真${index + 1}">` : ''}
                    <div class="bird-detail-text">
                        <h2>${desc.title}</h2>
                        <p>${desc.text.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `;
        });

        detailHtml += `
            <div class="back-to-list">
                <a href="zukan.html">&laquo; 図鑑一覧に戻る</a>
            </div>

            <div class="recommend-section">
                <h2>おすすめの野鳥</h2>
                <div class="recommend-grid" id="recommend-grid">
                    <!-- ここにJavaScriptでランダムな鳥が表示されます -->
                </div>
            </div>
        `;

        birdDetailContainer.innerHTML = detailHtml;
    }
    
    // おすすめの鳥を表示する関数
    function displayRecommendations(currentId) {
        const recommendGrid = document.getElementById('recommend-grid');
        if (!recommendGrid) return;

        let birdsForRecommendation = allBirds.filter(bird => bird.id !== currentId);

        // 配列をシャッフル
        for (let i = birdsForRecommendation.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [birdsForRecommendation[i], birdsForRecommendation[j]] = [birdsForRecommendation[j], birdsForRecommendation[i]];
        }

        const numberOfRecommendations = Math.min(3, birdsForRecommendation.length);
        const recommendedBirds = birdsForRecommendation.slice(0, numberOfRecommendations);

        recommendedBirds.forEach(bird => {
            const cardHtml = `
                <a href="detail.html?id=${bird.id}" class="card-link">
                    <div class="bird-card">
                        <img src="${bird.mainImage}" alt="${bird.nameJP}">
                        <div class="bird-card-content">
                            <h3>${bird.nameJP}</h3>
                        </div>
                    </div>
                </a>
            `;
            recommendGrid.innerHTML += cardHtml;
        });
    }

    // エラーメッセージを表示する関数
    function displayError(message) {
        birdDetailContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
});
