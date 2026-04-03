

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyEmail, verifyResetOtp } from '../../api/authApi'
const OTP_RESEND_SECONDS = 15;

const OtpVerification = () => {

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [seconds, setSeconds] = useState(OTP_RESEND_SECONDS);
    const [isVerifying, setIsVerifying] = useState(false)
    const inputRefs = useRef([]);
    const navigate = useNavigate()
    const location = useLocation()
    const flowFromState = location.state?.purpose
    const hasResetEmail = !!localStorage.getItem('pendingResetOtpEmail')
    const purpose = flowFromState || (hasResetEmail ? 'reset' : 'register')
    const email = location.state?.email
        || localStorage.getItem(purpose === 'reset' ? 'pendingResetOtpEmail' : 'pendingOtpEmail')
        || ''
    const resendExpiryKey = `otpResendExpiry_${purpose}`
    //timer logic for otp resend

    useEffect(() => {

        const now = Date.now();
        const savedExpiry = Number(localStorage.getItem(resendExpiryKey));
        if (!savedExpiry) {
            localStorage.setItem(
                resendExpiryKey,
                String(now + OTP_RESEND_SECONDS * 1000)
            )
        }

        const updateSeconds = () => {
            const currentExpiry = Number(localStorage.getItem(resendExpiryKey))
            const remaining = Math.max(0, Math.ceil((currentExpiry - Date.now()) / 1000));
            setSeconds(remaining)
        }
        updateSeconds()
        const intervalId = setInterval(updateSeconds, 1000)
        return () => clearInterval(intervalId)
    }, [resendExpiryKey]);

    function resendOTP() {
        if (seconds > 0) {
            return;
        }
        //updating everysecond
        const newExpiry = Date.now() + OTP_RESEND_SECONDS * 1000;
        localStorage.setItem(resendExpiryKey, String(newExpiry));
        setSeconds(OTP_RESEND_SECONDS)
    }

    useEffect(() => {
        if (!location.state?.email) {
            return
        }

        if (purpose === 'reset') {
            localStorage.setItem('pendingResetOtpEmail', location.state.email)
        } else {
            localStorage.setItem('pendingOtpEmail', location.state.email)
        }
    }, [location.state?.email, purpose])

    const copy = purpose === 'reset'
        ? {
            eyebrow: 'Reset password',
            title: 'Verify reset OTP',
            description: 'Enter the 6-digit code sent to your email to continue password reset.',
            missingEmail: 'Email is missing. Please start reset password again.'
        }
        : {
            eyebrow: 'Secure login',
            title: 'Enter the OTP',
            description: 'Use the 6-digit code sent to your email.',
            missingEmail: 'Email is missing. Please signup again.'
        }


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
            toast.error(copy.missingEmail)
            navigate(purpose === 'reset' ? '/forgot-password' : '/login')
            return
        }

        if (fullOtp.length !== otp.length) {
            toast.error('Please enter full OTP')
            return
        }

        setIsVerifying(true)
        const verifyRequest = purpose === 'reset'
            ? verifyResetOtp(email, fullOtp)
            : verifyEmail(email, fullOtp)

        verifyRequest
            .then((response) => {
                toast.success(response.data?.message || 'OTP verified')
                if (purpose === 'reset') {
                    navigate('/reset-password', { state: { email } })
                } else {
                    localStorage.removeItem('pendingOtpEmail')
                    navigate('/login')
                }
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
                        {copy.eyebrow}
                    </p>
                    <h1
                        className="mt-3 text-3xl font-semibold text-slate-900"
                        style={{ fontFamily: "'Crimson Pro', serif" }}
                    >
                        {copy.title}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        {copy.description}
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
                        <button disabled={seconds > 0}
                            type="button" onClick={resendOTP}
                            className={seconds <= 0
                                ? "font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                                : "font-semibold text-slate-400 cursor-not-allowed"}
                        >
                            {seconds === 0 ? 'Resend OTP' : ` Resend OTP in ${seconds}s`}

                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OtpVerification