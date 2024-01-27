#!/bin/bash

# Constants
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
JSON_RPC_URL="http://localhost:8545/"
WETH9_ADDRESS="0x0165878A594ca255338adfa4d48449f69242Eb8F"
NATIVE_CURRENCY_LABEL="ETH"
OUTPUT_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
CHAIN_ID=0

# Remove existing state (addresses, etc.)
rm state.json

# Command execution
yarn start -pk $PRIVATE_KEY -j $JSON_RPC_URL -w9 $WETH9_ADDRESS -ncl $NATIVE_CURRENCY_LABEL -o $OUTPUT_ADDRESS -c $CHAIN_ID
