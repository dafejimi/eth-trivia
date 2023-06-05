import axios from "axios";
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const url_1 = "http://localhost:3000/entrants"
const url_2 = "http://localhost:3000/players"

const log_details = async (fullName, address) => {
    try {
        const tokenString = crypto.randomBytes(16).toString('hex');
        const hashedToken = await bcrypt.hash(tokenString, 10);

        result = await axios.post(url_1, { full_name: fullName, wallet_address: address, token: hashedToken })

        return result
    } catch {
        console.log(error) 
    }
}

const check_in = async (fullName, address) => {
    try {         
        const result = await axios.get(`${url_1}?${full_name=fullName}&${wallet_address=address}`)

        if (result.wallet_address == address && result.full_name == fullName)  return result

    } catch(error) {
        console.log(eror);
    }
}

const scoreHandler = async (address, newScore, numAttempts) => {
    result = await axios.put(`${url_2}/${address}`, {new_score: newScore,attempt_count: numAttempts})
}
module.exports = [log_details, check_in, quizHandler, scoreHandler];