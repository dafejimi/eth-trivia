import React, { useState } from 'react'
import { useMoralis } from 'react-moralis';

import Cookies from "universal-cookie"

const cookie = new Cookies()
const url_1 = "http://localhost:3000/entrants"

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
        try {         
            const result = await axios.get(`${url_1}?${full_name=fullName}&${wallet_address=address}`)
            if (result.wallet_address == address && result.full_name == fullName)  {
                cookie.set('token', result.token)
            }
    
        } catch(error) {
            console.log(eror);
        }

        params['fullName'] = '';
        params['address'] = '';
        setIsData(true)
    }

    const handleLogDetails = async (e) => {
        e.preventDefault();

        const { fullName, address } = userParams
        try {
            const tokenString = crypto.randomBytes(16)
            const hashedToken = crypto.createHash('sha256').update(tokenString).digest('hex')
    
            const result = await axios.post(url_1, { full_name: fullName, wallet_address: address, token: hashedToken })
            cookie.set('token', result.token)
        } catch(error) {
            console.log(error) 
        }
        

        params['fullName'] = '';
        params['address'] = '';
        setIsData(true)       
    }
  return (
    <div>{
            isWeb3Enabled ? (
                <div>
                    <form>
                        <div className="">
                            <label className="mx-2 text-gray-200 font-semibold" htmlfor="fullName">Full Name</label>
                            <input 
                                className="my-2 mx-2 bx-3 block rounded-md"
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
                        </div>
                    </form>
                    <div className="inline">
                        <button className='mx-2 my-2 px-1 py-1 bg-sky-200 rounded-md' onClick={handleCheckIn}>Check In</button>
                        <button className='mx-2 my-2 px-1 py-1 bg-sky-200 rounded-md' onClick={handleLogDetails}>Log Details</button>
                    </div>
                </div>
            ) : <div className='fixed top-600 left-960'>Connect to a provider.</div>
        }
    </div>
  )
}

export default UserHandler