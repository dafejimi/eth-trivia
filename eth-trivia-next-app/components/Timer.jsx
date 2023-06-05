import React,{ useState } from 'react'

const Timer = () => {
    const [time, setTime] = useState(0)

    setInterval(() =>{
        setTime((time) => time + 1)
    }, 1000)

    const isTimeElapsed = time >= 30

    return (
      <div>
          {
          isTimeElapsed ? `00:${time}` : '00:00'
          }
      </div>
    )
}

export default Timer