import React from "react";
const MissionVision = () => {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div>
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground mb-4">
          Our mission is to democratize access to blockchain participation by providing comprehensive resources for node operators. We believe that a robust, distributed network of validators is essential for truly decentralized blockchain systems.
        </p>
        <p className="text-muted-foreground">Founded in 2023 during the emergence of Proof-of-Stake networks, our team has grown to include experts in blockchain infrastructure, network security, and validator operations. We're united by our passion for building a more decentralized internet.</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
        <p className="text-muted-foreground mb-4">
          We envision a future where anyone can participate in securing and maintaining blockchain networks, regardless of technical background. Our platform bridges the gap between complex blockchain protocols and everyday users interested in running nodes.
        </p>
        <p className="text-muted-foreground">
          By simplifying node operations and providing clear educational resources, we're helping to build a more resilient and distributed Web3 ecosystem where decentralization isn't just a buzzword but a reality.
        </p>
      </div>
    </div>;
};
export default MissionVision;