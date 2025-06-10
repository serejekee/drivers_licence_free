import React, { useEffect, useState } from "react";
import { allquestionAPI } from '../services/api'

export default function AllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [answerVisibility, setAnswerVisibility] = useState({});
  const questionsPerPage = 40;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await allquestionAPI.getAll({
          page,
          limit: questionsPerPage
        });
        const data = res.data;
        setQuestions(data.questions);
        setTotalPages(data.totalPages);
      } catch (e) {
        console.error('Error loading questions:', e);
        setError("Ошибка при загрузке вопросов");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [page]);

  const toggleAnswerVisibility = (questionId) => {
    setAnswerVisibility((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  if (loading) return <p className="text-center mt-20 text-white">Загрузка...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!questions.length) return <p className="text-center mt-20 text-white">Вопросы не найдены.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h2 className="text-3xl font-bold text-center mb-10">📝 Все вопросы</h2>

      <ul className="space-y-6">
        {questions.map((q, i) => {
          const rightAnswers = q.right_answers.split(",").map(Number);
          const isAnswerVisible = answerVisibility[q.id] || false;

          return (
            <li
              key={q.id}
              className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700"
            >
              <strong className="block text-lg mb-2">
                {i + 1}. {q.question_text}
              </strong>

              {q.photo && (
                <img
                  src={`/images/questions/${q.photo}`}
                  alt="вопрос"
                  className="w-full max-h-60 object-contain rounded-md mb-4"
                />
              )}

              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {[1, 2, 3, 4].map((num) =>
                  q[`answer_${num}`] ? <li key={num}>{q[`answer_${num}`]}</li> : null
                )}
              </ul>

              <div className="mt-4">
                <button
                  onClick={() => toggleAnswerVisibility(q.id)}
                  className={`px-4 py-2 rounded-md font-medium text-white ${
                    isAnswerVisible ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isAnswerVisible
                    ? "Скрыть правильный ответ"
                    : "Показать правильный ответ"}
                </button>

                {isAnswerVisible && (
                  <p className="mt-3 text-green-400 font-semibold">
                    Правильные ответы: {rightAnswers.map((a) => `Ответ ${a}`).join(", ")}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Навигация с вводом */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10 flex-wrap text-white">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded disabled:opacity-50"
        >
          ← Предыдущая
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const pageNum = Number(inputPage);
            if (pageNum >= 1 && pageNum <= totalPages) {
              setPage(pageNum);
              setInputPage("");
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="№ стр."
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onWheel={(e) => e.target.blur()} // отключаем изменение при скролле
            className="w-24 px-2 py-1 rounded bg-gray-700 text-white border border-gray-500 text-center appearance-none"
          />
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded disabled:opacity-50"
          >
            Перейти
          </button>
        </form>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded disabled:opacity-50"
        >
          Следующая →
        </button>
      </div>

      <p className="text-center mt-4 text-gray-400">
        Страница {page} из {totalPages}
      </p>
    </div>
  );
}






