import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { SituationId, RoleplayScenario } from '@/types/phrase';
import { resolveSituationId } from '@/lib/situations';
import { SituationNotFound } from '@/components/common/SituationNotFound';
import { RoleplayEngine } from '@/components/roleplay/RoleplayEngine';
import { ChevronLeftIcon, CheckIcon } from '@/components/common/Icons';
import styles from './RoleplayPage.module.css';

export const RoleplayPage: React.FC = () => {
  const { situationId } = useParams<{ situationId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { situations, roleplays, progress, getRoleplaysBySituation } = useAppStore();

  const rawSituation = situationId ?? searchParams.get('situation');
  const isExplicit = rawSituation !== undefined && rawSituation !== null;
  const resolvedSituation = rawSituation ? resolveSituationId(rawSituation) : 'travel';

  const activeSituation: SituationId = resolvedSituation || 'travel';
  const situationRoleplays = getRoleplaysBySituation(activeSituation);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    situationRoleplays[0]?.id || roleplays[0]?.id || ''
  );

  useEffect(() => {
    const matchingRoleplays = getRoleplaysBySituation(activeSituation);
    if (matchingRoleplays.length > 0) {
      setSelectedScenarioId(matchingRoleplays[0].id);
    }
  }, [activeSituation, getRoleplaysBySituation]);

  // Unknown situation in URL
  if (isExplicit && !resolvedSituation) {
    return <SituationNotFound requestedSlug={rawSituation} mode="roleplay" />;
  }

  const handleSelectSituation = (sitId: SituationId) => {
    if (situationId) {
      navigate(`/roleplay/${sitId}`);
    } else {
      setSearchParams({ situation: sitId });
    }
    const matching = getRoleplaysBySituation(sitId);
    if (matching.length > 0) {
      setSelectedScenarioId(matching[0].id);
    }
  };

  const activeScenario: RoleplayScenario | undefined =
    roleplays.find((r) => r.id === selectedScenarioId) || situationRoleplays[0] || roleplays[0];

  const situationProgress = progress[activeSituation];
  const completedRoleplayIds = situationProgress?.roleplaysCompleted || [];

  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to situations">
          <ChevronLeftIcon size={16} /> All Situations
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
          {completedRoleplayIds.length} of {situationRoleplays.length} scenarios mastered
        </span>
      </header>

      <section className={styles.pageHeader}>
        <h1 className={styles.titleKannada}>ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ</h1>
        <div className={styles.titleEnglish}>Interactive Scenario Roleplay</div>
      </section>

      {/* Situation category pills */}
      <nav className={styles.filterBar} aria-label="Situation categories">
        {situations.map((sit) => (
          <button
            key={sit.id}
            type="button"
            className={`${styles.situationChip} ${activeSituation === sit.id ? styles.active : ''}`}
            onClick={() => handleSelectSituation(sit.id)}
          >
            {sit.titleKannada} ({sit.title})
          </button>
        ))}
      </nav>

      {/* Scenario cards for current situation */}
      <section className={styles.scenarioList} aria-label="Available scenarios">
        {situationRoleplays.map((scenario) => {
          const isDone = completedRoleplayIds.includes(scenario.id);
          const isSelected = scenario.id === activeScenario?.id;
          return (
            <button
              key={scenario.id}
              type="button"
              className={`${styles.scenarioCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedScenarioId(scenario.id)}
            >
              <div>
                <div className={styles.cardTitleKn}>{scenario.titleKannada}</div>
                <div className={styles.cardTitleEn}>{scenario.title}</div>
                <div className={styles.cardDesc}>{scenario.description}</div>
              </div>
              {isDone && (
                <span className={styles.completionBadge}>
                  <CheckIcon size={14} /> Completed
                </span>
              )}
            </button>
          );
        })}
      </section>

      {activeScenario && <RoleplayEngine key={activeScenario.id} scenario={activeScenario} />}
    </main>
  );
};
