# WebAuthn

The steps below demonstrate how to authenticate using WebAuthn in order to obtain an AuthSig.

TODO:

### Technical Details

While the registration step involves minting a PKP via the Lit Relay server (or, optionally, you can send a transaction to the contract yourself), we have implemented an authentication scheme that involves sending signed challenges to the decentralized Lit network instead. This works by using a recent blockHash on the underlying blockchain (Polygon Mumbai) as a challenge, and having the user authenticate with their platform authenticator to generate a credential assertion (signature). When each Lit node receives this credential assertion from the client, they can recover the COSE credential public key which is stored in the smart contract to verify whether the assertion / signature is valid. If the signature is valid, then the nodes will return AuthSig signature shares back to the client.