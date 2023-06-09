import React, { useState } from 'react'
import { useMoralis, useWeb3Contract, useNotification } from 'react-moralis'

import frontendAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";

const Dashboard = () => {
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const { isWeb3Enabled, account, chainId } = useMoralis()

    const chainString = chainId ? parseInt(chainId).toString() : null;
    const ethTriviaAddress = chainId ? networkMapping[chainString].EthTrivia[0] : null;

    const [winner1, setWinner1] = useState('')
    const [winner2, setWinner2] = useState('')
    const [winner3, setWinner3] = useState('')
    const [winner4, setWinner4] = useState('')
    const [drawState, setDrawState] = useState(0)

    const getDrawState = async () => {
        const options = {
            abi: frontendAbi,
            contractAddress: ethTriviaAddress,
            functionName: "getDrawState",
            params: {},
            };
    
            await runContractFunction({
                params: options,
                onError: (error) => {
                    console.log(error)
                },
                onSuccess:handleDrawReturn
            });
    }

    const handleDrawReturn = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Draw state successfully retrieved",
            title: "Call Successful",
            position: "topR",
        })
    }

    const drawReturn = async () => {
        const state = await getDrawState()
        setDrawState(state)
    }
    
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

    const getWinnersList = async () => {
        list = await getWinners()
        setWinner1(list[0])
        setWinner2(list[1])
        setWinner3(list[2])
        setWinner4(list[3])
    }

    const requestScores = async (address) => {
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "requestScores",
        params: {
            p_address: address},
        };

        await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            }
        });
    }


    const transferWinnings = async (data) => {
        await requestScores(data.data[0].inputResult)
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "transferWinnings",
        params: {
            player_address:data.data[0].inputResult},
        };

        setTimeout(async () => {
            await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            },
            onSuccess:handleTransferSuccess
        })}, 15000)
    }

    const handleTransferSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Transfer successful!",
            title: "Transfer Successful",
            position: "topR",
        })
    }

    const closeDraw = async () => {
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "closeDraw",
        params: {},
        };

        await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            },
            onSuccess:handleCloseSuccess
        });
    }

    const handleCloseSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Draw closed successfully!",
            title: "Close Successful",
            position: "topR",
        })
    }

    const openDraw = async () => {
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "openDraw",
        params: {},
        };

        await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            },
            onSuccess:handleOpenSuccess
        });
    }
    const handleOpenSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Draw opened successfully!",
            title: "Open Successful",
            position: "topR",
        })
    }

    const withdrawLink = async () => {
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "withdrawLink",
        params: {},
        };

        await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            },
            onSuccess:handleWithdrawalSuccess
        });
    }

    const handleWithdrawalSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Successful Withdrawal, Check Balance!",
            title: "Successful Withdrawal",
            position: "topR",
        })
    }
    return (
        <div>
            {
                isWeb3Enabled ? (
                    <div>
                        <div className="my-5 bg-blue-300">
                            <button className="px-2 mx-2 my-2 bg-sky-200 font-semibold rounded-md" onClick={withdrawLink}>Withdraw Link</button>
                            <button className="px-2 mx-2 my-2 bg-sky-200 font-semibold rounded-md" onClick={closeDraw}>Close Draw</button>
                            <button className="px-2 mx-2 my-2 bg-sky-200 font-semibold rounded-md" onClick={openDraw}>Open Draw</button>
                            <button className="px-2 mx-2 my-2 bg-sky-200 font-semibold rounded-md" onClick={getWinnersList}>New Winners</button>
                            <button className="px-2 mx-2 my-2 bg-sky-200 font-semibold rounded-md" onClick={drawReturn}>Get Draw State</button>
                        </div>

                        <Form
                            onSubmit={transferWinnings}
                            data={[
                                {
                                    name: "Player Address",
                                    type: "text",
                                    inputWidth: "50%",
                                    value: "",
                                    key: "playerAddress",
                                }                                    
                            ]}
                            title="Transfer Winnings!"
                            id="Main Form"
                        /> 
                        <div> 
                            {
                                drawState == 0 ? (
                                    <div className="bg-blue-300 font-semibold text-gray-200">Draw is still Open, Trivia is Unavailable. Check again in a few minutes</div>
                                ):(
                                    <div className="bg-blue-300 font-semibold text-gray-200">Trivia is now available, navigate to trivia page to check your status and play.</div>
                                )
                            }
                            <div></div>
                        </div>
                    </div>
                ): <div>Connect to a Web3 provider</div> 
            }
        </div>
    )
}

export default Dashboard