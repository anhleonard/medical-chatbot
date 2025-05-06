"use client";
import Chat, { FilesId } from "@/components/chat";
import { Message } from "../../../../../../utils/interfaces";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMessages } from "@/api/services/message";
import { getAccessToken } from "@/storage/storage";
import { closeLoading, openLoading } from "@/redux/slices/loading";
import { useDispatch, useSelector } from "react-redux";
import { openAlert } from "@/redux/slices/alert";
import { RootState } from "@/redux/store";

const exampleMessages: Message[] = [
  // Cuộc hội thoại 1: Về sức khỏe
  {
    id: 1,
    content: "Xin chào, tôi có thể giúp gì cho bạn?",
    role: "assistant",
    conversationId: 1,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 ngày trước
    hasFile: false
  },
  {
    id: 2,
    content: "Tôi đang bị đau đầu và sốt nhẹ, có thể cho tôi lời khuyên không?",
    role: "user",
    conversationId: 1,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    hasFile: false
  },
  {
    id: 3,
    content: "Dựa trên triệu chứng của bạn, tôi có một số gợi ý:\n1. Nghỉ ngơi đầy đủ\n2. Uống nhiều nước\n3. Có thể dùng thuốc hạ sốt nếu nhiệt độ trên 38.5°C\n4. Theo dõi các triệu chứng khác\n\nNếu tình trạng không cải thiện sau 2-3 ngày, bạn nên đến gặp bác sĩ.",
    role: "assistant",
    conversationId: 1,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    hasFile: false
  },
  
  // Cuộc hội thoại 2: Về công việc
  {
    id: 4,
    content: "Chào trợ lý, tôi cần chuẩn bị cho buổi phỏng vấn ngày mai.",
    role: "user",
    conversationId: 2,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 ngày trước
    hasFile: false
  },
  {
    id: 5,
    content: "Rất vui được giúp bạn chuẩn bị cho buổi phỏng vấn. Tôi cần biết thêm chi tiết: Đây là vị trí gì và ngành nghề nào?",
    role: "assistant",
    conversationId: 2,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    hasFile: false
  },
  {
    id: 6,
    content: "Tôi xin việc ở vị trí lập trình viên frontend tại một công ty công nghệ.",
    role: "user",
    conversationId: 2,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    hasFile: false
  },
  {
    id: 7,
    content: "Tuyệt vời! Đối với vị trí frontend developer, đây là một số điểm bạn nên chuẩn bị:\n\n1. Kiến thức kỹ thuật:\n   - HTML/CSS/JavaScript\n   - Framework (React, Vue, Angular)\n   - Tối ưu hóa hiệu suất\n   - Responsive design\n\n2. Câu hỏi phỏng vấn thường gặp:\n   - DOM manipulation\n   - Event handling\n   - Closures trong JavaScript\n   - CSS flexbox/grid\n   - State management\n\n3. Chuẩn bị portfolio và mã nguồn để demo\n\nBạn có muốn tôi đi sâu vào bất kỳ chủ đề nào không?",
    role: "assistant",
    conversationId: 2,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    hasFile: false
  },
  
  // Cuộc hội thoại 3: Về nấu ăn
  {
    id: 8,
    content: "Hôm nay tôi muốn làm món pasta nhưng hết sốt cà chua. Có cách nào thay thế không?",
    role: "user",
    conversationId: 3,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 ngày trước
    hasFile: false
  },
  {
    id: 9,
    content: "Bạn có thể thử các lựa chọn thay thế sau cho sốt cà chua:\n\n1. Aglio e Olio: Dầu oliu, tỏi, ớt khô, rau mùi\n2. Sốt kem (nếu có kem tươi): Kem tươi, bơ, phô mai Parmesan\n3. Sốt bơ tỏi đơn giản: Bơ, tỏi, các loại thảo mộc\n4. Pesto (nếu có): Húng quế, dầu oliu, hạt thông, tỏi, phô mai\n\nBạn có những nguyên liệu gì trong tủ lạnh và tủ bếp?",
    role: "assistant",
    conversationId: 3,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    hasFile: false
  },
  {
    id: 10,
    content: "Tôi có dầu oliu, bơ, tỏi, kem tươi và phô mai.",
    role: "user",
    conversationId: 3,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    hasFile: false
  },
  {
    id: 11,
    content: "Tuyệt! Với những nguyên liệu bạn có, tôi gợi ý làm món pasta sốt kem tỏi:\n\nNguyên liệu:\n- Pasta (loại bạn đang có)\n- 2 thìa bơ\n- 2-3 tép tỏi (băm nhỏ)\n- 200ml kem tươi\n- 50g phô mai (bào hoặc cắt nhỏ)\n- Muối, tiêu đen xay\n\nCách làm:\n1. Nấu pasta theo hướng dẫn trên bao bì\n2. Đun chảy bơ trong chảo ở lửa vừa\n3. Phi thơm tỏi trong bơ (chú ý không để tỏi cháy)\n4. Đổ kem tươi vào, đun sôi nhẹ và giảm lửa\n5. Thêm phô mai, khuấy đều cho đến khi tan chảy và sốt sánh lại\n6. Nêm muối, tiêu vừa ăn\n7. Trộn pasta đã nấu chín với sốt\n\nBạn có thể thêm rau thơm nếu có và ăn kèm bánh mì nướng!",
    role: "assistant",
    conversationId: 3,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    hasFile: false
  },
  
  // Cuộc hội thoại 4: Về du lịch
  {
    id: 12,
    content: "Tôi dự định đi Đà Nẵng vào tháng tới, những địa điểm nào đáng tham quan nhất?",
    role: "user",
    conversationId: 4,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 giờ trước
    hasFile: false
  },
  {
    id: 13,
    content: "Đà Nẵng có rất nhiều địa điểm tuyệt vời để tham quan! Đây là những điểm đến không nên bỏ lỡ:\n\n1. Bà Nà Hills - Cầu Vàng\n2. Bán đảo Sơn Trà và chùa Linh Ứng\n3. Biển Mỹ Khê\n4. Ngũ Hành Sơn\n5. Phố cổ Hội An (gần Đà Nẵng)\n6. Đèo Hải Vân\n7. Suối khoáng nóng Thần Tài\n8. Cầu Rồng (đặc biệt vào tối thứ 7 và Chủ nhật để xem rồng phun lửa)\n\nThời gian lý tưởng để tham quan là từ tháng 2 đến tháng 5. Bạn dự định đi trong bao nhiêu ngày?",
    role: "assistant",
    conversationId: 4,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    hasFile: false
  },
  
  // Cuộc hội thoại 5: Về học tập
  {
    id: 14,
    content: "Tôi đang học tiếng Anh và gặp khó khăn với thì hiện tại hoàn thành tiếp diễn. Bạn có thể giải thích giúp tôi không?",
    role: "user",
    conversationId: 5,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 giờ trước
    hasFile: false
  },
  {
    id: 15,
    content: "Tôi rất vui được giải thích về thì hiện tại hoàn thành tiếp diễn (Present Perfect Continuous) cho bạn.\n\n**Cấu trúc:**\n- Subject + have/has + been + V-ing\n\n**Cách sử dụng chính:**\n1. Diễn tả hành động bắt đầu trong quá khứ, tiếp tục đến hiện tại và có thể tiếp tục trong tương lai\n   - *I have been studying English for 3 years.* (Tôi đã và đang học tiếng Anh được 3 năm)\n\n2. Nhấn mạnh tính liên tục của hành động\n   - *She has been working all day.* (Cô ấy đã làm việc cả ngày)\n\n3. Giải thích cho kết quả hiện tại\n   - *I'm tired because I have been running.* (Tôi mệt vì tôi đã chạy bộ)\n\n**Dấu hiệu nhận biết:**\n- For + khoảng thời gian (for 2 hours, for 3 months)\n- Since + thời điểm bắt đầu (since 2020, since Monday)\n- Recently, lately\n\nBạn có thể thực hành với các ví dụ sau:\n- *They _____ (wait) for the bus since 8 AM.*\n- *He looks exhausted because he _____ (study) all night.*\n\nBạn còn thắc mắc gì nữa không?",
    role: "assistant",
    conversationId: 5,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    hasFile: false
  },
  
  // Cuộc hội thoại 6: Về tư vấn mua sắm
  {
    id: 16,
    content: "Tôi đang tìm mua một chiếc laptop mới để làm đồ họa, ngân sách khoảng 25 triệu đồng. Bạn có gợi ý gì không?",
    role: "user",
    conversationId: 6,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 giờ trước
    hasFile: false
  },
  {
    id: 17,
    content: "Với ngân sách 25 triệu đồng cho laptop đồ họa, đây là một số gợi ý phù hợp:\n\n**1. Dell XPS 15**\n- Ưu điểm: Màn hình chất lượng cao, hiệu suất tốt, thiết kế đẹp\n- CPU: Intel Core i7 thế hệ 12\n- RAM: 16GB\n- GPU: NVIDIA GTX 1650 Ti\n- Màn hình: 15.6\" FHD+ hoặc 4K\n\n**2. ASUS ROG Zephyrus G14**\n- Ưu điểm: Hiệu năng cao, pin tốt, nhỏ gọn\n- CPU: AMD Ryzen 7 hoặc 9\n- RAM: 16GB\n- GPU: NVIDIA RTX 3060\n- Màn hình: 14\" QHD 120Hz\n\n**3. MacBook Pro 14\"**\n- Ưu điểm: Chip M2 mạnh mẽ, màn hình Retina xuất sắc, thời lượng pin dài\n- CPU: Apple M2 Pro\n- RAM: 16GB\n- GPU: Tích hợp\n- Màn hình: 14\" Liquid Retina XDR\n\n**4. Acer ConceptD 5**\n- Ưu điểm: Thiết kế cho người sáng tạo, màn hình chuẩn màu, hiệu năng tốt\n- CPU: Intel Core i7\n- RAM: 16GB\n- GPU: NVIDIA RTX 3050 Ti\n- Màn hình: 16\" 4K\n\n**Lưu ý quan trọng cho công việc đồ họa:**\n- Độ chính xác màu sắc của màn hình\n- RAM tối thiểu 16GB\n- Card đồ họa rời (NVIDIA GTX/RTX)\n- Bộ nhớ SSD tốc độ cao\n\nBạn thường sử dụng phần mềm đồ họa nào? Điều này sẽ giúp tôi đưa ra gợi ý chính xác hơn.",
    role: "assistant",
    conversationId: 6,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    hasFile: false
  },
  
  // Cuộc hội thoại 7: Hiện tại
  {
    id: 18,
    content: "Hôm nay tôi cảm thấy hơi stress, có cách nào giúp thư giãn nhanh không?",
    role: "user",
    conversationId: 7,
    createdAt: new Date().toISOString(), // Hiện tại
    hasFile: false
  },
  {
    id: 19,
    content: "Tôi rất hiểu cảm giác đó. Đây là một số phương pháp thư giãn nhanh và hiệu quả bạn có thể thử ngay:\n\n1. **Hít thở sâu 4-7-8**: Hít vào bằng mũi đếm đến 4, giữ hơi đếm đến 7, thở ra bằng miệng đếm đến 8. Lặp lại 3-5 lần.\n\n2. **Ngồi thiền 5 phút**: Chỉ cần ngồi thoải mái, nhắm mắt và tập trung vào hơi thở.\n\n3. **Kỹ thuật thư giãn cơ bắp**: Căng và thả lỏng từng nhóm cơ từ chân lên đầu.\n\n4. **Đi bộ ngắn**: Ra ngoài đi bộ 5-10 phút, tập trung quan sát xung quanh.",
    role: "assistant",
    conversationId: 7,
    createdAt: new Date().toISOString(),
    hasFile: false
  }
]

export default function ChatHistoryPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const chatId = Number(params.chatId);
  const [messages, setMessages] = useState<Message[]>([]);

  const { isLoading } = useSelector((state: RootState) => state.loading);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        dispatch(openLoading());
        const token = getAccessToken();
        if (chatId && token) {
          const response = await getMessages(chatId, token);

          // Map the API response to Message interface format
          const mappedMessages = response.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.sender === "user" ? "user" : "assistant",
            conversationId: msg.conversation_id,
            createdAt: msg.created_at,
            hasFile: Boolean(msg?.has_ocr) || Boolean(msg?.has_images),
          }));

          setMessages(mappedMessages);
        }
      } catch (error) {
        dispatch(
          openAlert({
            isOpen: true,
            title: "Lỗi",
            subtitle: "Có lỗi xảy ra khi lấy thông tin đoạn chat",
            type: "error",
          }),
        );
        // Use example messages when API fails
        // setMessages(exampleMessages);
      } finally {
        dispatch(closeLoading());
      }
    };

    if(chatId) {
      fetchMessages();
    }
  }, [chatId]);

  if (isLoading) {
    return null;
  }

  return <Chat savedMessages={messages} savedFilesId={[]} savedChatId={chatId.toString()} />;
}
