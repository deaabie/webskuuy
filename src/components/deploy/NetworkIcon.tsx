
import React from 'react';
import { NetworkConfig } from './types';

// Import icons
import {
  Disc,
  CircleDot,
  Hexagon,
  Pentagon,
  Octagon,
  Triangle,
  Square,
} from 'lucide-react';

interface NetworkIconProps {
  network: NetworkConfig;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}

const NetworkIcon: React.FC<NetworkIconProps> = ({ 
  network, 
  size = 40, 
  selected = false,
  onClick
}) => {
  // Icons for different networks
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'ethereum':
        return <Hexagon size={size * 0.6} className="text-blue-400" />;
      case 'polygon':
        return <Pentagon size={size * 0.6} className="text-purple-500" />;
      case 'arbitrum':
        return <CircleDot size={size * 0.6} className="text-blue-700" />;
      case 'optimism':
        return <Square size={size * 0.6} className="text-red-500" />;
      case 'binance':
        return <Octagon size={size * 0.6} className="text-yellow-400" />;
      case 'base':
        return <Triangle size={size * 0.6} className="text-blue-500" />;
      default:
        return <Disc size={size * 0.6} className="text-green-400" />;
    }
  };

  return (
    <div 
      className={`
        flex items-center justify-center 
        rounded-full 
        bg-card 
        ${selected ? 'ring-2 ring-primary' : 'hover:bg-accent'} 
        ${onClick ? 'cursor-pointer' : ''} 
        transition-all
        w-${size / 4} h-${size / 4}
      `}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {getIcon(network.icon)}
    </div>
  );
};

export default NetworkIcon;
