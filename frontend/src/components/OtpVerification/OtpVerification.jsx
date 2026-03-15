
import React from 'react'
import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyEmail } from '../../api/authApi'

const OtpVerification = () => {

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isVerifying, setIsVerifying] = useState(false)
    const inputRefs = useRef([]);
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || localStorage.getItem('pendingOtpEmail') || ''


    const handleChange = (element, index) => {
        const value = element.value.replace(/\D/g, '').slice(-1)

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }




    }

    function handleKeyDown(e, index) {

        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus()
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const fullOtp = otp.join("");
        if (!email) {
            toast.error('Email is missing. Please signup again.')
            navigate('/login')
            return
        }

        if (fullOtp.length !== otp.length) {
            toast.error('Please enter full OTP')
            return
        }

        setIsVerifying(true)
        verifyEmail(email, fullOtp)
            .then((response) => {
                toast.success(response.data?.message || 'OTP verified')
                localStorage.removeItem('pendingOtpEmail')
                navigate('/login')
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Failed to verify OTP')
            })
            .finally(() => {
                setIsVerifying(false)
            })
    };


    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-200 px-6 py-10"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Secure login
                    </p>
                    <h1
                        className="mt-3 text-3xl font-semibold text-slate-900"
                        style={{ fontFamily: "'Crimson Pro', serif" }}
                    >
                        Enter the OTP
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Use the 6-digit code sent to <span className="font-semibold text-slate-800">your email</span>.
                    </p>
                </div>
                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between gap-3">
                        {otp.map((digit, index) => (

                            <input
                                key={index}
                                value={digit}
                                type="text"
                                autoFocus={index === 0}
                                aria-label="OTP digit 1"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                autoComplete="one-time-code"

                                ref={(e) => inputRefs.current[index] = e}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}

                                className="h-12 w-12 rounded-md 
                                border border-slate-300 bg-white 
                                text-center text-xl font-semibold 
                                text-slate-900 outline-none 
                                focus:border-slate-500 focus:ring-1
                                 focus:ring-slate-400/40"
                            />
                        ))}


                    </div>

                    <button
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400/60"
                        type="submit"
                        disabled={isVerifying}
                    >
                        {isVerifying ? 'Verifying...' : 'Verify and continue'}
                    </button>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Did not receive it?</span>
                        <button
                            type="button"
                            className="font-semibold text-slate-700 transition hover:text-slate-900"
                        >
                            Resend code
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OtpVerification