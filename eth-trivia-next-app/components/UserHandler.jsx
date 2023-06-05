import React from 'react'
import { useMoralis } from 'react-moralis';

import Cookies from "universal-cookie"

import { log_details, check_in } from "../scripts/handle-requests"

const cookie = new Cookies()

const entryParams = {
    fullName: '',
    address: ''
}

const UserHandler = ({ setIsData }) => {
    const { isWeb3Enabled, account } = useMoralis()
    
    const [ userParams, setUserParams ] = useState(entryParams);

    const handleChange = (e) => {
        setUserParams({...entryParams, [e.target.name]: e.target.value});
    }

    const handleCheckIn = async (e) => {
        e.preventDefault()

        const { fullName, address } = userParams
        result = check_in(fullName, address)
        cookie.set('token', result.token)

        params['fullName'] = '';
        params['address'] = '';
        setIsData(true)
    }

    const handleLogDetails = async (e) => {
        e.preventDefault();

        const { fullName, address } = userParams
        result = log_details(fullName, address)
        cookie.set('token', result.token)

        params['fullName'] = '';
        params['address'] = '';
        setIsData(true)       
    }
  return (
    <div>{
            isWeb3Enabled ? (
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="">
                            <label htmlfor="fullName">Full Name</label>
                            <input 
                                name="fullName"
                                type="text"
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                            />
                            <input 
                                name="address"
                                type="text"
                                value={account}
                                onChange={handleChange}
                                hidden="true"
                                required
                            />
                            <input 
                                type='button' 
                                value='Check in' 
                                onClick={handleCheckIn}
                            />
                            <input 
                                type='button' 
                                value='Log Details'
                                onClick={handleLogDetails} 
                            />
                        </div>
                    </form>
                </div>
            ) : <div>Connect to a provider.</div>
        }
    </div>
  )
}

export default UserHandler