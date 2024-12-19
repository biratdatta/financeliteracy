"use client";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Chart.js components

import Question from "./components/Question";
import { questions, literacyFeedback } from "./data";
import { FaCheckCircle, FaPiggyBank, FaMapMarkerAlt, FaMoneyBillWave, FaChartLine, FaUniversity } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
ChartJS.register(ArcElement, Tooltip, Legend);

const GamePage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [country, setCountry] = useState("");
  const [literacyLevel, setLiteracyLevel] = useState(literacyFeedback.low);
  const [literacyScore, setLiteracyScore] = useState("0.00");
  const [currentPage, setCurrentPage] = useState(0);
  const suggestionsPerPage = 3;

  const startGame = () => {
    if (country.trim() !== "") {
      setIsIntroVisible(false);
    } else {
      alert("Please enter your country to start.");
    }
  };

  const getIconForIndex = (index: number) => {
  // Select icons based on index
  switch (index % 4) {
    case 0:
      return <FaPiggyBank className="text-green-500 w-10 h-10" />;
    case 1:
      return <FaMoneyBillWave className="text-purple-500 w-10 h-10" />;
    case 2:
      return <FaChartLine className="text-orange-500 w-10 h-10" />;
    default:
      return <FaUniversity className="text-blue-500 w-10 h-10" />;
  }
};

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prevScore) => prevScore + 1);

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
      setScore((prevScore) => (prevScore > 0 ? prevScore - 1 : 0));
    }
  };

  const retryGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsGameFinished(false);
    setIsIntroVisible(true);
    setCountry("");
    setCurrentPage(0);
  };

  const nextPage = () => {
    if ((currentPage + 1) * suggestionsPerPage < literacyLevel.suggestions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const literacyScoreDecimal = (score / questions.length).toFixed(2);
    setLiteracyScore(literacyScoreDecimal);

    const literacyLevel =
      score / questions.length <= 0.25
        ? literacyFeedback.low
        : score / questions.length <= 0.5
        ? literacyFeedback.basic
        : score / questions.length <= 0.75
        ? literacyFeedback.moderate
        : literacyFeedback.high;

    setLiteracyLevel(literacyLevel);
  }, [score, currentQuestion]);

  const getCurrentPageSuggestions = () => {
    const startIndex = currentPage * suggestionsPerPage;
    return literacyLevel.suggestions.slice(startIndex, startIndex + suggestionsPerPage);
  };

  const totalPages = Math.ceil(literacyLevel.suggestions.length / suggestionsPerPage);

  const pieChartData = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        data: [score, questions.length - score],
        backgroundColor: ["#4CAF50", "#F44336"], // Green for correct, Red for incorrect
        hoverBackgroundColor: ["#66BB6A", "#E57373"],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#d9a7c7] to-[#fffcdc] text-white p-4 sm:p-6">
      {isIntroVisible ? (
        <div className="text-center bg-white text-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 sm:p-8 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600">
            Empower your fintech and financial future
          </h2>
          <p className="text-md sm:text-lg text-gray-700">
            Test your knowledge and receive personalized feedback to help improve your financial literacy level.
          </p>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
            className="w-full p-2 border rounded mt-4 text-gray-800"
          />
          <button
            onClick={startGame}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded transition-transform transform hover:scale-105 active:scale-95 mt-4"
          >
            Lets Get Started
          </button>
        </div>
      ) : !isGameFinished ? (
        <div className="w-full max-w-xl bg-white text-gray-800 rounded-lg shadow-lg p-4 sm:p-6 space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-600">
              Statement {currentQuestion + 1} of {questions.length}
            </h2>
            <p>Please indicate whether the statements are True or False</p>
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
            <p className="text-indigo-500">{questions.length - (currentQuestion + 1)} statements remaining</p>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white text-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 sm:p-8 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600 flex items-center justify-center space-x-2">
            <FaCheckCircle className="text-green-500" /> <span>Finished!</span>
          </h2>
          <p className="text-xl sm:text-2xl font-semibold flex items-center justify-center space-x-2">
            <MdSchool className="text-indigo-500" />
            <span>Your score is {literacyScore} out of 1.00</span>
          </p>
          <div className="flex justify-center items-center">
            <Pie data={pieChartData} />
          </div>
          <p className="text-lg sm:text-xl font-semibold text-indigo-700">
            Literacy Level: {literacyLevel.title}
          </p>

          <p className="text-md sm:text-lg text-gray-600 flex items-center justify-center space-x-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span>Country: {country}</span>
          </p>

          <div className="text-left mt-4">
            <h3 className="font-semibold text-lg text-gray-700 mb-6 text-center">
              <span className="text-indigo-600">What to Do Next:</span>
            </h3>
   

   <div className="relative flex flex-col items-center gap-8">
  {getCurrentPageSuggestions().map((suggestion, index) => (
    <a
      key={index}
      href="https://university.taylors.edu.my/en.html"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 justify-start w-full max-w-md p-4 rounded-lg shadow-lg bg-white border ${
        index % 4 === 0
          ? "border-green-500"
          : index % 4 === 1
          ? "border-purple-500"
          : index % 4 === 2
          ? "border-orange-500"
          : "border-blue-500"
      } transition-transform transform hover:scale-105`}
    >
      {getIconForIndex(index)}
      <span className="text-gray-800 font-semibold">{suggestion}</span>
    </a>
  ))}
</div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={previousPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded ${
                  currentPage === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white font-semibold transition-colors`}
              >
                Previous
              </button>
              <span className="text-gray-600 flex items-center">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={(currentPage + 1) * suggestionsPerPage >= literacyLevel.suggestions.length}
                className={`px-4 py-2 rounded ${
                  (currentPage + 1) * suggestionsPerPage >= literacyLevel.suggestions.length
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white font-semibold transition-colors`}
              >
                Next
              </button>
            </div>
          </div>
          <button
            onClick={retryGame}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded transition-transform transform hover:scale-105 active:scale-95 mt-4"
          >
            Retry the Game
          </button>
          <br/>
    <button
  onClick={() => window.open("https://university.taylors.edu.my/en.html", "_blank")}
  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition-transform transform hover:scale-105 active:scale-95 mt-4"
>
  Check some Educational Content here
</button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
