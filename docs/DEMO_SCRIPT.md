# Nudi (ನುಡಿ) — 90-Second Product Demonstration Script

A comprehensive, time-coded walkthrough script for demonstrating **Nudi (ನುಡಿ) — Kannada for Everyday Life**.

- **Target Duration**: Exactly 90 seconds (01:30)
- **Live Demo**: [https://nudi-kannada-flame.vercel.app/](https://nudi-kannada-flame.vercel.app/)
- **Target Audience**: Newcomers to Karnataka, hackathon judges, educators, and language enthusiasts
- **Key Themes**: Situation-first immersion, pronunciation confidence, offline privacy, Karnataka heritage aesthetic

---

## Storyboard & Timing Overview

```text
[00:00 - 00:12] ── 1. The Newcomer's Problem & The Sandalwood Interface
[00:12 - 00:28] ── 2. Learn Mode: Everyday Phrases & Audio Speed
[00:28 - 00:48] ── 3. Speak Mode: Live Speech Recognition & Waveform Scoring
[00:48 - 01:05] ── 4. Branching Roleplay: Real-Life Market Conversation
[01:05 - 01:18] ── 5. Review Mode: SM-2 Spaced Repetition & Retention
[01:18 - 01:25] ── 6. Civic Navigation: BMTC Sign-Reading Mini-Quiz
[01:25 - 01:30] ── 7. PWA Architecture, Offline Access & Conclusion
```

---

## Detailed Step-by-Step Script

### [00:00 – 00:12] Act 1: The Problem & The Sandalwood Interface

| Timecode | Visual / On-Screen Action | Voiceover / Audio Script | Notes & Cues |
|:---|:---|:---|:---|
| **00:00 – 00:05** | Camera zooms into the hero page of Nudi. Warm Karnataka Sandalwood palette (`#2B1D14` deep sandalwood ink, `#F7F0E1` ivory paper, `#9E2A2B` kumkuma accent). | *"Every month, tens of thousands of newcomers arrive in Bengaluru and across Karnataka — eager to connect, but hesitant to speak Kannada in daily life."* | Calm, warm, engaging voice. Soft ambient tanpura fade in background. |
| **00:05 – 00:12** | Mouse hovers across the 6 situation cards: **Travel**, **Shopping**, **Healthcare**, **Transport**, **Education**, and **Workplace**. Active streak badge glows `🔥 3 Days`. | *"Meet Nudi (ನುಡಿ). Not another generic flashcard app, but a situation-first survival companion built around the exact moments you need it most."* | Cursor clicks on the **Travel & Commute (ಪ್ರಯಾಣ)** card. |

---

### [00:12 – 00:28] Act 2: Learn Mode — Everyday Phrases & Audio Speed

| Timecode | Visual / On-Screen Action | Voiceover / Audio Script | Notes & Cues |
|:---|:---|:---|:---|
| **00:12 – 00:18** | Screen navigates to `/learn/travel`. A clean phrase card displays in bold Kannada: **"ಮೀಟರ್ ಹಾಕಿ"** (*Mīṭar hāki* — "Please put the meter"). Formality badge shows `POLITE`. | *"In Learn Mode, phrases are curated for immediate survival. Tap the speaker to hear crystal-clear native pronunciation via the Web Speech API."* | Audio plays: *"Mīṭar hāki"* through native `kn-IN` synthesis. |
| **00:18 – 00:23** | User toggles the speed switch from `1.0x` to `0.75x`. The audio plays again at a relaxed pace with phonetic breakdown. | *"Tricky syllable? Slow down to 0.75x to hear every vowel elongation clearly."* | Clear demonstration of learner pacing. |
| **00:23 – 00:28** | User clicks the card or presses `Space`. The card smoothly performs a 3D flip animation, revealing the English translation, literal breakdown, and cultural tip: *"Auto drivers appreciate polite requests with '-banni' or '-kodi'."* | *"Flip to see cultural etiquette tips so you never sound rude or out of place."* | 3D card flip animation runs smoothly at 60 FPS. |

---

### [00:28 – 00:48] Act 3: Speak Mode — Speech Recognition & Scoring

| Timecode | Visual / On-Screen Action | Voiceover / Audio Script | Notes & Cues |
|:---|:---|:---|:---|
| **00:28 – 00:34** | User clicks **"Practice Speaking"** or presses `S`. Screen transitions to `/speak/travel_002` targeting **"ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ"** (*Illi nillisi* — "Please stop here"). | *"Speaking out loud builds muscle memory. Hit the record button and speak naturally."* | Smooth layout transition. |
| **00:34 – 00:40** | User clicks the mic button. Pulsing red recording ring activates with a dynamic real-time audio waveform visualizer responding to mic input via Web Audio API. | *[Speaker speaks into mic]*: *"ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ"* (Illi nillisi). | Web Speech API processes `kn-IN` in real-time. |
| **00:40 – 00:48** | Recognition completes in under 200ms. Pronunciation score animates with a circular gauge: **94% Excellent!** Word-level diffing highlights matching tokens in emerald ghats green (`#2F5D50`). Celebration chime sounds. | *"Nudi's phonetics engine scores your speech in real time with character-level accuracy and phonetic word highlighting. You get instant positive feedback."* | Clean visual feedback with zero latency. |

---

### [00:48 – 01:05] Act 4: Branching Roleplay — Realistic Conversations

| Timecode | Visual / On-Screen Action | Voiceover / Audio Script | Notes & Cues |
|:---|:---|:---|:---|
| **00:48 – 00:54** | User navigates to `/roleplay`. Selects scenario: **"Bargaining & Buying Vegetables at KR Market"**. Conversation interface opens. | *"Real conversations aren't one-sided. Nudi's interactive roleplay engine simulates branching dialogues."* | Avatar of Manjunath (Vendor) appears. |
| **00:54 – 01:00** | Vendor asks: *"ಏನು ಬೇಕು ಸರ್?"* (*What do you need, sir?*). Two response options appear: 1) *"ಒಂದು ಕೆಜಿ ಈರುಳ್ಳಿ ಕೊಡಿ"* (1 kg onions) vs 2) *"ಬೆಲೆ ಎಷ್ಟು?"* (How much is this?). | *"The vendor speaks first. Choose your response based on what you want to achieve."* | Audio reads vendor query aloud. |
| **01:00 – 01:05** | User clicks Option 1. The dialogue advances down Branch A: Vendor quotes price; user asks for UPI QR code. A scenario completion badge appears! | *"Every choice branches realistically, preparing you for real-world confidence without embarrassment."* | Branching state machine test verified. |

