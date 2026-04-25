import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import { IoCopyOutline, IoEyeSharp } from 'react-icons/io5';
import { MdDelete, MdArchive } from 'react-icons/md';
import toast from 'react-hot-toast';
import { CiShare1, CiStar } from 'react-icons/ci';
import { useEffect, useMemo, useState } from 'react';
import { BsPin, BsPinFill } from 'react-icons/bs';
import { updateNoteThunk, fetchNotesThunk } from '../redux/features/noteSlice';
import { createShare, getLatestShareForNote, revokeShare } from '../api/shareApi';

const copyFromClipboard = async (text) => {
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

const formatDatetimeLocal = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return '';
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const getShareBadge = (share) => {
    if (!share) return null;
    if (share.visibility === 'password') {
        return { label: 'Protected', className: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    if (share.visibility === 'public') {
        return { label: 'Public', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
    return { label: 'Shared', className: 'bg-sky-50 text-sky-800 border-sky-200' };
};

export const Pastes = () => {
    const { notes, totalPages, loading } = useSelector((state) => state.paste);
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState('');
    const [showFilterBox, setShowFilterBox] = useState(false);
    const [activeFilter, setActiveFilter] = useState('active');
    const [sortOrder, setSortOrder] = useState('pinned');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [Page, setPage] = useState(1);
    const [sharingNoteId, setSharingNoteId] = useState('');
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareTarget, setShareTarget] = useState(null);
    const [shareVisibility, setShareVisibility] = useState('unlisted');
    const [sharePassword, setSharePassword] = useState('');
    const [shareExpiresAt, setShareExpiresAt] = useState('');
    const [shareResult, setShareResult] = useState(null);
    const [shareByNoteId, setShareByNoteId] = useState({});

    const filterOptions = [
        { key: 'active', label: 'All' },
        { key: 'important', label: 'Important' },
        { key: 'archived', label: 'Archive' },
        { key: 'bin', label: 'Bin' },
    ];

    const refetchPage = (pageNumber) => {
        dispatch(
            fetchNotesThunk({
                page: pageNumber,
                limit: 6,
                scope: activeFilter,
                q: searchValue.trim(),
                from: dateFrom,
                to: dateTo,
            })
        );
    };

    useEffect(() => {
        setPage(1);
    }, [activeFilter, searchValue, dateFrom, dateTo]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                fetchNotesThunk({
                    page: Page,
                    limit: 6,
                    scope: activeFilter,
                    q: searchValue.trim(),
                    from: dateFrom,
                    to: dateTo,
                })
            );
        }, 250);

        return () => clearTimeout(timer);
    }, [dispatch, Page, activeFilter, searchValue, dateFrom, dateTo]);

    useEffect(() => {
        if (totalPages > 0 && Page > totalPages) {
            setPage(totalPages);
        }
    }, [Page, totalPages]);

    useEffect(() => {
        if (!loading && Page > 1 && notes.length === 0) {
            setPage((prev) => prev - 1);
        }
    }, [notes.length, loading, Page]);

    const filteredData = useMemo(() => {
        const data = [...notes];
        data.sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (sortOrder === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            return Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned));
        });
        return data;
    }, [notes, sortOrder]);

    useEffect(() => {
        if (filteredData.length === 0) {
            setShareByNoteId({});
            return;
        }

        let cancelled = false;

        const loadShareState = async () => {
            const pairs = await Promise.all(
                filteredData.map(async (note) => {
                    try {
                        const response = await getLatestShareForNote(note._id);
                        return [note._id, response.share || null];
                    } catch {
                        return [note._id, null];
                    }
                })
            );

            if (!cancelled) {
                setShareByNoteId(Object.fromEntries(pairs));
            }
        };

        loadShareState();

        return () => {
            cancelled = true;
        };
    }, [filteredData]);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const deleteFromPaste = async (id) => {
        const res = await dispatch(updateNoteThunk({ id, data: { isBin: true } }));
        if (updateNoteThunk.fulfilled.match(res)) {
            refetchPage(Page);
        }
    };

    const pinItem = (id) => {
        const note = notes.find((n) => n._id === id);
        if (!note) return;
        dispatch(updateNoteThunk({ id, data: { isPinned: !note.isPinned } }));
    };

    const makePasteArchieve = async (id) => {
        const res = await dispatch(updateNoteThunk({ id, data: { isArchived: true } }));
        if (updateNoteThunk.fulfilled.match(res)) {
            refetchPage(Page);
        }
    };

    const handleimportantNotes = async (id) => {
        const res = await dispatch(updateNoteThunk({ id, data: { isImportant: true } }));
        if (updateNoteThunk.fulfilled.match(res)) {
            refetchPage(Page);
        }
    };

    const handleNextPage = () => {
        if (Page < totalPages) setPage(Page + 1);
    };

    const handlePrevPage = () => {
        if (Page > 1) setPage(Page - 1);
    };

    const handlePageClick = (pageNumber) => {
        setPage(pageNumber);
    };

    const openShareDialog = async (paste) => {
        setShareTarget(paste);
        setShareVisibility('unlisted');
        setSharePassword('');
        setShareExpiresAt('');
        setShareResult(shareByNoteId[paste._id] || null);
        setShareDialogOpen(true);

        try {
            setSharingNoteId(paste._id);
            const response = await getLatestShareForNote(paste._id);
            if (response.share) {
                setShareResult(response.share);
                setShareVisibility(response.share.visibility || 'unlisted');
                setShareExpiresAt(formatDatetimeLocal(response.share.expiresAt));
            }
        } catch {
            // Keep dialog usable even if existing share fetch fails.
        } finally {
            setSharingNoteId('');
        }
    };

    const submitShare = async (event) => {
        event.preventDefault();
        if (!shareTarget) return;

        try {
            setSharingNoteId(shareTarget._id);
            const response = await createShare({
                noteId: shareTarget._id,
                visibility: shareVisibility,
                password: shareVisibility === 'password' ? sharePassword : undefined,
                expiresAt: shareExpiresAt ? new Date(shareExpiresAt).toISOString() : null,
            });

            const shareUrl = response?.share?.url || `${window.location.origin}/share/${response?.share?.token}`;
            const nextShare = { ...response.share, url: shareUrl };
            setShareResult(nextShare);
            setShareByNoteId((prev) => ({
                ...prev,
                [shareTarget._id]: nextShare,
            }));

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: shareTarget.title || 'Shared note',
                        text: shareTarget.description,
                        url: shareUrl,
                    });
                } catch (error) {
                    if (error?.name !== 'AbortError') {
                        // fall through to clipboard copy
                    }
                }
            }

            await copyFromClipboard(shareUrl);
            toast.success('Share link created and copied');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to create share link');
        } finally {
            setSharingNoteId('');
        }
    };

    const closeShareDialog = () => {
        if (sharingNoteId) return;
        setShareDialogOpen(false);
        setShareTarget(null);
        setShareVisibility('unlisted');
        setSharePassword('');
        setShareExpiresAt('');
        setShareResult(null);
    };

    const handleCopyShareUrl = async () => {
        if (!shareResult?.url) return;
        await copyFromClipboard(shareResult.url);
    };

    const handleRevokeShare = async () => {
        if (!shareResult?.token) return;
        try {
            setSharingNoteId(shareTarget?._id || '');
            await revokeShare(shareResult.token);
            toast.success('Share revoked');
            setShareResult(null);
            if (shareTarget?._id) {
                setShareByNoteId((prev) => ({
                    ...prev,
                    [shareTarget._id]: null,
                }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to revoke share');
        } finally {
            setSharingNoteId('');
        }
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="min-h-screen bg-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <div className={`mx-auto w-full px-6 py-10 ${showFilterBox ? 'max-w-[1600px]' : 'max-w-6xl'}`}>
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Library</p>
                        <h1 className="mt-3 text-3xl font-semibold text-slate-900" style={{ fontFamily: "'Crimson Pro', serif" }}>
                            All notes
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">Search, pin, and archive your saved ideas.</p>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pinned on top</div>
                </div>

                <div className={`mt-8 grid items-start gap-8 ${showFilterBox ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : 'grid-cols-1'}`}>
                    <div className="min-w-0">
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Search notes</label>
                            <div className="flex items-center justify-center gap-5">
                                <input
                                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                                    value={searchValue}
                                    onChange={handleSearch}
                                    placeholder="Search your notes..."
                                    type="text"
                                />
                                <button
                                    onClick={() => setShowFilterBox((prev) => !prev)}
                                    className="mt-2 rounded bg-black p-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                                >
                                    {showFilterBox ? 'Hide Filters' : 'Filter'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filteredData.length > 0 ? (
                                filteredData.map((p) => (
                                    <div key={p._id} className="flex justify-center">
                                        <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                            <div className="flex items-center justify-between gap-5 border-b border-slate-200 px-4 py-3">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-lg font-medium">{p.title || 'Untitled'}</h3>
                                                    {shareByNoteId[p._id] && (() => {
                                                        const badge = getShareBadge(shareByNoteId[p._id]);
                                                        return badge ? (
                                                            <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${badge.className}`}>
                                                                {badge.label}
                                                            </span>
                                                        ) : null;
                                                    })()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <NavLink to={`/?pasteId=${p._id}`} aria-label="Edit paste" className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                                        <FaRegEdit />
                                                    </NavLink>
                                                    <NavLink to={`/notes/${p._id}`} aria-label="View paste" className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                                        <IoEyeSharp />
                                                    </NavLink>
                                                    <button onClick={() => copyFromClipboard(p.description)} aria-label="Copy paste" className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                                        <IoCopyOutline />
                                                    </button>
                                                    <button
                                                        onClick={() => openShareDialog(p)}
                                                        aria-label="Share"
                                                        disabled={sharingNoteId === p._id}
                                                        className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <CiShare1 />
                                                    </button>
                                                    {p.isPinned ? (
                                                        <button onClick={() => pinItem(p._id)} aria-label="Pin" className="rounded-md p-2 text-amber-600 transition hover:bg-amber-50">
                                                            <BsPinFill />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => pinItem(p._id)} aria-label="Pin" className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                                            <BsPin />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="px-4 py-4">
                                                <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm">{p.description}</pre>
                                            </div>

                                            <div className="flex justify-between gap-2 border-t border-slate-200 px-4 py-3">
                                                <div className="flex gap-2 px-4 py-2">
                                                    <span className="material-symbols-outlined">calendar_clock</span>
                                                    <span>
                                                        <small className="text-xs text-gray-500">
                                                            {new Date(p.createdAt).toLocaleDateString('en-GB', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </small>
                                                    </span>
                                                </div>
                                                <div className="flex justify-evenly gap-2 px-4 py-2">
                                                    <button onClick={() => makePasteArchieve(p._id)} className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                                        <MdArchive />
                                                    </button>
                                                    <button onClick={() => handleimportantNotes(p._id)} aria-label="Important" className="rounded-md p-2 text-amber-600 transition hover:bg-amber-50 hover:text-amber-800">
                                                        <CiStar />
                                                    </button>
                                                    <button onClick={() => deleteFromPaste(p._id)} aria-label="Delete" className="rounded-md p-2 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800">
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600">No notes available</p>
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={Page === 1}
                                className="rounded-md border border-slate-300 bg-black px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {pageNumbers.map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageClick(pageNumber)}
                                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${Page === pageNumber ? 'border-black bg-black text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            <button
                                onClick={handleNextPage}
                                disabled={Page === totalPages || totalPages === 0}
                                className="rounded-md border border-slate-300 bg-black px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {shareDialogOpen && shareTarget && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
                            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Share note</p>
                                        <h3 className="mt-1 text-lg font-semibold text-slate-900">{shareTarget.title || 'Untitled'}</h3>
                                    </div>
                                    <button
                                        onClick={closeShareDialog}
                                        disabled={Boolean(sharingNoteId)}
                                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Close
                                    </button>
                                </div>

                                <form onSubmit={submitShare} className="space-y-5 px-6 py-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="space-y-2 text-sm text-slate-700">
                                            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Visibility</span>
                                            <select
                                                value={shareVisibility}
                                                onChange={(e) => setShareVisibility(e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-900"
                                            >
                                                <option value="unlisted">Unlisted</option>
                                                <option value="public">Public</option>
                                                <option value="password">Password protected</option>
                                            </select>
                                        </label>

                                        <label className="space-y-2 text-sm text-slate-700">
                                            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Expiry</span>
                                            <input
                                                type="datetime-local"
                                                value={shareExpiresAt}
                                                onChange={(e) => setShareExpiresAt(e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-900"
                                            />
                                        </label>
                                    </div>

                                    <label className="space-y-2 text-sm text-slate-700">
                                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Password</span>
                                        <input
                                            type="password"
                                            value={sharePassword}
                                            onChange={(e) => setSharePassword(e.target.value)}
                                            disabled={shareVisibility !== 'password'}
                                            placeholder={shareVisibility === 'password' ? 'Enter password' : 'Optional when password protection is selected'}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        />
                                    </label>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            type="submit"
                                            disabled={Boolean(sharingNoteId) || (shareVisibility === 'password' && !sharePassword.trim())}
                                            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {sharingNoteId === shareTarget._id ? 'Creating...' : 'Create share link'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeShareDialog}
                                            disabled={Boolean(sharingNoteId)}
                                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    {shareResult && (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                                            <p className="font-semibold">Share link ready</p>
                                            <p className="mt-1 break-all text-xs text-emerald-800">{shareResult.url}</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleCopyShareUrl}
                                                    className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-emerald-600"
                                                >
                                                    Copy link
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRevokeShare}
                                                    disabled={Boolean(sharingNoteId)}
                                                    className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Revoke link
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}

                    {showFilterBox && (
                        <aside className="w-full self-start rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:max-w-none">
                            <div className="border-b border-slate-200 pb-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Filter sidebar</p>
                                <h2 className="mt-1 text-lg font-semibold text-slate-900" style={{ fontFamily: "'Crimson Pro', serif" }}>Refine notes</h2>
                            </div>

                            <div className="mt-4 border-b border-slate-200 pb-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Filters</p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.key}
                                            onClick={() => setActiveFilter(option.key)}
                                            className={`flex w-full items-center justify-center rounded-lg border px-3 py-2 text-center text-sm font-medium transition ${activeFilter === option.key ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            <span className="truncate">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 border-b border-slate-200 pb-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Sort</p>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'pinned', label: 'Pinned' },
                                        { key: 'newest', label: 'New' },
                                        { key: 'oldest', label: 'Old' },
                                    ].map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => setSortOrder(item.key)}
                                            className={`flex w-full items-center justify-center rounded-lg border px-3 py-2 text-center text-sm font-medium transition ${sortOrder === item.key ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 border-b border-slate-200 pb-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Date</p>
                                <div className="mt-2 grid grid-cols-1 gap-2">
                                    <label className="text-xs font-medium text-slate-600">
                                        From
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                                        />
                                    </label>
                                    <label className="text-xs font-medium text-slate-600">
                                        To
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setActiveFilter('active');
                                        setSortOrder('pinned');
                                        setSearchValue('');
                                        setDateFrom('');
                                        setDateTo('');
                                        setShowFilterBox(false);
                                    }}
                                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setShowFilterBox(false)}
                                    className="flex-1 rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Apply
                                </button>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pastes;
