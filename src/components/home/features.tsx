import Image from "next/image";
import React from "react";

const FeaturesPage = () => {
  const features = [
    {
      title: "Tư vấn triệu chứng",
      description: "Cung cấp thông tin y khoa dựa trên mô tả triệu chứng, giúp người dùng hiểu rõ hơn về tình trạng sức khỏe của mình."
    },
    {
      title: "Hỗ trợ bác sĩ",
      description: "Cung cấp công cụ giúp bác sĩ quản lý câu hỏi, tra cứu thông tin y khoa nhanh chóng và tư vấn bệnh nhân hiệu quả."
    },
    {
      title: "Hướng dẫn chăm sóc sức khỏe",
      description: "Đưa ra lời khuyên về chế độ ăn uống, luyện tập và phòng ngừa bệnh tật để giúp người dùng duy trì một lối sống lành mạnh."
    }
  ];

  return (
    <div className="h-full p-3 flex flex-col items-center pt-4 gap-6 xl:gap-12 2xl:gap-20">
      <div className="font-bold text-primary-c900 text-xl lg:text-2xl 2xl:text-4xl 3xl:text-6xl">TÍNH NĂNG</div>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 items-start justify-center w-full h-fit max-w-7xl 3xl:max-w-[2000px]">
        {/* Cột bên trái */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <div className="flex flex-col gap-6 lg:gap-8 3xl:gap-12 items-center justify-center">
            <div className="flex flex-col gap-1 2xl:gap-4 items-center">
              <div className="font-righteous text-xl lg:text-3xl 2xl:text-5xl">
                <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
              </div>
              <div className="text-grey-c900 text-base lg:text-lg 2xl:text-2xl text-center max-w-80 lg:max-w-96 2xl:max-w-[600px] 3xl:max-w-[800px]">
                Chatbot y tế hỗ trợ người dùng tra cứu thông tin sức khỏe, tư vấn triệu chứng ban đầu và hướng dẫn chăm
                sóc y tế một cách tiện lợi.
              </div>
            </div>
            <Image
              src={"/logo/feature-logo.svg"}
              alt="feature-logo" 
              width={0}
              height={0}
              className="w-40 h-40 lg:w-48 lg:h-48 2xl:w-64 2xl:h-64 3xl:w-80 3xl:h-80"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-grey-c100 mx-8 lg:mx-16 2xl:mx-24 self-stretch hidden lg:block"></div>

        {/* Cột bên phải */}
        <div className="flex-1 flex flex-col w-full max-w-2xl md:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl space-y-3 px-4 mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="py-4 px-5 bg-primary-c10 rounded-2xl flex flex-col gap-2 w-full lg:w-2/3 xl:w-3/4 2xl:w-full">
              <div className="flex items-center gap-2">
                <Image src={"/icons/tick-icon.svg"} alt="tick-icon" width={0} height={0} className="w-5 h-5 2xl:w-7 2xl:h-7" />
                <div className="text-sm xl:text-base 2xl:text-[22px] text-primary-c900">{feature.title}</div>
              </div>
              <div className="text-grey-c900 text-sm 2xl:text-lg">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
