# Nudi (ನುಡಿ) — Content & Linguistic Style Guide

This document defines the linguistic principles, Unicode requirements, and editorial standards for contributing and verifying phrases in **Nudi (ನುಡಿ)**.

---

## 1. Editorial Philosophy: Situation-First

Nudi is built for newcomers to Karnataka who need to navigate real daily life with confidence and respect. Every phrase added to Nudi must satisfy the **Survival & Politeness Test**:

> *"Will a newcomer realistically need this phrase in their first 30 days in Bengaluru or Karnataka, and will uttering it create a warm, respectful connection with locals?"*

Abstract grammatical drills, literary archaisms, or textbook slang that is rarely spoken in everyday markets or transit are avoided in favor of practical, natural speech.

---

## 2. Situation Domains

All phrases must belong to one of the 6 core situation categories:

| Situation ID | Kannada Title | English Title | Focus Areas |
|:---|:---|:---|:---|
| `travel` | ಪ್ರಯಾಣ | Travel & Commute | Auto rickshaws, meters, directions, Namma Metro, BMTC buses |
| `shopping` | ಖರೀದಿ | Market & Shopping | KR Market / vegetable vendors, bargaining, UPI payments, quantities |
| `healthcare` | ಆರೋಗ್ಯ | Healthcare & Clinic | Describing symptoms, pharmacies/chemist, doctor appointments |
| `transport` | ಸಾರಿಗೆ | Public Transit | Bus conductors, stops, platform numbers, tickets, suburban trains |
| `education` | ಶಿಕ್ಷಣ | School & Campus | College administration, library, asking classmates, admissions |
| `workplace` | ಕೆಲಸದ ಸ್ಥಳ | Office & Workplace | Security desk, canteen, housekeeping, greeting colleagues |

Each situation must contain a **minimum of 8 phrases** (ideally 10–12).

---

## 3. Formality & Etiquette Standards

Kannada is deeply respectful. Nudi categorizes all utterances into two formality tiers:

### A. Polite (`polite`)
- **When to use**: Strangers, elders, service professionals (auto drivers, shopkeepers, conductors), doctors, and professional workplace interactions.
- **Key markers**:
  - Plural/honorific verb suffixes: `-banni` (ಬನ್ನಿ - please come), `-kodi` (ಕೊಡಿ - please give), `-tagoli` (ತಗೊಳ್ಳಿ - please take).
  - Polite markers: `Dayavittu` (ದಯವಿಟ್ಟು - please), `Namaskara` (ನಮಸ್ಕಾರ), `Dhanyavadagalu` (ಧನ್ಯವಾದಗಳು).
  - Address forms: `Sir` (ಸರ್), `Madam` (ಮೇಡಂ), `Anna` (ಅಣ್ಣ - elder brother).

### B. Casual (`casual`)
- **When to use**: Close peers, college friends, familiar classmates.
- **Key markers**:
  - Singular verb endings: `-baa` (ಬಾ), `-kodu` (ಕೊಡು), `-tagoo` (ತಗೋ).
  - Casual questions: `Enu samachara?` (ಏನು ಸಮಾಚಾರ?), `Hegiddeeya?` (ಹೇಗಿದ್ದೀಯಾ?).

---

## 4. Unicode & Script Rigor

The automated Go validator enforces strict script integrity:
1. Every Kannada character in `kannada` must reside strictly in the Unicode block **`\u0C80` – `\u0CFF`** (along with standard punctuation and whitespace).
2. Never substitute English Latin characters (like `O` or `0`) for Kannada symbols.
3. Ensure virama (halant `್`) and matras are properly positioned without orphan conjuncts.

---

## 5. Conversational Romanization Convention

To help newcomers read phonetics accurately without prior knowledge of academic diacritics (like IAST/ISO), Nudi uses **Conversational Phonetic Romanization**:

| Kannada Vowel | Romanization | Example | Note |
|:---|:---|:---|:---|
| ಅ | `a` | Amma | Short /a/ |
| ಆ | `aa` | Aane | Long /aa/ |
| ಇ | `i` | Illi | Short /i/ |
| ಈ | `ee` | Eega | Clear /ee/ |
| ಉ | `u` | Ooru / Uru | Short /u/ |
| ಊ | `oo` | Oota | Long /oo/ |
| ಎ | `e` | Elli | Short /e/ |
| ಏ | `ee` / `ae` | Eenu | Long /ee/ |
| ಐ | `ai` | Aidu | Diphthong /ai/ |
| ಒ | `o` | Ondu | Short /o/ |
| ಓ | `oo` | Oodu | Long /oo/ |
| ಔ | `au` | Aushadha | Diphthong /au/ |

---

## 6. How to Propose or Verify a Phrase

1. Open `src/data/phrases.json`.
2. Add your phrase to the `phrases` array following the exact schema:
   ```json
   {
     "id": "travel-metro-token",
     "situationId": "travel",
     "kannada": "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಎರಡು ಟೋಕನ್ ಕೊಡಿ.",
     "romanization": "Majestic-ge eradu token kodi.",
     "english": "Please give two tokens to Majestic.",
     "note": "Standard polite request at metro ticket counter.",
     "formality": "polite",
     "tags": ["travel", "metro", "tickets"],
     "reviewed": false
   }
   ```
3. Run the Go validator to ensure zero schema or Unicode regressions:
   ```bash
   go run ./tools/validate
   npm run test
   ```
4. If you are a native Kannada speaker verifying an existing draft phrase, change `"reviewed": false` to `"reviewed": true` and submit a Pull Request!
