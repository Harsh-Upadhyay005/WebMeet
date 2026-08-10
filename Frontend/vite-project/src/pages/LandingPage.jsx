import { Link } from "react-router-dom";
import { 
  Video, 
  MessageCircle, 
  Users, 
  Sparkles, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Radio
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import ThemeSelector from "../components/ThemeSelector";

const LandingPage = () => {
  const { theme } = useThemeStore();

  const features = [
    {
      icon: <Video className="w-6 h-6 text-primary" />,
      title: "Crystal Clear HD Video",
      description: "Experience ultra-low latency WebRTC video calling with adaptive bandwidth management.",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-secondary" />,
      title: "Instant Chat & Threads",
      description: "Real-time messaging with instant delivery, media attachments, and message history.",
    },
    {
      icon: <Users className="w-6 h-6 text-accent" />,
      title: "Group Rooms & Spaces",
      description: "Create public or private meeting spaces for instant group collaboration.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: "Smart AI Transcripts",
      description: "Automated live captions and meeting summaries powered by intelligent speech AI.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", description: "Trusted daily for calls" },
    { value: "99.99%", label: "Uptime SLA", description: "Reliable enterprise infrastructure" },
    { value: "< 12ms", label: "Latency", description: "Sub-second real-time audio sync" },
  ];

  return (
    <div 
      className="min-h-screen bg-base-100 text-base-content transition-colors duration-300 font-sans" 
      data-theme={theme}
    >
      {/* Simple Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-lg shadow-sm">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-base-content">
                WebMeet
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-base-content/80">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#stats" className="hover:text-primary transition-colors">Stats</a>
              <a href="#security" className="hover:text-primary transition-colors">Security</a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ThemeSelector />
              <Link 
                to="/login" 
                className="btn btn-ghost btn-sm font-semibold text-base-content/80"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary btn-sm font-semibold px-4"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 max-w-5xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base-200 border border-base-300 text-xs font-semibold text-base-content/80">
          <Radio className="w-3.5 h-3.5 text-primary" />
          <span>WebMeet Video & Chat Platform</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-base-content leading-tight">
          Simple, Crystal-Clear Video Calls & <span className="text-primary">Team Messaging</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
          Connect with your team instantly. High quality HD video calls, public & private chat rooms, and direct messaging built for seamless collaboration.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link 
            to="/signup" 
            className="btn btn-primary btn-lg rounded-full font-semibold px-8 shadow-md"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/login" 
            className="btn btn-outline btn-lg rounded-full font-semibold px-8"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Subtext */}
        <p className="text-xs text-base-content/60 font-medium pt-1">
          No credit card required • Instant room creation
        </p>

        {/* Clean Dashboard Preview Mockup (No 3D tilt, high clarity) */}
        <div className="pt-8">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-4 shadow-xl text-left max-w-4xl mx-auto">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-base-300 pb-3 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
                <span className="text-xs font-semibold text-base-content/70 ml-2">webmeet.app / call / room-702</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-success badge-sm gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live Call
                </span>
              </div>
            </div>

            {/* Video grid preview */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Main Participant */}
              <div className="md:col-span-2 relative aspect-video bg-base-300 rounded-xl overflow-hidden flex items-center justify-center border border-base-300">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                  alt="Video participant" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-base-900/80 text-white text-xs font-semibold px-3 py-1 rounded-lg backdrop-blur-sm">
                  Alex Morgan (Host)
                </div>
              </div>

              {/* Sidebar Participants */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="relative aspect-video bg-base-300 rounded-xl overflow-hidden border border-base-300">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                    alt="Participant 2" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-base-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    Sarah Jenkins
                  </div>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="font-semibold text-primary flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    In-Call Chat
                  </div>
                  <p className="text-base-content/80">
                    <span className="font-medium text-base-content">David:</span> Ready to share presentation slides!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-base-200 border-y border-base-300 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-base-content">
              Everything You Need for Collaboration
            </h2>
            <p className="text-base-content/70 max-w-xl mx-auto">
              Clean design, high quality audio-video stream, and simple controls.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-base-100 border border-base-300 rounded-2xl p-6 space-y-3 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center mb-2">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-base-content">
                  {item.title}
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-base-200 border border-base-300 rounded-2xl p-8 space-y-2 transition-colors duration-300">
              <div className="text-4xl font-extrabold text-primary">
                {stat.value}
              </div>
              <div className="text-lg font-bold text-base-content">
                {stat.label}
              </div>
              <div className="text-xs text-base-content/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 bg-base-200 border-y border-base-300 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-success/10 text-success mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Encrypted & Secure Communication
          </h2>
          <p className="text-sm text-base-content/70 max-w-lg mx-auto leading-relaxed">
            All calls are powered by secure WebRTC data channels with standard peer encryption. Your privacy and data security are always protected.
          </p>
        </div>
      </section>

      {/* Simple CTA Banner */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="bg-base-200 border border-base-300 rounded-3xl p-10 sm:p-12 space-y-6">
          <h2 className="text-3xl font-bold text-base-content">
            Ready to Start Your First Call?
          </h2>
          <p className="text-base-content/70 max-w-md mx-auto">
            Join WebMeet today and connect with colleagues, friends, and teams in seconds.
          </p>
          <div className="flex justify-center pt-2">
            <Link 
              to="/signup" 
              className="btn btn-primary btn-lg rounded-full font-semibold px-8"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-base-200 border-t border-base-300 text-sm text-base-content/70 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-base-content">
            <Video className="w-4 h-4 text-primary" />
            <span>WebMeet</span>
          </div>

          <div className="flex gap-6 text-xs font-semibold">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#stats" className="hover:text-primary transition-colors">Stats</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
            <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
          </div>

          <div className="text-xs text-base-content/50">
            © {new Date().getFullYear()} WebMeet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
