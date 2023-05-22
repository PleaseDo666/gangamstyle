---
sidebar_position: 5
---
# 5. What can you build with Programmatic Signing

As a distributed key management network, Lit provides developers with the ability to add programmable signing to their applications and wallets. These distributed wallets are known as Programmable Key Pairs (PKP) and the application logic that dictates when and why that key-pair will sign is known as a Lit Action.

## How do Lit Actions and PKPs work together?
A user can create a new PKP and grant a Lit Action the right to sign using it. This means the distributed key has the ability to sign and decrypt arbitrary data based on pre-defined logic and conditions.

Why is this useful?
A programmable distributed key is a primitive with a number of potential use-cases. For example, using a PKP and Lit Actions for onboarding web2 users to wallets based on modern multi-factor authentication (that don’t rely on a central authority or key custodian).

Additionally, Lit Actions + PKPs + web3 storage can be a replacement for a traditional web2 backend. Consider a web3-based Twitter alternative that utilizes Ceramic as its data storage solution. By creating a PKP associated with a Ceramic stream and granting specific Lit Actions the capability to sign with that PKP, you can emulate the functionality of a web2 backend. These Lit Actions can enforce business logic to ensure that only accurate data is written to the Ceramic Stream. For example, a likePost() Lit Action could verify whether a user has already liked a post before allowing the like to be recorded in the stream.

In the web2 paradigm, backends typically possess complete control over the database, often referred to as "god mode" access. However, with Lit and web3 storage like Ceramic, you can empower Lit Actions to assume a similar "god mode" role over a Ceramic stream. This is achieved by granting the Lit Action the ability to sign with the PKP associated with the stream. Nonetheless, it is crucial to note that the Lit Action will strictly adhere to the logic implemented within its code, ensuring that data is written to the stream in accordance with the specified rules. This seamless transition from a centralized web2 model to a decentralized web3 paradigm is greatly simplified through the capabilities provided by Lit.
