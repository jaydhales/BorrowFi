// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BorrowFI.sol";
import "../src/Token.sol";

contract Deploy_BorrowFI is Script {
	function run() external {
		vm.startBroadcast();
		Token borrowToken = new Token("$BorrowFI", "BFI");
		Token collateralToken = new Token("$Collateral", "CLT");
		BorrowFI borrowFI = new BorrowFI(address(borrowToken), address(collateralToken));


		// Transfer all Borrowable Token to Protocol;
		borrowToken.transfer(address(borrowFI), 100_000 * 10**18);
	}
}