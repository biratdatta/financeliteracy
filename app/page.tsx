 "use client";
import { useState } from "react";
import Question from "./components/Question";
import { questions, literacyFeedback } from "./data";

const GamePage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);

  const startGame = () => {
    setIsIntroVisible(false);
  };

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
      setScore(score > 0 ? score - 1 : 0);
    }
  };

  const retryGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsGameFinished(false);
    setIsIntroVisible(true);
  };

  const literacyLevel = (() => {
    const literacyScore = score / questions.length;
    if (literacyScore <= 0.25) return literacyFeedback.low;
    if (literacyScore <= 0.5) return literacyFeedback.basic;
    if (literacyScore <= 0.75) return literacyFeedback.moderate;
    return literacyFeedback.high;
  })();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      {isIntroVisible ? (
        <div className="text-center bg-white text-gray-800 rounded-lg shadow-lg max-w-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-indigo-600"> Empower your financial future </h2>
          <p className="text-lg text-gray-700">
            Test your knowledge and receive personalized feedback to help improve your financial literacy level.
          </p>
          <button
            onClick={startGame}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded transition-transform transform hover:scale-105 active:scale-95"
          >
            Lets Get Started
          </button>
        </div>
      ) : !isGameFinished ? (
        <div className="w-full max-w-xl bg-white text-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-600">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <div className="h-2 bg-gray-200 rounded-full mt-2">
              <div
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
              ></div>
            </div>
          </div>

          <Question
            questionText={questions[currentQuestion].question}
            onAnswer={handleAnswer}
            correctAnswer={questions[currentQuestion].correctAnswer}
          />

          <div className="mt-6 flex justify-between items-center">
            {currentQuestion > 0 && (
              <button
                onClick={goBack}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
              >
                Go Back
              </button>
            )}
            <p className="text-indigo-500">{questions.length - (currentQuestion + 1)} questions remaining</p>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white text-gray-800 rounded-lg shadow-lg max-w-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-indigo-600">Finished!</h2>
          <p className="text-2xl font-semibold">Your score: {score}/{questions.length}</p>
          <p className="text-xl font-semibold text-indigo-700">Literacy Level: {literacyLevel.title}</p>
          <div className="text-left mt-4">
            <h3 className="font-semibold text-lg text-gray-700">What to Do Next:</h3>
            <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600">
              {literacyLevel.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={retryGame}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded transition-transform transform hover:scale-105 active:scale-95"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
