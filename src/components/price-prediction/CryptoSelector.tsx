
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CryptoSelectorProps {
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
}

const cryptoOptions = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿' },
  { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ' },
  { value: 'binancecoin', label: 'BNB (BNB)', icon: '🟡' },
  { value: 'cardano', label: 'Cardano (ADA)', icon: '🔵' },
  { value: 'solana', label: 'Solana (SOL)', icon: '🟣' },
  { value: 'chainlink', label: 'Chainlink (LINK)', icon: '🔗' },
  { value: 'polygon', label: 'Polygon (MATIC)', icon: '🟪' },
  { value: 'avalanche-2', label: 'Avalanche (AVAX)', icon: '🔺' }
];

const CryptoSelector = ({ selectedCrypto, onCryptoChange }: CryptoSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
      <Select value={selectedCrypto} onValueChange={onCryptoChange}>
        <SelectTrigger id="crypto-select">
          <SelectValue placeholder="Choose a cryptocurrency" />
        </SelectTrigger>
        <SelectContent>
          {cryptoOptions.map((crypto) => (
            <SelectItem key={crypto.value} value={crypto.value}>
              <div className="flex items-center gap-2">
                <span>{crypto.icon}</span>
                <span>{crypto.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CryptoSelector;
