import React,{ useState, useEffect } from 'react'

const Timer = () => {
    const [seconds, setSeconds] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        // Clean up the timer
        return () => clearInterval(timer);
    }, []);

    return <div className="bg-blue-400 px-2 py-2 ">{`00:${seconds}`}</div>;
}

export default Timer

/* 
    TO STYLE
    - container div
*/