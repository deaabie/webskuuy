
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Award, Clock, Heart, ArrowRight, Server, Shield, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            Our mission is to democratize access to blockchain participation by providing comprehensive resources for node operators. We believe that a robust, distributed network of validators is essential for truly decentralized blockchain systems.
          </p>
          <p className="text-muted-foreground">
            Founded in 2020 during the emergence of Proof-of-Stake networks, our team has grown to include experts in blockchain infrastructure, network security, and validator operations. We're united by our passion for building a more decentralized internet.
          </p>
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
      </div>

      <Tabs defaultValue="team" className="mb-16">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">Our Team</TabsTrigger>
          <TabsTrigger value="values">Our Values</TabsTrigger>
          <TabsTrigger value="networks">Supported Networks</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Nakamoto",
                role: "Founder & Head of Validation",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
                bio: "Previously ran validation infrastructure for major PoS networks. 5+ years in blockchain infrastructure."
              },
              {
                name: "Sarah Chen",
                role: "CTO & Protocol Expert",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300",
                bio: "Cryptography researcher and core contributor to several consensus protocols. Specializes in validator security."
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Node Operations",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
                bio: "Infrastructure architect with experience managing 1000+ node clusters for enterprise blockchain deployments."
              }
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                    <p className="text-sm">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="values" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Decentralization",
                icon: <Server className="h-8 w-8 text-primary" />,
                description: "We believe in true decentralization through distributed node operation and accessible validation."
              },
              {
                title: "Security",
                icon: <Shield className="h-8 w-8 text-primary" />,
                description: "We prioritize secure infrastructure and best practices to protect validator operations and networks."
              },
              {
                title: "Education",
                icon: <Award className="h-8 w-8 text-primary" />,
                description: "We're committed to making blockchain technology and node operation accessible through quality resources."
              },
              {
                title: "Community",
                icon: <Users className="h-8 w-8 text-primary" />,
                description: "We foster a collaborative community of node operators who share knowledge and support each other."
              }
            ].map((value, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center gap-4">
                  {value.icon}
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="networks" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    name: "Ethereum",
                    icon: <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L4.5 12.5L12 17L19.5 12.5L12 2Z" fill="currentColor" /><path d="M12 17L4.5 12.5L12 22L19.5 12.5L12 17Z" fill="currentColor" /></svg>,
                    description: "Full support for Ethereum validators with comprehensive setup guides.",
                    validators: "10,000+ active validators"
                  },
                  {
                    name: "Solana",
                    icon: <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5.5H13.5L5 14H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 14.5H13.5L5 23H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 5L19 5L10.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                    description: "Detailed instructions for setting up high-performance Solana validators.",
                    validators: "2,500+ connected validators"
                  },
                  {
                    name: "Polkadot",
                    icon: <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="16" cy="8" r="2" fill="currentColor"/><circle cx="8" cy="16" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/></svg>,
                    description: "Complete validator and collator setup guides for Polkadot and parachains.",
                    validators: "1,200+ validators supported"
                  },
                  {
                    name: "Cosmos",
                    icon: <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><path d="M12 3C7.58172 3 4 6.58172 4 11" stroke="currentColor" strokeWidth="2"/><path d="M12 3C16.4183 3 20 6.58172 20 11" stroke="currentColor" strokeWidth="2"/><path d="M12 21C7.58172 21 4 17.4183 4 13" stroke="currentColor" strokeWidth="2"/><path d="M12 21C16.4183 21 20 17.4183 20 13" stroke="currentColor" strokeWidth="2"/></svg>,
                    description: "Multi-chain support for the Cosmos ecosystem with zone-specific guides.",
                    validators: "5,000+ validators across all zones"
                  },
                ].map((network, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">{network.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold">{network.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{network.description}</p>
                      <p className="text-sm font-medium">{network.validators}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "99.9% Validator Uptime",
                year: "2023",
                description: "Our node operation guides and infrastructure recommendations achieved near-perfect uptime across all supported networks."
              },
              {
                title: "100,000 Nodes Launched",
                year: "2022",
                description: "Validators following our guides have collectively launched over 100,000 nodes across various blockchain networks."
              },
              {
                title: "Web3 Infrastructure Award",
                year: "2023",
                description: "Recognized for excellence in decentralized infrastructure and validator support at the Global Blockchain Summit."
              }
            ].map((achievement, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{achievement.title}</CardTitle>
                  <CardDescription>{achievement.year}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Validator Community</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Connect with other node operators, access exclusive guides, and get priority support for your validator operations.
        </p>
        <a href="#" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
          Become a Validator <Zap className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default About;
