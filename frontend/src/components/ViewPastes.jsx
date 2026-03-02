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
      <div className="p-6 flex justify-center items-center">
        <div className="max-w-xl w-full text-center text-gray-600">
          Paste not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-4xl border rounded-lg bg-white shadow-sm overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold truncate">{currentPaste?.title || 'Untitled'}</h2>
          <div className="text-sm text-gray-500">{currentPaste?.createdAt ? new Date(currentPaste.createdAt).toLocaleString() : ''}</div>
        </div>

        {/* body */}
        <div className="px-6 py-5 relative">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm max-h-[60vh] overflow-auto mr-2">{currentPaste?.description}</pre>
          <button onClick={() => copyFromNote(currentPaste?.description)} aria-label="Copy paste" className="absolute top-5 right-5 text-gray-600 hover:text-gray-800">
            <IoCopyOutline />
          </button>
        </div>

        {/* footer */}
        <div className="px-6 py-3 border-t flex justify-end">
          <NavLink to="/notes" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Notes
          </NavLink>
        </div>
      </div>
    </div>
  )
}


