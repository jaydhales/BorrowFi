import { createThirdwebClient, getContract } from "thirdweb";

import { sepolia } from "thirdweb/chains";
import protocolAbi from "./abis/BorrowFI.json";
import erc20Abi from "./abis/IERC20.json";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

export const client = createThirdwebClient({
  clientId: "011734da152f29749ef3072f373a431b",
});

export const loadContract = (contractAddr: `0x${string}`, abi: any) =>
  getContract({
    client,
    chain: sepolia,
    address: contractAddr,
    // optional ABI
    abi: abi,
  });

export const protocolA = "0x31c14fcbd235bf3617eca5a3a548f7f000d61ec0";
export const bfiA = "0x10eb53ea44c9a493874ce0279b8db9c460f3efa4";
export const cltA = "0x38cd4aa34a495f6aca8b04401860f82c93563f99";

export const protocolContract = loadContract(protocolA, protocolAbi.abi);

export const bfiContract = loadContract(bfiA, erc20Abi.abi);
export const cltContract = loadContract(cltA, erc20Abi.abi);
