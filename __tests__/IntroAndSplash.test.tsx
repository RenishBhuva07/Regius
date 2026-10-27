import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import SplashScreen from '../src/Screens/Splash/Splash';
import Intro from '../src/Screens/Intro/Intro';

// Mock SVGs
jest.mock('../src/Assets/Images', () => {
  const React = require('react');
  const View = require('react-native').View;
  const MockSvg = (props: any) => React.createElement(View, props);
  return {
    SVGS: {
      RegiusAvatar: MockSvg,
      FloatHeart: MockSvg,
      FloatPicture: MockSvg,
      OfficeBag: MockSvg,
      HeartBordered: MockSvg,
      PictureBordered: MockSvg,
      Btn: MockSvg,
      BtnIcon: MockSvg,
      IntroHeroIllustration: MockSvg,
    },
  };
});

// Mock lucide icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const View = require('react-native').View;
  const MockIcon = (props: any) => React.createElement(View, props);
  return {
    CheckSquare: MockIcon,
    Bell: MockIcon,
    Flame: MockIcon,
    ArrowRight: MockIcon,
    Crown: MockIcon,
    Sparkles: MockIcon,
  };
});

// Mock navigation
const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
    navigate: mockNavigate,
  }),
}));

// Mock safe area insets
jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
  };
});

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

describe('SplashScreen & Intro Screen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    ReactTestRenderer.act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders SplashScreen with RegiusLogo and tagline without throwing', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<SplashScreen />);
    });

    const root = renderer!.root;
    const textNodes = root.findAllByType(Text);
    const hasTagline = textNodes.some(node =>
      node.props.children?.toString().includes('Mindful Productivity & Flow'),
    );
    expect(hasTagline).toBe(true);
  });

  it('renders Intro screen with all 3 steps (Tasks, Reminders, Habits)', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Intro />);
    });

    const root = renderer!.root;
    const textNodes = root.findAllByType(Text);
    const allText = textNodes.map(n => n.props.children?.toString()).join(' ');

    expect(allText).toContain('Plan Your Day In Details');
    expect(allText).toContain('Never Miss What Matters');
    expect(allText).toContain('Build Lasting Daily Rituals');
    expect(allText).toContain('Skip');
    expect(allText).not.toContain('Regius');
  });

  it('navigates to Login when Skip is pressed on Intro', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Intro />);
    });

    const root = renderer!.root;
    const skipButton = root.findByProps({ accessibilityLabel: 'Skip intro' });

    await ReactTestRenderer.act(() => {
      skipButton.props.onPress();
    });

    expect(mockReplace).toHaveBeenCalledWith('Login');
  });

  it('advances through steps with Next button and navigates to Login on final step', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Intro />);
    });

    const root = renderer!.root;

    // Step 1 -> Step 2
    let nextButton = root.findByProps({ accessibilityLabel: 'Next step' });
    await ReactTestRenderer.act(() => {
      nextButton.props.onPress();
    });
    expect(mockReplace).not.toHaveBeenCalled();

    // Step 2 -> Step 3
    nextButton = root.findByProps({ accessibilityLabel: 'Next step' });
    await ReactTestRenderer.act(() => {
      nextButton.props.onPress();
    });
    expect(mockReplace).not.toHaveBeenCalled();

    // Step 3 (Get Started) -> Login
    const getStartedBtn = root.findByProps({
      accessibilityLabel: 'Get Started',
    });
    await ReactTestRenderer.act(() => {
      getStartedBtn.props.onPress();
    });
    expect(mockReplace).toHaveBeenCalledWith('Login');
  });
});
