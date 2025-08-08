// Context CoinGecko
import type { CoinGeckoContextType } from './CoinGeckoUtils';
import { createContext } from 'react';
 
const CoinGeckoContext = createContext<CoinGeckoContextType | undefined>(undefined);
export default CoinGeckoContext; 