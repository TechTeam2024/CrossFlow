import React, {useState} from 'react'

export default function Login({users, onLogin}){
  const [username, setUsername] = useState(users?.[0]?.username || '')
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
          <select value={username} onChange={e=>setUsername(e.target.value)}>
            {users.map(u=> <option key={u.username} value={u.username}>{u.username}</option>)}
          </select>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn primary" type="submit">Sign in</button>
          </div>
          <p className="muted small">Demo accounts: passwords are <code>pass1</code>.. <code>pass50</code></p>
      </form>
    </div>
  )
}
