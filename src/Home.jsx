import React, {useState} from 'react'

const BASE_IFRAME = 'https://crosswordlabs.com/embed/temp1-11'

export default function Home({user, onLogout}){
  const [src, setSrc] = useState(()=> makeSrc(user))
  const [tab, setTab] = useState('crossword')

  function makeSrc(u){
    return `${BASE_IFRAME}?player=${encodeURIComponent(u)}&t=${Date.now()}`
  }

  function reset(){
    const s = makeSrc(user)
    setSrc(s)
    // persist if desired: localStorage.setItem(`puzzle_src_${user}`, s)
  }

  return (
    <div className="home-root">
      <header className="home-header">
        <div className="brand">
          <h1 className="brand-title">Tech Tournament</h1>
          <p className="subtitle muted">Welcome, <strong>{user}</strong></p>
        </div>
        <div className="header-actions">
          <button className="btn primary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="tabs">
        <button className={`tab-button ${tab==='crossword'?'active':''}`} onClick={()=>setTab('crossword')}>Crossword</button>
        <button className={`tab-button ${tab==='flowcharts'?'active':''}`} onClick={()=>setTab('flowcharts')}>Flowcharts</button>
      </div>

      <main className="home-main">
        {tab === 'crossword' && (
          <section className="pane crossword-pane">
            <div className="pane-header"><h2>Crossword</h2></div>
            <div className="iframe-wrap">
              <iframe title="crossword" src={src} frameBorder="0" allowFullScreen></iframe>
            </div>
          </section>
        )}

        {tab === 'flowcharts' && (
          <section className="pane flowchart-pane">
            <div className="pane-header"><h2>Flowcharts</h2></div>
            <div className="placeholder">(Empty — flowcharts area)</div>
          </section>
        )}
      </main>
    </div>
  )
}
