document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const filter = searchInput.value.toLowerCase();
            const birdCards = document.querySelectorAll('.bird-card');

            birdCards.forEach(card => {
                const birdName = card.querySelector('h3').textContent.toLowerCase();
                if (birdName.includes(filter)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
