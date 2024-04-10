// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BorrowFI.sol";
import "../src/Token.sol";

contract Deploy_BorrowFI is Script {
    function run() external {
        vm.startBroadcast();
        Token borrowToken = Token(0x31c14fcbD235bf3617EcA5a3A548f7F000d61eC0);
        Token collateralToken = Token(0x38cd4AA34a495f6ACA8b04401860F82C93563F99);
        BorrowFI borrowFI = BorrowFI(0x10EB53ea44C9A493874cE0279b8Db9C460f3EfA4);

        // Transfer to Test User
        collateralToken.transfer(0x40F01b39E488e30E7Fa67522E5B2622F42DF44B0, 2e18);
        // collateralToken.approve(address(borrowFI), type(uint256).max);
        // borrowFI.addCollateral(collateralToken.balanceOf(msg.sender));
    }
}
