const app = document.getElementById("app");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");

let currentPage = -1;
let isSubmitting = false;
let language = "en";

const participantId = "P-" + crypto.randomUUID();

const answers = {
    participantId,
    consent: false,
    demographics: {
        age: "",
        sex: "",
        hasPets: "",
        wantsPets: ""
    },
    sounds: {}
};

CONFIG.sounds.forEach(sound => {
    answers.sounds[sound.id] = {
        emotion: "",
        picture: "",
        touch: "",
        temperature: "",
        feeling: ""
    };
});

// ------------------------------------
// TRANSLATIONS
// ------------------------------------

const translations = {
    en: {
        siteTitle: "Listening & Sensation",
        subtitle:
            "Exploring the relationship between sound, emotion, imagery, and physical sensation.",
        eyebrow: "SOUND PERCEPTION STUDY",

        welcome: "WELCOME",
        welcomeTitle: "Listening & Sensation",
        welcomeIntro:
            "Thank you for your interest in participating in this research questionnaire.",
        welcomeDescription:
            "This study explores how people associate different sounds with emotions, visual imagery, physical sensations, and temperature.",
        welcomeTask:
            "You will listen to five different audio clips and answer several questions about each sound.",
        beforeBegin: "Before you begin:",
        instructions: [
            "Please use headphones if possible.",
            "Find a quiet environment.",
            "You may replay each sound.",
            "There are no right or wrong answers.",
            "Your responses will be recorded anonymously."
        ],
        start: "Start Questionnaire",

        participant: "Participant Information",
        participantIntro:
            "Please answer a few questions before beginning the listening study.",
        age: "1. What is your age range?",
        sex: "2. What is your gender?",
        pets: "3. Do you currently have any pets?",
        wantsPets: "4. Would you like to have pets?",
        consent:
            "I voluntarily agree to participate in this questionnaire and understand that my responses will be used for research.",

        sound: "Sound",
        soundIntro:
            "Listen carefully to the audio below. You may replay it as many times as needed.",
        audioStimulus: "Audio Stimulus",

        emotion: "1. What emotion does this sound evoke?",
        picture:
            "2. Which of the following pictures best represents the audio?",
        pictureDescription:
            "Select the image you associate most strongly with the sound.",
        touch:
            "3. Do you associate any touch sensation with this sound?",
        temperature:
            "4. Do you associate a temperature with this sound?",
        feeling:
            "5. What do you feel when you hear this sound?",

        pictureLabel: "Picture",
        other: "Other",
        specify: "Please specify...",

        previous: "Previous",
        next: "Next",
        submit: "Submit Responses",

        complete: "Questionnaire Complete",
        completeMessage:
            "Thank you for completing all five listening sections.",
        ready:
            "Your responses are ready to submit. Please click the button below to send them to the research database.",
        participantId: "Participant ID",
        finalSubmission: "Final Submission",

        sending: "Sending...",
        sent: "Submission Sent",
        thankYou:
            "Thank you for participating in this sound perception study.",
        sentNotice:
            "Your submission request was sent. The browser cannot independently confirm that Google Sheets saved it.",
        close: "You may now close this page.",
        finished: "Finished",

        required: "Please answer all required questions.",
        petRequired: "Please answer the pet follow-up question.",
        consentRequired: "Please confirm your consent.",
        soundRequired:
            "Please answer all five questions. If you selected Other, please specify your answer.",
        endpointError:
            "Please configure the Google Apps Script URL.",
        submitError:
            "The submission could not be sent. Please check your connection and try again."
    },

    zh: {
        siteTitle: "聲音與感官體驗",
        subtitle:
            "探索聲音與情緒、視覺意象及身體感受之間的關係。",
        eyebrow: "聲音感知研究",

        welcome: "歡迎參與",
        welcomeTitle: "聲音與感官體驗",
        welcomeIntro:
            "感謝您願意參與這份研究問卷。",
        welcomeDescription:
            "本研究希望了解人們如何將不同的聲音與情緒、視覺意象、觸覺及溫度感受產生連結。",
        welcomeTask:
            "您將聆聽五段不同的聲音，並針對每段聲音回答幾個問題。",
        beforeBegin: "開始之前，請注意：",
        instructions: [
            "建議使用耳機聆聽。",
            "請盡量在安靜的環境中作答。",
            "每段聲音都可以重複播放。",
            "所有問題都沒有標準答案。",
            "您的回答將以匿名方式記錄。"
        ],
        start: "開始問卷",

        participant: "參與者基本資料",
        participantIntro:
            "開始聆聽之前，請先回答以下幾個問題。",
        age: "1. 您的年齡區間為何？",
        sex: "2. 您的生理性別為何？",
        pets: "3. 您目前有養寵物嗎？",
        wantsPets: "4. 您會想要養寵物嗎？",
        consent:
            "我自願參與本問卷，並了解我的回答將用於研究用途。",

        sound: "聲音",
        soundIntro:
            "請仔細聆聽以下聲音。您可以依照需要重複播放。",
        audioStimulus: "聲音片段",

        emotion: "1. 這段聲音讓您聯想到什麼情緒？",
        picture:
            "2. 以下哪一張圖片最能代表這段聲音？",
        pictureDescription:
            "請選擇您認為與這段聲音最有關聯的圖片。",
        touch:
            "3. 這段聲音讓您聯想到任何觸覺感受嗎？",
        temperature:
            "4. 這段聲音讓您聯想到某種溫度嗎？",
        feeling:
            "5. 聽到這段聲音時，您有什麼感受？",

        pictureLabel: "圖片",
        other: "其他",
        specify: "請輸入您的答案……",

        previous: "上一頁",
        next: "下一頁",
        submit: "提交問卷",

        complete: "問卷已完成",
        completeMessage:
            "感謝您完成全部五段聲音的問卷。",
        ready:
            "您的回答已準備好提交。請點擊下方按鈕，將回答送至研究資料庫。",
        participantId: "參與者編號",
        finalSubmission: "提交問卷",

        sending: "傳送中……",
        sent: "已送出提交請求",
        thankYou:
            "感謝您參與本次聲音感知研究。",
        sentNotice:
            "瀏覽器已送出提交請求，但無法直接確認 Google 試算表是否成功儲存資料。",
        close: "您現在可以關閉此頁面。",
        finished: "完成",

        required: "請回答所有必填問題。",
        petRequired: "請回答關於養寵物的後續問題。",
        consentRequired: "請確認您同意參與研究。",
        soundRequired:
            "請完成全部五個問題。如果選擇「其他」，請輸入您的答案。",
        endpointError:
            "請先設定 Google Apps Script 網址。",
        submitError:
            "無法送出回答。請確認網路連線後再試一次。"
    }
};

