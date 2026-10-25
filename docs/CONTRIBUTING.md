# Contributing to Nudi (ನುಡಿ)

Thank you for your interest in contributing to **Nudi (ನುಡಿ)** — the situation-first Kannada learning companion for newcomers to Karnataka!

We welcome contributions of all kinds: new phrases, linguistic corrections, pronunciation hints, accessibility improvements, bug fixes, and documentation updates.

---

## Code of Conduct

All contributors and community participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all fellow contributors and language learners with kindness, respect, and patience.

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Go**: v1.21 or higher (for running the phrase validator CLI in `tools/validate/`)
- Modern web browser with Web Speech API support (Google Chrome or Microsoft Edge recommended for `kn-IN` voice)

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ankush-dev-eng/nudi-kannada.git
   cd nudi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```text
nudi/
├── src/
│   ├── components/         # Reusable UI components & layouts
│   │   ├── common/         # Buttons, badges, modals, waveforms
│   │   ├── layout/         # Header, Navigation, Footer, Container
│   │   ├── learn/          # Phrase flip card, pagination, audio speed
│   │   ├── roleplay/       # RoleplayEngine state machine
│   │   ├── review/         # Spaced repetition flashcard deck
│   │   ├── script/         # Akshara reference & sign quiz
│   │   └── speak/          # SpeakPractice recording & scoring
│   ├── data/
│   │   ├── phrases.json    # Canonical dataset of phrases & roleplays
│   │   ├── script.json     # Kannada alphabet & signs dataset
│   │   └── tips.json       # Cultural etiquette & survival tips
│   ├── hooks/              # Custom React hooks (speech, audio, etc.)
│   ├── pages/              # Route views (Home, Learn, Speak, etc.)
│   ├── services/           # Speech recognition, audio synthesizer, storage
│   ├── store/              # Zustand app state & SM-2 progress store
│   ├── types/              # TypeScript interfaces & types
│   ├── utils/              # Scoring algorithms, SM-2 math, formatting
│   ├── index.css           # Global tokens & CSS variables
│   └── main.tsx            # Application entrypoint
├── tools/
│   └── validate/           # Go validator CLI for phrases.json
├── docs/                   # Guides, demo script, and documentation
└── public/                 # PWA icons, manifest, and static assets
```

---

## Contributing Content (Phrases & Scenarios)

Before submitting new phrases or modifying existing ones, please read the [Content & Linguistic Style Guide](CONTENT_GUIDE.md).

Key rules:
1. **Unicode Strictness**: All Kannada text must strictly use Unicode code points `\u0C80` through `\u0CFF`.
2. **Situation Relevancy**: Every phrase must fit one of the 6 defined situation domains (`travel`, `shopping`, `healthcare`, `transport`, `education`, `workplace`).
3. **Romanization**: Provide unambiguous phonetic romanization with long vowel marks (e.g., `Namaskāra`, `Banni`, `Kodi`).
4. **Validation**: Always run the Go validator before committing:
   ```bash
   npm run validate
   ```

---

## Verification & Testing Suite

Before opening a pull request, ensure all verification checks pass locally:

```bash
# Run unit & component tests (Vitest)
npm test

# Run TypeScript typecheck
npm run typecheck

# Run ESLint linter
npm run lint

# Run Go phrase dataset validator
npm run validate

# Test production build & PWA asset generation
npm run build
```

---

## Git Commit Guidelines

We enforce **Conventional Commits** format. Each commit message should follow:

```text
<type>(<scope>): <subject>
```

### Common Types:
- `feat`: A new feature or capability
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting, CSS styling updates (no logic change)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or correcting tests
- `a11y`: Accessibility improvements
- `perf`: Performance improvements
- `ci`: CI configuration changes
- `chore`: Maintenance tasks, dependency bumps

### Examples:
- `feat: implement interactive waveform visualizer`
- `fix: resolve iOS Safari audio context resume unlock`
- `docs: update CONTRIBUTING.md with local setup steps`

---

## Pull Request Process

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. Make your atomic commits adhering to conventional commit formatting.
3. Ensure all tests and linters pass (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run validate`).
4. Push your branch to GitHub and open a Pull Request.
5. Provide a clear description of the problem solved and test coverage added.

Thank you for helping make Kannada accessible to everyone!
