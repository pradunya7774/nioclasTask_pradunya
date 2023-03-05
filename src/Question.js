import React, { useState, useEffect } from 'react';
import {MathJax,MathJaxContext} from 'better-react-mathjax';

function Question() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchQuestion() {
      setIsLoading(true);
      try {
        const response = await fetch(`https://0h8nti4f08.execute-api.ap-northeast-1.amazonaws.com/getQuestionDetails/getquestiondetails?QuestionID=${currentQuestionId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCurrentQuestion(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestion();
  }, [currentQuestionId]);

  function handlePrevClick() {
    setCurrentQuestionId(currentQuestionId - 1);
  }

  function handleNextClick() {
    setCurrentQuestionId(currentQuestionId + 1);
  }

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {currentQuestion ? (
                <div>
                    <MathJaxContext>
                  <MathJax>
                    <h1>{currentQuestion.question}</h1>
                  </MathJax>
                  <MathJax>
                    <p>{currentQuestion.answer}</p>
                  </MathJax>
                  </MathJaxContext>
                </div>
              ) : (
                <p>No question found.</p>
              )}
              <button onClick={handlePrevClick} disabled={currentQuestionId === 1}>Previous</button>
              <button onClick={handleNextClick} disabled={currentQuestionId === 3}>Next</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Question;