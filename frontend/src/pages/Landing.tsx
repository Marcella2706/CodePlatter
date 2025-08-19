import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Trophy, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Bookmark,
  BarChart3,
  Mic,
  Search,
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Curated Questions",
      description: "Hand-picked coding questions organized by topic and difficulty level"
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress analytics"
    },
    {
      icon: Bookmark,
      title: "Smart Bookmarks",
      description: "Save interesting questions for later practice and review"
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Find exactly what you need with powerful search and filtering"
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Navigate hands-free with built-in voice recognition technology"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Get insights into your strengths and areas for improvement"
    }
  ];


  return (
    <div className="landing-page min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <section className="relative pt-16 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>Trusted by 10,000+ developers worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
                Master Coding
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                One Question at a Time
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              The most comprehensive platform for coding interview preparation. 
              Practice with curated questions, track your progress, and ace your next tech interview.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400 animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>1000+ Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Excel</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines the best learning methodologies with cutting-edge technology 
              to accelerate your coding journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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