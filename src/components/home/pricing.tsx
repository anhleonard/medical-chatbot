import Button from "@/libs/button";
import Image from "next/image";
import React from "react";

const pricingData = [
  {
    title: "MIỄN PHÍ",
    price: "0 VNĐ",
    priceDescription: "cho tất cả mọi người",
    buttonLabel: "Thử ngay",
    features: [
      "Chatbot y tế hỗ trợ người dùng tra cứu thông tin sức khỏe, tư vấn triệu chứng ban đầu và hướng dẫn chăm sóc y tế một cách tiện lợi.",
      "Cung cấp thông tin y khoa dựa trên mô tả triệu chứng, giúp người dùng hiểu rõ hơn về tình trạng sức khỏe của mình.",
      "Cung cấp công cụ giúp bác sĩ quản lý câu hỏi, tra cứu thông tin y khoa nhanh chóng và tư vấn bệnh nhân hiệu quả."
    ]
  },
  {
    title: "HỘI VIÊN",
    price: "189.000 VNĐ",
    priceDescription: "người/tháng",
    buttonLabel: "Đăng ký ngay",
    features: [
      "Tất cả tính năng của gói Miễn phí, cộng thêm các ưu đãi đặc biệt cho hội viên.",
      "Truy cập không giới hạn vào cơ sở dữ liệu y khoa chuyên sâu và các tài liệu nghiên cứu mới nhất.",
      "Hỗ trợ ưu tiên và tư vấn chuyên sâu từ đội ngũ chuyên gia y tế."
    ]
  },
  {
    title: "DOANH NGHIỆP",
    buttonLabel: "Liên hệ hỗ trợ",
    features: [
      "Tất cả tính năng của gói Hội viên, được tùy chỉnh theo nhu cầu doanh nghiệp.",
      "Tích hợp API và các công cụ quản lý nhân viên, theo dõi sức khỏe tập thể.",
      "Hỗ trợ kỹ thuật 24/7 và đào tạo nhân viên sử dụng hệ thống."
    ]
  }
];

const PricingPage = () => {
  return (
    <div className="h-full p-3 flex flex-col items-center pt-4 gap-6 xl:gap-8 2xl:gap-10">
      <div className="font-bold text-primary-c900 text-xl lg:text-2xl 2xl:text-4xl">NÂNG CẤP</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-28 h-full w-full max-w-7xl">
        {pricingData.map((plan, index) => (
          <div key={index} className="rounded-2xl bg-primary-c10 px-3 pt-5 pb-3 flex flex-col gap-4 items-center h-full 2xl:max-h-[80vh]">
            <div className="text-grey-c900 text-xl font-bold">{plan.title}</div>
            <div className="flex flex-col px-3 py-4 bg-white rounded-2xl h-full w-full">
              <div className="flex flex-col gap-3 flex-1 mb-6 sm:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2">
                    <Image src={"/icons/tick-icon.svg"} alt="tick-icon" width={20} height={20} className="mt-[2px]" />
                    <div className="text-grey-c900 text-sm">{feature}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {plan.price && (
                  <div className="flex flex-col">
                    <div className="text-primary-c900 font-bold text-xl">{plan.price}</div>
                    <div className="text-grey-c900 text-sm">{plan.priceDescription}</div>
                  </div>
                )}
                <Button label={plan.buttonLabel} className="py-3 w-full" status="secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
