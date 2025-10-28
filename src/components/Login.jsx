import React, { useState } from 'react'
import './Login.css' // Import the CSS file for styling

export default function Login({ onLogin, currentUser, onLogout }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // static credentials
    const STATIC_USER = ['temp1-11', 'temp4-2']
    const STATIC_PASS = 'secret'

    function submit(e) {
        e.preventDefault()
        setError('')
        if (!username) {
            setError('Enter username')
            return
        }
        if (STATIC_USER.find((st) => st === username) && password === STATIC_PASS) {
            onLogin(username)
            setUsername('')
            setPassword('')
            setError('')
        } else {
            setError('Invalid credentials')
        }
    }

    if (currentUser) {
        return (
            <div className="login-center">
                <div className="card login-box page-center">
                    <h2>Account</h2>
                    <p>Signed in as <strong>{currentUser}</strong></p>
                </div>
            </div>
        )
    }

    return (
        <div className="login-center">
            <div className="card login-box">
                <h2 className="centered-title">Login</h2>
                <form onSubmit={submit} className="login-form">
                    <label>
                        Username
                        <input value={username} onChange={e => setUsername(e.target.value)} autoFocus />
                    </label>
                    <label>
                        Password
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    {error && <div className="error">{error}</div>}
                    <div className="form-actions">
                        <button type="submit" className="primary">Sign in</button>
                    </div>
                    <p className="hint">Use username <code>admin</code> and password <code>secret</code></p>
                </form>
            </div>
        </div>
    )
}
