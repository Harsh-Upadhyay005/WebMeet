import { useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser.js';
import { completeOnboarding } from '../lib/api.js';
import { Camera, CameraIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants/index.js';


const OnboardingPage = () => {
 const {authUser} = useAuthUser();
 const queryClient = useQueryClient();
 const navigate = useNavigate();

 const [formState, setFormState] = React.useState({
  fullName: authUser?.fullName || '',
  bio: authUser?.bio || '',
  nativeLanguage: authUser?.nativeLanguage || '',
  learningLanguage: authUser?.learningLanguage || '',
  profilePic: authUser?.profilePic || '',
  location: authUser?.location || '',
 });
 const {mutate: onboardingMutation, isPending} = useMutation({
  mutationFn: completeOnboarding,
  onSuccess: () => {
    toast.success('Profile onboarded successfully');
    queryClient.invalidateQueries({queryKey: ["authUser"]});
    navigate('/');
  },
  onError: (error) => {
    
    toast.error(error?.response?.data?.message || 'Failed to complete onboarding');
  },
 })

 const handleSubmit = (e) => {
  e.preventDefault();
  onboardingMutation(formState);
 }

 const handleRandomAvatar = () => {
  // Using DiceBear Avatars API for random avatar generation
  const idx = Math.floor(Math.random() * 100) +1;
  const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

  setFormState({...formState, profilePic: randomAvatar});
  toast.success('Random avatar generated');
 }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>
          <form onSubmit = {handleSubmit} className='space-y-4'>
            {/* Profile Pic Container*/}
            <div className='flex flex-col items-center justify-center space-4'>
              {/* Image Preview */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState.profilePic ? (
                  <img 
                    src={formState.profilePic} 
                    alt="Profile Preview" 
                    className='w-full h-full object-cover'/>
                ): (
                  <div className=' flex items-center justify-center w-full h-full text-base-300'>
                    <CameraIcon className='size-12 text-base-content opacity-40'/>
                    <button type="button" onClick={handleRandomAvatar} className="ml-2 px-3 py-1 text-sm rounded bg-primary text-white hover:bg-primary-dark">
                      <ShuffleIcon className='size-4 mr-2'/>
                       Generate Random Avatar
                      </button>
                  </div>
                )}
              </div>
              {/* Small button for random avatar generation */}
                <div className='mt-2'>
                  <button type="button" onClick={handleRandomAvatar} className="btn btn-sm btn-outline btn-secondary">
                    <ShuffleIcon className='size-4 mr-2'/>
                     Generate Random Avatar
                  </button>
                </div>
              {/* Upload Button */}
              <div className='mt-2'>
                <label className='btn btn-sm btn-outline btn-primary cursor-pointer'>
                  <Camera className='size-4 mr-2'/>
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormState((prev) => ({...prev, profilePic: reader.result}));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-white'>
              {/* Left Column */}
              <div className='space-y-4 text-white'>
              {/* Full Name */}
                    <div className = "form-control">
                    <label className = "label">
                    <span className = "label-text">Full Name</span>
                    </label>
                    <input
                    type = "text"
                    name= "fullName"
                    value = {formState.fullName}
                    onChange ={(e) => setFormState({ ...formState, fullName: e.target.value})}
                    className = "input input-bordered w-full "
                    placeholder = "Your full name"
                    required
                    />
                    
                    </div>
                    {/* Bio */}
                    <div className = "form-control">
                    <label className = "label">
                    <span className = "label-text">Bio</span>
                    </label>
                    <input
                    type = "text"
                    name= "bio"
                    value = {formState.bio}
                    onChange ={(e) => setFormState({ ...formState, bio: e.target.value})}
                    className = "input input-bordered w-full "
                    placeholder = "Tell other about yourself and your language learning goals"
                    required
                    />
              </div>
              </div>
              
              {/* Right Column */}
              <div className='space-y-4 '>
                {/* Native Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value})}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="" disabled>Select your native language</option>
                    {LANGUAGES.map((language) => (
                      <option key={`native-${language}`} value={language.toLowerCase()}>
                        {language}
                      </option>
                    ))}
                    </select>
                </div>


                {/* Learning Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value})}
                    className="select select-bordered w-full" //placeholder-white
                    required
                  >
                    {LANGUAGES.map((language) => (
                      <option key={`learning-${language}`} value={language.toLowerCase()}>
                        {language}
                      </option>
                    ))}
                    </select>
                </div>
              </div>
            </div>
            {/* Location Field  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your location"
                required
              />
            </div>

            {/* Submit Button */}
            <div className='mt-6'>
              <button 
                type="submit" 
                className='btn btn-primary w-full'
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage;
