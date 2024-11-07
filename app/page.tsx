"use client";
import { useState } from "react";
import Question from "./components/Question";
import { questions, literacyFeedback } from "./data";

const GamePage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(score + 1);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setIsGameFinished(true);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setScore(score > 0 ? score - 1 : 0); // Adjust score if going back from a correct answer
    }
  };

  const retryGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsGameFinished(false);
  };

  const literacyLevel = (() => {
    const literacyScore = score / questions.length;
    if (literacyScore <= 0.25) return literacyFeedback.low;
    if (literacyScore <= 0.5) return literacyFeedback.basic;
    if (literacyScore <= 0.75) return literacyFeedback.moderate;
    return literacyFeedback.high;
  })();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-4">
      {!isGameFinished ? (
        <div className="w-full max-w-lg p-4 bg-white text-gray-800 rounded-lg shadow-lg">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">Question {currentQuestion + 1} of {questions.length}</h2>
          </div>
          <Question
            questionText={questions[currentQuestion].question}
            onAnswer={handleAnswer}
            correctAnswer={questions[currentQuestion].correctAnswer}
          />
          <div className="mt-4 flex justify-between items-center">
            {currentQuestion > 0 && (
              <button
                onClick={goBack}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
              >
                Go Back
              </button>
            )}
            <p className="text-gray-500">{questions.length - (currentQuestion + 1)} questions remaining</p>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-white text-gray-800 rounded-lg shadow-lg max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Game Finished!</h2>
          <p className="mb-4">Your score: {score}/{questions.length}</p>
          <p className="text-xl font-semibold mb-4">Literacy Level: {literacyLevel.title}</p>
          <div className="text-left mb-4">
            <h3 className="font-semibold">What to Do Next:</h3>
            <ul className="list-disc list-inside mt-2 space-y-2">
              {literacyLevel.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={retryGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
