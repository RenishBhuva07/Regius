import React, { createContext, useContext, useMemo, useState } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  completePayment: () => void;
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  completePayment: () => {},
});

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const value = useMemo(
    () => ({
      isPremium,
      completePayment: () => setIsPremium(true),
    }),
    [isPremium]
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
};

export const usePremium = () => useContext(PremiumContext);
