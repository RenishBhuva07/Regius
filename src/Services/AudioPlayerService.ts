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

  async stop(): Promise<void> {
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
    const sub = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
      listener();
    });
    return () => sub.remove();
  },
};
