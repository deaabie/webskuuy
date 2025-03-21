
import React from 'react';
import { Square } from 'lucide-react';

interface NetworkIconProps {
  network: string;
  className?: string;
}

const NetworkIcon: React.FC<NetworkIconProps> = ({ network, className }) => {
  const getNetworkIcon = () => {
    switch (network) {
      case 'ethereum':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1.75L5.75 12.25L12 16L18.25 12.25L12 1.75Z" fill="#767DFF" />
            <path d="M12 16L5.75 12.25L12 22.25L18.25 12.25L12 16Z" fill="#767DFF" />
          </svg>
        );
      case 'polygon':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7.5V16.5L12 22L21 16.5V7.5L12 2Z" fill="#8247E5" />
            <path d="M16.5 13.25V10.75L12 8.25L7.5 10.75V13.25L12 15.75L16.5 13.25Z" fill="white" />
          </svg>
        );
      case 'optimism':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#FF0420" />
            <path d="M8 9.5L12 13.5L16 9.5" stroke="white" strokeWidth="2" />
          </svg>
        );
      case 'arbitrum':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6V12C4 17.52 7.48 21 12 21C16.52 21 20 17.52 20 12V6L12 2Z" fill="#213147" />
            <path d="M15 9L12 6L9 9L12 12L15 9Z" fill="#28A0F0" />
          </svg>
        );
      case 'base':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#0052FF" />
            <path d="M8 8H16V16H8V8Z" fill="white" />
          </svg>
        );
      default:
        return <Square className={className} />;
    }
  };

  return getNetworkIcon();
};

export default NetworkIcon;
