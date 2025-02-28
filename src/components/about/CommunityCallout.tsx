
import React from "react";
import { Zap } from "lucide-react";

const CommunityCallout = () => {
  return (
    <div className="bg-primary/5 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Join Our Validator Community</h2>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Connect with other node operators, access exclusive guides, and get priority support for your validator operations.
      </p>
      <a href="#" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
        Become a Validator <Zap className="h-4 w-4" />
      </a>
    </div>
  );
};

export default CommunityCallout;
