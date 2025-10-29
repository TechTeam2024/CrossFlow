import { useEffect, useState } from 'react'
import './App.css'
import Crossword from './components/Crossword'
import Login from './components/Login'
import Flowchart from './components/Flowchart'
import { getAuth, storeAuth, getCurrentUser, clearAuth } from './utils/auth'

function App() {
    const [page, setPage] = useState('crossword') // default page after login
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check for existing authentication on mount
    useEffect(() => {
        const authData = getAuth()
        if (authData && authData.authenticated) {
            setUser(authData.userId)
            setPage('crossword')
        }
        setLoading(false)
    }, [])

    function handleLogin(userId) {
        // Store authentication data securely
        storeAuth(userId)
        setUser(userId)
        setPage('crossword') // Navigate to crossword after login
    }

    function handleLogout() {
        // Clear authentication data
        clearAuth()
        setUser(null)
        setPage('login')
    }

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="app-root">
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100vh',
                    color: 'var(--muted)'
                }}>
                    Loading...
                </div>
            </div>
        )
    }

    return (
        <div className="app-root">
            <header className="app-header">
                <h1 className="title">CrossFlow</h1>

                {/* show tabs only after login */}
                {user && (
                    <nav className="app-nav">
                        <button 
                            className={page === 'crossword' ? 'active' : ''} 
                            onClick={() => setPage('crossword')}
                        >
                            Crossword
                        </button>
                        <button 
                            className={page === 'flowchart' ? 'active' : ''} 
                            onClick={() => setPage('flowchart')}
                        >
                            Flowcharts
                        </button>
                        <div style={{ flex: 1 }} />
                        <span className="user-badge">
                            <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 16 16" 
                                fill="currentColor" 
                                style={{ marginRight: '6px', verticalAlign: 'middle' }}
                            >
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                            </svg>
                            {user}
                        </span>
                        <button onClick={handleLogout} className="logout">
                            Logout
                        </button>
                    </nav>
                )}
            </header>

            <main className="app-main">
                {/* If not logged in, always show Login */}
                {!user && (
                    <Login onLogin={handleLogin} currentUser={user} />
                )}

                {/* After login, show the selected page */}
                {user && page === 'crossword' && <Crossword id={user}/>}

                {user && page === 'flowchart' && <Flowchart />}
            </main>
        </div>
    )
}

export default App