---

### [01:05 – 01:18] Act 5: Review Mode — SM-2 Spaced Repetition

| Timecode | Visual / On-Screen Action | Voiceover / Audio Script | Notes & Cues |
|:---|:---|:---|:---|
| **01:05 – 01:12** | User navigates to `/review`. Queue header shows: `5 Cards Due Today`. User flips a card: **"ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ"** (*Svalpa kaḍime māḍi* — Please reduce a little). | *"To ensure long-term retention, Nudi integrates the SuperMemo-2 spaced repetition algorithm."* | Clean card elevation with shadow. |
| **01:12 – 01:18** | User clicks rating button **4 (Good)**. Card sweeps off screen. Next interval calculates: 6 days. Daily review progress bar reaches 100%. | *"Grade how easily you remembered it. Nudi calculates optimal recall intervals so you retain phrases permanently."* | Responsive spring animation. |

---

### [01:18 – 01:25] Act 6: Civic Navigation — BMTC Sign Quiz

| Timecode | Visual / On-Screen Action | Voiceover / Audio Script | Notes & Cues |
|:---|:---|:---|:---|
| **01:18 – 01:25** | User clicks `/script`. Scrolls to the **Sign-Reading Mini-Quiz**. A photo-realistic BMTC bus destination board displays in Kannada script: **"ಮೆಜೆಸ್ಟಿಕ್"**. Four multiple-choice options appear. User selects **Majestic**. Checkmark flashes green! | *"Can't read Kannada script yet? The civic sign-quiz teaches you to read BMTC bus destination boards and Metro signages in minutes."* | Highlight civic utility. |

---

### [01:25 – 01:30] Act 7: PWA, Offline Privacy & Conclusion

| Timecode | Visual / On-Screen Action | Voiceover / Audio Script | Notes & Cues |
|:---|:---|:---|:---|
| **01:25 – 01:30** | Chrome DevTools shows Network set to **Offline**. User navigates through all pages seamlessly without a single error. Final screen shows GitHub URL and `v1.0.0` badge. | *"100% offline, zero tracking, zero install friction. Nudi: Kannada for Everyday Life. Try it today on GitHub!"* | Fade out with closing title card and Nudi sandalwood seal. |

---

## Production Setup & Recording Tips

1. **Resolution**: 1080p (1920x1080) at 60 FPS.
2. **Audio Voice**: Natural English accent with proper phonetic pronunciation of Kannada words.
3. **Browser**: Chromium-based (Chrome or Edge) with SpeechSynthesis Kannada voice enabled.
4. **Key Shortcuts Demo**: Press `?` briefly at 01:10 to show the accessibility keyboard modal for extra polish.
