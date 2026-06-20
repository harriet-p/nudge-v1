import { useCallback, useEffect, useMemo, useState } from 'react'
import { AFFECTION } from '../content/constants'
import { showDebugToolbar } from '../config/development'
import type { EffectPosition } from '../effects/types'
import { useEffects, usePersistentEffect } from '../hooks/useEffects'
import { usePreferences } from '../hooks/usePreferences'
import { useRitualSession } from '../hooks/useRitualSession'
import { getCelebrationEffectIds } from '../effects/celebrationEffects'
import { getEffectDefinition } from '../effects/registry'
import { CharacterStack } from './CharacterStack'
import { ScreenEffectLayer } from './ScreenEffectLayer'
import { PlayChase } from '../effects/PlayChase'
import { DeveloperNudgeToolbar } from './DeveloperNudgeToolbar'
import './MainScreen.css'
import { MorningChecklist } from './MorningChecklist'
import { RitualMoment } from './RitualMoment'
import { SettingsPanel } from './SettingsPanel'
import {
  DialogueBox,
  LightSwitch,
  PixelButton,
  ScreenLayout,
} from './ui'

export function MainScreen() {
  const { preferences, updatePreferences } = usePreferences()
  const { viewModel, session, accept, connect, dismiss, quietHours, nightMode, toggleLights, triggerDevNudge, fixRandomNudge2Ear } =
    useRitualSession(preferences)
  const { activeEffects, playEffect, stopEffect } = useEffects()
  const { celebrationEffectId, phase: sessionPhase, activeRitualId } = session
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isSleeping = useMemo(() => {
    if (
      viewModel.phase === 'inviting' &&
      viewModel.idleMood === 'sleeping' &&
      viewModel.darkMode
    ) {
      return true
    }

    if (viewModel.phase === 'resting') return true

    if (viewModel.phase === 'idle' && viewModel.idleMood === 'sleeping') {
      return true
    }

    return false
  }, [
    viewModel.sprite,
    viewModel.phase,
    viewModel.idleMood,
    viewModel.darkMode,
  ])

  const { characterEffects, screenEffects } = useMemo(() => {
    const character: typeof activeEffects = []
    const screen: typeof activeEffects = []

    for (const effect of activeEffects) {
      const definition = getEffectDefinition(effect.effectId)
      if (definition.anchor === 'screen') {
        screen.push(effect)
      } else {
        character.push(effect)
      }
    }

    return { characterEffects: character, screenEffects: screen }
  }, [activeEffects])

  const canPet = viewModel.phase === 'idle' && !quietHours && !nightMode
  const canPatRandomNudge2 =
    viewModel.phase === 'inviting' && !!viewModel.pettable

  usePersistentEffect('zzz', isSleeping, playEffect, stopEffect)

  useEffect(() => {
    if (sessionPhase !== 'celebrating' || !celebrationEffectId) return

    playEffect(celebrationEffectId)

    return () => {
      for (const effectId of getCelebrationEffectIds(activeRitualId ?? 'outdoors')) {
        stopEffect(effectId)
      }
    }
  }, [
    sessionPhase,
    celebrationEffectId,
    activeRitualId,
    playEffect,
    stopEffect,
  ])

  const handlePet = useCallback(
    (at: EffectPosition) => {
      if (canPatRandomNudge2) {
        playEffect('pat', { at })
        const durationMs =
          getEffectDefinition('pat').playbackDurationMs ?? 2400
        window.setTimeout(() => fixRandomNudge2Ear(), durationMs)
        return
      }

      if (!canPet) return
      playEffect('pat', { at })
    },
    [canPet, canPatRandomNudge2, playEffect, fixRandomNudge2Ear],
  )

  const handleLove = useCallback(() => {
    if (viewModel.phase !== 'idle' || quietHours || nightMode) return
    playEffect('love')
  }, [viewModel.phase, quietHours, nightMode, playEffect])

  return (
    <div className={`main-screen${showDebugToolbar ? ' main-screen--dev' : ''}`}>
      {showDebugToolbar && <DeveloperNudgeToolbar onTrigger={triggerDevNudge} />}
      <div className="main-screen__viewport">
      <ScreenLayout
        dark={viewModel.darkMode}
        dimming={viewModel.lightsDimming}
        instantTheme={viewModel.instantTheme}
      >
        <ScreenEffectLayer effects={screenEffects} />
        <button
          type="button"
          className="screen-layout__settings"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        />

        {viewModel.phase === 'inviting' ? (
          <>
            {viewModel.showLightSwitchOnly ? (
              <>
                {viewModel.dialogue && (
                  <DialogueBox
                    variant={viewModel.dialogue.variant}
                    className="screen-layout__dialogue"
                  >
                    {viewModel.dialogue.text}
                  </DialogueBox>
                )}
                <div className="screen-layout__actions">
                  <LightSwitch
                    on={viewModel.lightsOn ?? true}
                    onToggle={toggleLights}
                  />
                </div>
              </>
            ) : viewModel.dialogue && viewModel.buttons && !viewModel.checklist ? (
              <RitualMoment
                dialogue={viewModel.dialogue.text}
                dialogueVariant={viewModel.dialogue.variant}
                buttons={viewModel.buttons}
                onAccept={accept}
                onDismiss={dismiss}
              />
            ) : viewModel.checklist && viewModel.buttons ? (
              <>
                {viewModel.dialogue && (
                  <DialogueBox
                    variant={viewModel.dialogue.variant}
                    className="screen-layout__dialogue"
                  >
                    {viewModel.dialogue.text}
                  </DialogueBox>
                )}
                <div className="screen-layout__checklist">
                  <MorningChecklist items={viewModel.checklist} />
                  <div className="morning-checklist__actions">
                    {viewModel.buttons.map((button) => (
                      <PixelButton
                        key={`${button.action}-${button.label}`}
                        variant={button.variant}
                        onClick={accept}
                      >
                        {button.label}
                      </PixelButton>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              viewModel.dialogue && (
                <DialogueBox
                  variant={viewModel.dialogue.variant}
                  className="screen-layout__dialogue"
                >
                  {viewModel.dialogue.text}
                </DialogueBox>
              )
            )}
            {!viewModel.hideCharacter ? (
            <CharacterStack
              key={viewModel.spriteKey ?? viewModel.sprite}
              variant={viewModel.sprite}
              idleMood={viewModel.idleMood}
              lightsOut={!!session.roomDark && viewModel.darkMode}
              effects={characterEffects}
              pettable={canPatRandomNudge2}
              onPet={handlePet}
            />
            ) : (
              <div className="screen-layout__character screen-layout__character--play-chase">
                <PlayChase />
              </div>
            )}
          </>
        ) : (
          <>
            {viewModel.dialogue && (
              <DialogueBox
                variant={viewModel.dialogue.variant}
                className="screen-layout__dialogue"
              >
                {viewModel.dialogue.text}
              </DialogueBox>
            )}
            {!viewModel.hideCharacter ? (
            <CharacterStack
              key={viewModel.spriteKey ?? viewModel.sprite}
              variant={viewModel.sprite}
              idleMood={viewModel.idleMood}
              lightsOut={!!session.roomDark && viewModel.darkMode}
              effects={characterEffects}
              pettable={canPet}
              onPet={handlePet}
            />
            ) : (
              <div className="screen-layout__character screen-layout__character--play-chase">
                <PlayChase />
              </div>
            )}
            {viewModel.showHiBaby && (
              <div className="screen-layout__actions">
                <PixelButton variant="purple" onClick={connect}>
                  {AFFECTION.connectLabel}
                </PixelButton>
                <PixelButton variant="purple" onClick={handleLove}>
                  {AFFECTION.loveLabel}
                </PixelButton>
              </div>
            )}
          </>
        )}
      </ScreenLayout>
      </div>

      <SettingsPanel
        open={settingsOpen}
        preferences={preferences}
        onClose={() => setSettingsOpen(false)}
        onChange={updatePreferences}
      />

      {(quietHours || nightMode) && viewModel.phase === 'resting' && (
        <span className="visually-hidden">
          {nightMode
            ? `${preferences.tillyName} is sleeping until morning.`
            : `Quiet hours — ${preferences.tillyName} is resting.`}
        </span>
      )}
    </div>
  )
}
