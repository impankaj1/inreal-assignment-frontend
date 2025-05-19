'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance, { removeAccessToken } from '@/app/axiosInstance';
import { toast } from 'react-toastify';
import { BACKEND_BASE_URL } from '@/helpers/helper';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axiosInstance.post(
          `${BACKEND_BASE_URL}/auth/logout`,
          {},
          { withCredentials: true }
        );

        removeAccessToken();

        toast.success('Logged out successfully');

        router.push('/auth/login');
      } catch (error) {
        console.error('Logout failed:', error);
        toast.error('Failed to logout. Please try again.');
        router.push('/dashboard');
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className='w-full flex items-center justify-center h-[100vh]'>
      <h1 className='text-xl'>Logging out...</h1>
    </div>
  );
};

export default LogoutPage;
