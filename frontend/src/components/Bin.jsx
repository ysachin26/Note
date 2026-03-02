import { useDispatch, useSelector } from 'react-redux';
//import { deleteItem } from '../redux/features/noteSlice';
import { MdDelete } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { deleteNoteThunk } from '../redux/features/noteSlice'

export const Bin = () => {
  const dispatch = useDispatch();
  // const { bin } = useSelector((state) => state.paste);
  const { notes } = useSelector((state) => state.paste)
  const bin = notes.filter(n => n.isBin)

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



  // const handleBinDelete = (id) => {
  //   dispatch(deleteItem(id))
  // }

  const handleBinDelete = (id) => {
    dispatch(deleteNoteThunk(id))
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Trash Items</h2>
      <p className="text-1xl   mb-6">Note all items will be deleted automatically after 30 days</p>
      {bin.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bin.map((p) => (
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


                  {/* <button
                    onClick={() => handleDelete(p._id)}
                    aria-label="Delete permanently"
                    className="text-red-600 hover:text-red-800"
                  >
                    <MdDelete />
                  </button> */}
                  <button onClick={() => handleBinDelete(p._id)} aria-label="Delete paste" className="text-red-600 hover:text-red-800">
                    <MdDelete />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">Empty Bin</p>
      )}
    </div>
  );
};

export default Bin;