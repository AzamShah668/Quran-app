window.initSurahViewer = function() {
    var id = localStorage.getItem('currentSurahId');
    var name = localStorage.getItem('currentSurahName');
    
    var nameEl = document.getElementById('view-surah-name');
    var metaEl = document.getElementById('view-surah-meta');
    var container = document.getElementById('quran-container');

    if (!id || !container) return;
    
    nameEl.innerText = name;
    metaEl.innerText = "Surah Number " + id;

    // Fetch Arabic and English simultaneously
    Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`).then(res => res.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${id}/en.sahih`).then(res => res.json())
    ])
    .then(([arabicData, englishData]) => {
        container.innerHTML = ""; // Clear loader text

        var ayahsAr = arabicData.data.ayahs;
        var ayahsEn = englishData.data.ayahs;

        ayahsAr.forEach((ayah, index) => {
            var verseDiv = document.createElement('div');
            verseDiv.className = "display-card";
            verseDiv.style.cssText = "background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 10px;";
            
            verseDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="background: var(--primary-green); color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem;">${ayah.numberInSurah}</span>
                </div>
                <p style="direction: rtl; font-size: 1.8rem; line-height: 2.5; margin-bottom: 15px; font-family: 'Amiri', serif;">
                    ${ayah.text}
                </p>
                <p style="direction: ltr; font-size: 1rem; color: #555; line-height: 1.6; border-top: 1px solid #f0f0f0; padding-top: 15px;">
                    ${ayahsEn[index].text}
                </p>
            `;
            container.appendChild(verseDiv);
        });
    })
    .catch(err => {
        container.innerHTML = "<p style='text-align:center; color:red;'>Failed to load verses. Check your internet.</p>";
        console.error("Quran API Error:", err);
    });
};