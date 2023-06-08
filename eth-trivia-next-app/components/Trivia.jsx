import React, { useState, useEffect, useCallback } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis';
import axios from 'axios'
import Cookies from 'universal-cookie'

import frontendAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";

import { scoreHandler } from "../scripts/handle-requests";
import Timer from './Timer';
import TriviaRenderer from './TriviaRenderer';

const dateObject = new Date()
const authToken = new Cookies.get('token')
const multiplier = 0.001
const url_2 = "http://localhost:3000/players"

const Trivia = () => {
    const { runContractFunction } = useWeb3Contract()
    const { account, isWeb3Enabled, chainId } = useMoralis()

    const chainString = chainId ? parseInt(chainId).toString() : null;
    const ethTriviaAddress = chainId ? networkMapping[chainString].triviaContractAddress[0] : null;
    
    const [isEntrantAccepted, setIsEntrantAccepted] = useState(() => checkEntryStatus())
    const [isTokenCorrect, setIsTokenCorrect] = useState(() => checkToken())
    const [isTimeElapsed, setIsTimeElapsed] = useState(false)  
    const [time, setTime] = useState(0)
    const [attemptCount, setAttemptCount] = useState(0)
    const [renderCount, setRenderCount] = useState(0)
    const [score, setScore] = useState(0)

    const getWinners = async () => {
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "getRecentWinners",
        params: {},
        };

        await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            }
        });
    }

    const checkEntryStatus = async () => {
        let winningSlot
        const recentWinners = await getWinners()
        for (let i = 0; i <= 3; i++) {
            if(account == recentWinners[i]) winningSlot = recentWinners[i] 
        }
        if (winningSlot){ 
            return true
        } else {
            return false
        }   
    }

    const checkToken = async () => {
        request = await axios.get(`https://localhost:3000/search/entrants/?token=${authToken}`)
        token = request.token
        if (authToken == token) {
            return true
        } else {
            return false
        }
    }   
    
    const renderTrivia = async () => {
        setIsTimeElapsed(false)
        setRenderCount((renderCount) => renderCount + 1)
        return <TriviaRenderer setScore={setScore}/>
    }

    useEffect(() => {
        setAttemptCount((attemptCount) => attemptCount + 1)
        setInterval(() => {
            setTime((previousState) => previousState + 1)
        }, 1000)
    
        const isTimeUp = () => {
            if(time >= 30) setIsTimeElapsed(true)
            setTime(0)
        }
        
        setInterval(isTimeUp(), 1000)
    }, [renderCount])

    const handleFinishClick = async () => {
        result = await axios.put(`${url_2}/${account}`, {new_score: score,attempt_count: attemptCount})
        return (
            <div>
                {`You Scored ${score} points, expect ${score * multiplier}ETH in your wallet address: ${account}`}
            </div>
        )
    }

    return (
        <div>
            {
                isWeb3Enabled ? (
                    isTokenCorrect && isEntrantAccepted ? (
                        attemptCount <= 10 ? (
                            !isTimeElapsed ? (
                                <div className='bg-blue-400'>
                                    <Timer />
                                    <button onClick={renderTrivia}>Next</button>
                                </div>
                            ) : {renderTrivia}
                        ): (
                            <button className="mx-2 my-2 px-1 py-1 bg-sky-200 rounded-md" onClick={handleFinishClick}>Finish</button>
                        )
                    )
                    : <div className="bg-blue-400 relative top-600 left-960">Unauthorized User</div>
                ): <div  className="bg-blue-400 relative top-600 left-960">Connect to your web3 provider</div>
            }          
        </div>
    )
}

export default Trivia