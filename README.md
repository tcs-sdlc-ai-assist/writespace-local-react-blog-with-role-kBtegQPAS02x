# WriteSpace

A distraction-free writing application built with React and Vite. WriteSpace provides a clean, minimal environment for focused writing with automatic local storage persistence.

## Features

- **Distraction-Free Editor** — Clean, minimal writing interface with no unnecessary UI clutter
- **Auto-Save to localStorage** — Your writing is automatically saved as you type, so you never lose work
- **Document Management** — Create, edit, rename, and delete multiple documents
- **Word & Character Count** — Real-time statistics displayed unobtrusively
- **Dark Mode Support** — Toggle between light and dark themes for comfortable writing in any environment
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices
- **Markdown Support** — Write in Markdown with live preview
- **Focus Mode** — Hide all UI elements except the editor for maximum concentration

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **JavaScript (ES6+)** — Language
- **Tailwind CSS** — Utility-first styling
- **React Router** — Client-side routing
- **localStorage** — Client-side persistence (no backend required)

## Folder Structure

```
writespace/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Editor.jsx       # Main writing editor component
│   │   ├── Sidebar.jsx      # Document list sidebar
│   │   ├── Toolbar.jsx      # Editor toolbar (formatting, stats)
│   │   ├── DocumentCard.jsx # Document preview card
│   │   └── ThemeToggle.jsx  # Dark/light mode toggle
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.js    # localStorage read/write hook
│   │   ├── useDocuments.js       # Document CRUD operations
│   │   ├── useAutoSave.js        # Auto-save debounce logic
│   │   └── useWordCount.js       # Word/character counting
│   ├── pages/               # Route-level page components
│   │   ├── HomePage.jsx     # Landing/dashboard page
│   │   ├── EditorPage.jsx   # Writing editor page
│   │   └── NotFoundPage.jsx # 404 page
│   ├── context/             # React context providers
│   │   ├── ThemeContext.jsx  # Theme state management
│   │   └── DocumentContext.jsx # Document state management
│   ├── utils/               # Utility functions
│   │   ├── storage.js       # localStorage helpers
│   │   ├── markdown.js      # Markdown parsing utilities
│   │   └── constants.js     # App-wide constants
│   ├── App.jsx              # Root component with router
│   ├── main.jsx             # Entry point (renders App)
│   └── index.css            # Tailwind directives and global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
# Create a production build
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## localStorage Schema

All data is persisted in the browser's localStorage under the following keys:

### `writespace_documents`

An array of document objects:

```json
[
  {
    "id": "uuid-string",
    "title": "Document Title",
    "content": "The full text content of the document...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:45:00.000Z"
  }
]
```

| Field       | Type     | Description                              |
|-------------|----------|------------------------------------------|
| `id`        | `string` | Unique identifier (UUID v4)              |
| `title`     | `string` | Document title, user-editable            |
| `content`   | `string` | Full document body text (Markdown)       |
| `createdAt` | `string` | ISO 8601 timestamp of creation           |
| `updatedAt` | `string` | ISO 8601 timestamp of last modification  |

### `writespace_theme`

A string value for the current theme preference:

```json
"dark"
```

| Value    | Description          |
|----------|----------------------|
| `"light"` | Light mode (default) |
| `"dark"`  | Dark mode            |

### `writespace_settings`

A JSON object for user preferences:

```json
{
  "fontSize": 18,
  "fontFamily": "serif",
  "autoSaveInterval": 2000,
  "showWordCount": true
}
```

| Field              | Type      | Default   | Description                          |
|--------------------|-----------|-----------|--------------------------------------|
| `fontSize`         | `number`  | `18`      | Editor font size in pixels           |
| `fontFamily`       | `string`  | `"serif"` | Editor font family                   |
| `autoSaveInterval` | `number`  | `2000`    | Auto-save debounce delay in ms       |
| `showWordCount`    | `boolean` | `true`    | Whether to display word count stats  |

## Route Map

| Path           | Component       | Description                          |
|----------------|-----------------|--------------------------------------|
| `/`            | `HomePage`      | Dashboard with document list         |
| `/editor/:id`  | `EditorPage`    | Writing editor for a specific document |
| `*`            | `NotFoundPage`  | 404 — page not found                 |

## Scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start Vite dev server              |
| `npm run build`   | Build for production               |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint                         |

## License

Private — All rights reserved.