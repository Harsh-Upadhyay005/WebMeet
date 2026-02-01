import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import { Toaster } from 'react-hot-toast';
import useAuthUser from './hooks/useAuthUser.js'
import PageLoader from './components/PageLoader.jsx'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'


const App = () => {
  // tanstack query can be used here for global data fetching
 const {isLoading, authUser} = useAuthUser()
 const theme = useThemeStore((state) => state.theme);

 const isAuthenticated = Boolean(authUser)
 const isOnboarded = authUser?.isOnboarded

  if(isLoading){
    return (
      <PageLoader />
    )
  }

  return (
    <div className='h-screen bg-base-100' data-theme={theme}>
      <Routes>
        <Route path='/' element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to = {isAuthenticated ? "/onboarding" : "/login"} />
        )
       } 
       />
        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to= {isOnboarded ? "/" : "/onboarding"} />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path='/notification' element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <NotificationPage />
          </Layout>
        ) : <Navigate to="/login" />} />
        <Route path='/call/:id' element={isAuthenticated && isOnboarded ? (
          <CallPage />
        ) : <Navigate to="/login" />} />
        <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={false}>
            <ChatPage />
          </Layout>
        ) : <Navigate to="/login" />} />
        <Route path='/onboarding' element={isAuthenticated ? (!isOnboarded ? <OnboardingPage /> : <Navigate to="/" />): <Navigate to="/login" />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App