import NonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { Contract } from '@ethersproject/contracts'
import { MigrationStep } from '../migrations'
import { BigNumber } from '@ethersproject/bignumber'


const FEE_TIER = 500

const POOLS = [
  {
    name: 'USDC / WBTC',
    token0: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    token1: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    feeTier: FEE_TIER,
  },
  {
    name: 'USDC / WETH',
    token0: '0x9A676e781A523b5d0C0e43731313A708CB607508',
    token1: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    feeTier: FEE_TIER,
  },
  {
    name: 'USDC / WMATIC',
    token0: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
    token1: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    feeTier: FEE_TIER,
  },
  {
    name: 'WBTC / WETH',
    token0: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    token1: '0x9A676e781A523b5d0C0e43731313A708CB607508',
    feeTier: FEE_TIER,
  },
  {
    name: 'WBTC / WMATIC',
    token0: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
    token1: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    feeTier: FEE_TIER,
  },
  {
    name: 'WETH / WMATIC',
    token0: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
    token1: '0x9A676e781A523b5d0C0e43731313A708CB607508',
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
