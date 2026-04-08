import React, { useState } from 'react'
import { Video, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { signup } from '../lib/api'
import { motion } from 'framer-motion'

const SignUpPage = () => {
  const [signupData, setSignupData]= useState({
    fullName: '',
    email: '',
    password: '',
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success('Account created successfully! Welcome to WebMeet.')
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }
      queryClient.setQueryData(['authUser'], data)
      navigate('/onboarding')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Signup failed')
    }
  })

  const handleSignUp = async (e) => {
    e.preventDefault()
    signupMutation(signupData)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className='min-h-[100svh] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200 relative overflow-hidden'>
      
      {/* Background glowing blobs using daisyUI colors */}
      <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='flex flex-col-reverse lg:flex-row w-full max-w-5xl mx-auto rounded-[2rem] shadow-2xl overflow-hidden border border-base-content/10 bg-base-100/80 backdrop-blur-2xl relative z-10'
      >

        {/* left side - decorative */}
        <div className="hidden lg:flex w-full lg:w-5/12 bg-base-200/40 border-r border-base-content/5 items-center justify-center relative overflow-hidden p-10">
           
           <motion.div 
             animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/20 rounded-full blur-[60px]" 
           />
           
           <div className="max-w-md relative z-10 flex flex-col justify-center items-center text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="relative w-64 h-64 mx-auto mb-10 bg-base-100/30 rounded-full border border-base-content/10 shadow-2xl backdrop-blur-md flex items-center justify-center p-8 group"
            >
               <img src="/i.svg" alt="Join WebMeet" className="w-full h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-500" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
             <h2 className="text-3xl font-extrabold text-base-content tracking-tight">Start your journey</h2>
              <p className="text-base-content/70 text-base leading-relaxed">
               Join a thriving community, participate in seamless group chats, and spark conversations seamlessly.
              </p>
            </motion.div>
          </div>
        </div>

        {/* right side - signup form */}
        <div className='w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center'>
          
          {/* logo and title */}
          <motion.div variants={itemVariants} className='mb-10 flex items-center justify-start gap-4'>
            <div className="w-12 h-12 bg-primary text-primary-content flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20">
               <Video className='size-6'/>
            </div>
            <span className='text-2xl font-black font-sans text-base-content tracking-tight uppercase'>
              WebMeet
            </span>
          </motion.div>

          <form onSubmit={handleSignUp} className="w-full">
            <motion.div variants={itemVariants} className='mb-8'>
              <h2 className='text-3xl lg:text-4xl font-extrabold text-base-content mb-3'>Create Account</h2>
              <p className='text-base-content/70 font-medium'>Please fill in your details to get started.</p>
            </motion.div>

            <div className='space-y-5'>
              {/* full name input */}
              <motion.div variants={itemVariants} className='form-control w-full relative'>
                <label className='label mb-1 block'>
                  <span className='text-sm font-semibold text-base-content/80 tracking-wide'>Full Name</span>
                </label>
                <div className="relative text-base-content/50 focus-within:text-primary">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    className="input input-bordered w-full pl-12 py-6 bg-base-200/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </motion.div>

              {/* email input */}
              <motion.div variants={itemVariants} className='form-control w-full relative'>
                <label className='label mb-1 block'>
                  <span className='text-sm font-semibold text-base-content/80 tracking-wide'>Email Address</span>
                </label>
                <div className="relative text-base-content/50 focus-within:text-primary">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="input input-bordered w-full pl-12 py-6 bg-base-200/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </motion.div>

              {/* password input */}
              <motion.div variants={itemVariants} className='form-control w-full relative'>
                <label className='label mb-1 block'>
                  <span className='text-sm font-semibold text-base-content/80 tracking-wide'>Password</span>
                </label>
                <div className="relative text-base-content/50 focus-within:text-primary">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="input input-bordered w-full pl-12 py-6 bg-base-200/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <p className='text-xs text-base-content/50 mt-2 font-medium flex items-center gap-1'>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  Must be at least 6 characters long
                </p>
              </motion.div>

              {/* agree to terms */}
              <motion.div variants={itemVariants} className='form-control w-full mt-3'>
                <label className='flex items-center gap-3 cursor-pointer group'>
                  <input type="checkbox" required className="checkbox checkbox-primary checkbox-sm border-base-content/30" />
                  <span className='text-sm text-base-content/70 select-none mt-1'>
                    I agree to the <span className='text-primary hover:text-primary-focus hover:underline transition-colors'>Terms</span> and <span className='text-primary hover:text-primary-focus hover:underline transition-colors'>Privacy Policy</span>
                  </span>
                </label>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-8">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="btn btn-primary w-full text-lg h-14 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center group"
                disabled={isPending}
              >
                {isPending ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin mr-2" />
                     Creating account...
                   </>
                ) : (
                  <>
                     Sign Up
                     <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </>
                )}
              </motion.button>
            </motion.div>
            
            <motion.div variants={itemVariants} className='text-center mt-6'>
              <p className='text-sm text-base-content/70'>
                Already have an account?{" "} 
                <Link to="/login" className="text-primary hover:text-primary-focus font-bold hover:underline transition-colors ml-1">
                  Sign in
                </Link>
              </p>
            </motion.div>

          </form>
        </div>

      </motion.div>
    </div>
  )
}

export default SignUpPage