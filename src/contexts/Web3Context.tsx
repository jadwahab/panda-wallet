import React, { createContext, useEffect, FC } from "react";
import { storage } from "../utils/storage";
import { useWalletLockState } from "../hooks/useWalletLockState";
import { useBsv } from "../hooks/useBsv";
import { useOrds } from "../hooks/useOrds";
import { BSV_DECIMAL_CONVERSION } from "../utils/constants";
import { formatUSD } from "../utils/format";

export const Web3Context = createContext(undefined);

interface Web3ProviderProps {
  children: React.ReactNode;
}
export const Web3Provider: FC<Web3ProviderProps> = (
  props: Web3ProviderProps
) => {
  const { children } = props;
  const { isLocked } = useWalletLockState();
  const { bsvAddress, bsvPubKey, bsvBalance, exchangeRate } = useBsv();
  const { ordAddress, ordinals, ordPubKey } = useOrds();

  useEffect(() => {
    if (isLocked) {
      storage.remove("appState");
      return;
    }
    const balance = {
      bsv: bsvBalance,
      sat: Math.round(bsvBalance * BSV_DECIMAL_CONVERSION),
      usd: formatUSD(bsvBalance * exchangeRate),
    };
    storage.set({
      appState: {
        isLocked,
        ordinals,
        balance,
        addresses: { bsvAddress, ordAddress },
        pubKeys: { bsvPubKey, ordPubKey },
      },
    });
  }, [
    isLocked,
    bsvAddress,
    ordAddress,
    ordinals,
    bsvPubKey,
    ordPubKey,
    bsvBalance,
    exchangeRate,
  ]);

  return (
    <Web3Context.Provider value={undefined}>{children}</Web3Context.Provider>
  );
};
