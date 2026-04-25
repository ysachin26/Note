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
 * @param {string} noteId
 */
const getLatestShareForNote = async (noteId) => {
    const response = await axiosInstance.get(`/share/note/${noteId}/latest`)

    return response.data
}

/**
 * @param {{ noteId?: string, includeRevoked?: boolean }} [params]
 */
const listMyShares = async (params = {}) => {
    const response = await axiosInstance.get('/share', {
        params,
    })

    return response.data
}

/**
 * @param {string} token
 */
const revokeShare = async (token) => {
    const response = await axiosInstance.patch(`/share/${token}/revoke`)

    return response.data
}

/**
 * @param {string} token
 * @param {{ visibility?: 'unlisted' | 'public' | 'password', password?: string, clearPassword?: boolean, expiresAt?: string | null }} payload
 */
const updateShare = async (token, payload) => {
    const response = await axiosInstance.patch(`/share/${token}`, payload)

    return response.data
}

/**
 * @param {string[]} tokens
 */
const bulkRevokeShares = async (tokens) => {
    const response = await axiosInstance.patch('/share/bulk-revoke', { tokens })

    return response.data
}

export { bulkRevokeShares, createShare, fetchSharedNote, getLatestShareForNote, listMyShares, revokeShare, updateShare }