document.addEventListener("DOMContentLoaded", function () {
    const moodButtons = document.querySelectorAll(".mood-btn");
    const moodHistory = document.getElementById("mood-history");
    const calendar = document.getElementById("calendar");
    const paragraph = document.getElementById("summary")

    const savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || [];
    
    function updateMoodHistory() {
        moodHistory.innerHTML = "";
        savedMoods.forEach((entry) => {
            const li = document.createElement("li");
            li.textContent = `${entry.date} - ${entry.mood}`;
            moodHistory.appendChild(li);
        });
    }

    updateMoodHistory();

    moodButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const mood = this.getAttribute("data-mood");
        const moodType = this.getAttribute("data-mood-type") || mood;
        const today = new Date().toISOString().split("T")[0];

        const existingEntryIndex = savedMoods.findIndex(entry => entry.date === today);
        if (existingEntryIndex !== -1) {
            savedMoods[existingEntryIndex].mood = mood;
            savedMoods[existingEntryIndex].moodType = moodType;
        } else {
            savedMoods.push({ date: today, mood, moodType });
        }

        localStorage.setItem("moodHistory", JSON.stringify(savedMoods));
        updateMoodHistory();
        generateCalendar();
        updateText()
    });
    });

    function generateCalendar() {
        calendar.innerHTML = "";

        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const numDays = lastDay.getDate();

        for (let i = 1; i <= numDays; i++) {
            const dayBox = document.createElement("div");
            dayBox.classList.add("calendar-day");
            dayBox.textContent = i;

            const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
            const moodEntry = savedMoods.find(entry => entry.date === dateKey);

            if (moodEntry) {
                dayBox.textContent = moodEntry.mood; 
                dayBox.classList.add("has-mood");
            }

            calendar.appendChild(dayBox);
        }
    }

    function updateText() {
        if (savedMoods[0].moodType.trim() === "excited") {
        paragraph.innerText= "Zindagi ek dum mast chal rahi hai, bas paise thode aur aa jayein toh aur bhi mast ho jaaye! 😆💸"
    } else if (savedMoods[0].moodType.trim() === "sad") {
        paragraph.innerText = "dekho jindagi ek kiraya ka ghar hai"
    } else if (savedMoods[0].moodType.trim() === "happy") {
        paragraph.innerText = "da denge choco 🍫"
    } else if (savedMoods[0].moodType.trim() === "normal") {
        paragraph.innerText = "tum bus chill karo life mai 😌"
    } else {
        paragraph.innerText = "juice pila do mosambi ka 🍊"
    }
    }

    generateCalendar();
    updateText();
});
