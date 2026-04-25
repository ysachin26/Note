// @ts-check

import axiosInstance from './axiosInstance'

/**
 * @param {string} token
 * @param {string} [password]
 */
const fetchSharedNote = async (token, password = '') => {
    const response = await axiosInstance.get(`/share/${token}`, {
        params: password ? { password } : {},
    })

    return response.data
}

/**
 * @param {{ noteId: string, visibility?: 'unlisted' | 'public' | 'password', password?: string, expiresAt?: string | null }} sharePayload
 */
const createShare = async (sharePayload) => {
    const response = await axiosInstance.post('/share', sharePayload)

    return response.data
}

/**
 * @param {string} token
 */
const revokeShare = async (token) => {
    const response = await axiosInstance.patch(`/share/${token}/revoke`)

    return response.data
}

export { createShare, fetchSharedNote, revokeShare }