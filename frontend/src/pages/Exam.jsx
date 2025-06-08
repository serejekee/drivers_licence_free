import React, { useState, useEffect } from "react";
import { examAPI } from '../services/api';

export default function Exam() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); // сюда сохраним ответы по всем вопросам
  const [examFinished, setExamFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 минут в секундах

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("api/v1/questions/?mode=training");
        if (!res.ok) throw new Error("Ошибка при загрузке вопросов");
        setQuestions(await res.json());
      } catch (e) {
        alert(e.message);
      }
    })();
  }, []);

  // Таймер
  useEffect(() => {
    if (!examFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !examFinished) finishExam();
  }, [timeLeft, examFinished]);

  if (!questions.length) return <div className="text-center text-white p-8">Загрузка...</div>;

  // Стартовый экран экзамена
  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Добро пожаловать на экзамен!</h2>
          <p className="text-gray-300 mb-4">Вам предстоит ответить на 40 вопросов за 40 минут.</p>
          <p className="text-gray-300 mb-6">Для сдачи экзамена необходимо набрать не менее 70% правильных ответов.</p>
          <button
            onClick={() => setExamStarted(true)}
            className="py-3 px-6 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
          >
            Начать экзамен
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const correctAnswersSet = new Set(currentQuestion.right_answers.split(",").map((x) => x.trim()));

  const toggleAnswer = (id) => {
    if (examFinished) return;
    setSelectedAnswers((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Запоминаем ответ и переходим к следующему вопросу
  const nextQuestion = () => {
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswers: selectedAnswers.map(String),
        correctAnswers: [...correctAnswersSet],
      },
    ]);

    setSelectedAnswers([]);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = async () => {
    // Если пользователь на последнем вопросе еще не сохранил ответ — сделаем это
    let finalAnswers = userAnswers;
    if (!examFinished && selectedAnswers.length > 0 && userAnswers.length === questions.length - 1) {
      finalAnswers = [
        ...userAnswers,
        {
          questionId: currentQuestion.id,
          selectedAnswers: selectedAnswers.map(String),
          correctAnswers: [...correctAnswersSet],
        },
      ];
      setUserAnswers(finalAnswers);
    }

    // Сохраняем результат экзамена
    try {
      const examAnswers = finalAnswers.map(answer => ({
        question_id: answer.questionId,
        selected_answers: answer.selectedAnswers,
        correct_answers: answer.correctAnswers,
        is_correct: (
          answer.selectedAnswers.length === answer.correctAnswers.length &&
          answer.selectedAnswers.every(ans => answer.correctAnswers.includes(ans))
        )
      }));

      const submission = {
        exam_type: 'exam',
        answers: examAnswers,
        time_taken: (40 * 60) - timeLeft
      };

      await examAPI.submitExamResult(submission);
    } catch (error) {
      console.error('Error saving exam result:', error);
    }

    setExamFinished(true);
  };

  const calculateCorrectCount = () => {
    return userAnswers.reduce((acc, ans) => {
      const userSet = new Set(ans.selectedAnswers);
      const correctSet = new Set(ans.correctAnswers);
      const isCorrect =
        userSet.size === correctSet.size && [...userSet].every((val) => correctSet.has(val));
      return acc + (isCorrect ? 1 : 0);
    }, 0);
  };

  const percent = Math.round((calculateCorrectCount() / questions.length) * 100);
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  // Рендер отчёта
  if (examFinished && showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Результаты экзамена</h2>
          <p className="text-gray-300 mb-4">
            Правильных ответов: <strong className="text-white">{calculateCorrectCount()} из {questions.length}</strong>
          </p>
          <p className="text-gray-300 mb-6">Процент: <strong className="text-white">{percent}%</strong></p>
          <h3 className={`text-2xl font-bold mb-6 ${
            percent >= 70 ? "text-green-400" : "text-red-400"
          }`}>
            {percent >= 70 ? "✅ Экзамен сдан" : "❌ Экзамен не сдан"}
          </h3>
          <hr className="border-gray-600 mb-6" />

        {questions.map((q, idx) => {
          const userAnswerObj = userAnswers.find((a) => a.questionId === q.id);
          const userSet = new Set(userAnswerObj?.selectedAnswers || []);
          const correctSet = new Set(q.right_answers.split(",").map((x) => x.trim()));

          return (
            <div key={q.id} className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-white font-bold mb-4">Вопрос {idx + 1}: <span className="font-normal text-gray-300">{q.question_text}</span></p>
              {q.photo && <img src={`/img/${q.photo}`} alt="Вопрос" className="max-w-full rounded-lg mb-4" />}

              <div className="space-y-2">
                {[1, 2, 3, 4].map((num) => {
                  const idStr = String(num);
                  const answerText = q[`answer_${num}`];
                  const isUserSelected = userSet.has(idStr);
                  const isCorrect = correctSet.has(idStr);

                  let className = "p-3 rounded border-2 ";
                  if (isCorrect) {
                    className += "bg-green-900 border-green-500 text-green-100";
                  } else if (isUserSelected && !isCorrect) {
                    className += "bg-red-900 border-red-500 text-red-100";
                  } else {
                    className += "bg-gray-600 border-gray-500 text-gray-300";
                  }

                  return (
                    <div key={num} className={className}>
                      {answerText} {isUserSelected ? " (Ваш ответ)" : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => {
            setExamFinished(false);
            setShowResults(false);
            setCurrentIdx(0);
            setSelectedAnswers([]);
            setUserAnswers([]);
            setTimeLeft(40 * 60);
          }}
          className="w-full mt-6 py-3 px-6 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
        >
          Пройти экзамен заново
        </button>
        </div>
      </div>
    );
  }

  // Рендер экзамена (пока не завершён)
  if (examFinished && !showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Экзамен завершён</h2>
          <p className="text-gray-300 mb-4">Правильных ответов: <strong className="text-white">{calculateCorrectCount()} из {questions.length}</strong></p>
          <p className="text-gray-300 mb-6">Процент: <strong className="text-white">{percent}%</strong></p>
          <h3 className={`text-2xl font-bold mb-6 ${
            percent >= 70 ? "text-green-400" : "text-red-400"
          }`}>
            {percent >= 70 ? "✅ Экзамен сдан" : "❌ Экзамен не сдан"}
          </h3>

          <button
            onClick={() => setShowResults(true)}
            className="w-full py-3 px-6 text-lg font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer"
          >
            Показать подробные результаты
          </button>
        </div>
      </div>
    );
  }

  // Экзамен в процессе (показ вопроса)
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Вопрос {currentIdx + 1} из {questions.length}
          </h2>
          <div className={`text-xl font-bold ${timeLeft < 60 ? "text-red-400" : "text-green-400"}`}>
            ⏳ {minutes}:{seconds}
          </div>
        </div>

        <p className="text-gray-300 mb-6">{currentQuestion.question_text}</p>
        {currentQuestion.photo && (
          <img src={`/images/questions/${currentQuestion.photo}`} alt="Вопрос" className="max-w-full mb-6 rounded-lg" />
        )}

        <div className="space-y-3 mb-6">
          {[1, 2, 3, 4].map((num) => {
            const answerText = currentQuestion[`answer_${num}`];
            const idStr = String(num);
            const isSelected = selectedAnswers.includes(idStr);

            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-colors ";

            if (isSelected) {
              buttonClass += "border-blue-500 bg-blue-900 text-blue-100";
            } else {
              buttonClass += "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600";
            }

            return (
              <button
                key={num}
                onClick={() => toggleAnswer(idStr)}
                className={buttonClass}
              >
                {answerText}
              </button>
            );
          })}
        </div>

        <button
          onClick={nextQuestion}
          disabled={!selectedAnswers.length}
          className={`w-full py-3 px-6 text-lg font-medium rounded-lg transition-colors ${
            !selectedAnswers.length
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {currentIdx + 1 === questions.length ? "Завершить экзамен" : "Следующий вопрос"}
        </button>
      </div>
    </div>
  );
}
