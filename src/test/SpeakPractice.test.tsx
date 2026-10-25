import { describe, it, expect, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SpeakPractice } from '../components/speak/SpeakPractice';
import { Phrase } from '../types/phrase';

// Mock speech synthesis and recognition
vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: vi.fn(),
    speaking: false,
    hasKannadaVoice: false,
    isSupported: true,
    cancel: vi.fn(),
  }),
}));

vi.mock('../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
    isSupported: true,
    startListening: vi.fn(),
    stopListening: vi.fn(),
    resetTranscript: vi.fn(),
  }),
}));

vi.mock('../lib/feedback', () => ({
  playSuccessSound: vi.fn(),
  playErrorSound: vi.fn(),
  triggerHaptic: vi.fn(),
}));

const mockPhrase: Phrase = {
  id: 'test-speak-1',
  situationId: 'travel',
  kannada: 'ಧನ್ಯವಾದಗಳು',
  romanization: 'Dhanyavadagalu',
  english: 'Thank you',
  note: 'Standard polite gratitude',
  formality: 'polite',
  tags: ['polite', 'basics'],
  reviewed: true,
};

describe('SpeakPractice Component', () => {
  it('renders phrase details and listen buttons', () => {
    render(<SpeakPractice phrase={mockPhrase} />);

    expect(screen.getByText('ಧನ್ಯವಾದಗಳು')).toBeDefined();
    expect(screen.getByText('Dhanyavadagalu')).toBeDefined();
    expect(screen.getByText('Thank you')).toBeDefined();
    expect(screen.getByText(/Listen \(1.0x\)/)).toBeDefined();
  });

  it('allows text fallback input evaluation', () => {
    render(<SpeakPractice phrase={mockPhrase} />);

    // Click toggle fallback
    const toggleBtn = screen.getByText(/Having microphone or voice recognition issues/i);
    fireEvent.click(toggleBtn);

    const input = screen.getByLabelText('Text pronunciation input');
    fireEvent.change(input, { target: { value: 'dhanyavadagalu' } });

    const scoreBtn = screen.getByText('Score');
    fireEvent.click(scoreBtn);

    // Should display score percentage and spoken transcription
    expect(screen.getByText(/You said:/i)).toBeDefined();
    expect(screen.getAllByText(/dhanyavadagalu/).length).toBeGreaterThan(0);
  });
});
