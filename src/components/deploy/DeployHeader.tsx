
import React from 'react';

interface DeployHeaderProps {
  title: string;
  description: string;
}

const DeployHeader = ({ title, description }: DeployHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default DeployHeader;
