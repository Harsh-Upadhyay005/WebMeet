import React, { useState } from 'react'
import { Video } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post('/api/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Login successful!')
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }
      // Set the authUser query data directly
      queryClient.setQueryData(['authUser'], data)
      // Navigate based on onboarding status
      if (data.user?.isOnboarded) {
        navigate('/')
      } else {
        navigate('/onboarding')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    loginMutation.mutate(loginData)
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8'>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* login form */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* logo and title */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <Video className='size-9 text-primary'/>
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              WebMeet
            </span>
          </div>

          <div className='w-full'>
            <form onSubmit={handleLogin}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Welcome Back</h2>
                  <p className='text-sm opacity-70'>Please sign in to your account to continue.</p>
                </div>
                <div className='space-y-3'>
                  {/* email input */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="input input-bordered w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {/* password input */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="input input-bordered w-full"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </button>
                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Don&apos;t have an account?{" "} 
                    <Link to="/signup" className="text-primary hover:underline cursor-pointer">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* right side - decorative */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.svg" alt="Language connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold text-white">Connect with anyone worldwide</h2>
              <p className="opacity-70 text-white">
               Make friends, and improve your language skills together
              </p>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  )
}

export default LoginPage