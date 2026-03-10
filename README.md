# ⏱️ Stop Timer - Modern Web Experience

A versatile, high-performance web-based timer application featuring both a nostalgic **Classic** experience and a sleek, feature-rich **Modern** interface.

![Version Selection](https://raw.githubusercontent.com/jet2511/Stop-timer-HTML/main/docs/preview.png) *(Note: Placeholder for actual preview image)*

## 🌟 Key Features

### ⚡ Modern Version
- **Glassmorphism UI**: A stunning, semi-transparent design with smooth animations.
- **Dark Mode**: High-contrast, easy-to-read dark theme (automatic & manual toggle).
- **Multilingual Support**: Fully localized in **English** and **Tiếng Việt**.
- **Responsive Design**: Optimized for desktops, tablets, and mobile devices.
- **Keyboard Shortcuts**: Press `Space` to start/pause the timer instantly.

### 🕰️ Classic Version
- **Original Experience**: Faithfully preserves the legacy Adobe Animate/Canvas implementation.
- **Nostalgic Feel**: Perfect for users who prefer the original functional design.

## 🛠️ Technology Stack
- **Languages**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Architecture**: ES Modules for clean, maintainable logic.
- **Utils**: Custom unified `Timer` engine and `i18n` translation system.
- **No Dependencies**: Lightweight and fast, no heavy frameworks required.

## 🚀 Getting Started

### Local Development
To run this project locally, you need a local server due to the implementation of **ES Modules**.

1. **Using Node.js**:
   ```bash
   npx serve .
   ```
2. **Using VS Code**:
   - Install the **Live Server** extension.
   - Open `index.html` and click **"Go Live"**.

### Deployment
This project is fully compatible with **GitHub Pages**. Simply push to your repository and enable Pages in settings. `index.html` serves as the entry point for version selection.

## 📁 Project Structure
- `index.html`: Version selection landing page.
- `index_modern.html`: The modern UI entry point.
- `classic.html`: The classic legacy version.
- `js/`: Modular JavaScript logic (`timer.js`, `app.js`, `i18n.js`, etc.).
- `css/`: Stylesheets for modern and landing interfaces.
- `sound/`: Audio assets for alarms.

---
*Inspired by Online-Stopwatch. Built with modern web standards.*