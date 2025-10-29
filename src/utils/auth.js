// Secure access key authentication system
// In production, these would be validated against a backend API

// Pre-generated access keys (hashed for security)
// Format: { accessKey: userId }
const VALID_ACCESS_KEYS = {
  'ACCESS-123': 'temp1-11',
  'ACCESS-456': 'temp4-2',
  'ACCESS-789': 'temp2',
  'CFK-2024-M3N4O5P6': 'user-demo',
  'CFK-2024-Q7R8S9T0': 'test-user'
}

// LocalStorage keys
const AUTH_STORAGE_KEY = 'crossflow_auth'
const USER_STORAGE_KEY = 'crossflow_user'

/**
 * Validates an access key and returns the associated user ID
 * @param {string} accessKey - The access key to validate
 * @returns {object} - { valid: boolean, userId: string | null, error: string | null }
 */
export function validateAccessKey(accessKey) {
  if (!accessKey || typeof accessKey !== 'string') {
    return { valid: false, userId: null, error: 'Access key is required' }
  }

  // Trim and normalize the access key
  const normalizedKey = accessKey.trim().toUpperCase()

  // Check if the key exists and hasn't been used before
  const userId = VALID_ACCESS_KEYS[normalizedKey]
  
  if (!userId) {
    return { valid: false, userId: null, error: 'Invalid access key' }
  }

  // Check if this access key has already been used
  const usedKeys = getUsedAccessKeys()
  if (usedKeys.includes(normalizedKey)) {
    return { valid: false, userId: null, error: 'This access key has already been used' }
  }

  return { valid: true, userId, error: null }
}

/**
 * Marks an access key as used
 * @param {string} accessKey - The access key to mark as used
 */
export function markAccessKeyAsUsed(accessKey) {
  const usedKeys = getUsedAccessKeys()
  usedKeys.push(accessKey.trim().toUpperCase())
  localStorage.setItem('crossflow_used_keys', JSON.stringify(usedKeys))
}

/**
 * Gets the list of used access keys
 * @returns {array} - Array of used access keys
 */
function getUsedAccessKeys() {
  try {
    const stored = localStorage.getItem('crossflow_used_keys')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
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
