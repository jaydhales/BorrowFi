import {
  prepareContractCall,
  sendAndConfirmTransaction,
  toWei,
} from "thirdweb";
import {
  bfiContract,
  cltContract,
  protocolA,
  protocolContract,
} from "../client";
import { useActiveAccount } from "thirdweb/react";
import { approve } from "thirdweb/extensions/erc20";
import { useState } from "react";
import toast from "react-hot-toast";

const Borrow = ({
  refetchStatState,
}: {
  refetchStatState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) => {
  const account = useActiveAccount();
  const [borrowValue, setBorrowValue] = useState("");
  const [repayValue, setRepayValue] = useState("");

  const repay$BFI = async () => {
    if (!account) {
      return toast.error("No account connected");
    }

    toast.loading("Approving $BFI");
    const approveTx = prepareContractCall({
      contract: bfiContract,
      method: "approve",
      params: [protocolA, toWei(repayValue)],
    });

    const approveReceipt = await sendAndConfirmTransaction({
      transaction: approveTx,
      account,
    });

    if (!approveReceipt) {
      toast.dismiss();

      return toast.error("Failed to approve");
    }
    toast.dismiss();
    toast.loading("Repaying $BFI");

    const transaction = prepareContractCall({
      contract: protocolContract,
      method: "repay",
      params: [toWei(repayValue)],
    });

    const receipt = await sendAndConfirmTransaction({
      transaction,
      account,
    });

    if (!receipt) {
      toast.dismiss();

      return toast.error("Failed to deposit");
    }

    refetchStatState[1](true);

    setRepayValue("");
    toast.dismiss();

    return toast.success("$BFI repaid successfully");
  };

  const borrow$BFI = async () => {
    if (!account) {
      return toast.error("No account connected");
    }

    toast.loading("Borrowing $BFI");
    const transaction = prepareContractCall({
      contract: protocolContract,
      method: "borrow",
      params: [toWei(borrowValue)],
    });

    const receipt = await sendAndConfirmTransaction({
      transaction,
      account,
    });

    if (!receipt) {
      toast.dismiss();
      return toast.error("Failed to borrow");
    }

    refetchStatState[1](true);

    setBorrowValue("");
    toast.dismiss();
    return toast.success("$BFI borrowed successfully");
  };

  return (
    <div className="rounded-lg border bg-gray-900 py-3 px-6 grid gap-6">
      <p className="text-3xl font-black">$BFI Loan Management</p>
      <div>
        <p className="font-bold">Borrow </p>
        <div className="flex flex-wrap gap-2">
          <input
            className="appearance-none block flex-1 bg-gray-200 text-gray-700 border border-gray-200 rounded py-1.5 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="number"
            placeholder="1 (10**18)"
            step={"0.001"}
            value={borrowValue}
            onChange={(e) => setBorrowValue(e.target.value)}
          />
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold  py-1.5 px-2 w-28 rounded disabled:opacity-70"
            type="button"
            onClick={borrow$BFI}
            disabled={Number(borrowValue) === 0}
          >
            Borrow
          </button>
        </div>
      </div>

      <div>
        <p className="font-bold">Repay </p>
        <div className="flex flex-wrap gap-2">
          <input
            className="appearance-none block flex-1 bg-gray-200 text-gray-700 border  border-gray-200 rounded py-1.5 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="number"
            placeholder="1 (10**18)"
            step={"0.001"}
            value={repayValue}
            onChange={(e) => setRepayValue(e.target.value)}
          />
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 disabled:opacity-70 focus:shadow-outline focus:outline-none text-white font-bold py-1.5 px-2 rounded w-28"
            type="button"
            onClick={repay$BFI}
            disabled={Number(repayValue) === 0}
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
