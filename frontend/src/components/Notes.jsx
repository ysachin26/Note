import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
//import { binItems, importantNotes, pinnedCard, archievePaste } from '../redux/features/noteSlice';
import { FaRegEdit } from 'react-icons/fa';
import { IoCopyOutline, IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import { CiShare1 } from "react-icons/ci";
import { useMemo, useState } from 'react';
import { BsPin } from "react-icons/bs";
import { BsPinFill } from "react-icons/bs";
import { MdArchive } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { updateNoteThunk } from '../redux/features/noteSlice'





const copyFromClipboard = async (text) => {
	// small guard and user feedback
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
			await navigator.share(
				{
					title: p.title || 'shared paste',
					text: p.description,
					url: Url
				}
			);
			toast.success("shared successfully")
		}
		catch (error) {
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

export const Pastes = () => {

	const { notes } = useSelector((state) => state.paste);
	const dispatch = useDispatch();
	const [searchValue, setSearchValue] = useState('');
	//const [currentPage, setCurrentPage] = useState('');

	const filteredData = useMemo(() => {
		const data = [...notes.filter(n => !n.isArchived && !n.isBin && !n.isImportant)];

		//filtering my data
		let searchData = data;
		if (!searchValue.trim()) {
			searchData = data;
		}
		else {
			searchData = data.filter(item =>
				item.title.toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		//applying sorting on filterd data - this is the standard method becase applying sorting on unfiltered data is not optimised 
		//it is like performing sorting on 100 elements and rendering only 5 because of filtering

		searchData.sort((a, b) => {
			return b.isPinned - a.isPinned;
		})

		return searchData;
	}, [searchValue, notes]);


	const handleSearch = (e) => {
		setSearchValue(e.target.value);
	};


	// const deleteFromPaste = (id) => {
	// 	dispatch(binItems(id));
	// };

	// delete → move to bin  => new apporach
	const deleteFromPaste = (id) => {
		dispatch(updateNoteThunk({ id, data: { isBin: true } }))
	}

	// const pinItem = (id) => {

	// 	dispatch(pinnedCard(id))
	// }


	// pin → toggle => new apporach
	const pinItem = (id) => {
		const note = notes.find(n => n._id === id)
		dispatch(updateNoteThunk({ id, data: { isPinned: !note.isPinned } }))
	}


	// const makePasteArchieve = (id) => {
	// 	dispatch(archievePaste(id));
	// }

	// archive => new apporach

	const makePasteArchieve = (id) => {
		dispatch(updateNoteThunk({ id, data: { isArchived: true } }))
	}

	// const handleimportantNotes = (id) => {
	// 	dispatch(importantNotes(id));
	// };

	// important => new apporach
	const handleimportantNotes = (id) => {
		dispatch(updateNoteThunk({ id, data: { isImportant: true } }))
	}
	return (
		<div
			className="min-h-screen bg-slate-200"
			style={{ fontFamily: "'Space Grotesk', sans-serif" }}
		>
			<div className="mx-auto w-full max-w-6xl px-6 py-10">
				<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Library</p>
						<h1
							className="mt-3 text-3xl font-semibold text-slate-900"
							style={{ fontFamily: "'Crimson Pro', serif" }}
						>
							All notes
						</h1>
						<p className="mt-2 text-sm text-slate-600">Search, pin, and archive your saved ideas.</p>
					</div>
					<div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						Pinned on top
					</div>
				</div>

				<div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
					<label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Search notes</label>
					<input
						className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400/40"
						value={searchValue}
						onChange={handleSearch}
						placeholder="Search your notes..."
						type="text"
					/>
				</div>

				<div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
					{filteredData.length > 0 ? (
						filteredData.map((p) => (
							<div key={p._id} className="flex justify-center">
								<div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">

									<div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 gap-5">
										<h3 className="text-lg font-medium truncate">{p.title || 'Untitled'}</h3>
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
												onClick={() => sharePaste(p)}
												aria-label="Share"
												className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
											>
												<CiShare1 />
											</button>

											{
												p.isPinned ? (
													<button
														onClick={() => pinItem(p._id)}
														aria-label="Copy paste"
														className="rounded-md p-2 text-amber-600 transition hover:bg-amber-50"
													>
														<BsPinFill />
													</button>
												) : (
													<button
														onClick={() => pinItem(p._id)}
														aria-label="Copy paste"
														className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
													>
														<BsPin />
													</button>
												)
											}
										</div>
									</div>

									<div className="px-4 py-4">
										<pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm">{p.description}</pre>
									</div>

									<div className="px-4 py-3 border-t border-slate-200 flex gap-2 justify-between ">
										<div className="px-4 py-2  flex gap-2  ">
											<span className="material-symbols-outlined">
												calendar_clock
											</span>
											<span>
												<small className="text-xs text-gray-500">	{new Date(p.createdAt).toLocaleDateString('en-GB', {
													day: 'numeric', month: 'long', year: 'numeric'
												})
												}</small>
											</span>
										</div>
										<div className="px-4 py-2  flex gap-2  justify-evenly">

											<button
												onClick={() => makePasteArchieve(p._id)}
												className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
											>
												<MdArchive />
											</button>
											<button
												onClick={() => handleimportantNotes(p._id)}
												aria-label="Delete paste"
												className="rounded-md p-2 text-amber-600 transition hover:bg-amber-50 hover:text-amber-800"
											>
												<CiStar />
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

							</div>
						))
					) : (
						<p className="text-center text-gray-600">No notes available</p>
					)}
				</div>
				{<div className='flex content-center justify-center  gap-2 mt-4   '>
					<div className='flex content-center justify-center  gap-2 mt-4  border-2 p-2 '>


						<button className='flex content-center justify-center  gap-2  
						bg-black text-white  border-2 p-2 '>Prev</button>
 
						<button className='flex content-center justify-center  gap-2  
						bg-black text-white  border-2 p-2 '>Next</button>
					</div></div>}
			</div>
		</div>
	);
};

export default Pastes;
