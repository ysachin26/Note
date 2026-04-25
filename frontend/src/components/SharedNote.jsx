import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoCopyOutline } from 'react-icons/io5';
import { fetchSharedNote } from '../api/shareApi';

export const SharedNote = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState(null);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');

    const loadNote = async (sharePassword = '') => {
        try {
            setLoading(true);
            setError('');
            const response = await fetchSharedNote(token, sharePassword);
            setNote(response.note);
        } catch (err) {
            setNote(null);
            setError(err?.response?.data?.message || 'Unable to load shared note');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadNote();
        }
    }, [token]);

    const copyFromNote = async () => {
        try {
            await navigator.clipboard.writeText(note?.description || '');
            toast.success('Copied');
        } catch {
            toast.error('Copy failed');
        }
    };

    const submitPassword = async (event) => {
        event.preventDefault();
        await loadNote(password);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10 text-slate-600">
                    Loading shared note...
                </div>
            </div>
        );
    }

    if (error) {
        const isPasswordPrompt = error === 'password required';

        return (
            <div className="min-h-screen bg-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10">
                    <div className="w-full rounded-lg border border-slate-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        {isPasswordPrompt ? (
                            <form className="space-y-4 text-left" onSubmit={submitPassword}>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">This share is password protected.</p>
                                    <p className="mt-1 text-sm text-slate-500">Enter the password to view the note.</p>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                    placeholder="Password"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                                >
                                    Unlock
                                </button>
                            </form>
                        ) : (
                            error
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="min-h-screen bg-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Public note</p>
                            <h1 className="mt-2 text-2xl font-semibold text-slate-900" style={{ fontFamily: "'Crimson Pro', serif" }}>
                                {note.title || 'Untitled'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={copyFromNote}
                                className="rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                aria-label="Copy note"
                            >
                                <IoCopyOutline />
                            </button>
                            <NavLink
                                to="/notes"
                                className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                            >
                                Back to app
                            </NavLink>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <pre className="whitespace-pre-wrap break-words font-mono text-sm max-h-[60vh] overflow-auto text-slate-800">
                            {note.description}
                        </pre>
                        <div className="mt-4 text-xs text-slate-500">
                            Shared note view
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharedNote