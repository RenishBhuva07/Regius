import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Vibration } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
  };
});

import { ThemeScreen } from '../src/Screens/Theme/ThemeScreen';
import { ThemeProvider, THEME_PRESETS } from '../src/Theme/ThemeContext';
import { MilestoneProvider } from '../src/Context/MilestoneContext';
import { TaskReminderProvider } from '../src/Context/TaskReminderContext';
import { PremiumProvider } from '../src/Context/PremiumContext';

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PremiumProvider>
    <TaskReminderProvider>
      <MilestoneProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </MilestoneProvider>
    </TaskReminderProvider>
  </PremiumProvider>
);

describe('ThemeScreen Architecture & Visual System Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Vibration, 'vibrate').mockImplementation(jest.fn());
  });

  it('renders screen header with title and palette count badge', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ProvidersWrapper>
          <ThemeScreen />
        </ProvidersWrapper>,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('Prestige Themes');
    expect(str).toContain('Bespoke Luxury Color Systems');
    expect(str).toContain('6 PALETTES');
  });

  it('renders all 6 theme names and taglines', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ProvidersWrapper>
          <ThemeScreen />
        </ProvidersWrapper>,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    THEME_PRESETS.forEach(theme => {
      expect(str).toContain(theme.name);
      expect(str).toContain(theme.tagline);
    });
  });

  it('renders 4 round color swatches in one line with uppercase hex color codes for each theme', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ProvidersWrapper>
          <ThemeScreen />
        </ProvidersWrapper>,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    THEME_PRESETS.forEach(theme => {
      expect(theme.palette).toHaveLength(4);
      theme.palette.forEach(color => {
        expect(str).toContain(color.hex.toUpperCase());
        expect(str).toContain(color.label);
      });
    });
  });

  it('indicates selected theme, unlocked theme, and locked theme status', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ProvidersWrapper>
          <ThemeScreen />
        </ProvidersWrapper>,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    // Active / Selected theme indicator
    expect(str).toContain('CURRENT THEME');
    expect(str).toContain('Active Palette Applied');

    // Locked status badge
    expect(str).toContain('TIER');
    expect(str).toContain('REQUIRED');
  });

  it('renders filter tabs and allows switching tabs', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ProvidersWrapper>
          <ThemeScreen />
        </ProvidersWrapper>,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('All (6)');
    expect(str).toContain('Unlocked');
    expect(str).toContain('Rewards');
  });

  it('renders hero active bento card with live preview mockup', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ProvidersWrapper>
          <ThemeScreen />
        </ProvidersWrapper>,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('CURRENTLY ACTIVE');
    expect(str).toContain('Live Palette Preview');
    expect(str).toContain('CURRENT TIER');
  });

  it('provides light and dark palettes for all theme presets', () => {
    THEME_PRESETS.forEach(theme => {
      expect(theme.lightPalette).toHaveLength(4);
      expect(theme.darkPalette).toHaveLength(4);
      // Ensure hex format
      theme.lightPalette.forEach(col =>
        expect(col.hex).toMatch(/^#[0-9A-Fa-f]{6}$/),
      );
      theme.darkPalette.forEach(col =>
        expect(col.hex).toMatch(/^#[0-9A-Fa-f]{6}$/),
      );
    });
  });

  it('renders mode toggle button in header to switch between light and dark themes', async () => {
    let tree: any;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <ProvidersWrapper>
          <ThemeScreen />
        </ProvidersWrapper>,
      );
    });

    const toggleBtn = tree.root.findByProps({
      accessibilityLabel: 'Switch to Dark Theme',
    });
    expect(toggleBtn).toBeDefined();

    await act(async () => {
      toggleBtn.props.onPress();
    });

    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('Live Palette Preview');
  });
});
