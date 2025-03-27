
import React from 'react';
import { ChainConfig } from '@/services/cosmosService';

interface ChainHeaderProps {
  chain: ChainConfig;
}

const ChainHeader: React.FC<ChainHeaderProps> = ({ chain }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={chain.logo}
          alt={chain.display_name}
          className="w-16 h-16 rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div>
          <h1 className="text-3xl font-bold">{chain.display_name}</h1>
          <p className="text-muted-foreground">{chain.chain_id}</p>
        </div>
      </div>
    </div>
  );
};

export default ChainHeader;
