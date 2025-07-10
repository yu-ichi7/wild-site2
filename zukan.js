document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const birdGrid = document.getElementById('bird-grid');
    const searchInput = document.getElementById('search-input');
    let allBirds = [];

    // JSONファイルから鳥のデータを取得
    console.log('Fetching birds.json...');
    fetch('birds.json', { 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
        .then(data => {
            allBirds = data.birds;
            displayBirds(allBirds);
        })
        .catch(error => {
            console.error('鳥のデータの読み込みに失敗しました:', error);
            birdGrid.innerHTML = '<p>鳥のデータの読み込みに失敗しました。ページを再読み込みしてください。</p>';
        });

    // 鳥のカードを表示する関数
    function displayBirds(birds) {
        birdGrid.innerHTML = ''; // 既存のカードをクリア
        if (birds.length === 0) {
            birdGrid.innerHTML = '<p>該当する鳥が見つかりませんでした。</p>';
            return;
        }
        birds.forEach(bird => {
            // 新しい詳細ページへのリンクを作成（例: detail.html?id=sparrow）
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
            birdGrid.innerHTML += cardHtml;
        });
    }

    // 検索機能
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredBirds = allBirds.filter(bird => {
            return bird.nameJP.includes(searchTerm) || 
                   bird.nameEN.toLowerCase().includes(searchTerm) ||
                   bird.nameSCI.toLowerCase().includes(searchTerm);
        });
        displayBirds(filteredBirds);
    });
});
