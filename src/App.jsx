import { useEffect, useState } from 'react'
import './App.css'
import Crossword from './components/Crossword'
import Login from './components/Login'
import Flowchart from './components/Flowchart'

function App() {
    const [page, setPage] = useState('login') // default to login page
    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(localStorage.getItem('user') || null)
    }, [])

    function handleLogin(username) {
        localStorage.setItem('user', username);
        setUser(username)
        setPage('crossword') // default to crossword after login
    }

    function handleLogout() {
        setUser(null)
        localStorage.removeItem('user')
        setPage('login')
    }

    return (
        <div className="app-root">
            <header className="app-header">
                <h1 className="title">CrossFlow</h1>

                {/* show tabs only after login */}
                {user && (
                    <nav className="app-nav">
                        <button className={page === 'crossword' ? 'active' : ''} onClick={() => setPage('crossword')}>Crossword</button>
                        <button className={page === 'flowchart' ? 'active' : ''} onClick={() => setPage('flowchart')}>Flowcharts</button>
                        <div style={{ flex: 1 }} />
                        <span className="user-badge">Signed in: <strong>{user}</strong></span>
                        
                    </nav>
                )}
            </header>

            <main className="app-main">
                {/* If not logged in, always show Login */}
                {!user && (
                    <Login onLogin={handleLogin} currentUser={user} onLogout={handleLogout} />
                )}

                {/* After login, show the selected page */}
                {user && page === 'crossword' && <Crossword id={user}/>}

                {user && page === 'flowchart' && <Flowchart />}
            </main>
        </div>
    )
}

export default App
