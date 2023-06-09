import React, {useState} from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { useNotification } from 'web3uikit';
import { ethers } from "ethers";

import frontendAbi from "../constants/abi.json";
import networkMapping from "../constants/networkMapping.json";

import UserHandler from "./UserHandler"

const low_entry_fee = ethers.utils.parseEther("0.02")
const high_entry_fee = ethers.utils.parseEther("0.01")

const HomePage = () => {
    const { runContractFunction } = useWeb3Contract()
    const { isWeb3Enabled, account, chainId} = useMoralis()
    const dispatch = useNotification()

    const chainString = chainId ? parseInt(chainId).toString() : null;
    const ethTriviaAddress = chainId ? networkMapping[chainString].triviaContractAddress[0] : null;

    const [isData, setIsData] = useState(false)

    const lowChanceEntry = async () => {
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "enterLowChanceDraw",
        msgValue:low_entry_fee,
        params: {},
        };

        await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            },
            onSuccess:handleEntrySuccess
        });
    }

    const highChanceEntry = async () => {
        const options = {
        abi: frontendAbi,
        contractAddress: ethTriviaAddress,
        functionName: "enterHighChanceDraw",
        msgValue:high_entry_fee,
        params: {},
        };

        await runContractFunction({
            params: options,
            onError: (error) => {
                console.log(error)
            },
            onSuccess:handleEntrySuccess
            
        });
    }

    const handleEntrySuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Successful Entry, Await Results!",
            title: "Successful Entry",
            position: "topR",
        })
    }

    

    return (
        <div>
            <div>
                {isWeb3Enabled ? (
                    !isData ? (
                        <div className="my-5 bg-blue-400">
                            <div>
                                <p className="mx-2 border-x-3 border-y-10 font-semibold text-gray-200">
                                    Users pay X eth minimum, to participate in draw before trivia. 
                                    If selected user can proceed to participate in trivia.
                                    Before that user details must be provided, simply fill the form below.
                                </p>
                            </div>
                            <UserHandler setIsData={setIsData}/>
                        </div>
                        ) : (
                        <div className="bg-blue-400">
                            <p className="mx-2 border-x-3 border-y-10 font-semibold text-gray-200">
                                To stand a higher chance of selection pay more eth to enter higher chance entry pool.
                                After entry navigate to Trivia page and await confirmation of entry.
                            </p>
                            <div>
                                <button onClick={lowChanceEntry}>Enter Draw(Lower chance of Entry)</button>
                            </div>
                            <div>
                                <button className="px-2 mx-2 my-2 bg-sky-200 font-semibold rounded-md" onClick={highChanceEntry}>Enter Draw(Higher Chance of Entry)</button>
                            </div>
                        </div>
                    )
                ) : <div className="bg-blue-400 fixed top-50 left-75"> Connect to Web3 provider</div>
                }
            </div>
        </div>
    )
}

export default HomePage