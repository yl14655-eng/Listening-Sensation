# Sound & Sensation — GitHub Pages audio questionnaire

## 1. Add audio
Put your MP3 files in `audio/` and name them `sound-01.mp3`, `sound-02.mp3`, `sound-03.mp3`. Or change the paths in `config.js`. Use audio you have permission to publish. Audio in a public GitHub Pages site is publicly accessible.

## 2. Create private response spreadsheet
1. Create a new Google Sheet named `Sound Study Responses`. Keep **General access: Restricted**. Do not publish or share it with participants.
2. Open **Extensions → Apps Script**.
3. Replace the editor content with the contents of `Code.gs` and save.
4. Select **Deploy → New deployment → Web app**.
5. Choose **Execute as: Me** and **Who has access: Anyone**. Authorize the script. (Anyone is needed for anonymous submissions; it makes the endpoint public, NOT the spreadsheet.)
6. Copy the deployed **web app URL** ending in `/exec` into `STUDY_CONFIG.endpoint` in `config.js`.
7. IMPORTANT: If you change `Code.gs`, update the deployment to a new version via **Deploy → Manage deployments → Edit → New version**.

## 3. Publish the website
1. Create a new GitHub repository. Upload `index.html`, `style.css`, `app.js`, `config.js`, and the `audio` folder with your audio files. Do NOT upload `Code.gs` unless you intentionally want the server source public; it is not needed on GitHub.
2. In GitHub **Settings → Pages**, select **Deploy from a branch**, `main`, `/ (root)`, then save.
3. Visit `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` after Pages deploys.
4. Complete a test submission and check your private Sheet for 3 rows with the same participant ID.

## Customize
- Change clips, audio paths, question labels and question options in `config.js`.
- If you add/remove clips, update `EXPECTED_CLIPS` in `Code.gs`.
- If you add/remove question IDs, update `EXPECTED_QUESTIONS` in `Code.gs`.
- Redeploy Apps Script after editing `Code.gs`.
- The questionnaire is anonymous by default; do not ask for personal details unless you have an appropriate consent/privacy process.

## Privacy & security limits
- GitHub Pages files and audio are public. Never place API secrets, participant answers, or your private spreadsheet link in the repository.
- The Google Sheet is private if its sharing settings remain Restricted, but the Apps Script endpoint accepts public POST requests. It is not authentication, and spam/forged submissions are possible. This is suitable for a small low-risk study, not for sensitive data or strict participant access control.
- The browser uses `fetch(..., mode:'no-cors')`. A completed fetch does **not** prove the sheet received the submission. Check a test response in the Sheet before distributing the questionnaire.
- The backend prevents spreadsheet formula injection in participant text and duplicate participant IDs. No IP addresses, emails, or names are intentionally collected by the code. Hosting providers may still maintain technical access logs.
- Avoid changing the live questionnaire during data collection; version your study if question wording changes.
