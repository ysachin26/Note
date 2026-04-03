import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearError, forgotPasswordThunk } from '../../redux/features/authSlice'

export const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const onsubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError())
    const result = await dispatch(forgotPasswordThunk({ email }))
    if (result.meta.requestStatus ===
      'fulfilled'
    ) {
      localStorage.setItem('pendingResetOtpEmail', email)
      navigate('/verify', { state: { email, purpose: 'reset' } })
    }
    setEmail('')
  }
  return (
    <div className='flex justify-center items-center h-screen w-screen    '>

      <div className='flex flex-col gap-4 rounded-md  border-2 focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40 h-64 w-100 justify-center items-start'>
        <div className=' text-left ml-7  
                                text-center text-md font-semibold 
                                text-slate-500 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40'   style={{ fontFamily: "'Crimson Pro', serif" }}>Reset Password</div>

        <form onSubmit={onsubmit}>
          <div className='flex flex-row gap-4  w-100   items-center   justify-center'>
            <div className='  rounded-md 
                                border border-slate-300 bg-white 
                                text-center text-xl font-semibold 
                                text-slate-900 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40  rounded-md p-2'>
              <input className="   outline-hidden w-60 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 "
                style={{ fontFamily: "'Crimson Pro', serif" }} placeholder="enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={50}
                required />
            </div>
            <div className=' border cursor-pointer  p-2 rounded-md  rounded-md 
                                border border-slate-300 bg-black 
                                text-center text-xl font-semibold 
                                text-slate-900 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40 items-center justify-center' >
              <button className="outline-hidden mb-2 text-xs font-semibold  cursor-pointer uppercase tracking-[0.2em] text-slate-500  text-white"
                style={{ fontFamily: "'Crimson Pro', serif" }}  >
                Submit</button>
            </div>
          </div>
        </form>

      </div>

    </div>
  )
}


