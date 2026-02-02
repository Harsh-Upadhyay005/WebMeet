import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { updateProfile } from '../lib/api';
import { Camera, ShuffleIcon, ArrowLeft, Save } from 'lucide-react';
import { LANGUAGES } from '../constants/index.js';
import LazyImage from '../components/LazyImage';

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    profilePic: authUser?.profilePic || '',
    location: authUser?.location || '',
  });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
      queryClient.setQueryData(['authUser'], (oldData) => ({
        ...oldData,
        user: data.user,
      }));
      navigate('/');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    
    // Preload the image before setting it
    const img = new Image();
    img.src = randomAvatar;
    img.onload = () => {
      setFormState({ ...formState, profilePic: randomAvatar });
      toast.success('Random avatar generated');
    };
    img.onerror = () => {
      toast.error('Failed to load avatar, please try again');
    };
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Profile</h1>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden ring-4 ring-primary/20">
                  {formState.profilePic ? (
                    <LazyImage
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      placeholderClassName="w-full h-full bg-base-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Camera className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-sm btn-outline btn-secondary"
                  >
                    <ShuffleIcon className="size-4 mr-2" />
                    Random Avatar
                  </button>
                  <label className="btn btn-sm btn-outline btn-primary cursor-pointer">
                    <Camera className="size-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormState((prev) => ({ ...prev, profilePic: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Location */}
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

                {/* Native Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bio - Full Width */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Tell others about yourself and your language learning goals"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
