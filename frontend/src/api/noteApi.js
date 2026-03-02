import axiosInstance from "./axiosInstance";

const createNote = async (title, description) => {
    return await axiosInstance.post('/notes',
        {
            title, description
        }
    )
}

const fetchNotes = async () => {
    return await axiosInstance.get('/notes')
}

const updateNote = async (id,data) => {
    return await axiosInstance.patch(`/notes/${id}`, data 
    )
}

const deleteNote = async (id) => {
   return await axiosInstance.delete(`/notes/${id}`)
}
export { createNote, fetchNotes, updateNote, deleteNote }