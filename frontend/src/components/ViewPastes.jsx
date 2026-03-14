import { useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoCopyOutline } from "react-icons/io5";

export const ViewPastes = () => {
  const { notes } = useSelector((state) => state.paste);
  const { id } = useParams();

  const currentPaste = notes.find((item) => item._id === id);

  const copyFromNote = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied');
  }

  if (!currentPaste) {
    return (
      <div
        className="min-h-screen bg-slate-200"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10">
          <div className="w-full rounded-lg border border-slate-200 bg-white p-8 text-center text-gray-600 shadow-sm">
            Paste not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-200"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Note detail</p>
              <h2
                className="mt-2 text-lg font-semibold text-slate-900"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                {currentPaste?.title || 'Untitled'}
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              {currentPaste?.createdAt ? new Date(currentPaste.createdAt).toLocaleString() : ''}
            </div>
          </div>

          <div className="px-6 py-6 relative">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm max-h-[60vh] overflow-auto mr-2 text-slate-800">
              {currentPaste?.description}
            </pre>
            <button
              onClick={() => copyFromNote(currentPaste?.description)}
              aria-label="Copy paste"
              className="absolute top-6 right-6 rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <IoCopyOutline />
            </button>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
            <NavLink
              to="/notes"
              className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
            >
              Back to Notes
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}


