import React from 'react';
import { Text, AppState, AppStateStatus } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { useDailyQuote } from '../src/Services/DailyQuotes/useDailyQuote';
import { ScreenQuoteKey } from '../src/Services/DailyQuotes';
import * as DailyQuotesService from '../src/Services/DailyQuotes/DailyQuotesService';

const TestQuoteComponent: React.FC<{ screen: ScreenQuoteKey }> = ({
  screen,
}) => {
  const quote = useDailyQuote(screen);
  return <Text testID="quote-text">{quote}</Text>;
};

describe('useDailyQuote Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('initializes with the daily quote for the screen', () => {
    let testRenderer: ReactTestRenderer.ReactTestRenderer | null = null;
    act(() => {
      testRenderer = ReactTestRenderer.create(
        <TestQuoteComponent screen="dashboard" />,
      );
    });
    const root = testRenderer!.root;
    const textInstance = root.findByProps({ testID: 'quote-text' });
    expect(textInstance.props.children).toBe(
      DailyQuotesService.getDailyQuote('dashboard'),
    );
  });

  it('updates quote automatically when midnight timer fires', () => {
    const quoteDay1 = 'Make today a little legendary!';
    const quoteDay2 = 'Small steps. Extraordinary days!';

    const getDailyQuoteSpy = jest
      .spyOn(DailyQuotesService, 'getDailyQuote')
      .mockReturnValueOnce(quoteDay1)
      .mockReturnValue(quoteDay2);

    let testRenderer: ReactTestRenderer.ReactTestRenderer | null = null;
    act(() => {
      testRenderer = ReactTestRenderer.create(
        <TestQuoteComponent screen="dashboard" />,
      );
    });

    const root = testRenderer!.root;
    let textInstance = root.findByProps({ testID: 'quote-text' });
    expect(textInstance.props.children).toBe(quoteDay1);

    // Fast-forward to midnight
    act(() => {
      jest.runOnlyPendingTimers();
    });

    textInstance = root.findByProps({ testID: 'quote-text' });
    expect(textInstance.props.children).toBe(quoteDay2);
    expect(getDailyQuoteSpy).toHaveBeenCalledTimes(2);
  });

  it('updates quote when AppState transitions to active on a new day', () => {
    let appStateListener: ((state: AppStateStatus) => void) | null = null;
    jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((event, listener) => {
        if (event === 'change') {
          appStateListener = listener as (state: AppStateStatus) => void;
        }
        return { remove: jest.fn() };
      });

    const getLocalDateKeySpy = jest
      .spyOn(DailyQuotesService, 'getLocalDateKey')
      .mockReturnValueOnce('2026-10-22') // initial ref on mount
      .mockReturnValue('2026-10-23'); // subsequent calls (e.g. app resume next day)

    const quoteDay1 = 'Dreams move when you do!';
    const quoteDay2 = 'Progress looks good on you!';
    jest
      .spyOn(DailyQuotesService, 'getDailyQuote')
      .mockReturnValueOnce(quoteDay1)
      .mockReturnValue(quoteDay2);

    let testRenderer: ReactTestRenderer.ReactTestRenderer | null = null;
    act(() => {
      testRenderer = ReactTestRenderer.create(
        <TestQuoteComponent screen="tasks" />,
      );
    });

    const root = testRenderer!.root;
    let textInstance = root.findByProps({ testID: 'quote-text' });
    expect(textInstance.props.children).toBe(quoteDay1);

    // Simulate returning to app foreground after midnight
    act(() => {
      if (appStateListener) {
        appStateListener('active');
      }
    });

    textInstance = root.findByProps({ testID: 'quote-text' });
    expect(textInstance.props.children).toBe(quoteDay2);
  });
});
