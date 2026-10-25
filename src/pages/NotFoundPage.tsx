import React from 'react';
import { Link } from 'react-router-dom';
import { MysoreBorder } from '@/components/common/MysoreBorder';
import { HomeIcon } from '@/components/common/Icons';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.errorCode}>೪೦೪ / 404</div>
      <h1 className={styles.titleKannada}>ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ</h1>
      <div className={styles.titleEnglish}>Page Not Found</div>

      <MysoreBorder width={180} height={10} color="var(--kumkuma)" />

      <p className={styles.message}>
        ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟವು ಲಭ್ಯವಿಲ್ಲ. The route or resource you requested could not be located in Nudi.
      </p>

      <Link to="/" className={styles.homeBtn}>
        <HomeIcon size={18} /> Back to Situations (ಹೋಮ್)
      </Link>
    </main>
  );
};
