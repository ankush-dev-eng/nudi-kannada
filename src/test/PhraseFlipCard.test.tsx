import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhraseFlipCard } from '@/components/learn/PhraseFlipCard';
import { Phrase } from '@/types/phrase';

const mockPhrase: Phrase = {
  id: 'travel-01',
  situationId: 'travel',
  kannada: 'ನಮಸ್ಕಾರ, ಈ ಬಸ್ ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ?',
  romanization: 'Namaskara, ee bus Majestic-ge hogutta?',
  english: 'Hello, does this bus go to Majestic?',
  note: 'Majestic is Bengaluru central transit hub.',
  formality: 'polite',
  tags: ['transit'],
  reviewed: false,
};

describe('PhraseFlipCard Component', () => {
  it('renders front with Kannada script and romanization', () => {
    render(<PhraseFlipCard phrase={mockPhrase} />);

    expect(screen.getByText('ನಮಸ್ಕಾರ, ಈ ಬಸ್ ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ?')).toBeInTheDocument();
    expect(screen.getAllByText('Namaskara, ee bus Majestic-ge hogutta?').length).toBeGreaterThan(0);
    expect(screen.getAllByText('polite').length).toBeGreaterThan(0);
    expect(screen.getByText('review pending')).toBeInTheDocument();
  });

  it('renders audio playback buttons for normal and slow speed', () => {
    render(<PhraseFlipCard phrase={mockPhrase} />);

    expect(screen.getByRole('button', { name: /play normal audio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play slow audio/i })).toBeInTheDocument();
  });

  it('flips to back and displays English translation and usage note', () => {
    const handleLearned = vi.fn();
    const { container } = render(<PhraseFlipCard phrase={mockPhrase} onLearned={handleLearned} />);

    const cardButton = screen.getByRole('button', { name: /flashcard:/i });
    fireEvent.click(cardButton);

    expect(handleLearned).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Hello, does this bus go to Majestic?')).toBeInTheDocument();
    expect(screen.getByText(/Majestic is Bengaluru central transit hub/i)).toBeInTheDocument();

    // Check that CSS flipped class is applied
    const innerCard = container.querySelector('[class*="flipped"]');
    expect(innerCard).toBeInTheDocument();
  });
});
