import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Scene representing the abstract "Connection"
function Background3D() {
  const sphereRef = useRef();
  
  useFrame((state) => {
    if(sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
      
      {/* Background space elements */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />
      <Sparkles count={200} scale={20} size={5} speed={0.4} opacity={0.3} color="#fff" />

      {/* Main Abstract Orb (representing the core community) */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1}>
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[2.5, 4]} />
          <meshStandardMaterial 
            color="#4f46e5" 
            wireframe 
            emissive="#4f46e5" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      </Float>

      {/* Smaller Orbs (representing users) */}
      <Float speed={2} rotationIntensity={2} floatIntensity={2} position={[-5, 2, -6]}>
         <mesh>
           <sphereGeometry args={[0.5, 32, 32]} />
           <MeshDistortMaterial color="#ec4899" distort={0.5} speed={3} roughness={0} />
         </mesh>
      </Float>

      <Float speed={3} rotationIntensity={3} floatIntensity={2} position={[6, -3, -4]}>
         <mesh>
           <sphereGeometry args={[0.7, 32, 32]} />
           <MeshDistortMaterial color="#8b5cf6" distort={0.4} speed={4} roughness={0} />
         </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={3} position={[-4, -4, -8]}>
         <mesh>
           <sphereGeometry args={[0.4, 32, 32]} />
           <MeshDistortMaterial color="#3b82f6" distort={0.6} speed={2} roughness={0} />
         </mesh>
      </Float>
    </group>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP ScrollTrigger setup for storytelling text
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.story-section');
      
      sections.forEach((section) => {
        const textElements = section.querySelectorAll('.fade-up');
        
        gsap.fromTo(textElements, 
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2, // Stagger effect on text children
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%", // Starts animating when top of section hits 75% of viewport
              toggleActions: "play reverse play reverse", // Animates up and down naturally
            }
          }
        );
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white selection:bg-indigo-500/30 font-sans">
      
      {/* FIXED 3D BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Background3D />
        </Canvas>
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="h-[100svh] flex flex-col items-center justify-center text-center px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="z-10"
          >
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 mb-6 drop-shadow-2xl">
              WebMeet
            </h1>
            <p className="text-xl md:text-3xl font-light text-gray-300 max-w-2xl mx-auto drop-shadow-md">
              A universe of connections, right in your browser.
            </p>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="animate-bounce flex flex-col items-center">
              <span className="text-sm tracking-widest uppercase text-gray-400 mb-3">Scroll to explore</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </section>

        {/* STORY OVERLAY SECTIONS */}
        <div className="max-w-7xl mx-auto">
          
          {/* FEATURE 1: CHAT */}
          <section className="story-section min-h-[100svh] flex items-center px-6 md:px-12 lg:px-24">
            <div className="text-content max-w-xl backdrop-blur-md bg-black/30 p-8 md:p-12 rounded-[2rem] shadow-[0_0_50px_rgba(79,70,229,0.1)] border border-indigo-500/10">
              <div className="fade-up w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h2 className="fade-up text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Conversations that <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">feel alive.</span>
              </h2>
              <p className="fade-up text-xl text-gray-300 leading-relaxed font-light">
                Real-time chat with lightning-fast delivery. Express yourself without boundaries, share your moments seamlessly, and keep the conversation flowing naturally.
              </p>
            </div>
          </section>

          {/* FEATURE 2: CALLS */}
          <section className="story-section min-h-[100svh] flex items-center justify-end px-6 md:px-12 lg:px-24">
            <div className="text-content text-left md:text-right flex flex-col md:items-end max-w-xl backdrop-blur-md bg-black/30 p-8 md:p-12 rounded-[2rem] shadow-[0_0_50px_rgba(236,72,153,0.1)] border border-pink-500/10">
              <div className="fade-up w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-pink-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="fade-up text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Crystal Clear <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-400 to-pink-400">Audio & Video.</span>
              </h2>
              <p className="fade-up text-xl text-gray-300 leading-relaxed font-light md:ml-auto">
                Why just text when you can talk and see each other? High-definition video calls that completely bridge the gap, making it feel like you're right there in the very same room.
              </p>
            </div>
          </section>

          {/* FEATURE 3: GROUPS */}
          <section className="story-section min-h-[100svh] flex items-center px-6 md:px-12 lg:px-24">
            <div className="text-content max-w-xl backdrop-blur-md bg-black/30 p-8 md:p-12 rounded-[2rem] shadow-[0_0_50px_rgba(139,92,246,0.1)] border border-purple-500/10">
              <div className="fade-up w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h2 className="fade-up text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Find Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Communities.</span>
              </h2>
              <p className="fade-up text-xl text-gray-300 leading-relaxed font-light">
                Create communities, coordinate with teams, and host massive group hangouts. It's never been easier or more secure to bring everyone together in one space.
              </p>
            </div>
          </section>

        </div>

        {/* FINAL CTA SECTION */}
        <section className="story-section min-h-[80svh] flex flex-col items-center justify-center text-center px-6 relative z-10 bg-gradient-to-t from-black to-transparent pb-32 pt-32">
          <div className="max-w-3xl">
            <h2 className="fade-up text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-lg">
              Ready to connect?
            </h2>
            <p className="fade-up text-xl md:text-2xl text-gray-400 mb-12">
              Join the ecosystem today and experience communication without boundaries.
            </p>
            
            <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')} 
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full font-bold text-xl text-white shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center w-full sm:w-auto"
              >
                <span>Start Your Journey</span>
                <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </motion.button>
              
              <button 
                onClick={() => navigate('/login')} 
                className="px-10 py-5 rounded-full font-bold text-xl text-white border-2 border-white/20 hover:border-white/60 hover:bg-white/5 transition-all w-full sm:w-auto"
              >
                Sign In
              </button>
            </div>
            
            <div className="fade-up mt-16 text-sm text-gray-500">
               © {new Date().getFullYear()} WebMeet. All rights reserved.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}