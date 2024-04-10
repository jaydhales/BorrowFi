import Header from "./components/Header";
import Stats from "./components/Stats";
import Collateral from "./components/Collateral";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { useEffect, useState } from "react";
import { sepolia } from "thirdweb/chains";
import Borrow from "./components/Borrow";

export function App() {
  const switchActiveWalletChain = useSwitchActiveWalletChain();
  const chainId = useActiveWalletChain();
  const refetchStatState = useState(false);

  useEffect(() => {
    if (!!chainId && chainId != sepolia) {
      switchActiveWalletChain(sepolia);
    }
  }, [chainId]);

  return (
    <main className="p-4 pb-10 container max-w-screen-xl mx-auto">
      <Header />
      <Stats refetchStatState={refetchStatState} />

      <div className="mx-auto  pt-16">
        <p className="text-5xl text-center font-bold mb-4">
          Lend $BFI with your $CLT
        </p>
        {!!chainId ? (
          <div className="grid max-lg:max-w-xl max-lg:mx-auto lg:grid-cols-2 gap-8 pt-8 lg:px-6">
            <Collateral refetchStatState={refetchStatState} />
            <Borrow refetchStatState={refetchStatState} />
          </div>
        ) : (
          <div className="text-center text-3xl font-bold">Connect to Start</div>
        )}
      </div>
    </main>
  );
}
