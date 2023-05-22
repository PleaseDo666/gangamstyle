---
sidebar_position: 1
---

# 1. Intro
At its core, Lit is an attempt to decentralize [public key cryptography](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/). This technology underpins all of cryptocurrency and most of the security infrastructure on the web today.

Public key infrastructure (PKI) powers two main "buckets" of functionality: encryption and signing.

### **Encryption**

Encryption is the process of encoding information so that it remains hidden or inaccessible to unauthorized parties.

Lit's first feature is a **decentralized access control** protocol interoperable with most EVM chains, Solana, and Cosmos. With Lit, you can use on-chain access control conditions to do 4 main things:

- Encrypt and lock static content (images, videos, music, etc) behind an on-chain condition (for example, ownership of an NFT).
- Decrypt static content that was locked behind an on-chain condition.
- Authorize network signatures that provide access to dynamic content (for example, a server or network resource) behind an on-chain condition.
- Request a network signed JWT that provisions access and authorization to dynamic content behind an on-chain condition.

### **Signing**

Much like in the physical world, digital signatures are used as "proof" that a particular interaction took place. For example, when you swap some tokens on a DEX you must first approve the transaction in your wallet via a signature. Unlike their physical counterparts, cryptographic signatures are tamper-proof and immutable, giving you a secure method of authentication.

What if a smart contract could have it's own public and private keypair, just like any other wallet? And what if that smart contract had the ability to make arbitrary HTTP requests and use off-chain data in its computation? Imagine smart contracts that can read and write from any HTTP endpoint, blockchain, state machine, or decentralized storage system.

We have built this at Lit. We call the smart contracts *Lit Actions* and the keypairs they can use for signing and decryption *Programmable Key Pairs* (PKPs).
