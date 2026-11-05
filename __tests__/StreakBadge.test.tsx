jest.mock('@react-native-voice/voice', () => ({
  onSpeechStart: jest.fn(),
  onSpeechRecognized: jest.fn(),
  onSpeechEnd: jest.fn(),
  onSpeechError: jest.fn(),
  onSpeechResults: jest.fn(),
  onSpeechPartialResults: jest.fn(),
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn().mockResolvedValue(undefined),
  removeAllListeners: jest.fn(),
  isRecognizing: jest.fn().mockResolvedValue(false),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-native-track-player', () => ({
  setupPlayer: jest.fn().mockResolvedValue(undefined),
  updateOptions: jest.fn().mockResolvedValue(undefined),
  add: jest.fn().mockResolvedValue(undefined),
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  reset: jest.fn().mockResolvedValue(undefined),
  getState: jest.fn().mockResolvedValue('idle'),
  getProgress: jest.fn().mockResolvedValue({ position: 0, duration: 80 }),
  addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  registerPlaybackService: jest.fn(),
}));

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { StreakBadge } from '../src/Common/StreakBadge';
import * as CommonExports from '../src/Common';

describe('StreakBadge Component Suite', () => {
  it('cleanly exports StreakBadge from Common module', () => {
    expect(StreakBadge).toBeDefined();
    expect(CommonExports.StreakBadge).toBeDefined();
  });

  it('renders streak count label in uppercase by default', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(<StreakBadge streak={18} />);
    });
    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('18D STREAK');
    expect(str).toContain('#E65100'); // Orange text for active streak
    expect(str).toContain('#FFF0DE'); // Orange background
  });

  it('renders zero streak count properly when streak is 0', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(<StreakBadge streak={0} />);
    });
    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('0D STREAK');
    expect(str).toContain('#8E8E93'); // Muted text/flame for 0d streak
  });

  it('supports count prop alias for streak', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(<StreakBadge count={7} />);
    });
    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('7D STREAK');
  });

  it('supports explicit active flag when streak is 0 but completed', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <StreakBadge streak={0} active={true} />,
      );
    });
    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('0D STREAK');
    expect(str).toContain('#E65100');
  });

  it('supports different badge sizes without crashing', () => {
    let treeSm: any;
    let treeMd: any;
    let treeLg: any;
    act(() => {
      treeSm = ReactTestRenderer.create(<StreakBadge streak={10} size="sm" />);
      treeMd = ReactTestRenderer.create(<StreakBadge streak={10} size="md" />);
      treeLg = ReactTestRenderer.create(<StreakBadge streak={10} size="lg" />);
    });
    expect(JSON.stringify(treeSm.toJSON())).toContain('10D STREAK');
    expect(JSON.stringify(treeMd.toJSON())).toContain('10D STREAK');
    expect(JSON.stringify(treeLg.toJSON())).toContain('10D STREAK');
  });

  it('supports lowercase prop when uppercase is set to false', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <StreakBadge streak={14} uppercase={false} />,
      );
    });
    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('14d streak');
  });
});
