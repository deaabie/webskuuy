
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Mail, MessageSquare, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    
    // Reset form (in a real app, you'd have form state)
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6 gap-4">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Contact Us</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Message subject" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help you?"
                      className="min-h-[200px]"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send size={16} className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-blue-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">support@nodesample.com</p>
                    <p className="text-gray-600 dark:text-gray-300">info@nodesample.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageSquare className="text-green-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium">Social</h3>
                    <p className="text-gray-600 dark:text-gray-300">Discord: nodes-community</p>
                    <p className="text-gray-600 dark:text-gray-300">Telegram: @nodes_community</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="text-purple-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                    <p className="text-gray-600 dark:text-gray-300">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">How long does it take to get a response?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    We typically respond to inquiries within 24-48 business hours.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Do you offer technical support?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Yes, we provide technical support for node operators. Please use our Discord channel for fastest response.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Can I request a new project to be added?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Absolutely! We're always looking to expand our project listings. Please contact us with project details.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open("https://discord.gg/examplelink", "_blank")}>
                  Join Our Discord
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
