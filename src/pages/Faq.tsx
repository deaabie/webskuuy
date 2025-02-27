
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
      question: "What is this platform about?",
      answer: "Our platform is a comprehensive project management system that helps teams collaborate, track progress, and deliver projects on time. It combines powerful features with an intuitive interface to make project management seamless and efficient."
    },
    {
      question: "How do I get started with your service?",
      answer: "Getting started is easy! First, create an account by clicking the 'Sign Up' button. Once registered, you can create your first project, invite team members, and begin organizing your work. We also offer a helpful onboarding tour to guide you through key features."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial. After the trial period, you can choose from our various subscription plans based on your needs."
    },
    {
      question: "Can I integrate with other tools?",
      answer: "Absolutely! Our platform offers seamless integration with popular tools including Slack, GitHub, Trello, Asana, Google Workspace, and many more. We also have an API available for custom integrations with your existing systems."
    },
    {
      question: "What support options are available?",
      answer: "We provide multiple support channels including 24/7 chat support, email assistance, comprehensive documentation, video tutorials, and a community forum. Enterprise customers also receive dedicated account managers and priority support."
    },
    {
      question: "How secure is my data?",
      answer: "Security is our top priority. We use industry-standard encryption for all data, both in transit and at rest. Our infrastructure is hosted on secure cloud providers with regular security audits, and we're compliant with GDPR, SOC 2, and other relevant standards."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. When you cancel, you'll continue to have access until the end of your current billing period. We don't lock you in with long-term contracts or charge cancellation fees."
    },
    {
      question: "Do you offer discounts for non-profits or educational institutions?",
      answer: "Yes, we offer special pricing for non-profit organizations, educational institutions, and open-source projects. Please contact our sales team with details about your organization to learn more about our discount programs."
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
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our platform, features, and services.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            className="pl-10"
            placeholder="Search for questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>
              Browse through our most frequently asked questions
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
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            If you couldn't find the answer you were looking for, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <a href="/contact">Contact Support</a>
            </Button>
            <Button asChild>
              <a href="#">View Documentation</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
