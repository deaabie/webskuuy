
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Skuuy. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
