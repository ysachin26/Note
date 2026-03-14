import React from 'react'

const OtpVerification = () => {
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
                        Use the 4-digit code sent to <span className="font-semibold text-slate-800">your email</span>.
                    </p>
                </div>
                <form className="mt-6 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                        <input
                            aria-label="OTP digit 1"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            autoComplete="one-time-code"
                            className="h-12 w-12 rounded-md border border-slate-300 bg-white text-center text-xl font-semibold text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                            type="text"
                        />
                        <input
                            aria-label="OTP digit 2"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            className="h-12 w-12 rounded-md border border-slate-300 bg-white text-center text-xl font-semibold text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                            type="text"
                        />
                        <input
                            aria-label="OTP digit 3"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            className="h-12 w-12 rounded-md border border-slate-300 bg-white text-center text-xl font-semibold text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                            type="text"
                        />
                        <input
                            aria-label="OTP digit 4"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            className="h-12 w-12 rounded-md border border-slate-300 bg-white text-center text-xl font-semibold text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                            type="text"
                        />
                    </div>

                    <button
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400/60"
                        type="submit"
                    >
                        Verify and continue
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
