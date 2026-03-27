import { useDispatch, useSelector } from 'react-redux';
//import { unimportantNotes, binImportantItems } from '../redux/features/noteSlice';
import { FaRedo } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { FaStar } from "react-icons/fa";
import { updateNoteThunk,fetchNotesThunk } from '../redux/features/noteSlice'
import { useEffect } from 'react';

export const Important = () => {
  const dispatch = useDispatch();
  // const { important } = useSelector((state) => state.paste);

  const { notes } = useSelector((state) => state.paste)
  const important = notes.filter(n => n.isImportant && !n.isBin)

  useEffect(() => {
    dispatch(fetchNotesThunk({ page: 1, limit: 50, scope: 'important' }));
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

  // const handleunimportantNotes = (id) => {

  //   dispatch(unimportantNotes(id));
  // };

  // const handleDelete = (id) => {
  //   dispatch(binImportantItems(id))
  // }


  const handleunimportantNotes = async (id) => {
   await  dispatch(updateNoteThunk({ id, data: { isImportant: false } }))
  }
  const handleDelete = async(id) => {
    await dispatch(updateNoteThunk({ id, data: { isBin: true } }))
  }

  return (
    <div
      className="min-h-screen bg-slate-200"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Highlights</p>
            <h2
              className="mt-3 text-3xl font-semibold text-slate-900"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              Important notes
            </h2>
            <p className="mt-2 text-sm text-slate-600">Keep your most critical ideas ready to revisit.</p>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Starred
          </div>
        </div>

        {important.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {important.map((p) => (
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
                      onClick={() => handleunimportantNotes(p._id)}
                      aria-label="unimportant"
                      className="rounded-md p-2 text-amber-600 transition hover:bg-amber-50 hover:text-amber-800"
                    >
                      <FaStar />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
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
          <p className="mt-10 text-center text-gray-600">No important notes</p>
        )}
      </div>
    </div>
  );
};

export default Important;