import React, { useState, useEffect, useRef } from 'react';
import { RoleplayScenario, RoleplayOption } from '@/types/phrase';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { playSuccessSound, playCardFlipSound, triggerHaptic } from '@/lib/feedback';
import { useAppStore } from '@/store/useAppStore';
import { VolumeIcon, ChevronRightIcon, RefreshIcon } from '@/components/common/Icons';
import styles from './RoleplayEngine.module.css';

interface MessageHistoryItem {
  id: string;
  speaker: 'partner' | 'user';
  speakerName: string;
  kannada: string;
  romanization: string;
  english: string;
  feedback?: string;
}

interface RoleplayEngineProps {
  scenario: RoleplayScenario;
  onFinished?: () => void;
}

export const RoleplayEngine: React.FC<RoleplayEngineProps> = ({
  scenario,
  onFinished,
}) => {
  const { completeRoleplay } = useAppStore();
  const { speak } = useSpeechSynthesis();

  const getInitialStep = () => scenario.initialStepId || Object.keys(scenario.steps)[0] || '';

  const [currentStepId, setCurrentStepId] = useState<string>(getInitialStep());
  const [history, setHistory] = useState<MessageHistoryItem[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const currentStep = scenario.steps[currentStepId];

  // Auto-scroll chat area on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentStepId]);

  // When step changes, if it's a partner step and not already in history, add it
  useEffect(() => {
    if (!currentStep) {
      if (!isCompleted && history.length > 0) {
        setIsCompleted(true);
        playSuccessSound();
        triggerHaptic('success');
        completeRoleplay(scenario.id, scenario.situationId);
        if (onFinished) {
          onFinished();
        }
      }
      return;
    }

    if (currentStep.speaker === 'partner') {
      const alreadyAdded = history.some((h) => h.id === currentStep.id);
      if (!alreadyAdded) {
        setHistory((prev) => [
          ...prev,
          {
            id: currentStep.id,
            speaker: 'partner',
            speakerName: currentStep.speakerName,
            kannada: currentStep.kannada,
            romanization: currentStep.romanization,
            english: currentStep.english,
          },
        ]);
        // Auto-play partner audio
        speak(currentStep.kannada);
      }
    }
  }, [currentStep, history, isCompleted, scenario, completeRoleplay, speak, onFinished]);

  const handlePartnerAdvance = () => {
    if (!currentStep?.nextStepId) {
      setIsCompleted(true);
      playSuccessSound();
      triggerHaptic('success');
      completeRoleplay(scenario.id, scenario.situationId);
      if (onFinished) onFinished();
    } else {
      playCardFlipSound();
      triggerHaptic('light');
      setCurrentStepId(currentStep.nextStepId);
    }
  };

  const handleSelectOption = (option: RoleplayOption) => {
    playCardFlipSound();
    triggerHaptic('medium');

    // Add user response to history
    setHistory((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        speaker: 'user',
        speakerName: 'You (ನೀವು)',
        kannada: option.kannada,
        romanization: option.romanization,
        english: option.english,
        feedback: option.feedback,
      },
    ]);

    if (!option.nextStepId) {
      setIsCompleted(true);
      playSuccessSound();
      triggerHaptic('success');
      completeRoleplay(scenario.id, scenario.situationId);
      if (onFinished) onFinished();
    } else {
      setCurrentStepId(option.nextStepId);
    }
  };

  const handleRestart = () => {
    setHistory([]);
    setIsCompleted(false);
    setCurrentStepId(getInitialStep());
    playCardFlipSound();
  };

  return (
    <article className={styles.engineContainer}>
      <header className={styles.scenarioHeader}>
        <div className={styles.scenarioTitleKannada}>{scenario.titleKannada}</div>
        <div className={styles.scenarioTitleEnglish}>{scenario.title}</div>
        <p className={styles.scenarioDescription}>{scenario.description}</p>
      </header>

      <div
        className={styles.chatScrollArea}
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation dialogue history"
      >
        {history.map((msg, index) => (
          <div
            key={index}
            className={`${styles.bubble} ${
              msg.speaker === 'partner' ? styles.partnerBubble : styles.userBubble
            }`}
          >
            <span className={styles.speakerLabel}>{msg.speakerName}</span>
            <div className={styles.kannadaText}>{msg.kannada}</div>
            <div className={styles.romanText}>{msg.romanization}</div>
            <div className={styles.englishText}>{msg.english}</div>

            {msg.speaker === 'partner' && (
              <button
                type="button"
                className={styles.listenInlineBtn}
                onClick={() => speak(msg.kannada)}
                title="Listen to this line"
              >
                <VolumeIcon size={14} /> Listen
              </button>
            )}

            {msg.feedback && (
              <div
                style={{
                  fontSize: '0.78rem',
                  marginTop: '0.25rem',
                  padding: '0.2rem 0.4rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                }}
              >
                💡 {msg.feedback}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isCompleted && currentStep && currentStep.speaker === 'partner' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className={styles.advanceBtn}
            onClick={handlePartnerAdvance}
          >
            Continue Conversation <ChevronRightIcon size={16} />
          </button>
        </div>
      )}

      {!isCompleted && currentStep && currentStep.speaker === 'user' && currentStep.options && (
        <section className={styles.optionsSection}>
          <div className={styles.optionsPrompt}>Choose your Kannada response:</div>
          {currentStep.options.map((option: RoleplayOption) => (
            <button
              key={option.id}
              type="button"
              className={styles.optionButton}
              onClick={() => handleSelectOption(option)}
            >
              <span className={styles.optionKannada}>{option.kannada}</span>
              <span className={styles.optionRoman}>{option.romanization}</span>
              <span className={styles.optionEnglish}>{option.english}</span>
            </button>
          ))}
        </section>
      )}

      {isCompleted && (
        <section className={styles.completionCard} aria-live="polite">
          <div className={styles.completionBadge}>🎉</div>
          <div className={styles.completionTitle}>ಅಭಿನಂದನೆಗಳು! ಸಂಭಾಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ!</div>
          <div className={styles.completionSubtitle}>
            Well done! You successfully navigated this conversation scenario in Kannada.
          </div>
          <button
            type="button"
            className={styles.restartBtn}
            onClick={handleRestart}
          >
            <RefreshIcon size={16} /> Practice Scenario Again
          </button>
        </section>
      )}
    </article>
  );
};
