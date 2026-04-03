// @ts-check

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearError, forgotPasswordThunk } from '../../redux/features/authSlice'

export const ForgotPasswordForm = () => {
  /** @type {import('@reduxjs/toolkit').ThunkDispatch<any, any, import('@reduxjs/toolkit').AnyAction>} */
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  /**
   *  @param {import('react').SubmitEvent<HTMLFormElement>} e 
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError())
    const forgotPasswordAction =

      /** @type {(arg: { email: string }) => any} */
      (/** @type {unknown} */ (forgotPasswordThunk))
      
    const result = /** @type {{ meta: { requestStatus?: string } }} */ (
      await dispatch(forgotPasswordAction({ email }))
    )
    if (result.meta.requestStatus ===
      'fulfilled'
    ) {
      localStorage.setItem('pendingResetOtpEmail', email)
      navigate('/verify', { state: { email, purpose: 'reset' } })
    }
    setEmail('')
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-200 px-6 py-10"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Password recovery
          </p>
          <h1
            className="mt-3 text-3xl font-semibold text-slate-900"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Forgot password?
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email address and we will send an OTP to reset your password.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
              htmlFor="forgot-email"
            >
              Email
            </label>
            <input
              id="forgot-email"
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
              placeholder="you@notex.co"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={50}
              autoComplete="email"
              required
            />
          </div>

          <button
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400/60"
            type="submit"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  )
}


