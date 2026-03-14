import React from 'react'

const OtpVerification = () => {
    return (
        <div className='flex items-center justify-center h-screen bg-slate-200   hover:shadow-[0_14px_36px_rgba(15,23,42,0.25)]'>

            <div className=' flex flex-col  items-center justify-center h-[350px] w-[400px]
             bg-[rgba(255,255,255,0.8)] rounded-md'>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700/70">
                        Secure login
                    </p>
                    <h1
                        className="mt-3 text-3xl font-semibold text-slate-900"
                        style={{ fontFamily: "'Crimson Pro', serif" }}
                    >
                        Enter the OTP
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Use the 4-digit code sent to <span className="font-semibold text-slate-800">your email</span>.
                    </p>
                </div>
                <form className="mt-8 space-y-6" >
                    <div className="flex items-center justify-between gap-3">
                        <input
                            aria-label="OTP digit 1"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            autoComplete="one-time-code"


                             className="h-14 w-12  rounded-1xl border border-slate-200/80 bg-white/80 text-center text-xl 
                            font-semibold text-slate-900 shadow-sm outline-none transition focus:-translate-y-0.5
                             focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 sm:w-14"
                            type="text"
                        />
                        <input
                            aria-label="OTP digit 2"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}

                            className="h-14 w-12  rounded-1xl border border-slate-200/80 bg-white/80 text-center text-xl 
                            font-semibold text-slate-900 shadow-sm outline-none transition focus:-translate-y-0.5
                             focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 sm:w-14"
                            type="text"
                        />
                        <input
                            aria-label="OTP digit 3"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}

                            className="h-14 w-12rounded-1xl border border-slate-200/80 bg-white/80 text-center text-xl font-semibold text-slate-900 shadow-sm outline-none transition focus:-translate-y-0.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 sm:w-14"
                            type="text"
                        />
                        <input
                            aria-label="OTP digit 4"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}

                            className="h-14 w-12rounded-1xl border border-slate-200/80 bg-white/80 text-center text-xl font-semibold text-slate-900 shadow-sm outline-none transition focus:-translate-y-0.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 sm:w-14"
                            type="text"
                        />
                    </div>

                    <button
                        className="w-full rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white 
                         hover: pointer focus:outline-none focus:ring-2 focus:ring-slate-400/60"
                        type="submit"
                    >
                        Verify and continue
                    </button>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Did not receive it?</span>
                        <button
                            type="button"
                            className="font-semibold text-emerald-700 transition hover:text-emerald-900"
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
