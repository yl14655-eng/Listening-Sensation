const SHEET_NAME = "Responses";

const HEADERS = [
    "Timestamp",
    "Participant ID",
    "Age Range",
    "Sex",
    "Has Pets",
    "Wants Pets",
    "Sound ID",
    "Emotion",
    "Picture",
    "Touch Sensation",
    "Temperature",
    "Feeling"
];

const SOUND_IDS = [
    "sound-01",
    "sound-02",
    "sound-03",
    "sound-04",
    "sound-05"
];

const EMOTIONS = [
    "Happiness",
    "Sadness",
    "Fear",
    "Calmness"
];

const TOUCH = [
    "Rumbling",
    "Pressure",
    "Sharpness",
    "Nothing"
];

const TEMPERATURES = [
    "Cold",
    "Cool",
    "Warm",
    "Hot"
];

const FEELINGS = [
    "Happy",
    "Relaxed",
    "Nervous",
    "Uncomfortable"
];

// ----------------------------
// RECEIVE SUBMISSION
// ----------------------------

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        validateData(data);

        const lock = LockService.getScriptLock();
        lock.waitLock(10000);

        try {
            const sheet = getResponseSheet();

            const existingIds = sheet.getLastRow() > 1
                ? sheet.getRange(
                    2,
                    2,
                    sheet.getLastRow() - 1,
                    1
                ).getValues().flat()
                : [];

            // Prevent duplicate submissions.
            if (existingIds.includes(data.participantId)) {
                return jsonResponse({
                    success: true,
                    duplicate: true
                });
            }

            const d = data.demographics;
            const timestamp = new Date();

            const rows = SOUND_IDS.map(id => {
                const a = data.sounds[id];

                return [
                    timestamp,
                    safeCell(data.participantId),
                    safeCell(d.age),
                    safeCell(d.sex),
                    safeCell(d.hasPets),
                    safeCell(d.wantsPets),
                    id,
                    safeCell(a.emotion),
                    safeCell(a.picture),
                    safeCell(a.touch),
                    safeCell(a.temperature),
                    safeCell(a.feeling)
                ];
            });

            sheet.getRange(
                sheet.getLastRow() + 1,
                1,
                rows.length,
                HEADERS.length
            ).setValues(rows);

            return jsonResponse({
                success: true,
                rowsSaved: rows.length
            });

        } finally {
            lock.releaseLock();
        }

    } catch (error) {
        console.error(error);

        return jsonResponse({
            success: false,
            error: "Submission could not be processed"
        });
    }
}

// ----------------------------
// VALIDATION
// ----------------------------

function validChoice(value, options) {
    // Four predefined options or a custom Other answer.
    return (
        typeof value === "string" &&
        value.trim().length > 0 &&
        value.length <= 200
    );
}

function validateData(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid payload");
    }

    if (
        typeof data.participantId !== "string" ||
        !/^P-[a-f0-9-]{36}$/i.test(data.participantId)
    ) {
        throw new Error("Invalid participant ID");
    }

    if (data.consent !== true) {
        throw new Error("Consent is required");
    }

    const d = data.demographics;

    if (!d) {
        throw new Error("Missing demographics");
    }

    if (![
        "Under 22",
        "22–50",
        "Over 50"
    ].includes(d.age)) {
        throw new Error("Invalid age");
    }

    if (![
        "Female",
        "Male",
        "Intersex",
        "Prefer not to say"
    ].includes(d.sex)) {
        throw new Error("Invalid sex");
    }

    if (!["Yes", "No"].includes(d.hasPets)) {
        throw new Error("Invalid pet response");
    }

    if (d.hasPets === "No") {
        if (!validChoice(d.wantsPets, [
            "Yes",
            "No",
            "Not sure"
        ])) {
            throw new Error("Invalid pet follow-up");
        }
    } else if (d.wantsPets !== "") {
        throw new Error("Unexpected pet follow-up");
    }

    if (!data.sounds) {
        throw new Error("Missing sound responses");
    }

    SOUND_IDS.forEach(id => {
        const a = data.sounds[id];

        if (!a) {
            throw new Error("Missing sound: " + id);
        }

        if (!validChoice(a.emotion, EMOTIONS)) {
            throw new Error("Invalid emotion");
        }

        if (!["A", "B", "C"].includes(a.picture)) {
            throw new Error("Invalid picture");
        }

        if (!validChoice(a.touch, TOUCH)) {
            throw new Error("Invalid touch sensation");
        }

        if (!validChoice(a.temperature, TEMPERATURES)) {
            throw new Error("Invalid temperature");
        }

        if (!validChoice(a.feeling, FEELINGS)) {
            throw new Error("Invalid feeling");
        }
    });
}

// ----------------------------
// SPREADSHEET SAFETY
// ----------------------------

function safeCell(value) {
    const text = String(value ?? "");

    if (/^\s*[=+\-@]/.test(text)) {
        return "'" + text;
    }

    return text;
}

// ----------------------------
// CREATE RESPONSE SHEET
// ----------------------------

function getResponseSheet() {
    const spreadsheet =
        SpreadsheetApp.getActiveSpreadsheet();

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
    } else {
        const existingHeaders = sheet.getRange(
            1, 1, 1, HEADERS.length
        ).getValues()[0];

        if (
            JSON.stringify(existingHeaders) !==
            JSON.stringify(HEADERS)
        ) {
            throw new Error(
                "The existing Responses sheet has a " +
                "different column structure. Rename the " +
                "old sheet before collecting new responses."
            );
        }
    }

    return sheet;
}

// ----------------------------
// JSON RESPONSE
// ----------------------------

function jsonResponse(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}