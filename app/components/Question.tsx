

interface QuestionProps {
  questionText: string;
  onAnswer: (isCorrect: boolean) => void;
  correctAnswer: boolean;
}

const Question: React.FC<QuestionProps> = ({ questionText, onAnswer, correctAnswer }) => {
  const handleAnswer = (userAnswer: boolean) => {
    onAnswer(userAnswer === correctAnswer);
  };

  return (
    <div className="p-4 border-2 border-blue-200 rounded-lg shadow-lg bg-gray-100">
      <h2 className="text-lg font-medium mb-4">{questionText}</h2>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleAnswer(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          True
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          False
        </button>
      </div>
    </div>
  );
};

export default Question;
