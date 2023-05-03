# Placeholder: Auth Sigs

## Security Considerations

While an AuthSig can be provided across various SDK functions for authenticating the user against the nodes, we **do not** recommend this approach as it does not have an expiration time, nor does it use the [Object Capability model](https://en.wikipedia.org/wiki/Object-capability_model) to provide capability attenuation, delegation and other functionalities. This means that the same exact AuthSig object can be provided to the nodes multiple times / indefinitely (an example of replay attack), and once provided the authenticated user can perform read / mutative operations across all resources that are related to the original resource owner specified by the AuthSig object itself. 

Use AuthSigs at your own risk. We recommend using [session signatures](/SDK/Explanation/authentication/sessionSigs) instead.

# Placeholder: Session Sigs

## Background

With Lit Protocol, the user needs to prove ownership of their wallet, and this is typically done via a wallet signature, sometimes referred to as AuthSigs in the Lit docs. However, in order to protect against replay attacks, to let users scope and delegate specific capabilities to specific resources, and to deliver a good user experience, we've implemented support for session signatures (enabled by session keys) during authentication.

### An Improved User Experience

The steps to obtain an AuthSig requires an interactive experience that involves manual steps from the end-user - whether clicking through the Google OAuth flow, placing their fingerprint on their platform authenticators, or clicking through their the respective modals of their externally-owned accounts (eg. MetaMask). These manual steps can be friction that drives users away from applications.

On the other hand, the steps to obtain a SessionSig is completely non-interactive. The session keys and signature can all be done programmatically once an AuthSig has been obtained. 

For these reasons, by designing AuthSigs to have a long validity period and SessionSigs to have a short validity period, we open up opportunities to develop user experiences that strike a good balance between a smooth user experience and security:
- User Experience: Since we store the AuthSig in local storage, we can always retrieve it and continue to use it for as long as it is valid.
- Security: SessionSigs allow us to scope specific capabilties against a narrow set of resources that is performed during a (usually) small time window that the user is on the application.

# Session keys
## Letting a user use your rate limit nft

Alice owns a rate limit NFT and wants to let Bob use it, but only for specific Lit Actions or another Resource or set of Resources.

Alice can create a SIWE signature with Bob’s session key in the URI field `sessionKey:ed25519:<bobsSessionKeyHere>` and the resources `litRLICapability://<RLITokenIdHere>`, and `litActionCapability://<litActionIpfsIdHere>`.

Bob can attach this signature as a capability when he sends his AuthSig to the nodes.

## Letting a user use your PKP for a specific Lit Action

Alice owns a PKP and wants use it with a specific Lit Action that she has not authorized yet. She could use the smart contract and addPermittedAction(), run the function, then removePermittedAction() function, but would prefer not to spend the gas and wait for blocks etc.

When Alice creates a capability by signing the session key, she specifies the resources `litPKPCapability://<pkpIdHere>` and `litActionCapability://<litActionIpfsIdHere>`.

The SDK can attach this signature as a capability when it sends the AuthSig to the nodes.



## Security Considerations

### Expiration Times

The design decision to use SessionSigs in conjunction with AuthSigs is a compromise between security and UX. The intention is for AuthSigs to have a long(er) validity period (expires farther into the future) and for SessionSigs to be short-lived (expires soon) since SessionSigs is the actual authentication material that is required when operating against the specified resources. While our SDK uses sensible defaults for expiration times, these parameters are ultimately at the discretion of the application developer.

### SessionSig-per-Node

In order to prevent replay attacks, we have opted to generate a SessionSig per each node that the SDK is sending the request to. (Note that this is a fast operation compared to the latency involved in alternative security models)

If the SessionSig were to omit the `nodeAddress` parameter, then a node could technically re-use the SessionSig provided by the end-user to replay the request again from that node to the rest of the nodes in the network.

### AuthSig Replay-ability

Another possible replay attack comes from an AuthSig being provided solely, and repeatedly. When the AuthSig is signed against a payload containing the session keypair's public key as well as an allowlist of delegated capabilities, an AuthSig is insufficient to authenticate when provided in the absence of a SessionSig that corresponds to the signed session keypair public key. 

### AuthSig and SessionSig Coupling

Since a full SessionSig object couples an (inner) AuthSig with an (outer) SessionSig, this means that it is impossible for a node to attach a session signature that would be valid against an AuthSig that they have obtained elsewhere, ie. in an attempt to perform a replay attack. This is because the public key in the session signature must match that which is signed against in the (inner) AuthSig object.