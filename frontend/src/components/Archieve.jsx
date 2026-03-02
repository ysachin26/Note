import { useDispatch, useSelector } from 'react-redux';
//import { unarchivePaste, binArchiveItems } from '../redux/features/noteSlice';
import { FaRedo } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { updateNoteThunk } from '../redux/features/noteSlice'

export const Archive = () => {
  const dispatch = useDispatch();
  // const { archieve } = useSelector((state) => state.paste);

  const { notes } = useSelector((state) => state.paste)
  const archieve = notes.filter(n => n.isArchived && !n.isBin)

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

  const handleUnarchive = (id) => {
    dispatch(updateNoteThunk({ id, data: { isArchived: false } }))
  }
  const deleteFromPaste = (id) => {
    dispatch(updateNoteThunk({ id, data: { isBin: true } }))
  }
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Archived Notes</h2>

      {archieve.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {archieve.map((p) => (
            <div key={p._id} className="border rounded-lg bg-white flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-md font-medium truncate">{p.title || 'Untitled'}</h3>
                <button
                  onClick={() => copyFromClipboard(p.description)}
                  aria-label="Copy"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <IoCopyOutline />
                </button>
              </div>

              <div className="px-4 py-3 flex-grow">
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm">
                  {p.description}
                </pre>
              </div>

              <div className="px-4 py-2 border-t flex gap-2 justify-between">
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
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaRedo />
                  </button>
                  {/* <button
                    onClick={() => handleDelete(p._id)}
                    aria-label="Delete permanently"
                    className="text-red-600 hover:text-red-800"
                  >
                    <MdDelete />
                  </button> */}
                  <button onClick={() => deleteFromPaste(p._id)} aria-label="Delete paste" className="text-red-600 hover:text-red-800">
                    <MdDelete />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No archived notes</p>
      )}
    </div>
  );
};

export default Archive;