import React, {useState} from 'react'

export default function Login({users, onLogin}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e){
    e.preventDefault()
    const found = users.find(u => u.username === username && u.password === password)
    if(found){ onLogin(username) }
    else setError('Invalid credentials')
  }

  return (
    <div className="center-page">
      <form className="login-card glass-login" onSubmit={submit}>
          <h2>Sign in</h2>
          <label>Username</label>
          <input type="text" placeholder="user1" value={username} onChange={e=>setUsername(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn primary" type="submit">Sign in</button>
          </div>
    <p className="muted small">Demo accounts: usernames user1..user50, passwords pass1..pass50</p>
      </form>
    </div>
  )
}
