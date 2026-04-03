import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearError, resetPasswordThunk } from '../../redux/features/authSlice'


export const ResetPasswordForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
const email = JSON.parse(localStorage.getItem('user') || '{}');
      const result = await dispatch(resetPasswordThunk({ password ,email}));
      if (result.meta.requestStatus ===
        'fulfilled'

      ) {
        console.log(password)
        toast.success("password changed successfully")
        navigate('/login')
      }
    }





  }
  return (
    <div className='flex justify-center items-center h-screen w-screen    '>

      <div className='flex flex-col   gap-4 rounded-md  border-2 focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40 h-64 w-100 justify-center items-start'>
        <div className=' text-left ml-7  w-60
                                text-center text-md font-semibold 
                                text-slate-500 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40'   style={{ fontFamily: "'Crimson Pro', serif" }}>Reset New Password</div>

        <form onSubmit={onsubmit}>
          <div className='flex flex-col gap-4  w-100   items-center   justify-center'>
            <div className='  rounded-md 
                                border border-slate-300 bg-white 
                                text-center text-xl font-semibold 
                                text-slate-900 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40  rounded-md p-2'>
              <input className="   outline-hidden w-60 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 "
                style={{ fontFamily: "'Crimson Pro', serif" }} placeholder="enter new password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
                required />
            </div>  <div className='  rounded-md 
                                border border-slate-300 bg-white 
                                text-center text-xl font-semibold 
                                text-slate-900 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40  rounded-md p-2'>
              <input className="   outline-hidden w-60 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 "
                style={{ fontFamily: "'Crimson Pro', serif" }} placeholder="enter confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={20}
                required />
            </div>
            <div className='self-center w-60 flex justify-start'>
              <div className=' border cursor-pointer  p-2 rounded-md  rounded-md 
                                border border-slate-300 bg-black 
                                text-center text-xl font-semibold 
                                text-slate-900 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40 ' >
                <button className="outline-hidden mb-2 text-xs font-semibold  cursor-pointer uppercase tracking-[0.2em] text-slate-500  text-white"
                  style={{ fontFamily: "'Crimson Pro', serif" }}  >
                  Submit</button>
              </div>
            </div>

          </div>
        </form>

      </div>

    </div>
  )
}


