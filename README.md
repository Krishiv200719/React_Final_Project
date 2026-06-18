# Regex Sandbox — Syntax Highlighter & Tester

## Project Description

**Regex Sandbox** is a powerful, client-side web application for building, testing, and understanding regular expressions. 

Its primary purpose is to provide an interactive, visual environment where developers and learners can write regex patterns and instantly see how they evaluate against test strings. Designed with a warm, nature-inspired modern aesthetic, the application removes the intimidation factor of complex regex syntax through real-time feedback, plain-English explanations, and color-coded tokenization.

### Intended Users
- **Developers:** For quickly prototyping and debugging regex patterns without leaving the browser.
- **Learners:** For understanding what each part of a regex does via the built-in explainer and cheat sheet.
- **Data Analysts/Writers:** For safely building text extraction rules.

### Main Functionality
- **Live Regex Evaluation:** Type a pattern and instantly see matches highlighted in your test text.
- **Syntax Highlighting:** Regex patterns are tokenized and color-coded (e.g., quantifiers, character classes, groups).
- **Capture Group Visualization:** Matches are broken down by capture groups with distinct colors to help visualize nested extractions.
- **Plain-English Explainer:** Automatically translates complex patterns into a step-by-step human-readable breakdown.
- **Safe Execution:** Includes a catastrophic backtracking guard (2000ms timeout) and limits to 500 matches to prevent browser crashes.
- **Snippet Management:** Save, rename, and load your favorite patterns entirely within local storage.
- **Interactive Cheat Sheet:** Built-in reference for common regex tokens with one-click injection into the editor.

## Features

| Category | Features |
| :--- | :--- |
| **Core Regex** | Live matching, global/multiline/case-insensitive flags, capture group parsing |
| **Visual Aids** | Token syntax highlighting, layered match highlighting, interactive match tree viewer |
| **Educational** | Step-by-step plain English explainer, clickable regex cheat sheet |
| **Storage** | Local browser storage for saving, renaming, deleting, and loading snippets |
| **Safety** | Execution timeout guards, regex compilation error handling, match limits |

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React (v19.x) |
| **Build Tool** | Vite |
| **State Management** | React Hooks (`useState`, `useMemo`, `useCallback`) |
| **Styling** | Vanilla CSS (CSS Variables, Modern Flex/Grid Layouts) |
| **Database / Storage** | Browser `localStorage` (via custom `storageManager.js`) |
| **Backend / API** | None (100% Client-Side) |
| **Authentication** | None |

## Project Structure

```text
React_Final/
├── index.html                # Main HTML entry point
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite bundler configuration
├── eslint.config.js          # ESLint rules
├── public/                   # Static assets (favicon, etc.)
└── src/                      
    ├── main.jsx              # React mounting point
    ├── App.jsx               # Main application component & layout state
    ├── index.css             # Global stylesheet (Warm theme design system)
    ├── components/           # UI Components
    │   ├── CheatSheet.jsx       # Reference accordion & injection logic
    │   ├── ExplanationPanel.jsx # Plain-English breakdown UI
    │   ├── LandingPage.jsx      # Initial splash screen
    │   ├── MatchTree.jsx        # Tree view of matches and capture groups
    │   ├── RegexInputBar.jsx    # Tokenized input & flags toggle
    │   ├── SavedSnippets.jsx    # Local storage UI manager
    │   └── TestInputCard.jsx    # Layered highlighting textarea
    └── utils/                # Core Business Logic
        ├── regexEvaluator.js    # Safe RegExp compilation & evaluation loop
        ├── regexExplainer.js    # Translates tokens to english phrases
        ├── regexTokenizer.js    # Parses raw string into regex token types
        └── storageManager.js    # localStorage CRUD wrapper
```

### Key Directories
- `src/components/`: Contains all modular UI components. The app is highly componentized, separating the editor, tree viewers, and static overlays.
- `src/utils/`: The core engine of the application. The tokenizer and evaluator logic live here, fully abstracted from the React UI.

## Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Setup Instructions
1. Clone the repository or navigate to the project directory:
   ```bash
   cd React_Final
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
This project does not require any environment variables. All features run natively in the browser without external API dependencies.

## Running the Project

### Development
To start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173` or `http://localhost:5174`.

### Build for Production
To bundle the application for production deployment:
```bash
npm run build
```
The compiled static files will be placed in the `dist/` directory.

### Preview Production Build
To serve the production build locally:
```bash
npm run preview
```

### Testing & Linting
To run the ESLint checker:
```bash
npm run lint
```

## Database Documentation

This project does not use a traditional database. It relies entirely on the browser's `localStorage`.

### LocalStorage Collections
- **Key:** `regex_sandbox_snippets`
- **Format:** Array of JSON objects.
- **Model:**
  ```json
  {
    "id": "string (UUID or timestamp)",
    "name": "string (User-defined name)",
    "pattern": "string (Raw regex string)",
    "flags": "string (e.g., 'g', 'i')",
    "testText": "string",
    "createdAt": "ISO 8601 Date String",
    "updatedAt": "ISO 8601 Date String"
  }
  ```

## Architecture Overview

The application follows a strict unidirectional data flow using React:

1. **State Management (`App.jsx`):** Holds the source of truth for the `pattern`, `flags`, and `testText`.
2. **Tokenizer Pipeline (`regexTokenizer.js`):** The raw `pattern` string is parsed into an array of lexical tokens (quantifiers, anchors, classes) on every change. 
3. **Explainer Pipeline (`regexExplainer.js`):** The token array is mapped to human-readable strings to populate the `ExplanationPanel`.
4. **Evaluation Engine (`regexEvaluator.js`):** The `pattern` and `flags` are safely compiled into a JS `RegExp`. The `testText` is evaluated, extracting full matches and inner capture groups while guarding against infinite loops.
5. **Presentation Layer:** The derived data is fed down into `RegexInputBar` (for syntax highlighting) and `TestInputCard` (for layered text highlighting).

## Screenshots Section

*(Add screenshots of your application here)*

- **Landing Page:** 
  `![Landing Page](./docs/landing-page.png)`
- **Sandbox Editor:** 
  `![Sandbox Editor](./docs/sandbox-editor.png)`
- **Match Tree & Explanation:** 
  `![Match Tree Analysis](./docs/match-tree.png)`

## Deployment

Since this is a 100% static frontend application, it can be deployed to any static hosting provider.

### General Steps:
1. Run the build command:
   ```bash
   npm run build
   ```
2. Upload the contents of the `dist/` folder to your hosting provider.

### Recommended Platforms:
- **Vercel / Netlify:** Connect the repository and set the build command to `npm run build` and publish directory to `dist`.
- **Firebase Hosting:** Run `firebase init hosting`, set the public directory to `dist`, and run `firebase deploy`.

## Security Considerations

- **Authentication/Authorization:** None. The app is a public tool with no user accounts.
- **Catastrophic Backtracking:** The core regex evaluation engine (`regexEvaluator.js`) includes a strict `2000ms` performance timer. If an evaluation exceeds this limit, the loop breaks gracefully and returns a warning to the user, preventing browser thread lockups.
- **Cross-Site Scripting (XSS):** React handles text rendering safely by default. The layered highlight text block injects specific `<mark>` tags but relies heavily on React's automatic string escaping.
- **Data Privacy:** Because all snippet saves utilize `localStorage`, no user data or sensitive test texts are ever transmitted over a network.

## Troubleshooting

- **Server Connection Refused on Port 5173:** 
  Vite will automatically jump to port `5174` or `5175` if `5173` is occupied. Check your terminal output for the exact `Local` URL.
- **Regex Highlight Desync:**
  If the color-coded tokens in the input bar do not perfectly align with the typed text, ensure that your browser is not applying custom CSS tracking/letter-spacing, as the UI relies on an exact overlay mechanism.
- **Failed to Save Snippets:**
  If snippets are not saving, ensure you are not running your browser in a strict "Incognito/Private" mode that blocks `localStorage` APIs.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.
