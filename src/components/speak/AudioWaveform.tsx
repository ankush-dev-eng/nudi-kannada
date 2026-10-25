import React from 'react';
import styles from './AudioWaveform.module.css';

interface AudioWaveformProps {
  isRecording: boolean;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isRecording,
  barCount = 18,
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div
      className={`${styles.waveformContainer} ${isRecording ? styles.recording : ''}`}
      role="presentation"
      aria-label={isRecording ? 'Listening to speech...' : 'Microphone idle'}
    >
      {bars.map((index) => (
        <span
          key={index}
          className={styles.bar}
          style={{
            animationDuration: `${0.8 + ((index % 5) * 0.15)}s`,
          }}
        />
      ))}
    </div>
  );
};
