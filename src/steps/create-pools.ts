import UniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import { Contract } from '@ethersproject/contracts'
import { MigrationStep } from '../migrations'

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
    token0: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    token1: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    feeTier: FEE_TIER,
  },
  {
    name: 'USDC / WMATIC',
    token0: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    token1: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    feeTier: FEE_TIER,
  },
  {
    name: 'WBTC / WETH',
    token0: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    token1: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    feeTier: FEE_TIER,
  },
  {
    name: 'WBTC / WMATIC',
    token0: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    token1: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
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
  if (state.v3CoreFactoryAddress === undefined) {
    throw new Error('Missing UniswapV3Factory')
  }

  const v3CoreFactory = new Contract(state.v3CoreFactoryAddress, UniswapV3Factory.abi, signer)

  const owner = await v3CoreFactory.owner()
  if (owner !== (await signer.getAddress())) {
    throw new Error('UniswapV3Factory.owner is not signer')
  }

  const results = [];
  for (const pool of POOLS) {
    // Simulate the transaction and get the return value
    const poolAddress = await v3CoreFactory.callStatic.createPool(pool.token0, pool.token1, pool.feeTier, { gasPrice });

    // Execute the createPool function for each pool in the list
    const tx = await v3CoreFactory.createPool(pool.token0, pool.token1, pool.feeTier, { gasPrice });
    await tx.wait();

    // Push the result of each iteration to the results array
    results.push({
      message: `UniswapV3Factory added a pool for ${pool.name}`,
      poolAddress: poolAddress,
      hash: tx.hash
    });
  }

  return results;
}
