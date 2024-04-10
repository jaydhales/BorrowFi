import { ConnectButton, useActiveWalletChain } from "thirdweb/react";
import { client } from "../client";

const Header = () => {
  return (
    <div className="flex justify-between py-4 w-full">
      <p className="text-3xl font-bold italic">BorrowFI</p>
      <div>
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Example app",
            url: "https://example.com",
          }}
          autoConnect={true}
        />
      </div>
    </div>
  );
};

export default Header;