// Translations for answer choices.
// The keys remain English so saved data is consistent.

const optionTranslations = {
    "Under 22": "未滿 22 歲",
    "22–50": "22 至 50 歲",
    "Over 50": "超過 50 歲",

    "Female": "女性",
    "Male": "男性",
    "Intersex": "雙性人",
    "Prefer not to say": "不願透露",

    "Yes": "是",
    "No": "否",
    "Not sure": "不確定",

    "Happiness": "快樂",
    "Sadness": "悲傷",
    "Fear": "恐懼",
    "Calmness": "平靜",

    "Rumbling": "低沉震動",
    "Pressure": "壓迫感",
    "Sharpness": "尖銳感",
    "Nothing": "沒有觸覺感受",

    "Cold": "冰冷",
    "Cool": "涼爽",
    "Warm": "溫暖",
    "Hot": "炎熱",

    "Happy": "開心",
    "Relaxed": "放鬆",
    "Nervous": "緊張",
    "Uncomfortable": "不舒服"
};

function t(key) {
    return translations[language][key];
}

function translateOption(option) {
    if (language === "zh") {
        return optionTranslations[option] || option;
    }

    return option;
}

function setLanguage(newLanguage) {
    language = newLanguage;
    document.documentElement.lang =
        language === "zh" ? "zh-Hant" : "en";

    document.querySelector(".eyebrow").textContent =
        t("eyebrow");

    document.querySelector("h1").textContent =
        t("siteTitle");

    document.querySelector(".subtitle").textContent =
        t("subtitle");

    render();
}

// ------------------------------------
// HELPERS
// ------------------------------------

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function isOther(value, options) {
    return value !== "" && !options.includes(value);
}

