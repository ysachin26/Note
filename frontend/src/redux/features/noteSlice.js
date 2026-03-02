import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createNote, fetchNotes, updateNote, deleteNote } from '../../api/noteApi';
import toast from 'react-hot-toast';
// import { setlocalStorage } from '../../utility/localstorage';


/* 

//old apporach with local storage 


const initialState = {
   pastes: localStorage.getItem('pastes')
      ? JSON.parse(localStorage.getItem('pastes'))
      : [],

   archieve: localStorage.getItem('archive')
      ? JSON.parse(localStorage.getItem('archive'))
      : [],

   important: localStorage.getItem('important')
      ? JSON.parse(localStorage.getItem('important'))
      : [],

   bin: localStorage.getItem('bin')
      ? JSON.parse(localStorage.getItem('bin'))
      : [],
}

export const pasteSlice = createSlice({
   name: 'paste',
   initialState,
   reducers: {
      addToPaste: (state, action) => {
         const { data } = action.payload;
         if (data === '') {
            toast.error('Empty Note Cannot Be Created')
         } else {
            state.pastes.push(action.payload);
            setlocalStorage(state.pastes)


            toast.success('Successfully toasted!')
         }


      },
      updateToPaste: (state, action) => {
         const { id, title, data } = action.payload;
         const paste = state.pastes.find((p) => p.id === id);
         if (paste) {
            paste.title = title;
            paste.data = data;
            paste.createAt = new Date().toISOString();
         }
         setlocalStorage(state.pastes)

         toast.success('updated successfully')
      },
      resetPaste: (state) => {
         state.pastes = [];
         localStorage.removeItem("pastes")
         toast.success('Paste reset successfully')
      },

      archievePaste: (state, action) => {
         const id = action.payload;
         const paste = state.pastes.find((p) => p.id === id);

         if (paste) {
            state.archieve.push(paste);
            state.pastes = state.pastes.filter((item) => item.id != id)
            setlocalStorage(state.pastes, 'pastes')
            setlocalStorage(state.archieve, 'archive');
            toast.success('archieved')
         }
      },
      unarchivePaste: (state, action) => {
         const id = action.payload;
         const paste = state.archieve.find((item) => item.id === id)
         if (paste) {
            state.pastes.push(paste);
            state.archieve = state.archieve.filter((item) => item.id !== id);
            setlocalStorage(state.pastes, 'pastes')
            setlocalStorage(state.archieve, 'archive');
            toast.success('Note unarchived successfully');
         }
      },
      pinnedCard: (state, action) => {

         const id = action.payload;
         const paste = state.pastes.find((p) => p.id === id)

         if (paste) {
            if (paste.isPinned === true) {
               paste.isPinned = false;
               toast.success('unpinned')
            }
            else {
               paste.isPinned = true;
               toast.success("pinned")
            }

            setlocalStorage(state.pastes);
         }

      },

      removePaste: (state, action) => {
         const id = action.payload;
         const paste = state.pastes.find((item) => item.id === id);

         if (paste) {
            state.bin.push(paste); // push the object, not an array
            state.pastes = state.pastes.filter((item) => item.id != id)
            setlocalStorage(state.pastes, 'pastes')
            setlocalStorage(state.bin, 'bin');
            toast.success('Moved in bin')
         }
      },
      deleteArchivePaste: (state, action) => {
         const id = action.payload;
         state.archieve = state.archieve.filter((item) => item.id !== id);
         setlocalStorage(state.archieve, 'archive')
         toast.success('deleted')

      },
      importantNotes: (state, action) => {
         const id = action.payload;
         const paste = state.pastes.find((p) => p.id === id);

         if (paste) {
            state.important.push(paste);
            state.pastes = state.pastes.filter((item) => item.id != id)
            setlocalStorage(state.pastes, 'pastes')
            setlocalStorage(state.important, 'important');
            toast.success('marked important')
         }
      },
      unimportantNotes: (state, action) => {
         const id = action.payload;
         const paste = state.important.find((item) => item.id === id)
         if (paste) {
            state.pastes.push(paste);
            state.important = state.important.filter((item) => item.id !== id);
            setlocalStorage(state.pastes, 'pastes')
            setlocalStorage(state.important, 'important');
            toast.success('unmarked important');
         }
      },
      deleteImportant: (state, action) => {
         const id = action.payload;
         state.important = state.important.filter((item) => item.id !== id);
         setlocalStorage(state.important, 'important')
         toast.success('deleted')
      },
      binItems: (state, action) => {
         const id = action.payload;
         const paste = state.pastes.find((p) => p.id === id);

         if (paste) {
            state.bin.push(paste);
            state.pastes = state.pastes.filter((item) => item.id != id)
            setlocalStorage(state.pastes, 'pastes')
            setlocalStorage(state.bin, 'bin');
            toast.success('Moved in bin')
         }
      },
      binArchiveItems: (state, action) => {
         const id = action.payload;
         const paste = state.archieve.find((p) => p.id === id);

         if (paste) {
            state.bin.push(paste);
            state.archieve = state.archieve.filter((item) => item.id != id)
            setlocalStorage(state.archieve, 'archive')
            setlocalStorage(state.bin, 'bin');
            toast.success('Moved in bin')
         }
      },
      binImportantItems: (state, action) => {
         const id = action.payload;
         const paste = state.important.find((p) => p.id === id);

         if (paste) {
            state.bin.push(paste);
            state.important = state.important.filter((item) => item.id != id)
            setlocalStorage(state.important, 'important')
            setlocalStorage(state.bin, 'bin');
            toast.success('Moved in bin')
         }
      },
      deleteItem: (state, action) => {
         const id = action.payload;
         state.bin = state.bin.filter((item) => item.id !== id);
         setlocalStorage(state.bin, 'bin')
         toast.success('deleted')
      },
   },
})

export const { addToPaste, binImportantItems, binArchiveItems, binItems, deleteItem, unarchivePaste, deleteImportant, deleteArchivePaste, importantNotes, unimportantNotes, updateToPaste, removePaste, resetPaste, pinnedCard, archievePaste } = pasteSlice.actions;
export default pasteSlice.reducer;
*/

const initialState = {
   notes: [],
   loading: false,
   error: null
}

export const fetchNotesThunk = createAsyncThunk('notes/fetch', async () => {
   const response = await fetchNotes()
   return response.data.notes
})

export const createNoteThunk = createAsyncThunk('notes/create', async ({ title, description }) => {
   const response = await createNote(title, description)
   return response.data.notes
})

export const updateNoteThunk = createAsyncThunk('notes/update', async ({ id, data }) => {
   const response = await updateNote(id, data)
   return response.data.notes
})

export const deleteNoteThunk = createAsyncThunk('notes/delete', async (id) => {
   await deleteNote(id)
   return id
})

const pasteSlice = createSlice({
   name: 'paste',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchNotesThunk.fulfilled, (state, action) => {
            state.notes = action.payload
         })
         .addCase(createNoteThunk.fulfilled, (state, action) => {
            state.notes.push(action.payload)
            toast.success('Note created')
         })
         .addCase(updateNoteThunk.fulfilled, (state, action) => {
            const index = state.notes.findIndex((n) => n._id === action.payload._id)
            if (index !== -1) state.notes[index] = action.payload
            toast.success('Note updated')
         })
         .addCase(deleteNoteThunk.fulfilled, (state, action) => {
            state.notes = state.notes.filter((n) => n._id !== action.payload)
            toast.success('Note deleted')
         })
   }
})

export default pasteSlice.reducer