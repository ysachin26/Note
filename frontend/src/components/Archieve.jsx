import { useDispatch, useSelector } from 'react-redux';
//import { unarchivePaste, binArchiveItems } from '../redux/features/noteSlice';
import { FaRedo } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { updateNoteThunk } from '../redux/features/noteSlice'
import { useEffect } from 'react';
import { fetchNotesThunk } from '../redux/features/noteSlice';
export const Archive = () => {
  const dispatch = useDispatch();
  // const { archieve } = useSelector((state) => state.paste);

  const { notes } = useSelector((state) => state.paste)
  const archieve = notes.filter(n => n.isArchived && !n.isBin)

  useEffect(() => {
    dispatch(fetchNotesThunk({ page: 1, limit: 50, scope: 'archived' }));
  }, [dispatch]);
  
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

  // const handleUnarchive = (id) => {
  //   dispatch(unarchivePaste(id));
  // };

  // const deleteFromPaste = (id) => {
  //   dispatch(binArchiveItems(id));
  // };

  const handleUnarchive =  (id) => {
    dispatch(updateNoteThunk({ id, data: { isArchived: false } }))
  }
  
  const deleteFromPaste =  (id) => {
    dispatch(updateNoteThunk({ id, data: { isBin: true } }))
  }
  return (
    <div
      className="min-h-screen bg-slate-200"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Library</p>
            <h2
              className="mt-3 text-3xl font-semibold text-slate-900"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              Archived notes
            </h2>
            <p className="mt-2 text-sm text-slate-600">Restore or clean up notes you are finished with.</p>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Safe storage
          </div>
        </div>

        {archieve.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {archieve.map((p) => (
              <div key={p._id} className="rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                  <h3 className="text-md font-medium truncate">{p.title || 'Untitled'}</h3>
                  <button
                    onClick={() => copyFromClipboard(p.description)}
                    aria-label="Copy"
                    className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <IoCopyOutline />
                  </button>
                </div>

                <div className="px-4 py-4 flex-grow">
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm">
                    {p.description}
                  </pre>
                </div>

                <div className="px-4 py-3 border-t border-slate-200 flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined">calendar_clock</span>
                    <small className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </small>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUnarchive(p._id)}
                      aria-label="Unarchive"
                      className="rounded-md p-2 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <FaRedo />
                    </button>
                    <button
                      onClick={() => deleteFromPaste(p._id)}
                      aria-label="Delete paste"
                      className="rounded-md p-2 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                    >
                      <MdDelete />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-gray-600">No archived notes</p>
        )}
      </div>
    </div>
  );
};

export default Archive;