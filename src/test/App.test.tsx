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

  const situations = ['travel', 'shopping', 'healthcare', 'transport', 'education', 'workplace'];

  describe.each(situations)('Situation Routes: %s', (situation: string) => {
    it(`renders /learn/${situation} without 404`, () => {
      render(
        <MemoryRouter initialEntries={[`/learn/${situation}`]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.queryByText('ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ')).toBeNull();
    });

    it(`renders /speak/${situation} without 404`, () => {
      render(
        <MemoryRouter initialEntries={[`/speak/${situation}`]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.queryByText('ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ')).toBeNull();
      expect(screen.getByText('ಧ್ವನಿ ಅಭ್ಯಾಸ')).toBeDefined();
    });

    it(`renders /roleplay/${situation} without 404`, () => {
      render(
        <MemoryRouter initialEntries={[`/roleplay/${situation}`]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.queryByText('ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ')).toBeNull();
      expect(screen.getByText('ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ')).toBeDefined();
    });
  });

  describe('Short URLs & Aliases', () => {
    it('redirects /learn to /learn/travel', () => {
      render(
        <MemoryRouter initialEntries={['/learn']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
    });

    it('resolves alias /speak/market to shopping without 404', () => {
      render(
        <MemoryRouter initialEntries={['/speak/market']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.getByText('ಧ್ವನಿ ಅಭ್ಯಾಸ')).toBeDefined();
    });

    it('resolves alias /roleplay/office to workplace without 404', () => {
      render(
        <MemoryRouter initialEntries={['/roleplay/office']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.getByText('ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ')).toBeDefined();
    });
  });

  describe('Unknown situation IDs show friendly Situation Not Found page', () => {
    it('renders friendly SituationNotFound for /learn/invalid-xyz', () => {
      render(
        <MemoryRouter initialEntries={['/learn/invalid-xyz']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.getByText('ಸಂದರ್ಭ ಕಂಡುಬಂದಿಲ್ಲ')).toBeDefined();
      expect(screen.getByText('Situation Not Found')).toBeDefined();
    });

    it('renders friendly SituationNotFound for /speak/invalid-xyz', () => {
      render(
        <MemoryRouter initialEntries={['/speak/invalid-xyz']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.getByText('ಸಂದರ್ಭ ಕಂಡುಬಂದಿಲ್ಲ')).toBeDefined();
      expect(screen.getByText('Situation Not Found')).toBeDefined();
    });

    it('renders friendly SituationNotFound for /roleplay/invalid-xyz', () => {
      render(
        <MemoryRouter initialEntries={['/roleplay/invalid-xyz']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText(/೪೦೪ \/ 404/)).toBeNull();
      expect(screen.getByText('ಸಂದರ್ಭ ಕಂಡುಬಂದಿಲ್ಲ')).toBeDefined();
      expect(screen.getByText('Situation Not Found')).toBeDefined();
    });
  });
});