function radioOptions(name, options, selected) {
    return options.map(option => `
        <label class="choice">
            <input
                type="radio"
                name="${name}"
                value="${escapeHTML(option)}"
                ${selected === option ? "checked" : ""}
            >
            <span>${escapeHTML(translateOption(option))}</span>
        </label>
    `).join("");
}

function radioWithOther(name, options, selected) {
    const otherSelected = isOther(selected, options);

    return `
        ${radioOptions(name, options, selected)}

        <label class="choice">
            <input
                type="radio"
                name="${name}"
                value="__other__"
                ${otherSelected ? "checked" : ""}
            >
            <span>${t("other")}</span>
        </label>

        <div
            id="${name}-other-container"
            class="other-input ${otherSelected ? "" : "hidden"}"
        >
            <input
                type="text"
                id="${name}-other"
                maxlength="200"
                placeholder="${t("specify")}"
                value="${otherSelected ? escapeHTML(selected) : ""}"
            >
        </div>
    `;
}

function attachOther(name) {
    const radios = app.querySelectorAll(
        `input[name="${name}"]`
    );

    const container = document.getElementById(
        `${name}-other-container`
    );

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            const selected = getRadio(name);

            container.classList.toggle(
                "hidden",
                selected !== "__other__"
            );

            if (selected === "__other__") {
                document.getElementById(
                    `${name}-other`
                ).focus();
            }
        });
    });
}

function getRadio(name) {
    return app.querySelector(
        `input[name="${name}"]:checked`
    )?.value || "";
}

function getAnswer(name) {
    const value = getRadio(name);

    if (value === "__other__") {
        return document.getElementById(
            `${name}-other`
        ).value.trim();
    }

    return value;
}

function showError(message) {
    const error = document.getElementById("error");

    if (error) {
        error.textContent = message;
    }
}

function navigationButtons(final = false) {
    return `
        <div class="actions">
            <button
                type="button"
                class="secondary"
                id="previous"
            >
                ${t("previous")}
            </button>

            <button type="button" id="next">
                ${final ? t("submit") : t("next")}
            </button>
        </div>

        <p id="error" class="error" role="alert"></p>
    `;
}

function attachNavigation() {
    document.getElementById("previous")
        ?.addEventListener("click", previousPage);

    document.getElementById("next")
        ?.addEventListener("click", nextPage);
}

function updateProgress() {
    const total = CONFIG.sounds.length + 2;

    if (currentPage === -1) {
        progressBar.style.width = "0%";
        progressLabel.textContent = t("welcome");
        return;
    }

    progressBar.style.width =
        `${((currentPage + 1) / total) * 100}%`;

    if (currentPage === 0) {
        progressLabel.textContent = t("participant");
    } else if (currentPage <= CONFIG.sounds.length) {
        progressLabel.textContent =
            `${t("sound")} ${currentPage} / ${CONFIG.sounds.length}`;
    } else {
        progressLabel.textContent = t("finalSubmission");
    }
}

// ------------------------------------
// PAGE RENDERING
// ------------------------------------

function render() {
    updateProgress();

    if (currentPage === -1) {
        renderOpening();
    } else if (currentPage === 0) {
        renderDemographics();
    } else if (currentPage <= CONFIG.sounds.length) {
        renderSound(currentPage - 1);
    } else {
        renderSubmission();
    }

    window.scrollTo(0, 0);
}

// ------------------------------------
// OPENING PAGE
// ------------------------------------

function renderOpening() {
    app.innerHTML = `
        <div class="opening-page">
            <div class="language-switch">
                <button
                    type="button"
                    class="language-btn ${language === "en" ? "active" : ""}"
                    id="lang-en"
                >
                    English
                </button>

                <button
                    type="button"
                    class="language-btn ${language === "zh" ? "active" : ""}"
                    id="lang-zh"
                >
                    繁體中文
                </button>
            </div>

            <p class="eyebrow">${t("welcome")}</p>

            <h2>${t("welcomeTitle")}</h2>

            <p>${t("welcomeIntro")}</p>

            <p>${t("welcomeDescription")}</p>

            <p>${t("welcomeTask")}</p>

            <div class="notice">
                <strong>${t("beforeBegin")}</strong>

                <ul>
                    ${t("instructions").map(item => `
                        <li>${item}</li>
                    `).join("")}
                </ul>
            </div>

            <div class="actions">
                <span></span>

                <button type="button" id="start">
                    ${t("start")}
                </button>
            </div>
        </div>
    `;

    document.getElementById("lang-en")
        .addEventListener("click", () => {
            setLanguage("en");
        });

    document.getElementById("lang-zh")
        .addEventListener("click", () => {
            setLanguage("zh");
        });

    document.getElementById("start")
        .addEventListener("click", () => {
            currentPage = 0;
            render();
        });
}

