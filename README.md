$BorrowFI: https://sepolia.etherscan.io/address/0x10eb53ea44c9a493874ce0279b8db9c460f3efa4
$Collateral: https://sepolia.etherscan.io/address/0x38cd4aa34a495f6aca8b04401860f82c93563f99
BorrowFI Protocol: https://sepolia.etherscan.io/address/0x31c14fcbd235bf3617eca5a3a548f7f000d61ec0



# BorrowFI Protocol
## Introduction
The BorrowFI contract is a simple borrowing and lending platform that allows users to borrow a token (bFI) by locking up another token (clt) as collateral. The contract ensures that the borrower maintains a healthy loan-to-collateral ratio to prevent liquidation.

## Deployed Addresses (Sepolia Chain)
- **Main Protocol**: [0x31c14fcbd235bf3617eca5a3a548f7f000d61ec0](https://sepolia.etherscan.io/address/0x31c14fcbd235bf3617eca5a3a548f7f000d61ec0)
- **$BorrowFI**: [0x10eb53ea44c9a493874ce0279b8db9c460f3efa4](https://sepolia.etherscan.io/address/0x10eb53ea44c9a493874ce0279b8db9c460f3efa4)
- **$Collateral**: [0x38cd4aa34a495f6aca8b04401860f82c93563f99](https://sepolia.etherscan.io/address/0x38cd4aa34a495f6aca8b04401860f82c93563f99)

## Contract Functions

* **constructor(_bFI, _clt)**: This function is the constructor and is called when deploying the contract. It takes the addresses of the bFI and clt tokens as arguments and initializes the corresponding IERC20 instances.

* **borrow(amount)**: This function allows users to borrow bFI tokens. It checks the user's Loan-To-Collateral ratio and reverts if it's unhealthy (below 7000). If healthy, it increases the user's loan amount, total borrowed amount, and transfers the bFI tokens to the user.

* **repay(amount)**: This function allows users to repay their bFI loans. It checks if the user has enough allowance to transfer the bFI tokens and then reduces the user's loan amount, total borrowed amount, and transfers the bFI tokens from the user to the contract.

* **addCollateral(amount)**: This function allows users to add collateral (clt tokens) to their account. It checks if the user has enough allowance to transfer the clt tokens and then increases the user's collateral amount and total collateral amount.

* **withdrawCollateral(amount)**: This function allows users to withdraw their collateral (clt tokens). It checks the user's Loan-To-Collateral ratio after the withdrawal and reverts if it becomes unhealthy. If healthy, it reduces the user's collateral amount, total collateral amount, and transfers the clt tokens to the user.

* **getLTC()**: This view function allows users to see their current Loan-To-Collateral ratio.

* **isHealthy()**: This view function returns true if the user's Loan-To-Collateral ratio is healthy (greater than or equal to 7000).

* **checkIfHealthy(loanValue, collateralValue)**: This internal function calculates the Loan-To-Collateral ratio for a given loan and collateral value and returns true if it's healthy.

* **calculateLTC(loanValue, collateralValue)**: This internal function calculates the Loan-To-Collateral ratio by dividing the loan value by the collateral value (with a factor of DECIMALS for precision).

**Additional Notes:**

