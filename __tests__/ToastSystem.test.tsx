import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import Toast from 'react-native-toast-message';
import { toastConfig, RegiusToast } from '../src/Common/ToastConfig';
import { ToastHelper } from '../src/Common/ToastHelper';
import { ThemeProvider } from '../src/Theme/ThemeContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

describe('Regius Toast System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<ThemeProvider>{ui}</ThemeProvider>);
    });
    return renderer!;
  };

  it('exports toastConfig for success, error, info, and warning', () => {
    expect(toastConfig.success).toBeDefined();
    expect(toastConfig.error).toBeDefined();
    expect(toastConfig.info).toBeDefined();
    expect(toastConfig.warning).toBeDefined();
  });

  it('renders title and description properly', () => {
    const renderer = renderWithTheme(
      <RegiusToast
        variant="info"
        text1="Speed Adjusted"
        text2="Speech playback rate set to 1.25x"
      />,
    );

    const root = renderer.root;
    const texts = root.findAllByType(Text).map(t => t.props.children);
    expect(texts).toContain('Speed Adjusted');
    expect(texts).toContain('Speech playback rate set to 1.25x');
  });

  it('handles single text2 message gracefully', () => {
    const renderer = renderWithTheme(
      <RegiusToast variant="info" text2="Speech playback rate set to 1.25x" />,
    );

    const root = renderer.root;
    const texts = root.findAllByType(Text).map(t => t.props.children);
    expect(texts).toContain('Speech playback rate set to 1.25x');
  });

  it('calls onPress callback when toast card is tapped', () => {
    const mockOnPress = jest.fn();
    const renderer = renderWithTheme(
      <RegiusToast
        variant="warning"
        text1="Battery Low"
        text2="Please connect charger."
        onPress={mockOnPress}
      />,
    );

    const cardTouchable = renderer.root.findByProps({
      testID: 'regius-toast-card',
    });
    cardTouchable.props.onPress();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('invokes hide callback when dismiss button is pressed', () => {
    const mockHide = jest.fn();
    const renderer = renderWithTheme(
      <RegiusToast
        variant="success"
        text1="Saved"
        text2="Settings updated"
        hide={mockHide}
      />,
    );

    const dismissTouchable = renderer.root.findAllByProps({
      accessibilityLabel: 'Dismiss notification',
    })[0];
    dismissTouchable.props.onPress();
    expect(mockHide).toHaveBeenCalledTimes(1);
  });

  describe('ToastHelper', () => {
    it('dispatches success toast', () => {
      ToastHelper.success('Operation completed', 'Great');
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Great',
        text2: 'Operation completed',
      });
    });

    it('dispatches error toast', () => {
      ToastHelper.error('Invalid token', 'Auth Error');
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Auth Error',
        text2: 'Invalid token',
      });
    });

    it('dispatches info toast', () => {
      ToastHelper.info('Updating assets');
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'info',
        text1: 'Info',
        text2: 'Updating assets',
      });
    });

    it('dispatches warning toast', () => {
      ToastHelper.warning('Storage almost full');
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'warning',
        text1: 'Warning',
        text2: 'Storage almost full',
      });
    });
  });
});
