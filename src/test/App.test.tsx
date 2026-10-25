import { describe, it, expect, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: vi.fn(),
    speaking: false,
    hasKannadaVoice: false,
    isSupported: true,
    cancel: vi.fn(),
  }),
}));

describe('App Routing & Shell', () => {
  it('renders header, bottom nav, and home page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Header brand
    expect(screen.getAllByText(/ನುಡಿ/).length).toBeGreaterThan(0);
    // Situations heading
    expect(screen.getByText(/Situations • ಸಂದರ್ಭಗಳು/)).toBeDefined();
    // Bottom nav items
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Review')).toBeDefined();
    expect(screen.getByText('Read It')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
  });

  it('renders 404 page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route-xyz']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/೪೦೪ \/ 404/)).toBeDefined();
    expect(screen.getByText('ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ')).toBeDefined();
  });
});
