import BigNumber from 'bignumber.js';
import {
  oneEther,
  oneRay,
  RAY,
  ZERO_ADDRESS,
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
  oneUsd,
} from '../../helpers/constants';
import { ICommonConfiguration, eZksyncNetwork } from '../../helpers/types';

// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: 'Commons',
  ViTokenNamePrefix: 'Vinium Zksync Market',
  StableVdTokenNamePrefix: 'Vinium Zksync Market stable debt',
  VariableVdTokenNamePrefix: 'Vinium Zksync Market variable debt',
  SymbolPrefix: 'v',
  ProviderId: 0, // Overriden in index.ts
  OracleQuoteCurrency: 'USD',
  OracleQuoteUnit: oneUsd.toString(),
  ProtocolGlobalParams: {
    TokenDistributorPercentageBase: '10000',
    MockUsdPriceInWei: '5848466240000000',
    UsdAddress: '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96', // TODO: what is this?
    NilAddress: '0x0000000000000000000000000000000000000000',
    OneAddress: '0x0000000000000000000000000000000000000001',
    ViniumReferral: '0',
  },

  // ----------------
  // COMMON PROTOCOL PARAMS ACROSS POOLS AND NETWORKS
  // ----------------

  Mocks: {
    AllAssetsInitialPrices: {
      ...MOCK_CHAINLINK_AGGREGATORS_PRICES,
    },
  },
  // TODO: reorg alphabetically, checking the reason of tests failing
  LendingRateOracleRatesCommon: {
    WETH: {
      borrowRate: oneRay.multipliedBy(0.03).toFixed(),
    },
    DAI: {
      borrowRate: oneRay.multipliedBy(0.039).toFixed(),
    },
    USDC: {
      borrowRate: oneRay.multipliedBy(0.039).toFixed(),
    },
    USDT: {
      borrowRate: oneRay.multipliedBy(0.035).toFixed(),
    },
    VINIUM: {
      borrowRate: oneRay.multipliedBy(0.03).toFixed(),
    },
    WBTC: {
      borrowRate: oneRay.multipliedBy(0.03).toFixed(),
    },
    WAVAX: {
      borrowRate: oneRay.multipliedBy(0.05).toFixed(), // TODO: fix borrowRate?
    },
  },
  // ----------------
  // COMMON PROTOCOL ADDRESSES ACROSS POOLS
  // ----------------

  // If PoolAdmin/emergencyAdmin is set, will take priority over PoolAdminIndex/emergencyAdminIndex
  PoolAdmin: {
    [eZksyncNetwork.zksync]: undefined,
    [eZksyncNetwork.zksync_goerli]: undefined,
  },
  PoolAdminIndex: 0,
  EmergencyAdminIndex: 0,
  EmergencyAdmin: {
    [eZksyncNetwork.zksync]: undefined,
    [eZksyncNetwork.zksync_goerli]: undefined,
  },
  ProviderRegistry: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  ProviderRegistryOwner: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  LendingRateOracle: {
    [eZksyncNetwork.zksync]: '0x9feFf7905F8E1aed4481C6dcC195BF0704668A75',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  LendingPoolCollateralManager: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  LendingPoolConfigurator: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  LendingPool: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  WethGateway: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  TokenDistributor: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  ViniumOracle: {
    [eZksyncNetwork.zksync]: '0xdC86825a065E62cE86f155BdB299795d6Bb4C7dd',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  FallbackOracle: {
    [eZksyncNetwork.zksync]: ZERO_ADDRESS,
    [eZksyncNetwork.zksync_goerli]: ZERO_ADDRESS,
  },
  ChainlinkAggregator: {
    [eZksyncNetwork.zksync]: {
      // SAVAX: '0x49bDF0321C4Bf17c9297a6B266F55F3AF3cb0aDE',
      USDC: '0xF096872672F44d6EBA71458D74fe67F9a77a23B9',
      // USDT: '0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a',
      // DAI: '0x51D7180edA2260cc4F6e4EebB82FEF5c3c2B8300',
      // WETH: '0x976B3D034E162d8bD72D6b9C989d545b839003b0',
      // BTCB: '0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743',
      // GRAPE: '0xad42d3f890fe384f888d3d1c849ed12e9b8372c8',
      // WAVAX: '0x0A77230d17318075983913bC2145DB16C7366156',
      MIM: '0x54EdAB30a7134A16a54218AE64C73e1DAf48a8Fb',
      XGRAPE: '0x4cE9DBb0d37668002572e033ba3e1fe47B5BF4dF'
    },
    [eZksyncNetwork.zksync_goerli]: {
      WETH: '0x86d67c3D38D2bCeE722E601025C25a575021c6EA',
      USDT: '0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad',
      WBTC: '0x31CF013A08c6Ac228C94551d535d5BAfE19c602a',
      WAVAX: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
      USD: '0x86d67c3D38D2bCeE722E601025C25a575021c6EA',
    },
  },
  ReserveAssets: {
    [eZksyncNetwork.zksync]: {},
    [eZksyncNetwork.zksync_goerli]: {},
  },
  ReservesConfig: {},
  ViTokenDomainSeparator: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  WETH: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  WrappedNativeToken: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  ReserveFactorTreasuryAddress: {
    [eZksyncNetwork.zksync]: '',
    [eZksyncNetwork.zksync_goerli]: '',
  },
  IncentivesController: {
    [eZksyncNetwork.zksync]: ZERO_ADDRESS,
    [eZksyncNetwork.zksync_goerli]: ZERO_ADDRESS,
  },
};
