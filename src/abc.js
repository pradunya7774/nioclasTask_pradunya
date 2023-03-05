import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {MathJax,MathJaxContext} from 'better-react-mathjax';

function QuestionSet() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const history = useNavigate();

  useEffect(() => {
    async function fetchQuestion() {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const questionId = searchParams.get('QuestionID');
      try {
        const response = await fetch(`https://0h8nti4f08.execute-api.ap-northeast-1.amazonaws.com/getQuestionDetails/getquestiondetails?QuestionID=QuestionID${questionId}`);
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
  }, [location.search]);

  function handlePrevClick() {
    const searchParams = new URLSearchParams(location.search);
    const questionId = searchParams.get('QuestionID');
    const prevQuestionId = parseInt(questionId, 10) - 1;
    history.push(`/?QuestionID=${prevQuestionId}`);
  }

  function handleNextClick() {
    const searchParams = new URLSearchParams(location.search);
    const questionId = searchParams.get('QuestionID');
    const nextQuestionId = parseInt(questionId, 10) + 1;
    history.push(`/?QuestionID=${nextQuestionId}`);
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
              <button onClick={handlePrevClick} disabled={currentQuestion && currentQuestion.id === 1}>Previous</button>
              <button onClick={handleNextClick} disabled={currentQuestion && currentQuestion.id === 3}>Next</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default QuestionSet;
