import React from "react";
import { motion } from "framer-motion";

// Team members data
const teamMembers = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    image: "src/assets/img/aboutus-team1.webp",
  },
  {
    name: "Jane Smith",
    role: "Lead Developer",
    image: "src/assets/img/aboutus-team2.webp",
  },
  {
    name: "Michael Johnson",
    role: "UI/UX Designer",
    image: "src/assets/img/aboutus-team3.jpg",
  },
  {
    name: "Samroy",
    role: "UI/UX Designer",
    image: "src/assets/img/aboutus-team4.jpg",
  },
  {
    name: "SamroyIsMe",
    role: "UI/UX Designer",
    image: "src/assets/img/aboutus-team5.jpg",
  },
];

const AboutUsPage = () => {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Header */}
      <motion.header
        className="bg-black text-white py-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold">Về chúng tôi</h1>
        <p className="text-lg mt-2">
          Tìm hiểu thêm về sứ mệnh và đội ngũ của chúng tôi
        </p>
      </motion.header>

      {/* About Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black mb-4">
              Chúng tôi là ai
            </h2>
            <p className="text-gray-700 text-justify">
              Tại SKYN, chúng tôi tin rằng chăm sóc da không chỉ là một thói
              quen—mà là một hành trình hướng đến làn da khỏe mạnh, rạng rỡ. Sứ
              mệnh của chúng tôi là cung cấp các sản phẩm chăm sóc da chất lượng
              cao, được khoa học chứng minh và lấy cảm hứng từ thiên nhiên giúp
              nuôi dưỡng, bảo vệ và tăng cường vẻ đẹp tự nhiên của bạn. Được
              thành lập với niềm đam mê về vẻ đẹp sạch, chúng tôi lựa chọn cẩn
              thận các thành phần tự nhiên và công thức được bác sĩ da liễu chấp
              thuận để đảm bảo mọi sản phẩm đều nhẹ nhàng, hiệu quả và an toàn
              cho mọi loại da. Từ huyết thanh dưỡng ẩm đến mặt nạ trẻ hóa, chúng
              tôi tạo ra các giải pháp chăm sóc da giúp bạn tự tin vào làn da
              của mình.
              <br></br>Tại SKYN, chúng tôi không chỉ là một thương hiệu—chúng
              tôi là một cộng đồng tôn vinh việc tự chăm sóc, tính bền vững và
              sự tích cực về làn da. Hãy tham gia cùng chúng tôi trên hành trình
              hướng đến làn da rạng rỡ, khỏe mạnh—vì bạn xứng đáng có được điều
              tốt nhất.
            </p>
          </div>
          {/* Image */}
          <motion.div
            className="md:w-1/2 mt-6 md:mt-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="src/assets/img/aboutus-whoarewe.webp"
              alt="Who We Are"
              className="rounded-lg shadow-lg w-full max-w-xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* History Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          {/* Image */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="src/assets/img/aboutus-whywecreate.jpg"
              alt="History"
              className="rounded-lg shadow-lg w-full max-w-xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
          <div className="md:w-1/2 text-center md:text-right">
            <h2 className="text-3xl font-bold text-black mb-4">
              Tại sao chúng tôi được tạo ra
            </h2>
            <p className="text-gray-700 text-justify">
              Quyết định tạo trang web này xuất phát từ sự trân trọng sâu sắc
              đối với lịch sử phong phú và không ngừng phát triển của ngành chăm
              sóc da. Khi ngành công nghiệp làm đẹp tiếp tục phát triển với tốc
              độ chưa từng có, thật dễ dàng để bỏ qua hành trình đáng kinh ngạc
              mà ngành chăm sóc da đã trải qua trong hàng nghìn năm. Từ các nghi
              lễ cổ xưa đến những tiến bộ công nghệ hiện đại, chăm sóc da không
              chỉ là sản phẩm—mà còn là di sản văn hóa, tiến bộ khoa học và chăm
              sóc cá nhân. <br></br> <br></br>
              Chúng tôi tin rằng việc hiểu được lịch sử đằng sau các sản phẩm mà
              chúng ta sử dụng ngày nay cho phép chúng ta đánh giá cao sự khéo
              léo, sự tận tâm, và sự đổi mới đã định hình nên ngành chăm sóc da.
              Trang web này được tạo ra như một không gian dành cho bất kỳ ai
              quan tâm đến việc khám phá nguồn gốc của việc chăm sóc da, các
              phương pháp chữa bệnh cổ xưa đã truyền cảm hứng cho các giải pháp
              hiện đại, và cách các phương pháp chăm sóc da đã thích ứng như thế
              nào để đáp ứng nhu cầu của các thế hệ khác nhau.
              <br></br>
              <br></br>
              Ngoài việc tôn vinh quá khứ, chúng tôi còn hướng đến mục tiêu cung
              cấp nội dung sâu sắc tôn vinh sự đa dạng của việc chăm sóc da giữa
              các nền văn hóa và các giai đoạn thời gian. Bằng cách tìm hiểu
              thêm về lịch sử chăm sóc da, chúng tôi hy vọng trao quyền cho mọi
              người để đưa ra quyết định sáng suốt về thói quen làm đẹp của họ
              và kết nối họ với ý nghĩa sâu sắc hơn của việc tự chăm sóc.
              <br></br>
              <br></br>
              Cho dù bạn là người đam mê chăm sóc da, người yêu thích lịch sử
              hay chỉ đơn giản là tò mò về cách vẻ đẹp và sức khỏe giao thoa,
              trang web này cung cấp một góc nhìn độc đáo và nhiều thông tin.
              Chúng tôi rất vui mừng được chia sẻ quá trình phát triển hấp dẫn
              của chăm sóc da và mời những người khác tham gia vào hành trình!
            </p>
          </div>
        </div>
      </motion.section>
      {/* Vision & Mission Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black mb-4">Tầm nhìn</h2>
            <p className="text-gray-700 text-justify">
              Tại SKYN, tầm nhìn của chúng tôi là cách mạng hóa ngành chăm sóc
              da bằng cách làm cho các sản phẩm làm đẹp sạch, hiệu quả và bền
              vững có thể tiếp cận được với mọi người. Chúng tôi mong muốn trao
              quyền cho mọi người để đón nhận vẻ đẹp tự nhiên của họ, nuôi dưỡng
              sự tự tin và tình yêu bản thân với mỗi sản phẩm họ sử dụng. Chúng
              tôi hình dung một thế giới mà chăm sóc da không chỉ là một thói
              quen mà là một hành trình có ý nghĩa hướng đến làn da khỏe mạnh,
              rạng rỡ—một thế giới mà mọi người đều cảm thấy được trân trọng,
              được chăm sóc và tự tin vào làn da của mình, bất kể tuổi tác, giới
              tính hay xuất thân.
            </p>
            <h2 className="text-3xl font-bold text-black mb-4 mt-6 text-right">
              Nhiệm vụ
            </h2>
            <p className="text-gray-700 text-justify">
              Sứ mệnh của chúng tôi tại SKYN là tạo ra các sản phẩm chăm sóc da
              chất lượng cao, lấy cảm hứng từ thiên nhiên, vừa hiệu quả vừa dịu
              nhẹ cho mọi loại da. Chúng tôi tận tâm kết hợp những gì tốt nhất
              của khoa học và thiên nhiên để cung cấp các công thức nuôi dưỡng,
              bảo vệ và cải thiện làn da của bạn. Với trọng tâm là vẻ đẹp sạch,
              chúng tôi ưu tiên các thành phần tự nhiên, tính bền vững và các
              công thức được bác sĩ da liễu chấp thuận để đảm bảo tiêu chuẩn
              chăm sóc cao nhất. Chúng tôi cam kết biến việc tự chăm sóc bản
              thân thành trải nghiệm tích cực và toàn diện, cung cấp các giải
              pháp chăm sóc da giúp tăng cường sức khỏe, tinh thần và sự tự tin
              cho mọi cá nhân.
              <br />
              <br />
              By fostering a community that values transparency, sustainability,
              and skin positivity, we aim to inspire people to care for their
              skin with the same love and attention they give to their overall
              well-being.
            </p>
          </div>
          {/* Image */}
          <motion.div
            className="md:w-1/2 mt-6 md:mt-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="src/assets/img/aboutus-vision-mission.webp"
              alt="Vision & Mission"
              className="rounded-lg shadow-lg w-full max-w-xl transition-transform duration-500 transform hover:scale-105"
            />
          </motion.div>
        </div>
      </motion.section>
      {/* Slogan Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-[#CBB596] p-8 shadow-xl rounded-lg text-center">
          <p className="text-white text-3xl font-semibold leading-relaxed">
            "Tỏa sáng từ bên trong và tự tin tỏa sáng trong mỗi bước đi"
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUsPage;