// ------------------------------------
// PARTICIPANT INFORMATION
// ------------------------------------

function renderDemographics() {
    const d = answers.demographics;

    app.innerHTML = `
        <h2>${t("participant")}</h2>

        <p class="question-description">
            ${t("participantIntro")}
        </p>

        <div class="question">
            <label class="question-title">
                ${t("age")}
            </label>

            ${radioOptions("age", [
                "Under 22",
                "22–50",
                "Over 50"
            ], d.age)}
        </div>

        <div class="question">
            <label class="question-title">
                ${t("sex")}
            </label>

            ${radioOptions("sex", [
                "Female",
                "Male",
                "Nonbinary",
                "Others"
            ], d.sex)}
        </div>

        <div class="question">
            <label class="question-title">
                ${t("pets")}
            </label>

            ${radioOptions("hasPets", [
                "Yes",
                "No"
            ], d.hasPets)}
        </div>

        <div class="question hidden" id="pet-followup">
            <label class="question-title">
                ${t("wantsPets")}
            </label>

            ${radioWithOther("wantsPets", [
                "Yes",
                "No",
                "Not sure"
            ], d.wantsPets)}
        </div>

        <div class="question">
            <label class="choice">
                <input
                    type="checkbox"
                    id="consent"
                    ${answers.consent ? "checked" : ""}
                >

                <span>${t("consent")}</span>
            </label>
        </div>

        ${navigationButtons()}
    `;

    function updatePetFollowup() {
        const hasPets = getRadio("hasPets");

        document.getElementById("pet-followup")
            .classList.toggle("hidden", hasPets !== "No");
    }

    app.querySelectorAll('input[name="hasPets"]')
        .forEach(input => {
            input.addEventListener(
                "change",
                updatePetFollowup
            );
        });

    attachOther("wantsPets");
    updatePetFollowup();
    attachNavigation();
}

// ------------------------------------
// AUDIO QUESTIONS
// ------------------------------------

function renderSound(index) {
    const sound = CONFIG.sounds[index];
    const a = answers.sounds[sound.id];

    const pictureOptions = sound.images.map((image, i) => {
        const letter = ["A", "B", "C"][i];

        return `
            <label class="image-option">
                <input
                    type="radio"
                    name="picture"
                    value="${letter}"
                    ${a.picture === letter ? "checked" : ""}
                >

                <img
                    src="${escapeHTML(image)}"
                    alt="${t("pictureLabel")} ${letter}"
                >

                <span>${t("pictureLabel")} ${letter}</span>
            </label>
        `;
    }).join("");

    app.innerHTML = `
        <h2>
            ${t("sound")} ${String(index + 1).padStart(2, "0")}
        </h2>

        <p class="question-description">
            ${t("soundIntro")}
        </p>

        <div class="audio-container">
            <p>${t("audioStimulus")} ${index + 1}</p>

            <audio
                controls
                preload="metadata"
                src="${escapeHTML(sound.audio)}"
            ></audio>
        </div>

        <div class="question">
            <label class="question-title">
                ${t("emotion")}
            </label>

            ${radioWithOther(
                "emotion",
                CONFIG.emotions,
                a.emotion
            )}
        </div>

        <div class="question">
            <label class="question-title">
                ${t("picture")}
            </label>

            <p class="question-description">
                ${t("pictureDescription")}
            </p>

            <div class="image-grid">
                ${pictureOptions}
            </div>
        </div>

        <div class="question">
            <label class="question-title">
                ${t("touch")}
            </label>

            ${radioWithOther(
                "touch",
                CONFIG.touchSensations,
                a.touch
            )}
        </div>

        <div class="question">
            <label class="question-title">
                ${t("temperature")}
            </label>

            ${radioWithOther(
                "temperature",
                CONFIG.temperatures,
                a.temperature
            )}
        </div>

        <div class="question">
            <label class="question-title">
                ${t("feeling")}
            </label>

            ${radioWithOther(
                "feeling",
                CONFIG.feelings,
                a.feeling
            )}
        </div>

        ${navigationButtons()}
    `;

    [
        "emotion",
        "touch",
        "temperature",
        "feeling"
    ].forEach(attachOther);

    attachNavigation();
}

