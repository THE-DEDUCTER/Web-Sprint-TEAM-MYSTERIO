'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogoMark } from '@/components/ui/Spinner'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <LogoMark size={80} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 md:p-8">
      <div className="flex w-full max-w-[1000px] min-h-[600px] rounded-[1.5rem] bg-[#f8f9fa] overflow-hidden shadow-2xl">
        {/* Left Side: Image */}
        <div className="relative hidden w-1/2 md:block">
          <Image 
            src="/login-bg.png" 
            alt="Cohort Login Background" 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side: Form */}
        <div className="flex w-full flex-col items-center justify-center px-8 py-12 md:w-1/2 md:px-16 text-center">
          <LogoMark size={48} className="mb-8" />
          
          <h1 className="mb-4 text-[2rem] font-bold leading-tight tracking-tight text-[#1a1c29]">
            WELCOME TO<br />COHORT
          </h1>
          
          <p className="mb-10 text-[0.95rem] text-[#6b7280] max-w-[280px]">
            Connect, message, and innovate with your campus community
          </p>

          <div className="w-full max-w-[320px]">
            <label className="mb-8 flex items-start gap-3 text-left cursor-pointer group">
              <div className="relative flex items-center pt-1">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded-[4px] border border-neutral-300 bg-white checked:border-[#6b7280] checked:bg-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#6b7280] focus:ring-offset-2 transition-all"
                />
                <svg className="pointer-events-none absolute left-1/2 top-1/2 mt-[2px] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[0.85rem] text-[#6b7280] leading-relaxed">
                I agree to the <a href="#" className="font-semibold text-[#4b5563] hover:underline">Terms and Conditions</a> and <a href="#" className="font-semibold text-[#4b5563] hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button 
              disabled={!agreed}
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#a3a3a3] hover:bg-[#8f8f8f] text-white py-3.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white p-1">
                <svg viewBox="0 0 24 24" className="h-full w-full">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
              </div>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
