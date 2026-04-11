import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearError, resetPasswordThunk } from '../../redux/features/authSlice'


export const ResetPasswordForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onsubmit = async (e) => {

    e.preventDefault();
    dispatch(clearError());
    if (password !== confirmPassword) {

      toast.error("password do not match");
      return;
    }
    else {
      const email = location.state?.email || localStorage.getItem('pendingResetOtpEmail') || '';
      if (!email) {
        toast.error('Email is missing. Please start reset flow again')
        navigate('/forgot-password')
        return
      }

      const result = await dispatch(resetPasswordThunk({ password, email }));
      if (result.meta.requestStatus ===
        'fulfilled'

      ) {
        localStorage.removeItem('pendingResetOtpEmail')
        toast.success("password changed successfully")
        navigate('/login')
      }
    }
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
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Choose a strong password you have not used before.
          </p>
        </div>

        <form onSubmit={onsubmit} className="mt-6 space-y-5">
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
              htmlFor="new-password"
            >
              New password
            </label>
            <input
              id="new-password"
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
              placeholder="Enter new password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={20}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
              htmlFor="confirm-password"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={20}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400/60"
            type="submit"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  )
}