// ------------------------------------
// SAVE ANSWERS
// ------------------------------------

function saveCurrentPage() {
    if (currentPage === 0) {
        const d = answers.demographics;

        d.age = getRadio("age");
        d.sex = getRadio("sex");
        d.hasPets = getRadio("hasPets");

        d.wantsPets = d.hasPets === "No"
            ? getAnswer("wantsPets")
            : "";

        answers.consent =
            document.getElementById("consent").checked;

        return;
    }

    if (
        currentPage >= 1 &&
        currentPage <= CONFIG.sounds.length
    ) {
        const sound = CONFIG.sounds[currentPage - 1];
        const a = answers.sounds[sound.id];

        a.emotion = getAnswer("emotion");
        a.picture = getRadio("picture");
        a.touch = getAnswer("touch");
        a.temperature = getAnswer("temperature");
        a.feeling = getAnswer("feeling");
    }
}

// ------------------------------------
// VALIDATION
// ------------------------------------

function validateCurrentPage() {
    if (currentPage === 0) {
        const d = answers.demographics;

        if (!d.age || !d.sex || !d.hasPets) {
            showError(t("required"));
            return false;
        }

        if (d.hasPets === "No" && !d.wantsPets) {
            showError(t("petRequired"));
            return false;
        }

        if (!answers.consent) {
            showError(t("consentRequired"));
            return false;
        }

        return true;
    }

    if (
        currentPage >= 1 &&
        currentPage <= CONFIG.sounds.length
    ) {
        const sound = CONFIG.sounds[currentPage - 1];
        const a = answers.sounds[sound.id];

        if (
            !a.emotion ||
            !a.picture ||
            !a.touch ||
            !a.temperature ||
            !a.feeling
        ) {
            showError(t("soundRequired"));
            return false;
        }

        return true;
    }

    return true;
}

// ------------------------------------
// NAVIGATION
// ------------------------------------

function nextPage() {
    if (isSubmitting) return;

    saveCurrentPage();

    if (!validateCurrentPage()) {
        return;
    }

    if (currentPage === CONFIG.sounds.length + 1) {
        submitResponses();
        return;
    }

    currentPage++;
    render();
}

function previousPage() {
    if (currentPage <= -1 || isSubmitting) return;

    if (currentPage <= CONFIG.sounds.length) {
        saveCurrentPage();
    }

    currentPage--;
    render();
}

// ------------------------------------
// FINAL PAGE
// ------------------------------------

function renderSubmission() {
    app.innerHTML = `
        <h2>${t("complete")}</h2>

        <p>${t("completeMessage")}</p>

        <div class="notice">
            ${t("ready")}
        </div>

        <p>
            ${t("participantId")}:
            <strong>${escapeHTML(participantId)}</strong>
        </p>

        ${navigationButtons(true)}
    `;

    attachNavigation();
}

// ------------------------------------
// SUBMIT TO GOOGLE SHEETS
// ------------------------------------

async function submitResponses() {
    if (isSubmitting) return;

    if (
        !CONFIG.endpoint.startsWith(
            "https://script.google.com/"
        )
    ) {
        showError(t("endpointError"));
        return;
    }

    isSubmitting = true;

    const button = document.getElementById("next");
    button.disabled = true;
    button.textContent = t("sending");

    const payload = {
        ...answers,
        submittedAt: new Date().toISOString()
    };

    try {
        await fetch(CONFIG.endpoint, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(payload)
        });

        app.innerHTML = `
            <h2>${t("sent")}</h2>

            <p>${t("thankYou")}</p>

            <div class="notice">
                ${t("sentNotice")}
            </div>

            <p>
                ${t("participantId")}:
                <strong>${escapeHTML(participantId)}</strong>
            </p>

            <p>${t("close")}</p>
        `;

        progressBar.style.width = "100%";
        progressLabel.textContent = t("finished");

    } catch (error) {
        showError(t("submitError"));

        button.disabled = false;
        button.textContent = t("submit");
    } finally {
        isSubmitting = false;
    }
}

// ------------------------------------
// START
// ------------------------------------

render();
