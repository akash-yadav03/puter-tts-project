# Text-to-Speech (TTS) Web Application

A simple browser-based text-to-speech application built with vanilla HTML, CSS, and JavaScript using **[puter.js](https://puter.com/docs)** for cloud-powered voice synthesis.

---

## 📖 Overview

This project demonstrates how to integrate **puter.js** into a client-side TTS application. It allows users to input text and convert it to speech directly in the browser using cloud-enhanced APIs provided by Puter.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎤 **Voice Input** | Type or paste any text to convert into spoken audio |
| 🔊 **Play/Pause/Stop** | Full playback controls for the speech output |
| ⚡ **Cloud-Powered** | Uses puter.js for enhanced TTS capabilities |
| 🌐 **Cross-Browser** | Works on modern browsers (Chrome, Firefox, Edge, Safari) |
| 💾 **Client-Side** | No backend required – runs entirely in the browser |

---

## 🛠️ Prerequisites

- A web browser with **JavaScript enabled**
- An internet connection (puter.js requires network access)
- No build tools or package managers needed

---

## 📁 Project Structure

```
tts-project/
├── index.html        # Main HTML structure
├── styles.css        # Styling and layout
├── script.js         # TTS logic with puter.js integration
└── README.md
```

---

## 🚀 Getting Started

### Step 1: Clone or Download

```bash
# Clone the repository (if applicable)
git clone <your-repo-url>

# Or download as ZIP and extract
```

### Step 2: Include puter.js

Add this script tag to your `index.html` `<head>` section:

```html
<script src="https://js.puter.com/v2/"></script>
```

### Step 3: Open the Project

Simply open `index.html` in your browser:

```bash
# Using a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000

# Or double-click index.html (may have CORS limitations)
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **[Puter.js](https://js.puter.com)** – Cloud platform powering the TTS functionality
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)** – Browser-native TTS support
- The open-source community

---

> ⚠️ **Note:** Browser support for Web Speech API varies. For consistent results, test across Chrome, Firefox, and Edge.
