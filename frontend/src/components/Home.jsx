import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createNoteThunk, updateNoteThunk, deleteNoteThunk, fetchNotesThunk } from '../redux/features/noteSlice';
import { FaRedo, FaRegEdit } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import { IoIosAdd } from "react-icons/io";
import { IoCopyOutline, IoEyeSharp } from "react-icons/io5";
import { CiShare1 } from "react-icons/ci";


export const Home = () => {
  const [inputTitle, setTitleText] = useState('');
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get('pasteId');
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.paste);

  const slicedArr = notes.slice(0, 3);

  useEffect(() => {
    dispatch(fetchNotesThunk())
  }, [])

  useEffect(() => {
    if (pasteId) {
      const pasteToEdit = notes.find((p) => p._id === pasteId);
      if (pasteToEdit) {
        setTitleText(pasteToEdit.title);
        setValue(pasteToEdit.description);
        setSearchParams({ pasteId: pasteId });
      }
    }
  }, [pasteId]);

  const copyFromHome = async (text) => {
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

  const sharePaste = async (p) => {
    const Url = `${window.location.origin}/?pasteId=${p._id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: p.title || 'shared paste',
          text: p.description,
          url: Url
        });
        toast.success("shared successfully")
      } catch (error) {
        if (error.name !== 'AbortError') {
          await copyFromClipboard(Url);
          toast.success("link copied to clipboard successfully")
        }
      }
    } else {
      await copyFromClipboard(Url);
      toast.success('Link copied to clipboard');
    }
  }

  const reset = () => {
    setTitleText('');
    setValue('');
    setSearchParams({});
  };

  const createNewPaste = () => {
    setTitleText('');
    setValue('');
    setSearchParams({});
  };

  const createPaste = () => {
    if (pasteId) {
      dispatch(updateNoteThunk({ id: pasteId, data: { title: inputTitle, description: value } }))
    } else {
      dispatch(createNoteThunk({ title: inputTitle, description: value }))
    }
    setTitleText('');
    setValue('');
    setSearchParams({});
  };

  const editMode = (id) => {
    const pasteToEdit = notes.find((p) => p._id === id);
    if (pasteToEdit) {
      setTitleText(pasteToEdit.title);
      setValue(pasteToEdit.description);
      setSearchParams({ pasteId: id });
    }
  };

  const deletePaste = (id) => {
    dispatch(deleteNoteThunk(id))
  };

  return (
    <div
      className="min-h-screen bg-slate-200"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
            <h1
              className="mt-3 text-3xl font-semibold text-slate-900"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              Create and refine your notes
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Draft ideas quickly, then pin or archive the ones that matter most.
            </p>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Synced and secure
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Title</label>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
                value={inputTitle}
                placeholder="Your title goes here..."
                onChange={(e) => setTitleText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-10 rounded-md bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                onClick={createPaste}
              >
                {pasteId ? 'Update Note' : 'Create Note'}
              </button>
              <button
                onClick={createNewPaste}
                aria-label="New Note"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <IoIosAdd />
              </button>
              <button
                onClick={reset}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Reset"
              >
                <FaRedo />
              </button>
            </div>
          </div>

          <div className="mt-6 relative">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Note</label>
            <textarea
              className="mt-2 w-full min-h-[320px] rounded-md border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
              rows={20}
              value={value}
              placeholder="Type here..."
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              onClick={() => copyFromHome(value)}
              aria-label="Copy paste"
              className="absolute right-5 top-12 rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <IoCopyOutline />
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-lg font-semibold text-slate-900">Recent Notes</h4>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Last 3</span>
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {slicedArr.length > 0 ? (
              slicedArr.map((p) => (
                <div key={p._id} className="flex justify-center">
                  <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 gap-5">
                      <h3 className="text-md font-medium truncate">{p.title || 'Untitled'}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editMode(p._id)}
                          aria-label="Edit"
                          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <FaRegEdit />
                        </button>
                        <NavLink
                          to={`/notes/${p._id}`}
                          aria-label="View paste"
                          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <IoEyeSharp />
                        </NavLink>
                        <button
                          onClick={() => copyFromClipboard(p.description)}
                          aria-label="Copy"
                          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <IoCopyOutline />
                        </button>
                        <button
                          onClick={() => sharePaste(p)}
                          aria-label="Share"
                          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <CiShare1 />
                        </button>
                      </div>
                    </div>

                    <div className="px-4 py-4">
                      <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm">{p.description}</pre>
                    </div>

                    <div className="px-4 py-3 border-t border-slate-100 flex gap-2 justify-between ">
                      <div className="px-4 py-2 flex gap-2">
                        <span className="material-symbols-outlined">calendar_clock</span>
                        <span>
                          <small className="text-xs text-gray-500">
                            {new Date(p.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                          </small>
                        </span>
                      </div>
                      <div className="px-4 py-2 flex gap-2 justify-evenly">
                        <button
                          onClick={() => deletePaste(p._id)}
                          aria-label="Delete paste"
                          className="rounded-md p-2 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No notes available</p>
            )}
          </div>

          {notes.length > 3 && (
            <div className="mt-6 flex justify-center items-center">
              <NavLink
                to="/notes"
                className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
              >
                View All Notes
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
