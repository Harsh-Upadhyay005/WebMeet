import React, { useState } from 'react'
import { Video, Mail, Lock, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../lib/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success('Login successful!')
      queryClient.setQueryData(['authUser'], data)
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      setTimeout(() => {
        if (data.user?.isOnboarded) {
          navigate('/')
        } else {
          navigate('/onboarding')
        }
      }, 100);
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    loginMutation.mutate(loginData)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className='min-h-[100svh] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200 relative overflow-hidden'>
      
      {/* Background glowing blobs using primary/secondary colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[30%] h-[30%] rounded-full bg-accent/10 blur-[120px] pointer-events-none mix-blend-screen" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='flex flex-col lg:flex-row w-full max-w-5xl mx-auto rounded-3xl shadow-2xl overflow-hidden border border-base-content/10 bg-base-100/80 backdrop-blur-xl relative z-10'
      >
        {/* left side - form */}
        <div className='w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center'>
          
          {/* logo and title */}
          <motion.div variants={itemVariants} className='mb-10 flex items-center justify-start gap-4'>
            <div className="w-12 h-12 bg-primary text-primary-content flex items-center justify-center rounded-2xl shadow-lg shadow-primary/30">
              <Video className='size-6'/>
            </div>
            <span className='text-3xl font-bold font-sans text-base-content tracking-tight'>
              WebMeet
            </span>
          </motion.div>

          <form onSubmit={handleLogin} className="w-full">
            <motion.div variants={itemVariants} className='mb-8'>
              <h2 className='text-3xl font-bold text-base-content mb-3'>Welcome Back</h2>
              <p className='text-base-content/70 leading-relaxed'>Please sign in to your account to continue connecting with the world.</p>
            </motion.div>

            <div className='space-y-5'>
              {/* email input */}
              <motion.div variants={itemVariants} className='form-control w-full relative'>
                <label className='label mb-1 block'>
                  <span className='text-sm font-medium text-base-content/80'>Email Address</span>
                </label>
                <div className="relative text-base-content/50 focus-within:text-primary">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="input input-bordered w-full pl-12 py-6 bg-base-200/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </motion.div>

              {/* password input */}
              <motion.div variants={itemVariants} className='form-control w-full relative'>
                <label className='label mb-1 block flex justify-between'>
                  <span className='text-sm font-medium text-base-content/80'>Password</span>
                </label>
                <div className="relative text-base-content/50 focus-within:text-primary">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="input input-bordered w-full pl-12 py-6 bg-base-200/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn btn-primary w-full text-lg h-14 rounded-xl shadow-lg shadow-primary/30 group"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                       Sign In
                       <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                  )}
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className='text-center mt-6'>
                <p className='text-sm text-base-content/70'>
                  Don&apos;t have an account?{" "} 
                  <Link to="/signup" className="text-primary hover:text-primary-focus font-semibold hover:underline transition-colors ml-1">
                    Sign Up
                  </Link>
                </p>
              </motion.div>
            </div>
          </form>
        </div>

        {/* right side - decorative with floating elements */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-base-200/50 border-l border-base-content/5 items-center justify-center relative overflow-hidden p-8">
           {/* Decorative blobs inside right panel */}
           <motion.div 
             animate={{ y: [0, -40, 0], scale: [1, 1.2, 1] }}
             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" 
           />
           <motion.div 
             animate={{ y: [0, 40, 0], rotate: [0, 10, 0] }}
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]" 
           />
           
           <div className="max-w-md relative z-10 flex flex-col justify-center items-center text-center">
            {/* Floating illustration card */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-72 h-72 mx-auto mb-10 bg-base-100/50 rounded-[2.5rem] shadow-xl border border-base-content/10 backdrop-blur-md flex items-center justify-center p-8 group overflow-hidden"
            >
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <img src="/i.svg" alt="Illustration" className="w-full h-full object-contain relative z-10" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-extrabold text-base-content tracking-tight leading-tight">
                 Connect with anyone <br/>
                 <span className="text-primary">anywhere, instantly</span>
              </h2>
              <p className="text-base-content/70 text-lg max-w-[80%] mx-auto">
               Join thousands of others in real-time interactions, seamless groups, and crystal clear connections.
              </p>
            </motion.div>
          </div>
        </div>
        
      </motion.div>
    </div>
  )
}

export default LoginPage