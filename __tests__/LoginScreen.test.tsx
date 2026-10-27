import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { LoginScreen } from '../src/Screens/Login/LoginScreen';
import { AuthContext } from '../src/Context/AuthContext';
import { ThemeContext } from '../src/Theme/ThemeContext';

// Mock Lucide icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const View = require('react-native').View;
  const MockIcon = (props: any) => React.createElement(View, props);
  return {
    KeyRound: MockIcon,
    X: MockIcon,
    ShieldCheck: MockIcon,
    FileText: MockIcon,
    Lock: MockIcon,
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

describe('LoginScreen Design System & Auth Mode Tests', () => {
  const mockSetAuthState = jest.fn();

  const renderWithProviders = (isDarkMode = false) => {
    return ReactTestRenderer.create(
      <ThemeContext.Provider
        value={{
          isDarkMode,
          Colors: {} as any,
          toggleTheme: jest.fn(),
          setDarkMode: jest.fn(),
          activeThemeId: 'classic_light',
          setActiveThemeId: jest.fn(),
          themePresets: [] as any,
        }}
      >
        <AuthContext.Provider
          value={{
            isLoading: false,
            user: null,
            isAuthenticated: false,
            requiresProfileCompletion: false,
            setAuthState: mockSetAuthState,
            updateUser: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <LoginScreen />
        </AuthContext.Provider>
      </ThemeContext.Provider>,
    );
  };

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

  it('renders Sign In mode by default with luxury heading and welcome badge', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = renderWithProviders(false);
    });

    const root = renderer!.root;
    const textNodes = root.findAllByType(Text);
    const allText = textNodes.map(n => n.props.children?.toString()).join(' ');

    expect(allText).toContain('Sign In to Regius');
    expect(allText).toContain('WELCOME BACK');
    expect(allText).toContain('Plan your day in details with mindful luxury');
    expect(allText).toContain('Remember this device for 30 days');
    expect(allText).toContain('Forgot?');
    expect(allText).toContain('Continue as Guest');
  });

  it('switches to Create Account mode and renders registration fields', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = renderWithProviders(false);
    });

    const root = renderer!.root;

    // Find "Create Account" switch tab
    const touchables = root.findAllByType(TouchableOpacity);
    const createAccountTab = touchables.find(t => {
      const texts = t.findAllByType(Text);
      return texts.some(tx => tx.props.children === 'Create Account');
    });

    expect(createAccountTab).toBeDefined();

    await ReactTestRenderer.act(() => {
      createAccountTab!.props.onPress();
    });

    const textNodes = root.findAllByType(Text);
    const allText = textNodes.map(n => n.props.children?.toString()).join(' ');

    expect(allText).toContain('Create an Account');
    expect(allText).toContain('JOIN THE REALM');
    expect(allText).toContain('Experience artisanal productivity');
    expect(allText).toContain('Full Name');
    expect(allText).toContain('Terms');
    expect(allText).toContain('Privacy Policy');
  });

  it('allows continuing as guest directly to Dashboard', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = renderWithProviders(false);
    });

    const root = renderer!.root;
    const touchables = root.findAllByType(TouchableOpacity);
    const guestButton = touchables.find(t => {
      const texts = t.findAllByType(Text);
      return texts.some(tx =>
        tx.props.children?.toString().includes('Continue as Guest'),
      );
    });

    expect(guestButton).toBeDefined();

    await ReactTestRenderer.act(() => {
      guestButton!.props.onPress();
    });

    expect(mockReplace).toHaveBeenCalledWith('MainTabs', {
      screen: 'Dashboard',
      params: { justLoggedIn: true },
    });
  });

  it('triggers authentication on submit', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = renderWithProviders(false);
    });

    const root = renderer!.root;

    // Enter email
    const textInputs = root.findAllByType(TextInput);
    expect(textInputs.length).toBeGreaterThanOrEqual(2);

    await ReactTestRenderer.act(() => {
      textInputs[0].props.onChangeText('royalty@regius.ai');
      textInputs[1].props.onChangeText('secretPass123');
    });

    // Find primary submit button
    const submitBtn = root.findByProps({
      accessibilityLabel: 'Primary auth submit',
    });
    expect(submitBtn).toBeDefined();

    await ReactTestRenderer.act(() => {
      submitBtn!.props.onPress();
    });

    // Fast-forward auth timer
    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(1200);
    });

    expect(mockSetAuthState).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'royalty@regius.ai',
        name: 'royalty',
      }),
      false,
    );

    expect(mockReplace).toHaveBeenCalledWith('MainTabs', {
      screen: 'Dashboard',
      params: { justLoggedIn: true },
    });
  });

  it('supports Social Authentication (Google and Apple)', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = renderWithProviders(false);
    });

    const root = renderer!.root;
    const touchables = root.findAllByType(TouchableOpacity);
    const googleBtn = touchables.find(t => {
      const texts = t.findAllByType(Text);
      return texts.some(tx => tx.props.children === 'Google');
    });

    expect(googleBtn).toBeDefined();

    await ReactTestRenderer.act(() => {
      googleBtn!.props.onPress();
    });

    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockSetAuthState).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Google User',
      }),
      false,
    );
  });
});
