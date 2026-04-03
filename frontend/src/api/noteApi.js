// @ts-check

import axiosInstance from "./axiosInstance";
/**
 * 
 * @param {string} title 
 * @param {string} description 
 *  
 */
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
/**
 * 
 * @param {string} id 
 * @param {string} data 
 * @returns 
 */
const updateNote = async (id, data) => {
    return await axiosInstance.patch(`/notes/${id}`, data
    )
}
 /**
 * 
 * @param {string} id 
 
 
 */
const deleteNote = async (id) => {
    return await axiosInstance.delete(`/notes/${id}`)
}
export { createNote, fetchNotes, updateNote, deleteNote }