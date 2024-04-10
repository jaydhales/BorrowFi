import React, { useEffect, useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client, protocolContract } from "../client";
import {
  ContractOptions,
  encode,
  eth_call,
  fromHex,
  getRpcClient,
  prepareContractCall,
  readContract,
  toEther,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";

const readContractWithFrom = async ({
  contract,
  method,
  returnType,
  from,
  params,
}: {
  contract: Readonly<ContractOptions<any>>;
  method: string;
  returnType: "string" | "number" | "bigint" | "boolean" | "bytes";
  from?: string;
  params?: any[];
}) => {
  const rpcRequest = getRpcClient({ client, chain: sepolia });

  const tx = prepareContractCall({
    contract,
    method,
    params,
  });

  const encodedData = await encode(tx);
  const result = await eth_call(rpcRequest, {
    from,
    to: contract.address,
    data: encodedData,
  });

  if (result) {
    const data = fromHex(result, returnType);
    return {
      data,
      isSuccess: true,
    };
  } else {
    return {
      data: undefined,
      isSuccess: false,
    };
  }
};

const Stats = ({
  refetchStatState,
}: {
  refetchStatState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) => {
  const account = useActiveAccount();
  const [refetchStats, setRefetchStats] = refetchStatState;

  const {
    data: totalBorrowed,
    isSuccess: totalBorrowedSuccess,
    refetch: refetchTotalBorrowed,
  } = useReadContract({
    contract: protocolContract,
    method: "totalBorrowed",
  });

  const {
    data: totalCollateral,
    isSuccess: totalCollateralSuccess,
    refetch: refetchTotalCollateral,
  } = useReadContract({
    contract: protocolContract,
    method: "totalCollateral",
  });

  const {
    data: userLoan,
    isSuccess: userLoanSuccess,
    refetch: refetchUserLoan,
  } = useReadContract({
    contract: protocolContract,
    method: "loanOf",
    params: [account?.address],
  });

  const {
    data: userCollateral,
    isSuccess: userCollateralSuccess,
    refetch: refetchUserCollateral,
  } = useReadContract({
    contract: protocolContract,
    method: "collateralOf",
    params: [account?.address],
  });

  const [{ data: userLTC, isSuccess: userLTCSuccess }, setLTC] = useState<any>({
    data: undefined,
    isSuccess: false,
  });

  const [{ data: isHealthy }, setIsHealthy] = useState<any>({
    data: undefined,
    isSuccess: false,
  });

  useEffect(() => {
    if (refetchStats) {
      setRefetchStats(false);
      refetchTotalBorrowed();
      refetchTotalCollateral();
      refetchUserLoan();
      refetchUserCollateral();
      setRefetchStats(false);
    }
  }, [refetchStats]);

  useEffect(() => {
    if (account) {
      readContractWithFrom({
        contract: protocolContract,
        method: "getLTC",
        returnType: "number",
        from: account?.address,
        params: [],
      }).then((res) => setLTC(res));

      readContractWithFrom({
        contract: protocolContract,
        method: "isHealthy",
        returnType: "boolean",
        from: account?.address,
        params: [],
      }).then((res) => setIsHealthy(res));
    }
  }, [account, refetchStats]);

  return (
    <div className="grid gap-3">
      <div className="grid gap-1 text-right  font-bold">
        <p>
          Total Borrowed $BFI:{" "}
          {totalBorrowedSuccess ? toEther(totalBorrowed) : 0} $BFI
        </p>
        <p>
          Total Collateral:{" "}
          {totalCollateralSuccess ? toEther(totalCollateral) : 0} $CLT
        </p>
      </div>

      {!!account ? (
        <div className="grid gap-1 text-right  font-bold">
          <p>
            Your Loan-To-Collateral Percentage:{" "}
            <span className={!isHealthy ? "text-green-500" : "text-red-500"}>
              {userLTCSuccess ? Number(userLTC) / 100 : 0} %
            </span>
          </p>

          <p>Your Loan: {userLoanSuccess ? toEther(userLoan) : 0} $BFI </p>
          <p>
            Your Collateral:{" "}
            {userCollateralSuccess ? toEther(userCollateral) : 0} $CLT
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Stats;
