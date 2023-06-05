import React from 'react'

const RenderWinners = ({ winner1, winner2, winner3, winner4}) => {
  return (
    <div>
        <ul>
            <li>{winner1}</li>
            <li>{winner2}</li>
            <li>{winner3}</li>
            <li>{winner4}</li>
        </ul>
    </div>
  )
}

export default RenderWinners