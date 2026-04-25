import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoCopyOutline } from 'react-icons/io5';
import { listMyShares, revokeShare } from '../api/shareApi';

const copyText = async (text) => {
    if (!navigator?.clipboard) {
        toast.error('Clipboard not supported');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied');
    } catch {
        toast.error('Copy failed');
    }
};

const statusBadge = (share) => {
    if (share.revokedAt) {
        return { label: 'Revoked', className: 'bg-rose-50 text-rose-800 border-rose-200' };
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
        return { label: 'Expired', className: 'bg-slate-100 text-slate-700 border-slate-300' };
    }

    if (share.visibility === 'password') {
        return { label: 'Protected', className: 'bg-amber-50 text-amber-800 border-amber-200' };
    }

    if (share.visibility === 'public') {
        return { label: 'Public', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }

    return { label: 'Unlisted', className: 'bg-sky-50 text-sky-800 border-sky-200' };
};

export const Shares = () => {
    const [shares, setShares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revokingToken, setRevokingToken] = useState('');
    const [showRevoked, setShowRevoked] = useState(false);

    const fetchShares = async () => {
        try {
            setLoading(true);
            const response = await listMyShares({ includeRevoked: true });
            setShares(response.shares || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to load shares');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShares();
    }, []);

    const filteredShares = useMemo(() => {
        if (showRevoked) return shares;
        return shares.filter((share) => !share.revokedAt);
    }, [shares, showRevoked]);

    const handleRevoke = async (token) => {
        try {
            setRevokingToken(token);
            await revokeShare(token);
            setShares((prev) =>
                prev.map((share) => (share.token === token ? { ...share, revokedAt: new Date().toISOString() } : share))
            );
            toast.success('Share revoked');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to revoke share');
        } finally {
            setRevokingToken('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <div className="mx-auto w-full max-w-6xl px-6 py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Sharing</p>
                        <h1 className="mt-3 text-3xl font-semibold text-slate-900" style={{ fontFamily: "'Crimson Pro', serif" }}>
                            Manage share links
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">Copy, audit, and revoke links from one place.</p>
                    </div>

                    <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                        <input
                            type="checkbox"
                            checked={showRevoked}
                            onChange={(e) => setShowRevoked(e.target.checked)}
                            className="h-4 w-4"
                        />
                        Show revoked
                    </label>
                </div>

                {loading ? (
                    <p className="mt-10 text-center text-slate-600">Loading share links...</p>
                ) : filteredShares.length === 0 ? (
                    <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                        No share links yet.
                    </div>
                ) : (
                    <div className="mt-8 grid gap-4">
                        {filteredShares.map((share) => {
                            const badge = statusBadge(share);
                            const canRevoke = !share.revokedAt && !(share.expiresAt && new Date(share.expiresAt) < new Date());

                            return (
                                <div key={share.token} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Note</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{share.noteId}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${badge.className}`}>
                                            {badge.label}
                                        </span>
                                    </div>

                                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                                        <p className="break-all text-xs text-slate-700">{share.url}</p>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                        <span>Created: {share.createdAt ? new Date(share.createdAt).toLocaleString() : '-'}</span>
                                        <span>Viewed: {share.lastViewedAt ? new Date(share.lastViewedAt).toLocaleString() : 'Never'}</span>
                                        <span>Expires: {share.expiresAt ? new Date(share.expiresAt).toLocaleString() : 'No expiry'}</span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => copyText(share.url)}
                                            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
                                        >
                                            <IoCopyOutline />
                                            Copy link
                                        </button>

                                        {canRevoke && (
                                            <button
                                                type="button"
                                                onClick={() => handleRevoke(share.token)}
                                                disabled={revokingToken === share.token}
                                                className="rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {revokingToken === share.token ? 'Revoking...' : 'Revoke'}
                                            </button>
                                        )}

                                        <NavLink
                                            to={`/share/${share.token}`}
                                            target="_blank"
                                            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-100"
                                        >
                                            Open link
                                        </NavLink>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shares;
