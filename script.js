const textarea = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
const languageSelect = document.getElementById("languageSelect");
const voiceSelect = document.getElementById("voiceSelect");
const generateButton = document.getElementById("generateButton");
const errorMessage = document.getElementById("errorMessage");
const audioContainer = document.getElementById("audioContainer");
const audioPlayer = document.getElementById("audioPlayer");

let MAX_CHARS = 500;
let voices = [];
let currentAudio = null;

// --------------------------------------------------
// Character counter
// --------------------------------------------------
textarea.addEventListener("input", () => {
    const length = textarea.value.length;
    charCount.textContent = `${length} / ${MAX_CHARS}`;
});

// --------------------------------------------------
// Languages
// --------------------------------------------------
    const languageNames = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese"
    };

function populateLanguages() {
    languageSelect.innerHTML = `
        <option value="">Select language</option>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="pt">Portuguese</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="zh">Chinese</option>
    `;
}

// --------------------------------------------------
// Load ElevenLabs voices
// --------------------------------------------------

async function loadVoices() {
    try {
        
        voices = await puter.ai.txt2speech.listVoices({
            provider: "elevenlabs"
        });

        if (!voices || voices.length === 0) {
            throw new Error("No ElevenLabs voices were returned by Puter.");
        }

        populateLanguages();

        // IMPORTANT:
        // Show ALL voices.
        // Do not filter voices by language.
        populateVoices();  
    } catch (error) {    
        showError(error.message || "Failed to load voices.");
    }
}

// --------------------------------------------------
// Populate voice dropdown
// --------------------------------------------------
function populateVoices() {
    voiceSelect.innerHTML = `<option value="">Select voice</option>`;

    voices.forEach((voice) => {
        const option = document.createElement("option");

        option.value = voice.id;

        // Show voice name
        option.textContent = voice.name;

        voiceSelect.appendChild(option);
    });
}

async function translateText(text, targetLanguage) {
const languageName = languageNames[targetLanguage];

if (!languageName) {
    throw new Error("Invalid target language.");
}

const prompt = `
Translate the following text into ${languageName}.

Important rules:
Return ONLY the translated text.
Do not add explanations.
Do not add quotation marks.
Preserve the original meaning.
Preserve the original tone.
Do not summarize.
Do not transliterate.
If Profanity found beep it.
Write using the normal writing system of ${languageName}.

Text:
${text}
`;

const response = await puter.ai.chat(prompt, {
    model: "gpt-5-nano"
});

// Puter chat responses can contain the result in different forms.
let translatedText = "";

if (typeof response === "string") {
    translatedText = response;
} else if (response?.message?.content) {
    translatedText = response.message.content;
} else if (response?.content) {
    translatedText = response.content;
} else if (response?.text) {
    translatedText = response.text;
}

if (!translatedText) {
    throw new Error("Translation returned an empty result.");
}

return translatedText.trim();
}

// --------------------------------------------------
// Generate speech
// --------------------------------------------------

generateButton.addEventListener("click", async () => {

    clearError();

    const text = textarea.value.trim();
    const voiceId = voiceSelect.value;
    const language = languageSelect.value;

    // --------------------------------------------------
    // Validation
    // --------------------------------------------------
    if (!text) {
        showError("Please enter some text.");
        textarea.focus();
        return;
    }

    if (text.length > MAX_CHARS) {
        showError(`Text cannot exceed ${MAX_CHARS} characters.`);
        textarea.focus();
        return;
    }

    if (!language) {
        showError("Please select a language.");
        languageSelect.focus();
        return;
    }

    if (!voiceId) {
        showError("Please select a voice.");
        voiceSelect.focus();
        return;
    }

    try {
        generateButton.disabled = true;
        generateButton.textContent = "Generating...";

        // --------------------------------------------------
        // Stop previous audio
        // --------------------------------------------------
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }

        audioPlayer.pause();
        audioPlayer.currentTime = 0;

        // --------------------------------------------------
        // Add language instruction
        // --------------------------------------------------
        const translatedText = await translateText(text,language);

        // --------------------------------------------------
        // Generate speech
        // --------------------------------------------------
        currentAudio = await puter.ai.txt2speech(
            translatedText,
            {
                provider: "elevenlabs",

                // Multilingual ElevenLabs model
                model: "eleven_multilingual_v2",

                // User-selected voice
                voice: voiceId,

                // MP3 output
                output_format: "mp3_44100_128"
            }
        );

        // --------------------------------------------------
        // Play audio
        // --------------------------------------------------
        audioPlayer.src = currentAudio.src;
        audioContainer.hidden = false;

        // Reset player to beginning
        audioPlayer.currentTime = 0;
        generateButton.textContent = "Playing...";
        await audioPlayer.play();

        // --------------------------------------------------
        // Audio finished
        // --------------------------------------------------
        audioPlayer.onended = () => {
            generateButton.disabled = false;
            generateButton.textContent = "Generate";
            currentAudio = null;
        };
    } catch (error) {

        showError(error.message || "Failed to generate speech.");

        generateButton.disabled = false;
        generateButton.textContent = "Generate";
    }
});

// --------------------------------------------------
// Error handling
// --------------------------------------------------
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

// --------------------------------------------------
// Start application
// --------------------------------------------------
loadVoices();