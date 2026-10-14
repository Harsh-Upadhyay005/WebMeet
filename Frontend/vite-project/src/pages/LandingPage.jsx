import { useState } from "react";
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
  Radio,
  Play,
  X,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  MoreVertical,
  Settings,
  Send,
  Check
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import ThemeSelector from "../components/ThemeSelector";
import InteractiveDemo from "../components/InteractiveDemo";

const LandingPage = () => {
  const { theme } = useThemeStore();
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Support local dashboard image (e.g. public/dashboard.png, public/dashboard.jpg, public/dashboard.webp)
  const [dashboardImg, setDashboardImg] = useState("/dashboard.png");
  const [hasLocalImage, setHasLocalImage] = useState(false);

  const handleImageError = () => {
    if (dashboardImg === "/dashboard.png") {
      setDashboardImg("/dashboard.jpg");
    } else if (dashboardImg === "/dashboard.jpg") {
      setDashboardImg("/dashboard.webp");
    } else if (dashboardImg === "/dashboard.webp") {
      setDashboardImg("/hero-dashboard.png");
    } else {
      setHasLocalImage(false);
    }
  };

  const features = [
    {
      icon: <Video className="w-6 h-6 text-[#FF5E4D]" />,
      title: "Crystal Clear HD Video",
      description: "Experience ultra-low latency WebRTC video calling with adaptive bandwidth management.",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#9055FD]" />,
      title: "Instant Chat & Threads",
      description: "Real-time messaging with instant delivery, media attachments, and message history.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF5E4D]" />,
      title: "Group Rooms & Spaces",
      description: "Create public or private meeting spaces for instant group collaboration.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#9055FD]" />,
      title: "Smart AI Transcripts",
      description: "Automated live captions and meeting summaries powered by intelligent speech AI.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create or Join a Room",
      desc: "Launch an instant room with a unique code or custom name in just one click."
    },
    {
      step: "02",
      title: "Invite Your Team",
      desc: "Share your invite link with teammates, students, or clients with zero friction."
    },
    {
      step: "03",
      title: "Collaborate Seamlessly",
      desc: "Talk in HD video, share screens, send real-time chat, and take synchronized notes."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever free",
      desc: "Perfect for quick team calls, study groups, and community meetups.",
      features: [
        "Up to 50 participants per call",
        "Unlimited 1-on-1 calls",
        "45 minutes group meeting limit",
        "HD video & real-time chat",
        "End-to-end encryption"
      ],
      popular: false,
      buttonText: "Get Started Free"
    },
    {
      name: "Pro Team",
      price: "$12",
      period: "per host / month",
      desc: "Built for growing teams that need unlimited meeting time and cloud recordings.",
      features: [
        "Up to 250 participants per call",
        "Unlimited group call duration",
        "Cloud recording & AI summaries",
        "Custom room URLs & branding",
        "Priority 24/7 support"
      ],
      popular: true,
      buttonText: "Start Free 14-Day Trial"
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per host / month",
      desc: "Advanced security, SSO, dedicated servers, and custom compliance SLA.",
      features: [
        "Up to 1,000 participants",
        "Dedicated WebRTC servers",
        "Single Sign-On (SAML/Okta)",
        "Audit logs & HIPAA compliance",
        "Dedicated account manager"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users", description: "Trusted daily for calls" },
    { value: "99.99%", label: "Uptime SLA", description: "Reliable enterprise infrastructure" },
    { value: "< 12ms", label: "Latency", description: "Sub-second real-time audio sync" },
  ];

  return (
    <div 
      className="min-h-screen bg-[#FCFAF8] text-slate-800 font-sans selection:bg-[#FFE3D9] selection:text-[#FF5E4D]" 
      data-theme={theme}
    >
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#FCFAF8]/85 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5E4D] to-[#FF8E53] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5 fill-white stroke-none" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                WebMeet
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-9 text-[15px] font-medium text-slate-600">
              <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
              <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <ThemeSelector />
              </div>
              <Link 
                to="/login" 
                className="text-[15px] font-semibold text-slate-700 hover:text-slate-900 transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-white text-[15px] font-semibold bg-gradient-to-r from-[#FF7A45] via-[#FF5E4D] to-[#FF455B] shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:opacity-95 active:scale-[0.98] transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
        {/* Fluid Organic Waves Background */}
        {/* Bottom-left soft peach/coral wave */}
        <div className="absolute -bottom-24 -left-20 w-[420px] sm:w-[560px] h-[420px] sm:h-[560px] pointer-events-none z-0">
          <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="blob-left" x1="15%" y1="20%" x2="90%" y2="85%">
                <stop offset="0%" stopColor="#FFA67A" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#FF6B4E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF4359" stopOpacity="0.75" />
              </linearGradient>
            </defs>
            <path
              d="M-50,220 C-40,360 70,470 190,460 C310,450 370,350 380,250 C390,150 300,60 180,45 C60,30 -60,110 -50,220 Z"
              fill="url(#blob-left)"
            />
          </svg>
        </div>

        {/* Right side background fluid ribbon & waves behind dashboard */}
        <div className="absolute right-0 top-0 w-[550px] sm:w-[750px] lg:w-[920px] h-full pointer-events-none z-0 overflow-hidden">
          <svg viewBox="0 0 920 800" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="wave-grad-1" x1="0%" y1="20%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#FF8F6A" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#FF684D" stopOpacity="0.88" />
                <stop offset="80%" stopColor="#FF4A5C" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FF8364" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="wave-grad-2" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#FFA480" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#FF5C43" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#FF385C" stopOpacity="0.88" />
              </linearGradient>
            </defs>
            
            {/* Sweeping sunset wave backdrop */}
            <path 
              d="M380,100 C560,40 760,90 890,170 C960,210 970,320 920,430 C840,580 670,680 490,690 C350,700 280,600 350,490 C410,390 470,300 380,210 C320,150 290,130 380,100 Z" 
              fill="url(#wave-grad-1)" 
            />

            {/* Inner fluid curve */}
            <path 
              d="M440,250 C610,170 780,230 920,300 C930,430 860,580 730,650 C580,720 410,700 340,600 C280,490 350,400 410,340 C440,310 440,270 440,250 Z" 
              fill="url(#wave-grad-2)" 
              opacity="0.96"
            />

            {/* Fine contour accent lines */}
            <path 
              d="M360,210 C560,120 770,170 910,230 C950,250 930,360 860,470 C790,580 640,670 490,680" 
              stroke="#FF553E" 
              strokeWidth="1.5" 
              strokeOpacity="0.75" 
              fill="none" 
            />
            <path 
              d="M410,160 C610,80 810,140 930,200" 
              stroke="#FFA07A" 
              strokeWidth="1" 
              strokeOpacity="0.6" 
              fill="none" 
            />
          </svg>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* ==================== LEFT COLUMN ==================== */}
            <div className="lg:col-span-6 space-y-7 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFF0E9] border border-[#FFE0D3] shadow-sm">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[#FF5E4D]">
                  <Video className="w-3.5 h-3.5 fill-[#FF5E4D] stroke-none" />
                </div>
                <span className="text-xs font-semibold text-[#8C341F] tracking-wide">
                  All-in-one team communication
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Clear conversations.
                <br />
                Stronger <span className="text-[#FF5E4D]">teamwork.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed font-normal">
                HD video calls, team chat, and seamless collaboration for teams, classes, and communities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-base bg-gradient-to-r from-[#FF7A45] via-[#FF5E4D] to-[#FF4757] shadow-lg shadow-orange-500/30 hover:shadow-orange-500/45 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white border border-slate-200/90 text-slate-800 font-semibold text-base shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
                    <Play className="w-3 h-3 fill-white stroke-none ml-0.5" />
                  </span>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* 3 Bottom Feature Badges */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4">
                {/* HD Video Calls */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEEAE4] text-[#FF5E4D] flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 fill-[#FF5E4D] stroke-none" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm leading-tight">HD</div>
                    <div className="text-xs text-slate-500 leading-tight">Video Calls</div>
                  </div>
                </div>

                {/* Team Chat */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3EEFE] text-[#9055FD] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 fill-[#9055FD] stroke-none" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm leading-tight">Team</div>
                    <div className="text-xs text-slate-500 leading-tight">Chat</div>
                  </div>
                </div>

                {/* Instant Rooms */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3EEFE] text-[#9055FD] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 fill-[#9055FD] stroke-none" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm leading-tight">Instant</div>
                    <div className="text-xs text-slate-500 leading-tight">Rooms</div>
                  </div>
                </div>
              </div>

            </div>

            {/* ==================== RIGHT COLUMN (DASHBOARD PREVIEW) ==================== */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
                
                {/* Floating Top Right Card: "4+ In a call" */}
                <div 
                  className="absolute -top-5 -right-2 sm:-top-7 sm:-right-4 md:-right-6 z-30 bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-float"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-900 leading-tight">4+</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight">In a call</div>
                  </div>
                </div>

                {/* Floating Bottom Right Card: "Secure & Private" */}
                <div 
                  className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-6 md:-right-8 z-30 bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-4 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] max-w-[240px] sm:max-w-[270px] animate-float"
                  style={{ animationDelay: "1.4s" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5E4D] to-[#FF8E53] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
                      <Shield className="w-5 h-5 fill-white/20 stroke-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-tight">Secure & Private</div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">
                        Your conversations stay safe and encrypted.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Dashboard Outer Container with gentle 3D Perspective */}
                <div 
                  className="relative rounded-2xl sm:rounded-3xl bg-white border border-white/90 shadow-[0_25px_60px_-15px_rgba(20,20,30,0.16),0_12px_25px_-5px_rgba(255,90,50,0.1)] overflow-hidden transition-all duration-500 hover:rotate-0 hover:scale-[1.01]"
                  style={{
                    transform: "perspective(1200px) rotateY(-5deg) rotateX(3deg) rotateZ(0.5deg)"
                  }}
                >
                  {/* Local image provided by user (e.g. /dashboard.png) */}
                  <img 
                    src={dashboardImg}
                    alt="WebMeet Call Dashboard"
                    className={`w-full h-auto object-cover ${hasLocalImage ? "block" : "hidden"}`}
                    onLoad={() => setHasLocalImage(true)}
                    onError={handleImageError}
                  />

                  {/* Fallback High-Fidelity Video Call Dashboard Mockup */}
                  {!hasLocalImage && (
                    <div className="w-full bg-[#FAFAFC] text-slate-800 p-4 sm:p-5 select-none">
                      {/* Dashboard Header Bar */}
                      <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-3 px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF5E4D] to-[#FF8E53] flex items-center justify-center text-white shadow-xs">
                            <Video className="w-3.5 h-3.5 fill-white stroke-none" />
                          </div>
                          <span className="font-extrabold text-sm text-slate-900 tracking-tight">WebMeet</span>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          <div className="p-1 text-slate-500 hover:text-slate-800 transition-colors">
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="p-1 text-slate-500 hover:text-slate-800 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <div className="p-1 text-slate-500 hover:text-slate-800 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF455B] text-white text-xs font-semibold shadow-xs">
                            <PhoneOff className="w-3 h-3" />
                            <span>Leave</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Grid & Chat Panel Layout */}
                      <div className="grid grid-cols-12 gap-3">
                        {/* Video Tiles Grid (8 cols) */}
                        <div className="col-span-8 flex flex-col justify-between space-y-3">
                          <div className="grid grid-cols-2 gap-2.5">
                            {/* Participant 1: You */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
                              <img 
                                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80" 
                                alt="You" 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                                You
                              </div>
                              <div className="absolute bottom-2 right-2 w-5 h-5 rounded-md bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                                <Mic className="w-3 h-3" />
                              </div>
                            </div>

                            {/* Participant 2: Priya */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
                              <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" 
                                alt="Priya" 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                                Priya
                              </div>
                              <div className="absolute bottom-2 right-2 w-5 h-5 rounded-md bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                                <Mic className="w-3 h-3" />
                              </div>
                            </div>

                            {/* Participant 3: Alex */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
                              <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" 
                                alt="Alex" 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                                Alex
                              </div>
                              <div className="absolute bottom-2 right-2 w-5 h-5 rounded-md bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                                <Mic className="w-3 h-3" />
                              </div>
                            </div>

                            {/* Participant 4: Rohan */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
                              <img 
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" 
                                alt="Rohan" 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                                Rohan
                              </div>
                              <div className="absolute bottom-2 right-2 w-5 h-5 rounded-md bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                                <Mic className="w-3 h-3" />
                              </div>
                            </div>
                          </div>

                          {/* Video Controls Bar */}
                          <div className="flex items-center justify-center gap-2 pt-1">
                            <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
                              <Mic className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
                              <Video className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
                              <Monitor className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#FF455B] text-white flex items-center justify-center shadow-sm shadow-red-500/30">
                              <PhoneOff className="w-4 h-4" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
                              <MessageCircle className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
                              <Settings className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Right Chat Panel (4 cols) */}
                        <div className="col-span-4 bg-white rounded-xl border border-slate-200/80 p-2.5 flex flex-col justify-between shadow-xs">
                          {/* Tabs */}
                          <div>
                            <div className="flex items-center border-b border-slate-100 pb-2 mb-2 gap-4 text-xs font-semibold">
                              <span className="text-[#FF5E4D] border-b-2 border-[#FF5E4D] pb-1 cursor-pointer">Chat</span>
                              <span className="text-slate-400 cursor-pointer">Notes</span>
                            </div>

                            {/* Chat Messages */}
                            <div className="space-y-2 text-[11px]">
                              {/* Message 1: Priya */}
                              <div>
                                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                                  <span className="font-bold text-slate-700">Priya</span>
                                  <span>10:24 AM</span>
                                </div>
                                <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-100/80">
                                  Hey team! 👋
                                </div>
                              </div>

                              {/* Message 2: Rohan */}
                              <div>
                                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                                  <span className="font-bold text-slate-700">Rohan</span>
                                  <span>10:25 AM</span>
                                </div>
                                <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-100/80">
                                  Let's discuss the new design today.
                                </div>
                              </div>

                              {/* Message 3: Alex */}
                              <div>
                                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                                  <span className="font-bold text-slate-700">Alex</span>
                                  <span>10:27 AM</span>
                                </div>
                                <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-100/80">
                                  Sounds good!
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Chat Input */}
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px] text-slate-400 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200/60">
                            <span>Type a message...</span>
                            <Send className="w-3 h-3 text-[#FF5E4D]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-24 bg-white border-y border-slate-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E9] text-xs font-semibold text-[#FF5E4D]">
              Key Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Everything You Need for Effortless Collaboration
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Designed from the ground up for lightning-fast connections, crystal clarity, and seamless team workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#FCFAF8] border border-slate-200/70 hover:border-orange-200 rounded-3xl p-7 space-y-4 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-13 h-13 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-24 bg-[#FCFAF8] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EEFE] text-xs font-semibold text-[#9055FD]">
              Simple & Fast
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Start a Call in 3 Simple Steps
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              No complex installations or downloads required. Jump straight into the conversation from any modern browser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((st, idx) => (
              <div key={idx} className="relative bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <span className="text-4xl font-extrabold text-[#FF5E4D]/25 font-mono">
                  {st.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {st.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2 p-6 rounded-3xl bg-[#FCFAF8] border border-slate-200/60">
                <div className="text-4xl lg:text-5xl font-extrabold text-[#FF5E4D] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-lg font-bold text-slate-800">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECURITY SECTION ==================== */}
      <section id="security" className="py-24 bg-[#FCFAF8]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5E4D] to-[#FF8E53] text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Encrypted & Private by Design
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            All calls leverage secure peer-to-peer WebRTC connections with end-to-end media encryption. Your video, audio, and private room chats never leave encrypted tunnels.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#FF5E4D]" /> WebRTC DTLS / SRTP Encryption</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#FF5E4D]" /> No Third-Party Tracking</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#FF5E4D]" /> SOC-2 Compliant Hosting</span>
          </div>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <section id="pricing" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E9] text-xs font-semibold text-[#FF5E4D]">
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Simple Plans for Every Stage
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Start free today with no credit card required. Upgrade whenever your team is ready.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular 
                    ? "bg-[#FCFAF8] border-2 border-[#FF5E4D] shadow-xl shadow-orange-500/10 lg:-translate-y-2" 
                    : "bg-white border border-slate-200/80 shadow-sm hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF7A45] to-[#FF455B] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/ {plan.period}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                        <Check className="w-4 h-4 text-[#FF5E4D] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link 
                    to="/signup"
                    className={`w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                      plan.popular 
                        ? "bg-gradient-to-r from-[#FF7A45] via-[#FF5E4D] to-[#FF455B] text-white shadow-md shadow-orange-500/25 hover:opacity-95" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="py-24 bg-[#FCFAF8] max-w-5xl mx-auto px-4">
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#FF5E4D] to-[#FF8E53] p-10 sm:p-14 text-white text-center space-y-6 overflow-hidden shadow-2xl shadow-orange-500/25">
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to Upgrade Your Team's Meetings?
            </h2>
            <p className="text-white/90 text-base leading-relaxed">
              Experience the clarity of WebMeet today. Connect with colleagues, clients, and communities without hassle.
            </p>
            <div className="pt-3 flex justify-center">
              <Link 
                to="/signup" 
                className="px-8 py-3.5 rounded-full bg-white text-[#FF5E4D] font-bold text-base shadow-lg hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 bg-white border-t border-slate-200 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 font-bold text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF5E4D] to-[#FF8E53] flex items-center justify-center text-white">
              <Video className="w-4 h-4 fill-white stroke-none" />
            </div>
            <span className="text-lg">WebMeet</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
          </div>

          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} WebMeet. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ==================== INTERACTIVE DEMO MODAL ==================== */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">WebMeet Live Demo</h3>
                <p className="text-xs text-slate-500">Test audio, video, and controls right here.</p>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-2">
              <InteractiveDemo />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
