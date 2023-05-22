---
sidebar_position: 3
---
# 3. Working with Access Control Conditions 
ACCs can be harnessed to restrict access to a particular resource (such as a file, webpage, or server). You can set an on-chain condition(s) and then the network will provision signatures and decryption keys for users that meet those conditions.

### **Example Conditions**

- User is a member of a DAO
- User holds an NFT in a collection
- User holds at least 0.1 ETH
- The result of any smart contract function call
- User owns a specific wallet address
- Using boolean operations (AND + OR) for any of the above

### **Supported Logic**

- Supports many EVM chains and Solana. Full list [here](https://developer.litprotocol.com/support/supportedChains).
- Supports many standard contracts, with plans to support any RPC call soon. If you need to interact with a contract that we don't support yet, ask us, and we will implement it.
- *Boolean conditions*: "And" or "Or" are currently supported.
- *Updateable conditions*: Only the creator can update the condition.
- *Permanent conditions*: When a condition is stored as permanent, it becomes impossible to update it, forever.

### **Basic Example**

Restrict access based on the possession of an ERC1155 token. In this example, the token contract's address is 0x3110c39b428221012934A7F617913b095BC1078C and the token id we are checking for is 9541.

```js
const accessControlConditions = [
  {
    contractAddress: '0x3110c39b428221012934A7F617913b095BC1078C',
    standardContractType: 'ERC1155',
    chain,
    method: 'balanceOf',
    parameters: [
      ':userAddress',
      '9541'
    ],
    returnValueTest: {
      comparator: '>',
      value: '0'
    }
  }
]
```

To learn more and get started as a developer in the Lit Eco, head on over to our [protocol documentation](https://developer.litprotocol.com/coreConcepts/accessControl/conditionTypes/unifiedAccessControlConditions).
