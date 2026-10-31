import { useRef, useState } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export interface UseScrollReactiveHeaderOptions {
  threshold?: number;
}

export interface UseScrollReactiveHeaderReturn {
  scrollY: Animated.Value;
  isScrolled: boolean;
  isScrolledRef: React.MutableRefObject<boolean>;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function useScrollReactiveHeader(
  options?: UseScrollReactiveHeaderOptions,
): UseScrollReactiveHeaderReturn {
  const threshold = options?.threshold ?? 15;
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
        if (offsetY > threshold && !isScrolledRef.current) {
          isScrolledRef.current = true;
          setIsScrolled(true);
        } else if (offsetY <= threshold && isScrolledRef.current) {
          isScrolledRef.current = false;
          setIsScrolled(false);
        }
      },
    },
  );

  return {
    scrollY,
    isScrolled,
    isScrolledRef,
    handleScroll,
  };
}

export default useScrollReactiveHeader;

