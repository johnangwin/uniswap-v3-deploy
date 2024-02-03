import NonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { Contract } from '@ethersproject/contracts'
import { MigrationStep } from '../migrations'
import { BigNumber } from '@ethersproject/bignumber'


const FEE_TIER = 500

const POOLS = [
  {
    name: 'USDC / WBTC',
    token0: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    token1: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    feeTier: FEE_TIER,
  },
  {
    name: 'USDC / WETH',
    token0: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    token1: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    feeTier: FEE_TIER,
  },
  {
    name: 'USDC / WMATIC',
    token0: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    token1: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    feeTier: FEE_TIER,
  },
  {
    name: 'WBTC / WETH',
    token0: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    token1: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    feeTier: FEE_TIER,
  },
  {
    name: 'WBTC / WMATIC',
    token0: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    token1: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    feeTier: FEE_TIER,
  },
  {
    name: 'WETH / WMATIC',
    token0: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    token1: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    feeTier: FEE_TIER,
  }
];

export const CREATE_POOLS: MigrationStep = async (state, { signer, gasPrice }) => {
  if (state.nonfungibleTokenPositionManagerAddress === undefined) {
    throw new Error('Missing NonfungiblePositionManager')
  }

  const nonfungiblePositionManager = new Contract(state.nonfungibleTokenPositionManagerAddress, NonfungiblePositionManager.abi, signer)

  const results = [];
  for (const pool of POOLS) {
    // Simulate the transaction and get the return value
    const poolAddress = await nonfungiblePositionManager.callStatic
      .createAndInitializePoolIfNecessary(
        pool.token0,
        pool.token1,
        pool.feeTier,
        BigNumber.from('79228162514264337593543950336'),
        { gasPrice });

    // Execute the createPool function for each pool in the list
    const tx = await nonfungiblePositionManager
      .createAndInitializePoolIfNecessary(
        pool.token0,
        pool.token1,
        pool.feeTier,
        BigNumber.from('79228162514264337593543950336'),
        { gasPrice });

    // Push the result of each iteration to the results array
    results.push({
      message: `NonfungiblePositionManager added pool for ${pool.name}`,
      poolAddress: poolAddress,
      hash: tx.hash
    });
  }

  return results;
}
