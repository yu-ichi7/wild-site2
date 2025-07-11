document.addEventListener('DOMContentLoaded', () => {
    // サンプルデータ（実際のアプリではAPIやJSONから取得）
    const galleryData = [
        { 
            id: 1, 
            src: 'https://source.unsplash.com/800x600/?sparrow', 
            title: 'スズメの群れ', 
            date: '2024-07-01',
            description: '公園で見かけたスズメの群れ。餌を探している様子です。'
        },
        { 
            id: 2, 
            src: 'https://source.unsplash.com/800x600/?pigeon', 
            title: '公園のハト', 
            date: '2024-07-05',
            description: '広場でくつろぐハトの群れ。人懐っこい性格です。'
        },
        { 
            id: 3, 
            src: 'https://source.unsplash.com/800x600/?crow', 
            title: 'カラスの観察', 
            date: '2024-07-10',
            description: '木の上で休むカラス。知能が高いことで知られています。'
        },
        { 
            id: 4, 
            src: 'https://source.unsplash.com/800x600/?bird', 
            title: '野鳥のさえずり', 
            date: '2024-06-28',
            description: '森で撮影した美しい野鳥の姿。'
        },
        { 
            id: 5, 
            src: 'https://source.unsplash.com/800x600/?sparrow,portrait', 
            title: 'スズメのポートレート', 
            date: '2024-07-03',
            description: '近くで撮影したスズメのアップショット。'
        },
        { 
            id: 6, 
            src: 'https://source.unsplash.com/800x600/?pigeon,street', 
            title: '街中のハト', 
            date: '2024-07-07',
            description: '都会の風景に溶け込むハトたち。'
        },
        { 
            id: 7, 
            src: 'https://source.unsplash.com/800x600/?crow,black', 
            title: '黒い羽根の輝き', 
            date: '2024-07-09',
            description: '太陽の光を浴びて輝くカラスの羽根。'
        },
        { 
            id: 8, 
            src: 'https://source.unsplash.com/800x600/?bird,colorful', 
            title: '色鮮やかな野鳥', 
            date: '2024-06-30',
            description: '鮮やかな羽色が美しい野鳥を発見。'
        }
    ];

    // DOM要素の取得
    const galleryGrid = document.getElementById('gallery-grid');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');

    // グローバル変数
    let currentPage = 1;
    const itemsPerPage = 8;
    let currentIndex = 0;

    // ギャラリーの初期化
    function initGallery() {
        displayGallery();
        setupEventListeners();
        updatePagination();
    }

    // ギャラリーの表示
    function displayGallery() {
        galleryGrid.innerHTML = '';
        
        // ページネーションの更新
        updatePagination();
        
        // 現在のページのデータを取得
        const paginatedData = getPaginatedData();
        
        // ギャラリーアイテムの作成
        paginatedData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.index = index;
            
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <div class="gallery-caption">
                    <h3>${item.title}</h3>
                    <p>${item.date}</p>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => openModal(index));
            galleryGrid.appendChild(galleryItem);
        });
    }

    // ページネーションデータの取得
    function getPaginatedData() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return galleryData.slice(startIndex, endIndex);
    }

    // ページネーションの更新
    function updatePagination() {
        const totalPages = Math.ceil(galleryData.length / itemsPerPage);
        
        // 前へ・次へボタンの状態を更新
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // ページ番号の表示を更新
        pageNumbers.innerHTML = '';
        
        // ページ番号の表示（最大5つまで）
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 最初のページへのリンク
        if (startPage > 1) {
            const firstPage = document.createElement('span');
            firstPage.className = 'page-number' + (1 === currentPage ? ' active' : '');
            firstPage.textContent = '1';
            firstPage.addEventListener('click', () => goToPage(1));
            pageNumbers.appendChild(firstPage);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
        }
        
        // ページ番号の表示
        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = 'page-number' + (i === currentPage ? ' active' : '');
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageNumber);
        }
        
        // 最後のページへのリンク
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
            
            const lastPage = document.createElement('span');
            lastPage.className = 'page-number' + (totalPages === currentPage ? ' active' : '');
            lastPage.textContent = totalPages;
            lastPage.addEventListener('click', () => goToPage(totalPages));
            pageNumbers.appendChild(lastPage);
        }
    }

    // ページ遷移
    function goToPage(page) {
        if (page < 1 || page > Math.ceil(currentFilteredData.length / itemsPerPage)) return;
        
        currentPage = page;
        displayGallery();
        
        // ページトップにスクロール
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // モーダルを開く
    function openModal(index) {
        currentIndex = index;
        const paginatedData = getPaginatedData();
        const item = paginatedData[index];
        
        modalImg.src = item.src;
        modalImg.alt = item.title;
        modalCaption.textContent = `${item.title} - ${item.description}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // モーダルを閉じる
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 前の画像を表示
    function showPrevImage() {
        const paginatedData = getPaginatedData();
        currentIndex = (currentIndex - 1 + paginatedData.length) % paginatedData.length;
        const item = paginatedData[currentIndex];
        
        modalImg.src = item.src;
        modalImg.alt = item.title;
        modalCaption.textContent = `${item.title} - ${item.description}`;
    }

    // 次の画像を表示
    function showNextImage() {
        const paginatedData = getPaginatedData();
        currentIndex = (currentIndex + 1) % paginatedData.length;
        const item = paginatedData[currentIndex];
        
        modalImg.src = item.src;
        modalImg.alt = item.title;
        modalCaption.textContent = `${item.title} - ${item.description}`;
    }

    // イベントリスナーの設定
    function setupEventListeners() {
        // モーダル関連
        closeBtn.addEventListener('click', closeModal);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // モーダルの外側をクリックで閉じる
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'block') {
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                }
            }
        });
        
        // ページネーション
        prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
        nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    }

    // 初期化を実行
    initGallery();
});
