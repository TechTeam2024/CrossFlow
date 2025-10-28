import React from 'react'

export default function Crossword({id}) {
  return (
    <div className="page-center crossword-page">
      <h2>Crossword</h2>
      <div className="iframe-wrap">
        <iframe
          title="crossword"
          width="100%"
          height="100%"
          className="crossword-iframe"
          frameBorder="0"
          src={`https://crosswordlabs.com/embed/${id}`}
        />
      </div>
    </div>
  )
}
