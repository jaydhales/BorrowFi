// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract BorrowFI {
    IERC20 public bFI; // Borrow Token
    IERC20 public clt; // Collateral Token

    mapping(address user => uint256 amount) public collateralOf;
    mapping(address user => uint256 amount) public loanOf;

    uint256 public totalBorrowed;
    uint256 public totalCollateral;

    uint256 public constant DECIMALS = 10000;

    constructor(address _bFI, address _clt) {
        bFI = IERC20(_bFI);
        clt = IERC20(_clt);
    }

    function borrow(uint256 amount) external {
        uint256 loanValue = loanOf[msg.sender] + amount;
        uint256 collateralValue = collateralOf[msg.sender];
        if (checkIfHealthy(loanValue, collateralValue)) {
            revert("Insufficient LTC for Borrowing");
        }

        loanOf[msg.sender] += amount;
        totalBorrowed += amount;

        bool success = bFI.transfer(msg.sender, amount);
        assert(success);
    }

    function repay(uint256 amount) external {
        require(bFI.allowance(msg.sender, address(this)) >= amount, "Insufficient Allowance");

        bool success = bFI.transferFrom(msg.sender, address(this), amount);
        assert(success);

        loanOf[msg.sender] -= amount;
        totalBorrowed -= amount;
    }

    function addCollateral(uint256 amount) external {
        require(clt.allowance(msg.sender, address(this)) >= amount, "Insufficient Allowance");

        bool success = clt.transferFrom(msg.sender, address(this), amount);
        assert(success);

        collateralOf[msg.sender] += amount;
        totalCollateral += amount;
    }

    function withdrawCollateral(uint256 amount) external {
        uint256 loanValue = loanOf[msg.sender];
        uint256 collateralValue = collateralOf[msg.sender] - amount;

        if (checkIfHealthy(loanValue, collateralValue)) {
            revert("Insufficient LTC for Collateral Withdrawal");
        }

        collateralOf[msg.sender] -= amount;
        totalCollateral -= amount;

        bool success = clt.transfer(msg.sender, amount);
        assert(success);
    }

    function getLTC() public view returns (uint256 ratio) {
        uint256 collateralValue = collateralOf[msg.sender];
        uint256 loanValue = loanOf[msg.sender];

        ratio = calculateLTC(loanValue, collateralValue);
    }

    function isHealthy() public view returns (bool) {
        return getLTC() >= 7000;
    }

    function checkIfHealthy(uint256 loanValue, uint256 collateralValue) internal pure returns (bool) {
        return calculateLTC(loanValue, collateralValue) >= 7000;
    }

    function calculateLTC(uint256 loanValue, uint256 collateralValue) internal pure returns (uint256 ratio) {
        ratio = (loanValue * DECIMALS) / collateralValue;
    }
}
