import { Link } from "react-router-dom";
import { Video, MessageCircle, Users, Sparkles, Shield, Zap, ArrowRight, Play } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useState, useEffect } from "react";
import ThemeSelector from "../components/ThemeSelector";
import InteractiveDemo from "../components/InteractiveDemo";

const LandingPage = () => {
  const { theme } = useThemeStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Crystal Clear Video",
      description: "HD video calls with zero lag",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Instant Messaging",
      description: "Real-time chat that just works",
      gradient: "from-pink-400 to-rose-400",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Spaces",
      description: "Collaborate without limits",
      gradient: "from-rose-400 to-orange-400",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "12ms", label: "Latency" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" data-theme={theme}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl transition-all duration-1000 bg-primary/30"
          style={{
            left: `${mousePosition.x - 250}px`,
            top: `${mousePosition.y - 250}px`,
          }}
        />
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Glassmorphic Navbar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="backdrop-blur-xl bg-base-100/30 border border-base-content/10 rounded-2xl px-6 py-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-lg blur opacity-50 group-hover:opacity-75 transition" />
                <div className="relative bg-base-100 p-2 rounded-lg">
                  <Video className="w-6 h-6 text-primary" />
                </div>
              </div>
              <span className="text-xl font-bold text-primary">
                WebMeet
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeSelector />
              <Link to="/login" className="btn btn-ghost btn-sm rounded-full hover:bg-base-content/5">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-sm rounded-full bg-primary border-none text-primary-content hover:bg-primary-focus hover:shadow-lg hover:scale-105 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
        <div className="max-w-6xl w-full">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-base-100/30 border border-base-content/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Powered by Stream.io</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="block">Communication</span>
              <span className="block text-primary">
                Reimagined
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto">
              Minimalist design meets powerful features. Connect with anyone, anywhere, instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/signup" 
                className="group relative px-8 py-4 rounded-full font-medium text-white overflow-hidden transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-all" />
                <span className="relative flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <button 
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="px-8 py-4 rounded-full font-medium backdrop-blur-xl bg-base-100/30 border border-base-content/10 hover:bg-base-100/50 transition-all flex items-center gap-2 group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Interactive Demo Preview */}
            <div className="pt-16 relative">
              <div className="relative max-w-4xl mx-auto">
                {/* Interactive Demo Component */}
                <div className="backdrop-blur-2xl bg-base-100/20 border border-base-content/10 rounded-3xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                  <InteractiveDemo />
                </div>

                {/* Orbiting Elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 rounded-2xl backdrop-blur-xl bg-purple-500/20 border border-purple-400/20 flex items-center justify-center animate-float">
                  <MessageCircle className="w-8 h-8 text-purple-400" />
                </div>
                
                <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-2xl backdrop-blur-xl bg-pink-500/20 border border-pink-400/20 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <Users className="w-8 h-8 text-pink-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-lg text-base-content/60">Simple, powerful, beautiful</p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                className={`group relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 cursor-pointer ${
                  activeFeature === index
                    ? 'bg-base-100/40 border-base-content/20 scale-105 shadow-2xl'
                    : 'bg-base-100/20 border-base-content/10 hover:bg-base-100/30'
                }`}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative space-y-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 transition-transform duration-500 ${
                    activeFeature === index ? 'scale-110' : ''
                  }`}>
                    <div className="text-transparent bg-gradient-to-br bg-clip-text" style={{
                      backgroundImage: `linear-gradient(to bottom right, ${feature.gradient.includes('purple') ? '#a855f7' : '#ec4899'}, ${feature.gradient.includes('pink') ? '#f472b6' : '#fb923c'})`
                    }}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-base-content/60">{feature.description}</p>

                  {/* Progress Bar */}
                  <div className="pt-4">
                    <div className="h-1 bg-base-content/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${feature.gradient} transition-all duration-500 ${
                          activeFeature === index ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-2xl bg-base-100/20 border border-base-content/10 rounded-3xl p-12">
            <div className="grid md:grid-cols-3 gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2 group cursor-pointer">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-base-content/60">{stat.label}</div>
                  <div className="w-16 h-1 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack - Minimalist */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built with Modern Tech</h2>
            <p className="text-base-content/60">Powered by industry leaders</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'Stream.io', 'Node.js', 'MongoDB', 'Zustand', 'Tailwind'].map((tech, index) => (
              <div
                key={index}
                className="px-6 py-3 rounded-full backdrop-blur-xl bg-base-100/20 border border-base-content/10 hover:bg-base-100/40 hover:scale-110 transition-all cursor-pointer"
              >
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Badge */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-2xl bg-base-100/20 border border-base-content/10 rounded-3xl p-12 text-center space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-400/20">
              <Shield className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold">Bank-Grade Security</h3>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              End-to-end encryption, secure authentication, and compliance with industry standards. Your data is always protected.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold">
            Ready to Start?
          </h2>
          <p className="text-xl text-base-content/60">
            Join thousands of teams already using WebMeet
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="group relative px-10 py-5 rounded-full font-medium text-white text-lg overflow-hidden transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-all" />
              <span className="relative flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <p className="text-sm text-base-content/40">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-12 px-4 border-t border-base-content/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-purple-400" />
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                WebMeet
              </span>
            </div>

            <div className="flex gap-8 text-sm text-base-content/60">
              <a href="#" className="hover:text-base-content transition">Features</a>
              <a href="#" className="hover:text-base-content transition">Privacy</a>
              <a href="#" className="hover:text-base-content transition">Terms</a>
            </div>

            <div className="text-sm text-base-content/40">
              © 2026 WebMeet
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
