
import React from "react";

interface HeroProps {
  darkMode: boolean;
}

const Hero = ({ darkMode }: HeroProps) => {
  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">About Skuuy</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Your gateway to the decentralized future. We empower node operators with the tools and knowledge to secure blockchain networks.
        </p>
      </div>

      <div className="relative w-full h-64 md:h-96 mb-12 rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80"
          alt="Blockchain data center"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h2 className="text-3xl font-bold text-white">Our Node Running Journey</h2>
        </div>
      </div>
    </>
  );
};

export default Hero;
