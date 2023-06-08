import React, { useState, useEffect } from 'react'
import axios from 'axios'

const TriviaRenderer = async ({ setScore }) => {
    const [question, setQuestion] = useState('')
    const [correctAnswer, setCorrectAnswer] = useState('')
    const [incorrectOptions, setIncorrectOptions] = useState([])
    const [correctOption, setCorrectOption] = useState([])
    const [isDisabled, setIsDisabled] = useState(false)

    const result = await axios.get("https://the-trivia-api.com/api/questions")
    const questionNumber = getRandomInt(0,9)

    const incorrectOption_1 =  result[questionNumber].incorrectAnswer[0]
    const incorrectOption_2 =  result[questionNumber].incorrectAnswer[1]
    const incorrectOption_3 =  result[questionNumber].incorrectAnswer[2]

    setQuestion(result[questionNumber].question)
    setCorrectAnswer(result[questionNumber].correctAnswer)
    setIncorrectOptions(incorrectOption_1, incorrectOption_3)
    setCorrectOption(incorrectOption_2, correctAnswer)

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); 
    }
    
    useEffect(async () => {        
        const form = document.querySelector("form")
        form.addEventListener(
            "submit",
            (event) => {
                const data = new FormData(form).get("options")
                if(data == correctAnswer) {
                    setScore((previousState) => previousState +1)
                } 
                setIsDisabled((previousState) => !previousState)
                event.preventDefault()  
            }
        )
    }, [question, correctAnswer, incorrectOptions, correctOption])
        
    return (
        <div className="mx-2 my-2 px-1 py-1 bg-blue-400">
            <form>
                <fieldset>
                    <legend>{question}</legend>
                    <div>
                        <input type="radio" id="option_1" name="options" value={incorrectOptions[getRandomInt(0,1)]} />
                        <input type="radio" id="option_2" name="options" value={correctOption[getRandomInt(0,1)]} />
                        <input type="radio" id="option_3" name="options" value={incorrectOptions[getRandomInt(0,1)]} />
                        <input type="radio" id="option_4" name="options" value={correctOption[getRandomInt(0,1)]} />
                    </div>
                    <div>
                        <button type='submit' disabled={isDisabled}>Submit</button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}

export default TriviaRenderer