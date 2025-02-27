
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Award, Clock, Heart, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We're a passionate team dedicated to building amazing software projects that make a difference.
        </p>
      </div>

      <div className="relative w-full h-64 md:h-96 mb-12 rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80"
          alt="Our company"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h2 className="text-3xl font-bold text-white">Our Story</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            Our mission is to create innovative software solutions that empower people to build, connect, and create in new ways. We believe that technology should be accessible to everyone and that great software can transform industries.
          </p>
          <p className="text-muted-foreground">
            Founded in 2020, our team has grown to include experts in development, design, and product strategy. We're united by our passion for creating tools that make complex processes simple and enjoyable.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground mb-4">
            We envision a world where technology enhances human potential rather than replacing it. Our products are designed to augment your capabilities, streamline your workflows, and help you focus on what matters most.
          </p>
          <p className="text-muted-foreground">
            By combining cutting-edge technology with intuitive design, we're creating a future where everyone can harness the power of software to achieve their goals.
          </p>
        </div>
      </div>

      <Tabs defaultValue="team" className="mb-16">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">Our Team</TabsTrigger>
          <TabsTrigger value="values">Our Values</TabsTrigger>
          <TabsTrigger value="history">Our History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
                bio: "Alex founded the company with a vision to create intuitive software that solves real problems."
              },
              {
                name: "Sarah Chen",
                role: "CTO",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300",
                bio: "Sarah leads our technical strategy and ensures we're using the right technologies for the right problems."
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Design",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
                bio: "Michael ensures our products are not just functional, but a joy to use through thoughtful design."
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
                title: "Innovation",
                icon: <Award className="h-8 w-8 text-primary" />,
                description: "We constantly push boundaries and explore new approaches to solve complex problems."
              },
              {
                title: "Quality",
                icon: <Heart className="h-8 w-8 text-primary" />,
                description: "We're committed to excellence in everything we do, from code to customer service."
              },
              {
                title: "Collaboration",
                icon: <Users className="h-8 w-8 text-primary" />,
                description: "We believe the best results come from diverse teams working together toward common goals."
              },
              {
                title: "Transparency",
                icon: <Clock className="h-8 w-8 text-primary" />,
                description: "We maintain open communication with our customers, partners, and each other."
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
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {[
                  {
                    year: "2020",
                    title: "Company Founded",
                    description: "Our journey began with a small team and a big vision for the future of software."
                  },
                  {
                    year: "2021",
                    title: "First Major Product Launch",
                    description: "We released our flagship product to critical acclaim and quickly gained our first enterprise customers."
                  },
                  {
                    year: "2022",
                    title: "Team Expansion",
                    description: "We tripled our team size and opened our second office to support our growing customer base."
                  },
                  {
                    year: "2023",
                    title: "International Expansion",
                    description: "We took our products global, launching in over 20 countries and supporting multiple languages."
                  }
                ].map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {event.year.slice(-2)}
                      </div>
                      {index < 3 && <div className="w-0.5 h-full bg-border"></div>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{event.year}: {event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
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
                title: "Product of the Year",
                year: "2022",
                description: "Awarded by the Software Innovation Association for our flagship product."
              },
              {
                title: "Top 10 Startups",
                year: "2021",
                description: "Named one of the top 10 startups to watch by Tech Innovators magazine."
              },
              {
                title: "Best Workplace",
                year: "2023",
                description: "Recognized for our outstanding company culture and employee satisfaction."
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
        <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're always looking for talented individuals to join our growing team. Check out our current openings.
        </p>
        <a href="#" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
          View Careers <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default About;
