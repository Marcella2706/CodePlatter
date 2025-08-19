import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/hooks/use-toast';
import { 
  Mail, 
  Send, 
  MessageSquare,
  User,
  CheckCircle,
  Loader2,
  Heart,
  HelpCircle
} from 'lucide-react';

const BASE_URL = "https://codeplatter-back.pearl99z.tech";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password from the login page by clicking 'Forgot Password'. Follow the email instructions to create a new password.",
      icon: "🔐"
    },
    {
      question: "Can I suggest new features?",
      answer: "Absolutely! We love hearing from our users. Contact us with your ideas and we'll consider them for future updates.",
      icon: "💡"
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-600/20 dark:to-emerald-600/20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Message Sent Successfully! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm sm:text-base leading-relaxed">
              Thank you for reaching out! We've received your message and our team will get back to you within 24 hours. 
              In the meantime, feel free to explore more coding questions.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setSubmitted(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Another Message
              </Button>
              
              <a 
                href="/dashboard"
                className="block w-full"
              >
                <Button 
                  variant="outline"
                  className="w-full border-2 border-blue-200 dark:border-white/20 text-blue-600 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  Continue Learning
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full text-sm mb-6 animate-fade-in">
              <Heart className="w-4 h-4" />
              <span className="font-medium">We'd love to hear from you</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed px-4">
              Have a question, suggestion, or just want to say hello? We're here to help you succeed 
              on your coding journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <Card className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl sm:text-2xl text-blue-700 dark:text-white flex items-center">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-blue-700 dark:text-gray-200 text-sm font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="pl-10 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all rounded-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-blue-700 dark:text-gray-200 text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="pl-10 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-blue-700 dark:text-gray-200 text-sm font-medium">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-blue-700 dark:text-gray-200 text-sm font-medium">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        placeholder="Tell us more about your question or feedback..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-blue-200 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                    <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Quick answers to common questions. Can't find what you're looking for? 
                  Feel free to reach out!
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card 
                    key={index} 
                    className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3">
                        <div className="text-xl sm:text-2xl mt-1">{faq.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                            {faq.question}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;