import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { ScreenQuoteKey } from './dailyQuotesData';
import * as DailyQuotesService from './DailyQuotesService';

/**
 * React hook delivering the screen's random quote of the day.
 * Automatically updates at 12:00 AM midnight and on app resume.
 */
export function useDailyQuote(screen: ScreenQuoteKey): string {
  const [quote, setQuote] = useState<string>(() =>
    DailyQuotesService.getDailyQuote(screen),
  );
  const currentDateKeyRef = useRef<string>(
    DailyQuotesService.getLocalDateKey(),
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleMidnightUpdate = () => {
      const msUntilMidnight = DailyQuotesService.getMsUntilNextMidnight();
      timeoutId = setTimeout(() => {
        const todayKey = DailyQuotesService.getLocalDateKey();
        currentDateKeyRef.current = todayKey;
        setQuote(DailyQuotesService.getDailyQuote(screen));
        scheduleMidnightUpdate();
      }, msUntilMidnight);
    };

    scheduleMidnightUpdate();

    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'active') {
          const todayKey = DailyQuotesService.getLocalDateKey();
          if (todayKey !== currentDateKeyRef.current) {
            currentDateKeyRef.current = todayKey;
            setQuote(DailyQuotesService.getDailyQuote(screen));
            if (timeoutId) clearTimeout(timeoutId);
            scheduleMidnightUpdate();
          }
        }
      },
    );

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.remove();
    };
  }, [screen]);

  return quote;
}
