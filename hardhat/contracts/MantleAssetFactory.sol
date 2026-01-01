// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MantleToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) ERC20(name, symbol) {
        _mint(owner, initialSupply);
    }
}

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MantleNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}

contract MantleAssetFactory {
    event TokenCreated(address indexed tokenAddress, string name, string symbol, address indexed receiver);
    event NFTCreated(address indexed nftAddress, string name, string symbol, address indexed receiver);

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address receiver
    ) external returns (address) {
        MantleToken newToken = new MantleToken(name, symbol, initialSupply, receiver);
        emit TokenCreated(address(newToken), name, symbol, receiver);
        return address(newToken);
    }

    function createNFT(
        string memory name,
        string memory symbol
    ) external returns (address) {
        MantleNFT newNFT = new MantleNFT(name, symbol);
        emit NFTCreated(address(newNFT), name, symbol, msg.sender);
        return address(newNFT);
    }

    /**
     * @dev Creates an NFT collection and mints the first token immediately.
     */
    function createNFTWithMint(
        string memory name,
        string memory symbol,
        string memory tokenURI,
        address receiver
    ) external returns (address) {
        MantleNFT newNFT = new MantleNFT(name, symbol);
        newNFT.mintNFT(receiver, tokenURI);
        emit NFTCreated(address(newNFT), name, symbol, receiver);
        return address(newNFT);
    }
}
