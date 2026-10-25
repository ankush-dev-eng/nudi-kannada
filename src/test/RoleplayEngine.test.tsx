import { describe, it, expect, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoleplayEngine } from '../components/roleplay/RoleplayEngine';
import { RoleplayScenario } from '../types/phrase';

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: vi.fn(),
    speaking: false,
    hasKannadaVoice: false,
    isSupported: true,
    cancel: vi.fn(),
  }),
}));

vi.mock('../lib/feedback', () => ({
  playSuccessSound: vi.fn(),
  playCardFlipSound: vi.fn(),
  triggerHaptic: vi.fn(),
}));

const mockScenario: RoleplayScenario = {
  id: 'test-scenario-auto',
  situationId: 'travel',
  title: 'Hiring an Auto Rickshaw',
  titleKannada: 'ಆಟೋ ಬಾಡಿಗೆ ಪಡೆಯುವುದು',
  description: 'Practice hailing an auto and asking to go by meter.',
  partnerRole: 'Auto Driver',
  userRole: 'Commuter',
  initialStepId: 'step-1',
  steps: {
    'step-1': {
      id: 'step-1',
      speaker: 'partner',
      speakerName: 'Auto Driver (ಆಟೋ ಚಾಲಕರು)',
      kannada: 'ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು ಸರ್?',
      romanization: 'Ellige hogabeku sir?',
      english: 'Where do you want to go sir?',
      nextStepId: 'step-2',
    },
    'step-2': {
      id: 'step-2',
      speaker: 'user',
      speakerName: 'You (ನೀವು)',
      kannada: 'Choose your reply',
      romanization: '',
      english: '',
      options: [
        {
          id: 'opt-1',
          kannada: 'ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗಬೇಕು, ಮೀಟರ್ ಹಾಕಿ.',
          romanization: 'Majestic-ge hogabeku, meter haaki.',
          english: 'Need to go to Majestic, please put the meter.',
          phraseId: 'travel-auto-meter',
          nextStepId: 'step-3',
          feedback: 'Polite and clear instruction!',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      speaker: 'partner',
      speakerName: 'Auto Driver (ಆಟೋ ಚಾಲಕರು)',
      kannada: 'ಸರಿ ಸರ್, ಬನ್ನಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
      romanization: 'Sari sir, banni kulithukolli.',
      english: 'Okay sir, please come and sit.',
    },
  },
};

describe('RoleplayEngine Component', () => {
  it('renders initial partner message and title', () => {
    render(<RoleplayEngine scenario={mockScenario} />);

    expect(screen.getByText('ಆಟೋ ಬಾಡಿಗೆ ಪಡೆಯುವುದು')).toBeDefined();
    expect(screen.getByText('Hiring an Auto Rickshaw')).toBeDefined();
    expect(screen.getByText('ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು ಸರ್?')).toBeDefined();
    expect(screen.getByText('Where do you want to go sir?')).toBeDefined();
    expect(screen.getByText(/Continue Conversation/i)).toBeDefined();
  });

  it('advances through user options to completion', () => {
    const onFinished = vi.fn();
    render(<RoleplayEngine scenario={mockScenario} onFinished={onFinished} />);

    // Step 1: Partner speaks -> user clicks continue
    const continueBtn = screen.getByText(/Continue Conversation/i);
    fireEvent.click(continueBtn);

    // Step 2: User options should appear
    expect(screen.getByText('Choose your Kannada response:')).toBeDefined();
    expect(screen.getByText('ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗಬೇಕು, ಮೀಟರ್ ಹಾಕಿ.')).toBeDefined();

    // Select the option
    const optionBtn = screen.getByText('ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗಬೇಕು, ಮೀಟರ್ ಹಾಕಿ.');
    fireEvent.click(optionBtn);

    // Partner speaks final line (step-3)
    expect(screen.getByText('ಸರಿ ಸರ್, ಬನ್ನಿ ಕುಳಿತುಕೊಳ್ಳಿ.')).toBeDefined();

    // Click continue on final step to complete scenario
    const finalContinueBtn = screen.getByText(/Continue Conversation/i);
    fireEvent.click(finalContinueBtn);

    // Celebration card should be visible
    expect(screen.getByText(/ಅಭಿನಂದನೆಗಳು! ಸಂಭಾಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ!/i)).toBeDefined();
    expect(onFinished).toHaveBeenCalledTimes(1);
  });
});
