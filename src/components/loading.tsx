import React from 'react'
import Spinner from './spinner'
import {  useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Image from 'next/image'

const LoadingPage = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen z-[9999] bg-white/70">
      <Image 
        src="/icons/loading.svg"
        alt="loading" 
        width={80} 
        height={80}
        className="animate-spin" 
      />
    </div>
  )
}

export default LoadingPage