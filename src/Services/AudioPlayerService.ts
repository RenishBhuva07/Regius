import TrackPlayer, {
  Capability,
  Event,
  State,
} from 'react-native-track-player';

let isPlayerReady = false;

export interface PlaybackTrack {
  id: string;
  url: string | number | any;
  title: string;
  artist?: string;
  artwork?: string | number | any;
}

export interface AudioPlaybackCallbacks {
  onStart?: () => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
}

let activeSessionId = 0;
let activeSessionCleanup: (() => void) | null = null;

export const AudioPlayerService = {
  async setup(): Promise<boolean> {
    if (isPlayerReady) return true;
    try {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      isPlayerReady = true;
      return true;
    } catch (e: any) {
      // If already initialized in hot-reload, ignore error
      if (
        e?.message?.includes?.('already initialized') ||
        e?.code === 'player_already_initialized'
      ) {
        isPlayerReady = true;
        return true;
      }
      console.warn('[AudioPlayerService] setupPlayer error:', e);
      return false;
    }
  },

  async play(track: PlaybackTrack): Promise<void> {
    await this.setup();
    try {
      this.cancelActiveSession();
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.url,
        title: track.title,
        artist: track.artist || 'Regius Neural Voice',
        artwork: track.artwork,
      });
      await TrackPlayer.play();
    } catch (e) {
      console.warn('[AudioPlayerService] Play error:', e);
    }
  },

  /**
   * Plays a track and coordinates with native playback lifecycle callbacks.
   * Resolves ONLY when playback genuinely finishes, errors, or reaches safety timeout.
   */
  async playWithCallbacks(
    track: PlaybackTrack,
    callbacks?: AudioPlaybackCallbacks,
    maxTimeoutMs: number = 30000,
  ): Promise<boolean> {
    await this.setup();

    // Clean up any previous session listeners FIRST before generating new session ID!
    this.cancelActiveSession();

    activeSessionId += 1;
    const sessionId = activeSessionId;

    return new Promise<boolean>(async resolve => {
      let settled = false;
      let hasStarted = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      let subState: { remove: () => void } | null = null;
      let subQueue: { remove: () => void } | null = null;
      let subTrack: { remove: () => void } | null = null;
      let subError: { remove: () => void } | null = null;

      const cleanup = () => {
        if (settled) return;
        settled = true;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (subState) {
          subState.remove();
          subState = null;
        }
        if (subQueue) {
          subQueue.remove();
          subQueue = null;
        }
        if (subTrack) {
          subTrack.remove();
          subTrack = null;
        }
        if (subError) {
          subError.remove();
          subError = null;
        }
        activeSessionCleanup = null;
      };

      activeSessionCleanup = cleanup;

      // Safety timeout guard
      timer = setTimeout(() => {
        if (sessionId !== activeSessionId || settled) return;
        console.warn('[AudioPlayerService] Playback safety timeout reached');
        cleanup();
        callbacks?.onError?.(new Error('Playback safety timeout reached'));
        resolve(false);
      }, maxTimeoutMs);

      try {
        // Reset and queue track BEFORE registering listeners so reset does not trigger premature completion
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: track.id,
          url: track.url,
          title: track.title,
          artist: track.artist || 'Regius Neural Voice',
          artwork: track.artwork,
        });

        // Listen for playback state changes
        subState = TrackPlayer.addEventListener(Event.PlaybackState, event => {
          if (sessionId !== activeSessionId || settled) return;

          if (event.state === State.Playing) {
            if (!hasStarted) {
              hasStarted = true;
              callbacks?.onStart?.();
            }
          } else if (event.state === State.Ended) {
            cleanup();
            callbacks?.onEnded?.();
            resolve(true);
          } else if (
            hasStarted &&
            (event.state === State.Stopped || event.state === State.None)
          ) {
            cleanup();
            callbacks?.onEnded?.();
            resolve(true);
          }
        });

        subQueue = TrackPlayer.addEventListener(
          Event.PlaybackQueueEnded,
          () => {
            if (sessionId !== activeSessionId || settled) return;
            cleanup();
            callbacks?.onEnded?.();
            resolve(true);
          },
        );

        subTrack = TrackPlayer.addEventListener(
          Event.PlaybackTrackChanged,
          event => {
            if (sessionId !== activeSessionId || settled) return;
            // When track ends and no next track is queued
            if (hasStarted && event.nextTrack === undefined) {
              cleanup();
              callbacks?.onEnded?.();
              resolve(true);
            }
          },
        );

        subError = TrackPlayer.addEventListener(
          Event.PlaybackError,
          event => {
            if (sessionId !== activeSessionId || settled) return;
            console.warn('[AudioPlayerService] PlaybackError event:', event);
            cleanup();
            callbacks?.onError?.(event);
            resolve(false);
          },
        );

        await TrackPlayer.play();
      } catch (e) {
        console.warn('[AudioPlayerService] playWithCallbacks error:', e);
        cleanup();
        callbacks?.onError?.(e);
        resolve(false);
      }
    });
  },

  async playAndWait(
    track: PlaybackTrack,
    maxTimeoutMs: number = 30000,
  ): Promise<void> {
    await this.playWithCallbacks(track, undefined, maxTimeoutMs);
  },

  cancelActiveSession(): void {
    activeSessionId += 1;
    if (activeSessionCleanup) {
      activeSessionCleanup();
      activeSessionCleanup = null;
    }
  },

  async stop(): Promise<void> {
    this.cancelActiveSession();
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    } catch (e) {
      console.warn('[AudioPlayerService] Stop error:', e);
    }
  },

  async pause(): Promise<void> {
    try {
      await TrackPlayer.pause();
    } catch (e) {
      console.warn('[AudioPlayerService] Pause error:', e);
    }
  },

  async getState(): Promise<State> {
    try {
      return (await TrackPlayer.getPlaybackState()).state;
    } catch {
      return State.None;
    }
  },

  onPlaybackFinished(listener: () => void): () => void {
    const subQueue = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        listener();
      },
    );
    const subState = TrackPlayer.addEventListener(
      Event.PlaybackState,
      event => {
        if (event.state === State.Ended) {
          listener();
        }
      },
    );
    return () => {
      subQueue.remove();
      subState.remove();
    };
  },
};
