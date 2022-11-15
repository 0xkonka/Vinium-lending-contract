import { eZksyncNetwork, IZksyncConfiguration } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategySAVAX,
  strategyUSDC,
  strategyUSDT,
  strategyDAI,
  strategyWETH,
  strategyBTCB,
  strategyGRAPE, strategyWAVAX, strategyXGRAPE, strategyMIM,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

// @ts-ignore
export const ZksyncConfig: IZksyncConfiguration = {
  ...CommonsConfig,
  MarketId: 'Zksync market',
  ProviderId: 4,
  ReservesConfig: {
    USDC: strategyUSDC,
    DAI: strategyDAI,
  },
  ReserveAssets: {
    [eZksyncNetwork.zksync]: {
      USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      DAI: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    },
    [eZksyncNetwork.zksync_goerli]: {
      USDC: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
      DAI: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    },
  },
};

export default ZksyncConfig;
