import { task } from 'hardhat/config';
import { loadPoolConfig, ConfigNames, getTreasuryAddress } from '../../helpers/configuration';
import { ZERO_ADDRESS } from '../../helpers/constants';
import {
  getAddressById,
  getViToken,
  getFirstSigner,
  getInterestRateStrategy,
  getLendingPoolAddressesProvider,
  getProxy,
  getStableVdToken,
  getVariableVdToken,
} from '../../helpers/contracts-getters';
import { getParamPerNetwork, verifyContract } from '../../helpers/contracts-helpers';
import { eContractid, eNetwork, ICommonConfiguration, IReserveParams } from '../../helpers/types';
import { LendingPoolConfiguratorFactory, LendingPoolFactory } from '../../types';

task('verify:tokens', 'Deploy oracles for dev enviroment')
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ verify, all, pool }, localDRE) => {
    await localDRE.run('set-DRE');
    const network = localDRE.network.name as eNetwork;
    const poolConfig = loadPoolConfig(pool);
    const {
      ReserveAssets,
      ReservesConfig,
      ViTokenNamePrefix,
      StableVdTokenNamePrefix,
      VariableVdTokenNamePrefix,
      SymbolPrefix,
    } = poolConfig as ICommonConfiguration;
    const treasuryAddress = await getTreasuryAddress(poolConfig);

    const addressesProvider = await getLendingPoolAddressesProvider();
    const lendingPoolProxy = LendingPoolFactory.connect(
      await addressesProvider.getLendingPool(),
      await getFirstSigner()
    );

    const lendingPoolConfigurator = LendingPoolConfiguratorFactory.connect(
      await addressesProvider.getLendingPoolConfigurator(),
      await getFirstSigner()
    );

    const configs = Object.entries(ReservesConfig) as [string, IReserveParams][];

    const tokenImpls = {
      BTCB: {
        viBTCB: '0xb4246bc0c00b3949977c16ae78c601b4579dd14b',
        stableVdBTCB: '0xda0a0568b5ced2bf9c48855e96cb7ba378efb7fa',
        variableVdBTCB: '0xad5ba66197cf7580991ecec68ae82d2e4d6217df',
      },
    };

    for (const entry of Object.entries(getParamPerNetwork(ReserveAssets, network))) {
      const [token, tokenAddress] = entry;
      if (token != 'BTCB') {
        continue;
      }
      console.log(`- Verifying ${token} token related contracts`);
      const {
        stableVdTokenAddress,
        variableVdTokenAddress,
        viTokenAddress,
        interestRateStrategyAddress,
      } = await lendingPoolProxy.getReserveData(tokenAddress);

      const tokenConfig = configs.find(([symbol]) => symbol === token);
      if (!tokenConfig) {
        throw `ReservesConfig not found for ${token} token`;
      }

      const {
        optimalUtilizationRate,
        baseVariableBorrowRate,
        variableRateSlope1,
        variableRateSlope2,
        stableRateSlope1,
        stableRateSlope2,
      } = tokenConfig[1].strategy;
      //
      // // Proxy Stable Debt
      // console.log(`\n- Verifying Stable Debt Token proxy...\n`);
      // await verifyContract(
      //   eContractid.InitializableAdminUpgradeabilityProxy,
      //   await getProxy(stableVdTokenAddress),
      //   [lendingPoolConfigurator.address]
      // );
      // //
      // // // Proxy Variable Debt
      // // console.log(`\n- Verifying  Debt Token proxy...\n`);
      // // await verifyContract(
      // //   eContractid.InitializableAdminUpgradeabilityProxy,
      // //   await getProxy(variableVdTokenAddress),
      // //   [lendingPoolConfigurator.address]
      // // );
      // //
      // // // Proxy viToken
      // // console.log('\n- Verifying viToken proxy...\n');
      // // await verifyContract(
      // //   eContractid.InitializableAdminUpgradeabilityProxy,
      // //   await getProxy(viTokenAddress),
      // //   [lendingPoolConfigurator.address]
      // // );
      // //
      // // // Strategy Rate
      // // console.log(`\n- Verifying Strategy rate...\n`);
      // // await verifyContract(
      // //   eContractid.DefaultReserveInterestRateStrategy,
      // //   await getInterestRateStrategy(interestRateStrategyAddress),
      // //   [
      // //     addressesProvider.address,
      // //     optimalUtilizationRate,
      // //     baseVariableBorrowRate,
      // //     variableRateSlope1,
      // //     variableRateSlope2,
      // //     stableRateSlope1,
      // //     stableRateSlope2,
      // //   ]
      // // );

      const stableDebt = tokenImpls[token][`stableVd${token}`];
      const variableDebt = tokenImpls[token][`variableVd${token}`];
      const viToken = tokenImpls[token][`vi${token}`];
      // const stableDebt = await getAddressById(`stableVd${token}`);
      // const variableDebt = await getAddressById(`variableVd${token}`);
      // const viToken = await getAddressById(`vi${token}`);

      if (viToken) {
        console.log('\n- Verifying viToken...\n');
        await verifyContract(eContractid.ViToken, await getViToken(viToken), []);
      } else {
        console.error(`Skipping viToken verify for ${token}. Missing address at JSON DB.`);
      }
      if (stableDebt) {
        console.log('\n- Verifying StableVdToken...\n');
        await verifyContract(eContractid.StableVdToken, await getStableVdToken(stableDebt), []);
      } else {
        console.error(`Skipping stable debt verify for ${token}. Missing address at JSON DB.`);
      }
      if (variableDebt) {
        console.log('\n- Verifying VariableVdToken...\n');
        await verifyContract(
          eContractid.VariableVdToken,
          await getVariableVdToken(variableDebt),
          []
        );
      } else {
        console.error(`Skipping variable debt verify for ${token}. Missing address at JSON DB.`);
      }
    }
  });
