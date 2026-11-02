import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ModalBottomBar } from '../src/Components/AddModal/ModalBottomBar';
import { ThemeContext, lightColors, darkColors, THEME_PRESETS } from '../src/Theme/ThemeContext';
import { Colors } from '../src/Assets/StyleUtilities/Colors';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

describe('ModalBottomBar Common Component Suite', () => {
  it('renders dismiss and submit buttons with expected labels and styling', () => {
    const handleClose = jest.fn();
    const handleSubmit = jest.fn();

    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ModalBottomBar
          onClose={handleClose}
          onSubmit={handleSubmit}
          submitText="Create Task"
        />,
      );
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Create Task');
    expect(json).toContain(Colors.MidnightCharcoal);
  });

  it('triggers onClose when back/dismiss button is pressed', () => {
    const handleClose = jest.fn();
    const handleSubmit = jest.fn();

    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ModalBottomBar
          onClose={handleClose}
          onSubmit={handleSubmit}
          submitText="Create Reminder"
        />,
      );
    });

    const root = tree.root;
    const backBtn = root.findByProps({ accessibilityLabel: 'Go back' });

    act(() => {
      backBtn.props.onPress();
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('triggers onSubmit when submit hero button is pressed', () => {
    const handleClose = jest.fn();
    const handleSubmit = jest.fn();

    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ModalBottomBar
          onClose={handleClose}
          onSubmit={handleSubmit}
          submitText="Create Habit Flow"
        />,
      );
    });

    const root = tree.root;
    const submitBtn = root.findByProps({ accessibilityLabel: 'Create Habit Flow' });

    act(() => {
      submitBtn.props.onPress();
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not trigger onSubmit when disabled', () => {
    const handleSubmit = jest.fn();

    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ModalBottomBar
          onClose={jest.fn()}
          onSubmit={handleSubmit}
          submitText="Save Changes"
          disabled={true}
        />,
      );
    });

    const root = tree.root;
    const submitBtn = root.findByProps({ accessibilityLabel: 'Save Changes' });

    act(() => {
      submitBtn.props.onPress();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('adapts view background color in dark mode matching header aesthetic', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ThemeContext.Provider
          value={{
            isDarkMode: true,
            Colors: darkColors,
            toggleTheme: jest.fn(),
            setDarkMode: jest.fn(),
            activeThemeId: 'classic_dark',
            setActiveThemeId: jest.fn(),
            themePresets: THEME_PRESETS,
          }}
        >
          <ModalBottomBar
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            submitText="Create Task"
          />
        </ThemeContext.Provider>,
      );
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('#282048'); // Dark header/bottom-bar background
  });

  it('adapts view background color in light mode matching header aesthetic', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <ThemeContext.Provider
          value={{
            isDarkMode: false,
            Colors: lightColors,
            toggleTheme: jest.fn(),
            setDarkMode: jest.fn(),
            activeThemeId: 'classic_light',
            setActiveThemeId: jest.fn(),
            themePresets: THEME_PRESETS,
          }}
        >
          <ModalBottomBar
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            submitText="Create Task"
          />
        </ThemeContext.Provider>,
      );
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain(Colors.LavenderPurple); // Light header/bottom-bar background
  });
});
