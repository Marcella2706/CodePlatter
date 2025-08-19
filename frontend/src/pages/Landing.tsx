import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Trophy, 
  ArrowRight,
  CheckCircle,
  Bookmark,
  BarChart3,
  Mic,
  Search,
  Star,
  Users,
  Code2,
  Target,
  Sparkles
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Curated Questions",
      description: "Hand-picked coding questions organized by topic and difficulty level",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress analytics",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Bookmark,
      title: "Smart Bookmarks",
      description: "Save interesting questions for later practice and review",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Find exactly what you need with powerful search and filtering",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Navigate hands-free with built-in voice recognition technology",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Get insights into your strengths and areas for improvement",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const stats = [
    { icon: Users, number: "10,000+", label: "Active Developers" },
    { icon: Code2, number: "300+", label: "Coding Questions" },
    { icon: Target, number: "95%", label: "Success Rate" },
    { icon: Star, number: "4.9/5", label: "User Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "CodePlatter helped me land my dream job! The question quality is exceptional.",
      avatar: "SC"
    },
    {
      name: "Alex Rodriguez", 
      role: "Full Stack Developer",
      content: "Best platform for interview prep. The progress tracking keeps me motivated.",
      avatar: "AR"
    },
    {
      name: "Emily Johnson",
      role: "CS Student",
      content: "As a student, this free platform has been invaluable for my learning journey.",
      avatar: "EJ"
    }
  ];

  return (
    <div className="landing-page min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <section className="relative pt-8 sm:pt-16 pb-16 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base mb-6 sm:mb-8 animate-fade-in backdrop-blur-sm border border-blue-200/50 dark:border-white/10">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Trusted by 10,000+ developers worldwide</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 animate-fade-in leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
                Master Coding
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                One Question at a Time
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up px-4">
              The most comprehensive platform for coding interview preparation. 
              Practice with curated questions, track your progress, and ace your next tech interview.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 animate-slide-up px-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                </Button>
              </Link>
              
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm min-w-[200px]">
                  Sign In
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 lg:gap-8 text-gray-500 dark:text-gray-400 animate-fade-in px-4">
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-green-200/50 dark:border-green-500/30">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm sm:text-base font-medium">Free Forever</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-blue-200/50 dark:border-blue-500/30">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm sm:text-base font-medium">300+ Questions</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-purple-200/50 dark:border-purple-500/30">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm sm:text-base font-medium">Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

   

      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Everything You Need to 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Excel</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto px-4">
              Our platform combines the best learning methodologies with cutting-edge technology 
              to accelerate your coding journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className={`bg-gradient-to-br ${feature.color} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

     
      
    </div>
  );
};

export default Landing;