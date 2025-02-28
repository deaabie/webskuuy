
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Minus } from "lucide-react";

const Faq = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([0]); // Default expand first question

  const faqs = [
    {
      question: "What is a blockchain node?",
      answer: "A blockchain node is a computer that participates in a blockchain network by maintaining a copy of the blockchain, validating transactions, and contributing to the consensus mechanism. Nodes are the infrastructure that keeps blockchain networks running in a decentralized manner."
    },
    {
      question: "What's the difference between a validator and a full node?",
      answer: "A full node maintains a complete copy of the blockchain and verifies transactions, but doesn't necessarily participate in block production. A validator node (in Proof-of-Stake networks) actively participates in consensus by proposing and validating new blocks, often requiring staked tokens and specialized hardware."
    },
    {
      question: "What hardware do I need to run a validator node?",
      answer: "Hardware requirements vary by blockchain, but generally validators need a dedicated server with sufficient CPU (4-8 cores), RAM (16-32GB), storage (1TB+ SSD), and a stable internet connection with good bandwidth. High-throughput networks like Solana have more demanding requirements than others."
    },
    {
      question: "Is running a node profitable?",
      answer: "Profitability depends on the blockchain network, the amount staked, hardware and operational costs, and market conditions. Validators typically earn rewards for block production and transaction validation, but costs (hardware, electricity, maintenance) must be considered for net profitability calculations."
    },
    {
      question: "What are the risks of running a validator?",
      answer: "Risks include slashing (penalties for downtime or misbehavior), technical failures, security breaches, and regulatory uncertainties. Different networks have different slashing conditions and penalty severities. Proper server security, monitoring, and maintenance are essential to mitigate these risks."
    },
    {
      question: "How much do I need to stake to become a validator?",
      answer: "Stake requirements vary widely by network: Ethereum requires 32 ETH, Solana requires around 0.1 SOL (but high hardware costs), Polkadot has dynamic minimums, and Cosmos chains typically require between 50-10,000 tokens depending on the specific chain. Some networks also allow delegation to validators."
    },
    {
      question: "How do I handle validator node maintenance and updates?",
      answer: "Regular maintenance includes updating client software, operating system patches, security updates, and occasional hardware upgrades. Most networks announce updates in advance. Setting up monitoring, automated alerts, and having a backup validator ready are best practices to minimize downtime during maintenance."
    },
    {
      question: "Can I run multiple validators on the same machine?",
      answer: "While technically possible for some networks, it's generally not recommended for security and performance reasons. Running multiple validators on one machine creates a single point of failure and can lead to correlated downtime or slashing. For most networks, dedicated hardware per validator is the recommended best practice."
    },
  ];

  const toggleQuestion = (index: number) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter(i => i !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Node Operator FAQ</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about running nodes and validators across different blockchain networks.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            className="pl-10"
            placeholder="Search for node operation questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Node Operation Questions</CardTitle>
            <CardDescription>
              Essential information for blockchain validators and node runners
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="py-4">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="flex justify-between items-center w-full text-left font-medium"
                  >
                    <span>{faq.question}</span>
                    {expandedQuestions.includes(index) ? (
                      <Minus className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                  {expandedQuestions.includes(index) && (
                    <div className="mt-2 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold mb-4">More Validator Questions?</h2>
          <p className="text-muted-foreground mb-6">
            If you have more specific questions about running nodes on particular networks, our support team can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <a href="/contact">Contact Node Support</a>
            </Button>
            <Button asChild>
              <a href="#">View Validation Guides</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
