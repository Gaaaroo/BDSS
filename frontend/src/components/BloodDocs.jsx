import BloodDoc from "../components/BloodDoc";

export default function BloodDocs() {
  const bloodType = [
    {
      bloodType: "A+",
      description: "Nhóm máu A dương tính, phổ biến ở Việt Nam.",
      image: "a_plus.jpg",
    },
    {
      bloodType: "A-",
      description: "Nhóm máu A âm tính, hiếm gặp.",
      image: "a_minus.jpg",
    },
    {
      bloodType: "B+",
      description: "Nhóm máu B dương tính, khá phổ biến.",
      image: "b_plus.jpg",
    },
    {
      bloodType: "B-",
      description: "Nhóm máu B âm tính, rất hiếm.",
      image: "b_minus.jpg",
    },
    {
      bloodType: "AB+",
      description: "Nhóm máu AB dương tính, nhận được mọi nhóm máu.",
      image: "ab_plus.jpg",
    },
    {
      bloodType: "AB-",
      description: "Nhóm máu AB âm tính, cực kỳ hiếm.",
      image: "ab_minus.jpg",
    },
    {
      bloodType: "O+",
      description: "Nhóm máu O dương tính, phổ biến nhất.",
      image: "o_plus.jpg",
    },
    {
      bloodType: "O-",
      description: "Nhóm máu O âm tính, cho được mọi nhóm máu.",
      image: "o_minus.jpg",
    },
  ];

  return (
    <div className=" items-center">
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-8">
        {bloodType.map((bloods) => (
          <BloodDoc
            key={bloods.bloodType}
            bloodType={bloods.bloodType}
            image={bloods.image}
            description={bloods.description}
          />
        ))}
      </ul>
    </div>
  );
}
