import { task } from 'hardhat/config';
import { getParamPerNetwork } from '../../helpers/contracts-helpers';
import {
  deployLendingPoolCollateralManager,
  deployWalletBalancerProvider,
  authorizeWETHGateway,
  deployUiPoolDataProviderV2,
} from '../../helpers/contracts-deployments';
import { loadPoolConfig, ConfigNames, getTreasuryAddress } from '../../helpers/configuration';
import { getWETHGateway } from '../../helpers/contracts-getters';
import { eNetwork, ICommonConfiguration } from '../../helpers/types';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import { initReservesByHelper, configureReservesByHelper } from '../../helpers/init-helpers';
import { exit } from 'process';
import {
  getViniumProtocolDataProvider,
  getLendingPoolAddressesProvider,
} from '../../helpers/contracts-getters';
import { chainlinkAggregatorProxy, chainlinkEthUsdAggregatorProxy } from '../../helpers/constants';

task('full:add-new-tokens', 'Initialize lending pool configuration.')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ verify, pool }, localBRE) => {
    try {
      await localBRE.run('set-DRE');
      const network = <eNetwork>localBRE.network.name;
      const poolConfig = loadPoolConfig(pool);
      const {
        ViTokenNamePrefix,
        StableVdTokenNamePrefix,
        VariableVdTokenNamePrefix,
        SymbolPrefix,
        ReserveAssets,
        ReservesConfig,
        LendingPoolCollateralManager,
        WethGateway,
        IncentivesController,
      } = poolConfig as ICommonConfiguration;

      const reserveAssets = await getParamPerNetwork(ReserveAssets, network);
      const incentivesController = await getParamPerNetwork(IncentivesController, network);
      const addressesProvider = await getLendingPoolAddressesProvider(
        '0x7a6Aaf62a3112a928598101fAC0bFB9B03D9Ab11'
      );

      const testHelpers = await getViniumProtocolDataProvider();

      const admin = await addressesProvider.getPoolAdmin();
      const oracle = await addressesProvider.getPriceOracle();

      if (!reserveAssets) {
        throw 'Reserve assets is undefined. Check ReserveAssets configuration at config directory';
      }

      const treasuryAddress = await getTreasuryAddress(poolConfig);

      console.log('treasuryAddress: ', treasuryAddress);

      await initReservesByHelper(
        ReservesConfig,
        reserveAssets,
        ViTokenNamePrefix,
        StableVdTokenNamePrefix,
        VariableVdTokenNamePrefix,
        SymbolPrefix,
        admin,
        treasuryAddress,
        incentivesController,
        pool,
        verify
      );
      await configureReservesByHelper(ReservesConfig, reserveAssets, testHelpers, admin);

      //
      // let collateralManagerAddress = await getParamPerNetwork(
      //   LendingPoolCollateralManager,
      //   network
      // );
      // if (!notFalsyOrZeroAddress(collateralManagerAddress)) {
      //   const collateralManager = await deployLendingPoolCollateralManager(verify);
      //   collateralManagerAddress = collateralManager.address;
      // }
      // // Seems unnecessary to register the collateral manager in the JSON db
      //
      // console.log(
      //   '\tSetting lending pool collateral manager implementation with address',
      //   collateralManagerAddress
      // );
      // await waitForTx(
      //   await addressesProvider.setLendingPoolCollateralManager(collateralManagerAddress)
      // );
      //
      // console.log(
      //   '\tSetting ViniumProtocolDataProvider at AddressesProvider at id: 0x01',
      //   collateralManagerAddress
      // );
      // const viniumProtocolDataProvider = await getViniumProtocolDataProvider();
      // await waitForTx(
      //   await addressesProvider.setAddress(
      //     '0x0100000000000000000000000000000000000000000000000000000000000000',
      //     viniumProtocolDataProvider.address
      //   )
      // );
      //
      // await deployWalletBalancerProvider(verify);
      //
      // const lendingPoolAddress = await addressesProvider.getLendingPool();
      //
      // let gateWay = getParamPerNetwork(WethGateway, network);
      // if (!notFalsyOrZeroAddress(gateWay)) {
      //   gateWay = (await getWETHGateway()).address;
      // }
      // await authorizeWETHGateway(gateWay, lendingPoolAddress);
    } catch (err) {
      console.error(err);
      exit(1);
    }
  });
