
import React from 'react';

const DeployFooter = () => {
  return (
    <div className="mt-12 text-sm text-muted-foreground">
      <p className="mb-2">
        * Developers who contribute to the ecosystem are highly valued by L2 networks, 
        and deploying smart contracts is the easiest and most popular way to make such contributions.
      </p>
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
        <div>© {new Date().getFullYear()} Smart Contract Deployer. All rights reserved.</div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </div>
  );
};

export default DeployFooter;
