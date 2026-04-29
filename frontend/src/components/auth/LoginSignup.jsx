

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginThunk, registerThunk, clearError } from '../../redux/features/authSlice'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast'

export const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    /** @type {import('@reduxjs/toolkit').ThunkDispatch<any, any, import('@reduxjs/toolkit').AnyAction>} */
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { error } = useSelector(
        /**
         * @param {{ auth: { error: string | null } }} state
         */
        (state) => state.auth
    )
    const isLoginMode = isLogin === 'Login'
    const tabBase =
        'rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition'
    const tabActive = 'bg-slate-200 text-slate-900'
    const tabIdle = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'

    const navigateToResetPassword = () => {
        navigate('/forgot-password');
    }
    /**
     * @param {import('react').SubmitEvent<HTMLFormElement>} e
     */

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(clearError())
        try {
            if (isLogin === 'Login') {
                const loginAction =
                    /** @type {(arg: { email: string, password: string }) => any} */
                    (/** @type {unknown} */ (loginThunk))
                const result = /** @type {{ meta: { requestStatus?: string } }} */ (
                    await dispatch(loginAction({ email, password }))
                )
                if (result.meta.requestStatus ===
                    'fulfilled'
                ) {
                    navigate('/')
                }
            }
            else {
                const registerAction =

                    /** @type {(arg: { name: string, email: string, password: string }) => any} */

                    (/** @type {unknown} */ (registerThunk))

                const result = /** @type {{ meta: { requestStatus?: string } }} */ (
                    await dispatch(registerAction({ name, email, password }))
                )
                if (result.meta.requestStatus === 'fulfilled') {
                    localStorage.setItem('pendingOtpEmail', email)
                    navigate('/verify', { state: { email, purpose: 'register' } })
                }
            }
        } catch (error) {

            toast.error(error)
        }

    }

    return (
        <div
            className="min-h-screen bg-slate-200"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            <div className="flex min-h-screen items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
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
                        <div className="flex rounded-md border border-slate-300 bg-white p-1">
                            <button
                                type="button"
                                className={`${tabBase} ${isLoginMode ? tabActive : tabIdle} cursor-pointer`}
                                onClick={() => setIsLogin('Login')}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className={`${tabBase} ${!isLoginMode ? tabActive : tabIdle} cursor-pointer`}
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
                                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
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
                                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
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
                            <div className='flex items-center relative'>
                                <input
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 mt-2 text-slate-600 hover:text-slate-900 transition"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            className="w-full rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400/60"
                            type="submit"
                        >
                            {isLoginMode ? 'Login' : 'Create account'}
                        </button>

                        {error && (
                            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                                {(Array.isArray(error) ? error : [error]).map((msg, index) => (
                                    <p key={index}>{msg}</p>
                                ))}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                            {isLoginMode ? (
                                <>
                                    <button onClick={navigateToResetPassword}
                                        type="button"
                                        className="font-semibold cursor-pointer text-slate-700 transition hover:text-slate-900"
                                    >
                                        Forgot password?
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin('Signup')}
                                        className="font-semibold cursor-pointer text-slate-700 transition hover:text-slate-900"
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
                                        className="font-semibold cursor-pointer text-slate-700 transition hover:text-slate-900"
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
    )
}


