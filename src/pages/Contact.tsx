
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the Supabase edge function to send the email
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Message sent successfully! Our node operators will get back to you soon.");
      // Clear the form after successful submission
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Node Support</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Have questions about setting up your node or need technical assistance with your Web3 infrastructure? Our team is ready to help.
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
                  placeholder="Describe your node setup or technical issue"
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
            <CardTitle>Node Support Information</CardTitle>
            <CardDescription>
              Our blockchain node experts are available to assist with your setup and operation needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  skuuycom@gmail.com
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  deaabie0x@gmail.com
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Node Operator Hotline</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +62 (878) 6475-9813
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  24/7 Technical Support for Priority Validators
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Headquarters</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  123 Blockchain rd<br />
                  Crypto spaces, ZG 6300<br />
                  indonesia
                </p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="font-medium mb-2">Join Our Web3 Community</h3>
              <div className="flex space-x-4">
                <a href="https://x.com/BrigadirCurva" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path></svg>
                </a>
                <a href="https://x.com/BrigadirCurva" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
                <a href="https://t.me/suncomefaster" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.977-.608 1.413-.184.042-.364.084-.543.126-1.19-.216-2.38-.432-3.516-.648-.136.21-.271.42-.406.63-1.823-.236-3.646-.472-5.352-.708a.077.077 0 0 0-.081.034c-.18.312-.36.624-.513.905a.076.076 0 0 0 .011.086c1.342.681 2.684 1.362 3.961 2.043l.739.39c.122.061.244.122.366.183-1.177.497-2.348.994-3.516 1.491a.076.076 0 0 0-.039.095c.213.452.426.904.639 1.352a.077.077 0 0 0 .084.045c1.814-.29 3.628-.58 5.403-.87.36.58.72 1.16 1.08 1.74-1.231.315-2.462.63-3.686.945a.077.077 0 0 0-.054.106c.27.602.54 1.204.81 1.8a.076.076 0 0 0 .093.042c1.78-.396 3.56-.792 5.271-1.188.164.498.328.996.491 1.494a.076.076 0 0 0 .125.03c1.141-1.236 2.282-2.472 3.384-3.708.043-.048.094-.103.094-.168-.224-2.098-.448-4.196-.671-6.285z"/></svg>
                </a>
                <a href="https://github.com/deaabie" className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M14.5 9h-5l1 12h3z"></path><path d="M9.5 9c0-1 .5-3 2.5-3 2 0 2.5 2 2.5 3"></path></svg>
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
