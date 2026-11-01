import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Plus, ChevronRight, SlidersHorizontal } from 'lucide-react-native';
import { HeaderActionButton } from '../src/Common/HeaderActionButton';

describe('HeaderActionButton Primitive Suite', () => {
  it('renders default gold accent and label cleanly', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <HeaderActionButton
          label="Add Category"
          icon={Plus}
          onPress={jest.fn()}
        />,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('Add Category');
    expect(str).toContain('#1E2028'); // Luxury Nero container
    expect(str).toContain('#363944'); // Border
    expect(str).toContain('#F5C518'); // Default Gold accent
    expect(str).toContain('rgba(245, 197, 24, 0.15)'); // Circular wrap aura
  });

  it('renders icon on the left by default (like Add Category & Configure)', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <HeaderActionButton
          label="Configure"
          icon={SlidersHorizontal}
          onPress={jest.fn()}
        />,
      );
    });

    const root = tree.root;
    const touchable = root.findByProps({ accessibilityRole: 'button' });
    const children = touchable.props.children;

    // First child is the icon wrap, second is the text, third is false
    expect(children[0]).toBeTruthy(); // iconNode on left
    expect(children[1].props.children).toBe('Configure');
    expect(children[2]).toBeFalsy();
  });

  it('renders icon on the right when iconPosition="right" (like Voice Studio)', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <HeaderActionButton
          label="Voice Studio"
          icon={ChevronRight}
          iconPosition="right"
          onPress={jest.fn()}
        />,
      );
    });

    const root = tree.root;
    const touchable = root.findByProps({ accessibilityRole: 'button' });
    const children = touchable.props.children;

    // First child is false, second is the text, third is the icon wrap
    expect(children[0]).toBeFalsy();
    expect(children[1].props.children).toBe('Voice Studio');
    expect(children[2]).toBeTruthy(); // iconNode on right
  });

  it('triggers onPress callback when clicked', () => {
    const onPressMock = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <HeaderActionButton
          label="Add Category"
          icon={Plus}
          onPress={onPressMock}
        />,
      );
    });

    const touchable = tree.root.findByProps({ accessibilityRole: 'button' });
    act(() => {
      touchable.props.onPress();
    });

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('supports custom accentColor and hexToRgba aura generation', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <HeaderActionButton
          label="Studio Audio"
          icon={ChevronRight}
          accentColor="#8383D6"
          onPress={jest.fn()}
        />,
      );
    });

    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('#8383D6');
    expect(str).toContain('rgba(131, 131, 214, 0.15)');
  });

  it('applies custom accessibilityLabel when provided', () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <HeaderActionButton
          label="Voice Studio"
          icon={ChevronRight}
          onPress={jest.fn()}
          accessibilityLabel="Open Voice Studio and Audition Neural Personas"
        />,
      );
    });

    const touchable = tree.root.findByProps({
      accessibilityLabel: 'Open Voice Studio and Audition Neural Personas',
    });
    expect(touchable).toBeTruthy();
  });
});
