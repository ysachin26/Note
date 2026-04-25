import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoCopyOutline } from 'react-icons/io5';
import { bulkRevokeShares, listMyShares, revokeShare, updateShare } from '../api/shareApi';

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
    const [savingToken, setSavingToken] = useState('');
    const [bulkRevoking, setBulkRevoking] = useState(false);
    const [showRevoked, setShowRevoked] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [editingToken, setEditingToken] = useState('');
    const [editVisibility, setEditVisibility] = useState('unlisted');
    const [editPassword, setEditPassword] = useState('');
    const [editExpiresAt, setEditExpiresAt] = useState('');

    const isExpired = (share) => Boolean(share.expiresAt && new Date(share.expiresAt) < new Date());
    const canRevoke = (share) => !share.revokedAt && !isExpired(share);

    const toDateTimeLocal = (isoValue) => {
        if (!isoValue) return '';
        const date = new Date(isoValue);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 16);
    };

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
        const normalizedSearch = searchText.trim().toLowerCase();

        return shares.filter((share) => {
            if (!showRevoked && share.revokedAt) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const haystack = `${share.noteId} ${share.token} ${share.url}`.toLowerCase();
            return haystack.includes(normalizedSearch);
        });
    }, [shares, showRevoked, searchText]);

    const selectedActiveTokens = useMemo(() => {
        const selectedSet = new Set(selectedTokens);
        return filteredShares.filter((share) => selectedSet.has(share.token) && canRevoke(share)).map((share) => share.token);
    }, [filteredShares, selectedTokens]);

    const handleRevoke = async (token) => {
        try {
            setRevokingToken(token);
            await revokeShare(token);
            setShares((prev) =>
                prev.map((share) => (share.token === token ? { ...share, revokedAt: new Date().toISOString() } : share))
            );
            setSelectedTokens((prev) => prev.filter((selectedToken) => selectedToken !== token));
            toast.success('Share revoked');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to revoke share');
        } finally {
            setRevokingToken('');
        }
    };

    const handleToggleToken = (token) => {
        setSelectedTokens((prev) => {
            if (prev.includes(token)) {
                return prev.filter((item) => item !== token);
            }
            return [...prev, token];
        });
    };

    const handleSelectVisibleActive = () => {
        const visibleActiveTokens = filteredShares.filter((share) => canRevoke(share)).map((share) => share.token);
        setSelectedTokens(visibleActiveTokens);
    };

    const handleClearSelection = () => {
        setSelectedTokens([]);
    };

    const handleBulkRevoke = async () => {
        if (selectedActiveTokens.length === 0) {
            toast.error('Select at least one active link');
            return;
        }

        try {
            setBulkRevoking(true);
            const response = await bulkRevokeShares(selectedActiveTokens);
            const revokedAt = response?.revokedAt || new Date().toISOString();

            setShares((prev) =>
                prev.map((share) => (selectedActiveTokens.includes(share.token) ? { ...share, revokedAt } : share))
            );
            setSelectedTokens([]);
            toast.success(`Revoked ${response?.modified || selectedActiveTokens.length} links`);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to revoke selected links');
        } finally {
            setBulkRevoking(false);
        }
    };

    const openEdit = (share) => {
        setEditingToken(share.token);
        setEditVisibility(share.visibility || 'unlisted');
        setEditPassword('');
        setEditExpiresAt(toDateTimeLocal(share.expiresAt));
    };

    const closeEdit = () => {
        setEditingToken('');
        setEditPassword('');
    };

    const handleSaveEdit = async (token) => {
        try {
            setSavingToken(token);

            /** @type {{ visibility: 'unlisted' | 'public' | 'password', password?: string, clearPassword?: boolean, expiresAt?: string | null }} */
            const payload = {
                visibility: editVisibility,
                expiresAt: editExpiresAt ? new Date(editExpiresAt).toISOString() : null,
            };

            if (editVisibility === 'password') {
                if (editPassword.trim()) {
                    payload.password = editPassword.trim();
                }
            } else {
                payload.clearPassword = true;
            }

            const response = await updateShare(token, payload);
            const nextShare = response?.share;

            setShares((prev) => prev.map((share) => (share.token === token ? { ...share, ...nextShare } : share)));
            closeEdit();
            toast.success('Share updated');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to update share');
        } finally {
            setSavingToken('');
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

                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search by token, note or url"
                            className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
                        />

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
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSelectVisibleActive}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-100"
                    >
                        Select visible active
                    </button>
                    <button
                        type="button"
                        onClick={handleClearSelection}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-100"
                    >
                        Clear selection
                    </button>
                    <button
                        type="button"
                        onClick={handleBulkRevoke}
                        disabled={bulkRevoking || selectedActiveTokens.length === 0}
                        className="rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {bulkRevoking ? 'Revoking selected...' : `Bulk revoke (${selectedActiveTokens.length})`}
                    </button>
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
                            const isEditing = editingToken === share.token;
                            const selected = selectedTokens.includes(share.token);
                            const revokeAllowed = canRevoke(share);

                            return (
                                <div key={share.token} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() => handleToggleToken(share.token)}
                                                disabled={!revokeAllowed}
                                                className="mt-1 h-4 w-4"
                                            />
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Note</p>
                                                <p className="mt-1 text-sm font-medium text-slate-900">{share.noteId}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                                                Views: {share.viewCount || 0}
                                            </span>
                                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${badge.className}`}>
                                                {badge.label}
                                            </span>
                                        </div>
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

                                        {revokeAllowed && (
                                            <button
                                                type="button"
                                                onClick={() => handleRevoke(share.token)}
                                                disabled={revokingToken === share.token}
                                                className="rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {revokingToken === share.token ? 'Revoking...' : 'Revoke'}
                                            </button>
                                        )}

                                        {!share.revokedAt && (
                                            <button
                                                type="button"
                                                onClick={() => (isEditing ? closeEdit() : openEdit(share))}
                                                className="rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800 transition hover:bg-amber-50"
                                            >
                                                {isEditing ? 'Cancel edit' : 'Edit settings'}
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

                                    {isEditing && (
                                        <div className="mt-4 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Note</p>
                                            <select
                                                value={editVisibility}
                                                onChange={(e) => setEditVisibility(e.target.value)}
                                                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
                                            >
                                                <option value="unlisted">Unlisted</option>
                                                <option value="public">Public</option>
                                                <option value="password">Password</option>
                                            </select>

                                            <input
                                                type="datetime-local"
                                                value={editExpiresAt}
                                                onChange={(e) => setEditExpiresAt(e.target.value)}
                                                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
                                            />

                                            {editVisibility === 'password' && (
                                                <input
                                                    type="password"
                                                    value={editPassword}
                                                    onChange={(e) => setEditPassword(e.target.value)}
                                                    placeholder="New password (optional if already set)"
                                                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500 md:col-span-2"
                                                />
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleSaveEdit(share.token)}
                                                disabled={savingToken === share.token}
                                                className="rounded-md border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {savingToken === share.token ? 'Saving...' : 'Save changes'}
                                            </button>
                                        </div>
                                    )}
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
