
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Fill out the form and our team will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"} <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Here are the different ways you can reach us.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  contact@example.com
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  support@example.com
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +1 (555) 123-4567
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mon-Fri, 9am-5pm EST
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Office</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  123 Innovation Drive<br />
                  Tech Valley, CA 94103<br />
                  United States
                </p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="font-medium mb-2">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
