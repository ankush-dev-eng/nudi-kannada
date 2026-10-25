import '@testing-library/jest-dom';

// Mock Web Speech API SpeechSynthesis and SpeechRecognition for test environment
if (typeof window !== 'undefined') {
  if (!window.speechSynthesis) {
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      pending: false,
      speaking: false,
      paused: false,
      onvoiceschanged: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as SpeechSynthesis;
  }

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
