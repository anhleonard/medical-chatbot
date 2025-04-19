import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const QuestionsPage = () => {
  const [openQuestionId, setOpenQuestionId] = useState<number>();

  const questions = [
    {
      id: 0,
      question: "Làm sao để tôi đăng ký?",
      answer: "Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief, and freedom, either alone or in community with others and in public or private, to manifest his religion or belief in teaching, practice, worship and observance. Everyone has the right to freedom of opinion and expression; this right includes freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers. Everyone has the right to rest and leisure, including reasonable limitation of working hours and periodic holidays with pay."
    },
    {
      id: 1,
      question: "Tài khoản hội viên có tự động gia hạn?",
      answer: "Có, tài khoản hội viên sẽ tự động gia hạn hàng tháng. Bạn có thể hủy đăng ký bất cứ lúc nào trong phần cài đặt tài khoản của mình."
    },
    {
      id: 2,
      question: "Medical Chatbot có thể trả lời ở những lĩnh vực nào?",
      answer: "Medical Chatbot có thể trả lời các câu hỏi liên quan đến sức khỏe, triệu chứng bệnh, tư vấn y tế cơ bản, và hướng dẫn chăm sóc sức khỏe. Tuy nhiên, chatbot không thay thế cho việc thăm khám trực tiếp với bác sĩ."
    },
    {
      id: 3,
      question: "How do I get started?",
      answer: "To get started, simply create a free account and begin exploring our medical chatbot features. You can upgrade to a member account anytime to access premium features."
    }
  ];

  const handleQuestionClick = (id: number) => {
    setOpenQuestionId(openQuestionId === id ? undefined : id);
  };

  return (
    <div className="h-full p-3 flex flex-col items-center pt-4 gap-8 bg-white">
      <div className="font-bold text-primary-c900 text-xl lg:text-2xl 2xl:text-4xl">HỎI ĐÁP</div>
      <Image 
        src={"/logo/question-logo.svg"}
        alt="question-logo" 
        width={0}
        height={0}
        className="w-20 h-20 lg:w-24 lg:h-24 2xl:w-32 2xl:h-32 3xl:w-40 3xl:h-40"
      />
      <div className="w-full max-w-2xl md:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl space-y-3 px-4">
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q.question}
            answer={q.answer}
            isOpen={openQuestionId === q.id}
            onClick={() => handleQuestionClick(q.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionsPage;

interface QuestionProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
  }
  
  const QuestionItem: React.FC<QuestionProps> = ({ question, answer, isOpen, onClick }) => {
    return (
      <div className="w-full rounded-2xl overflow-hidden bg-primary-c10">
        <button
          onClick={onClick}
          className="w-full flex justify-between items-center py-4 px-5"
        >
          <span className="text-grey-c900 font-bold text-left text-sm 2xl:text-lg">{question}</span>
          <div className="flex items-center">
            {isOpen ? (
              <Image
                src="/icons/close-icon.svg"
                alt="close-icon"
                width={14}
                height={14}
                className="opacity-60 2xl:w-6 2xl:h-6"
              />
            ) : (
              <Image
                src="/icons/expand-icon.svg"
                alt="expand-icon"
                width={16}
                height={16}
                className="opacity-60 2xl:w-6 2xl:h-6"
              />
            )}
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden p-3 pt-0"
            >
              <motion.div 
                layout
                className="px-3 py-2 text-grey-c900 text-sm 2xl:text-lg leading-relaxed bg-white rounded-xl text-justify"
              >
                {answer}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };