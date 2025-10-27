import React, {useState, useEffect} from 'react'
import Login from './Login'
import Home from './Home'
import users from '../users.json'

export default function App(){
  const [user, setUser] = useState(()=> sessionStorage.getItem('currentUser'))

  useEffect(()=>{
    // ensure users data loaded (it's imported statically)
    if(!users || users.length === 0) console.warn('No users loaded')
  },[])

  function handleLogin(username){
    sessionStorage.setItem('currentUser', username)
    setUser(username)
  }
  function handleLogout(){
    sessionStorage.removeItem('currentUser')
    setUser(null)
  }

  return (
    <div className="app-root">
      {user ? <Home user={user} onLogout={handleLogout} /> : <Login users={users} onLogin={handleLogin} />}
    </div>
  )
}
