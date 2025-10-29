// Secure access key authentication system with Supabase backend
import { supabase } from '../config/supabase'

// LocalStorage keys
const AUTH_STORAGE_KEY = 'crossflow_auth'
const USER_STORAGE_KEY = 'crossflow_user'

/**
 * Generates a simple device fingerprint for tracking
 * @returns {string} - Device fingerprint
 */
function getDeviceFingerprint() {
  const userAgent = navigator.userAgent
  const language = navigator.language
  const platform = navigator.platform
  const screenResolution = `${screen.width}x${screen.height}`
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  const fingerprint = `${userAgent}-${language}-${platform}-${screenResolution}-${timezone}`
  
  // Create a simple hash
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return `device_${Math.abs(hash).toString(36)}`
}

/**
 * Validates an access key against Supabase database
 * @param {string} accessKey - The access key to validate
 * @returns {Promise<object>} - { valid: boolean, userId: string | null, error: string | null }
 */
export async function validateAccessKey(accessKey) {
  if (!accessKey || typeof accessKey !== 'string') {
    return { valid: false, userId: null, error: 'Access key is required' }
  }

  // Trim and normalize the access key
  const normalizedKey = accessKey.trim().toUpperCase()

  try {
    // Query Supabase to check if the key exists
    const { data, error } = await supabase
      .from('access_keys')
      .select('*')
      .eq('key', normalizedKey)
      .single()

    if (error || !data) {
      return { valid: false, userId: null, error: 'Invalid access key' }
    }

    // Check if the key has already been used
    if (data.is_used) {
      return { 
        valid: false, 
        userId: null, 
        error: 'This access key has already been used' 
      }
    }

    return { valid: true, userId: data.user_id, error: null }
  } catch (err) {
    console.error('Error validating access key:', err)
    return { 
      valid: false, 
      userId: null, 
      error: 'Unable to validate access key. Please try again.' 
    }
  }
}

/**
 * Marks an access key as used in Supabase database
 * @param {string} accessKey - The access key to mark as used
 * @returns {Promise<boolean>} - Success status
 */
export async function markAccessKeyAsUsed(accessKey) {
  const normalizedKey = accessKey.trim().toUpperCase()
  const deviceFingerprint = getDeviceFingerprint()

  try {
    const { error } = await supabase
      .from('access_keys')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_by_device: deviceFingerprint
      })
      .eq('key', normalizedKey)

    if (error) {
      console.error('Error marking access key as used:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Error marking access key as used:', err)
    return false
  }
}

/**
 * Stores authentication data in localStorage
 * @param {string} userId - The user ID to store
 */
export function storeAuth(userId) {
  const authData = {
    userId,
    timestamp: Date.now(),
    authenticated: true
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
  localStorage.setItem(USER_STORAGE_KEY, userId)
}

/**
 * Retrieves authentication data from localStorage
 * @returns {object | null} - Authentication data or null if not authenticated
 */
export function getAuth() {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!authData) return null

    const parsed = JSON.parse(authData)
    
    // Verify the authentication is still valid
    if (parsed.authenticated && parsed.userId) {
      return parsed
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Checks if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const auth = getAuth()
  return auth !== null && auth.authenticated === true
}

/**
 * Gets the current user ID
 * @returns {string | null}
 */
export function getCurrentUser() {
  const auth = getAuth()
  return auth ? auth.userId : null
}

/**
 * Clears authentication (for admin purposes only - not exposed to users)
 * This is a hidden function for testing purposes
 */
export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}

/**
 * Generates a sample access key (for admin/testing purposes only)
 * @returns {string}
 */
export function generateAccessKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = 'CFK-2024-'
  for (let i = 0; i < 8; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

// Export the list of valid keys (for admin reference only - should be in backend in production)
export function getValidAccessKeys() {
  return Object.keys(VALID_ACCESS_KEYS)
}
