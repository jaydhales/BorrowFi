import {
  prepareContractCall,
  sendAndConfirmTransaction,
  toWei,
} from "thirdweb";
import { cltContract, protocolA, protocolContract } from "../client";
import { useActiveAccount } from "thirdweb/react";
import { approve } from "thirdweb/extensions/erc20";
import { useState } from "react";
import toast from "react-hot-toast";

const Collateral = ({
  refetchStatState,
}: {
  refetchStatState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) => {
  const account = useActiveAccount();
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");

  const depositCollateral = async () => {
    if (!account) {
      return toast.error("No account connected");
    } else {
      toast.loading("Approving $CLT");
      const approveTx = prepareContractCall({
        contract: cltContract,
        method: "approve",
        params: [protocolA, toWei(depositValue)],
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
      toast.loading("Depositing $CLT");

      const transaction = prepareContractCall({
        contract: protocolContract,
        method: "addCollateral",
        params: [toWei(depositValue)],
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

      setDepositValue("");
      toast.dismiss();

      return toast.success("Collateral Deposited successfully");
    }
  };

  const withdrawCollateral = async () => {
    if (!account) {
      return toast.error("No account connected");
    }

    toast.loading("Withdrawing $CLT");

    const transaction = prepareContractCall({
      contract: protocolContract,
      method: "withdrawCollateral",
      params: [toWei(withdrawValue)],
    });

    const receipt = await sendAndConfirmTransaction({
      transaction,
      account,
    });

    if (!receipt) {
      toast.dismiss();
      return toast.error("Failed to withdraw");
    }

    refetchStatState[1](true);

    setWithdrawValue("");

    toast.dismiss();
    return toast.success("Collateral Withdrawn successfully");
  };

  return (
    <div className="rounded-lg border bg-gray-900 py-3 px-6 grid gap-6">
      <p className="text-3xl font-black">Collateral Management</p>
      <div>
        <p className="font-bold">Deposit Collateral</p>
        <div className="flex flex-wrap gap-2">
          <input
            className="appearance-none block flex-1 bg-gray-200 text-gray-700 border border-gray-200 rounded py-1.5 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="number"
            placeholder="1 (10**18)"
            step={"0.001"}
            value={depositValue}
            onChange={(e) => setDepositValue(e.target.value)}
          />
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold  py-1.5 px-2 w-28 rounded disabled:opacity-70"
            type="button"
            onClick={depositCollateral}
            disabled={Number(depositValue) === 0}
          >
            Deposit
          </button>
        </div>
      </div>

      <div>
        <p className="font-bold">Withdraw</p>
        <div className="flex flex-wrap gap-2">
          <input
            className="appearance-none block flex-1 bg-gray-200 text-gray-700 border  border-gray-200 rounded py-1.5 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="number"
            placeholder="1 (10**18)"
            step={"0.001"}
            value={withdrawValue}
            onChange={(e) => setWithdrawValue(e.target.value)}
          />
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 disabled:opacity-70 focus:shadow-outline focus:outline-none text-white font-bold py-1.5 px-2 rounded w-28"
            type="button"
            onClick={withdrawCollateral}
            disabled={Number(withdrawValue) === 0}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collateral;
