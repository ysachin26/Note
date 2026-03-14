import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginThunk, registerThunk } from '../../redux/features/authSlice'
import { useState } from 'react'



export const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error } = useSelector((state) => state.auth)
    const isLoginMode = isLogin === 'Login'
    const tabBase =
        'rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] transition'
    const tabActive = 'bg-slate-900 text-white shadow-[0_14px_36px_rgba(15,23,42,0.22)]'
    const tabIdle = 'text-slate-600 hover:text-slate-900'

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLogin === 'Login') {
            const result = await dispatch(loginThunk({ email, password }))
            if (result.meta.requestStatus ===
                'fulfilled'
            ) {
                navigate('/')
            }
        }
        else {
            const result = await dispatch(registerThunk({ name, email, password }))
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/')
            }
        }
    }
    return (
        <div
            className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-sky-50 to-rose-50"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-rose-200/60 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_280px_at_50%_-10%,_rgba(59,130,246,0.18),_transparent_60%)]" />

            <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur">
                    <div className="p-8 sm:p-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Account</p>
                                <h1
                                    className="mt-3 text-3xl font-semibold text-slate-900"
                                    style={{ fontFamily: "'Crimson Pro', serif" }}
                                >
                                    {isLoginMode ? 'Welcome back' : 'Create your account'}
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    {isLoginMode
                                        ? 'Log in to continue building your notes.'
                                        : 'Start your NoteX workspace in minutes.'}
                                </p>
                            </div>
                            <div className="flex rounded-full border border-slate-200/70 bg-white/80 p-1 shadow-sm">
                                <button
                                    type="button"
                                    className={`${tabBase} ${isLoginMode ? tabActive : tabIdle}`}
                                    onClick={() => setIsLogin('Login')}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    className={`${tabBase} ${!isLoginMode ? tabActive : tabIdle}`}
                                    onClick={() => setIsLogin('Signup')}
                                >
                                    Signup
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            {!isLoginMode && (
                                <div>
                                    <label
                                        className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                                        htmlFor="fullName"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        id="fullName"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:-translate-y-0.5 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15"
                                        placeholder="Alex Morgan"
                                        type="text"
                                        autoComplete="name"
                                    />
                                </div>
                            )}

                            <div>
                                <label
                                    className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:-translate-y-0.5 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15"
                                    placeholder="you@notex.co"
                                    type="email"
                                    autoComplete="email"
                                />
                            </div>

                            <div>
                                <label
                                    className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:-translate-y-0.5 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                                />
                            </div>

                            <button
                                className="w-full rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.28)] focus:outline-none focus:ring-2 focus:ring-slate-400/60"
                                type="submit"
                            >
                                {isLoginMode ? 'Login' : 'Create account'}
                            </button>

                            {error && (
                                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                                {isLoginMode ? (
                                    <>
                                        <button
                                            type="button"
                                            className="font-semibold text-slate-800 transition hover:text-slate-900"
                                        >
                                            Forgot password?
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsLogin('Signup')}
                                            className="font-semibold text-emerald-700 transition hover:text-emerald-800"
                                        >
                                            Need an account?
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>Already have an account?</span>
                                        <button
                                            type="button"
                                            onClick={() => setIsLogin('Login')}
                                            className="font-semibold text-emerald-700 transition hover:text-emerald-800"
                                        >
                                            Login here
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


