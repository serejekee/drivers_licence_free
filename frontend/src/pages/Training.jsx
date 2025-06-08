import React, { useState, useEffect } from "react";
import { questionAPI, examAPI } from "../services/api";


export default function Training() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const questionsCount = 40;

  useEffect(() => {
    (async () => {
      try {
        const res = await questionAPI.getTraining(questionsCount);
        setQuestions(res.data);
      } catch (e) {
        console.error('Error loading questions:', e);
        alert("Ошибка при загрузке вопросов");
      }
    })();
  }, []);

  if (!questions.length) return <div className="text-center text-white p-8">Загрузка...</div>;

  const currentQuestion = questions[currentIdx];
  const correctAnswersSet = new Set(currentQuestion.right_answers.split(",").map(x => x.trim()));

  const toggleAnswer = id => !showResult && setSelectedAnswers(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  const checkAnswer = () => {
    const selectedSet = new Set(selectedAnswers.map(String));
    const isCorrect = selectedSet.size === correctAnswersSet.size && [...selectedSet].every(val => correctAnswersSet.has(val));
    
    if (isCorrect) {
      setCorrectAnswersCount(correctAnswersCount + 1);
    }
    
    // Сохраняем ответ пользователя
    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswers: selectedAnswers.map(String),
        correctAnswers: [...correctAnswersSet],
        isCorrect
      }
    ]);
    
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      alert(`Тренировка завершена! Правильных ответов: ${correctAnswersCount} из ${questions.length}`);

      // Сохранение результатов
      (async () => {
        try {
          const examAnswers = userAnswers.map(answer => ({
            question_id: answer.questionId,
            selected_answers: answer.selectedAnswers,
            correct_answers: answer.correctAnswers,
            is_correct: answer.isCorrect
          }));

          const submission = {
            exam_type: 'training',
            answers: examAnswers,
          };

          await examAPI.submitExamResult(submission);
        } catch (error) {
          console.error('Error saving training result:', error);
        }
      })();
      setCurrentIdx(0);
      setCorrectAnswersCount(0);
    }
    setSelectedAnswers([]);
    setShowResult(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">
          Вопрос {currentIdx + 1} из {questions.length}
        </h2>
        <p className="text-gray-300 mb-6">{currentQuestion.question_text}</p>
        
        {currentQuestion.photo && (
          <img 
            src={`/images/questions/${currentQuestion.photo}`}
            alt="Вопрос" 
            className="max-w-full mb-6 rounded-lg"
          />
        )}

        <div className="space-y-3 mb-6">
          {[1, 2, 3, 4].map(num => {
            const answerText = currentQuestion[`answer_${num}`];
            const idStr = String(num);
            const isSelected = selectedAnswers.includes(idStr);
            const isCorrect = showResult && correctAnswersSet.has(idStr);
            const isWrong = showResult && isSelected && !correctAnswersSet.has(idStr);
            
            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-colors ";
            
            if (isCorrect) {
              buttonClass += "border-green-500 bg-green-900 text-green-100";
            } else if (isWrong) {
              buttonClass += "border-red-500 bg-red-900 text-red-100";
            } else if (isSelected) {
              buttonClass += "border-blue-500 bg-blue-900 text-blue-100";
            } else {
              buttonClass += "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600";
            }

            return (
              <button
                key={num}
                onClick={() => toggleAnswer(idStr)}
                disabled={showResult}
                className={buttonClass}
              >
                {answerText}
              </button>
            );
          })}
        </div>

        <button
          onClick={showResult ? nextQuestion : checkAnswer}
          disabled={!selectedAnswers.length && !showResult}
          className={`w-full py-3 px-6 text-lg font-medium rounded-lg transition-colors ${
            showResult 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-green-600 hover:bg-green-700 text-white"
          } ${(!selectedAnswers.length && !showResult) ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {showResult 
            ? (currentIdx + 1 === questions.length ? "Завершить" : "Следующий вопрос") 
            : "Проверить ответ"
          }
        </button>
      </div>
    </div>
  );
}

