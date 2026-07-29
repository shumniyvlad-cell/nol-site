export type DiagnosticQuestion = {
  id: string;
  question: string;
  options: readonly string[];
};

export const diagnosticQuestions: readonly DiagnosticQuestion[] = [
  {
    id: "amount",
    question: "Какова приблизительная общая сумма долгов?",
    options: [
      "До 300 000 ₽",
      "300 000–1 000 000 ₽",
      "1–3 млн ₽",
      "Более 3 млн ₽",
    ],
  },
  {
    id: "arrears",
    question: "Есть ли просрочки?",
    options: [
      "Нет",
      "До 3 месяцев",
      "Более 3 месяцев",
      "Есть исполнительные производства",
    ],
  },
  {
    id: "income",
    question: "Есть ли официальный доход?",
    options: ["Да", "Нет", "Нестабильный доход"],
  },
  {
    id: "realEstate",
    question: "Есть ли недвижимость?",
    options: [
      "Нет",
      "Единственное жильё",
      "Ипотечное жильё",
      "Есть дополнительная недвижимость",
    ],
  },
  {
    id: "valuableAssets",
    question: "Есть ли автомобиль или другое ценное имущество?",
    options: ["Да", "Нет"],
  },
  {
    id: "transactions",
    question: "Были ли за последние три года сделки с имуществом?",
    options: ["Да", "Нет", "Не уверен(а)"],
  },
  {
    id: "priority",
    question: "Что сейчас беспокоит больше всего?",
    options: [
      "Звонки и давление",
      "Арест счетов",
      "Риск потери имущества",
      "Невозможность платить",
      "Непонимание последствий",
    ],
  },
];
