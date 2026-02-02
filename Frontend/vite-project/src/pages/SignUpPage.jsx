import React, { useState } from 'react'
import { Video } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { signup } from '../lib/api'

const SignUpPage = () => {
  const [signupData, setSignupData]= useState({
    fullName: '',
    email: '',
    password: '',
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: signupMutation } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success('Account created successfully!')
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }
      // Set the authUser query data directly
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
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8'>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

      {/* signup form for left side */}
      <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
      {/* logo and title */}
      <div className='mb-4 flex items-center justify-start gap-2'>
        <Video className='size-9 text-primary'/>
        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
          WebMeet
        </span>
      </div>


      <div className='w-full'>
        <form onSubmit={handleSignUp}>
          <div className='space-y-4'>
            <div>
              <h2 className='text-xl font-semibold text-white'>Create an Account</h2>
              <p className='text-sm opacity-70 text-white'>Please fill in the information below to create a new account.</p>
            </div>
            <div className='space-y-3'>
              {/* full name input */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text text-white'>Full Name</span>
                </label>
                <input
                  type="text"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {/* email input */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text text-white'>Email</span>
                </label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {/* password input */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text text-white'>Password</span>
                </label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Enter your password"
                  required
                />
                <p className='text-xs opacity-70 mt-1 text-white'>
                  Password must be at least 6 characters long.
                </p>
              </div>
              {/* agree to terms */}
              <div className='form-control w-full'>
                <label className='label cursor-pointer justify-start gap-2'>
                  <input type="checkbox" className='checkbox checkbox-sm' required/>
                  <span className='text-xs leading-tight text-white '>
                    I agree to the {" "}
                    <span className='text-primary hover:underline cursor-pointer'>terms of service </span> and{" "}
                    <span className='text-primary hover:underline cursor-pointer'>privacy policy</span>.
                  </span>
                </label>
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? 'Creating account...' : 'Sign Up'}
            </button>
            <div className='text-center mt-4'>
              <p className='text-sm text-white'>
                Already have an account?{" "} 
                <Link to="/login" className="text-primary hover:underline cursor-pointer">
                  Sign in
                </Link>
              </p>
            </div>

            </div>
      
        </form>

      </div>

      </div>

      {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/dist/i.svg" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold text-white">Connect with language partners worldwide</h2>
              <p className="opacity-70 text-white">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default SignUpPage