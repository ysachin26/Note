import axiosInstance from "./axiosInstance";

const createNote = async (title, description) => {
    return await axiosInstance.post('/notes',
        {
            title, description
        }
    )
}

const fetchNotes = async (page = 1, limit = 6, scope = 'all') => {
    return await axiosInstance.get('/notes', {
        //axios req params key to conver objects to query strings
        params:
        {
            page,
            limit, scope
        }
    })
}

const updateNote = async (id, data) => {
    return await axiosInstance.patch(`/notes/${id}`, data
    )
}

const deleteNote = async (id) => {
    return await axiosInstance.delete(`/notes/${id}`)
}
export { createNote, fetchNotes, updateNote, deleteNote }