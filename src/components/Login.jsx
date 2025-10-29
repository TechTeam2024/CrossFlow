import React, { useState } from 'react'
import './Login.css' 
import { validateAccessKey, markAccessKeyAsUsed } from '../utils/auth'

export default function Login({ onLogin, currentUser }) {
    const [accessKey, setAccessKey] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function submit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!accessKey) {
            setError('Please enter your access key')
            setLoading(false)
            return
        }

        // Validate the access key
        const result = validateAccessKey(accessKey)

        if (result.valid) {
            // Mark the key as used
            markAccessKeyAsUsed(accessKey)
            
            // Call the login handler
            onLogin(result.userId)
            
            // Clear the form
            setAccessKey('')
            setError('')
        } else {
            setError(result.error)
        }

        setLoading(false)
    }

    if (currentUser) {
        return (
            <div className="login-center">
                <div className="card login-box page-center">
                    <h2>Welcome!</h2>
                    <p>You are signed in as <strong>{currentUser}</strong></p>
                    <p className="hint" style={{ marginTop: '20px', color: 'var(--muted)' }}>
                        Your session is secure and will persist across browser sessions.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="login-center">
            <div className="card login-box">
                <h2 className="centered-title">Access Required</h2>
                <p className="hint" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    Enter your unique access key to continue
                </p>
                <form onSubmit={submit} className="login-form">
                    <label>
                        Access Key
                        <input 
                            value={accessKey} 
                            onChange={e => setAccessKey(e.target.value)} 
                            placeholder="CFK-2024-XXXXXXXX"
                            autoFocus
                            disabled={loading}
                            style={{ textTransform: 'uppercase' }}
                        />
                    </label>
                    {error && <div className="error" style={{ color: '#ff4444', padding: '8px', background: 'rgba(255,68,68,0.1)', borderRadius: '4px' }}>{error}</div>}
                    <div className="form-actions">
                        <button type="submit" className="primary" disabled={loading}>
                            {loading ? 'Validating...' : 'Access Application'}
                        </button>
                    </div>
                    <p className="hint" style={{ marginTop: '16px', fontSize: '12px', color: 'var(--muted)' }}>
                        <strong>Note:</strong> Each access key can only be used once. Contact your administrator if you need a new key.
                    </p>
                </form>
            </div>
        </div>
    )
}
