import React, {useState} from 'react'

const BASE_IFRAME = 'https://crosswordlabs.com/embed/temp1-11'

export default function Home({user, onLogout}){
  const [src, setSrc] = useState(()=> makeSrc(user))

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
          <h1 className="brand-title">Crossword Tournament</h1>
          <p className="subtitle muted">Welcome, <strong>{user}</strong></p>
        </div>
        <div className="header-actions">
          <button className="btn primary" onClick={reset}>Reset my puzzle</button>
          <button className="btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="home-main">
        <section className="pane crossword-pane">
          <div className="pane-header"><h2>Crossword</h2></div>
          <div className="iframe-wrap">
            <iframe title="crossword" src={src} frameBorder="0" allowFullScreen></iframe>
          </div>
        </section>

        <section className="pane flowchart-pane">
          <div className="pane-header"><h2>Flowcharts</h2></div>
          <div className="placeholder">(Empty — flowcharts area)</div>
        </section>
      </main>
    </div>
  )
}
