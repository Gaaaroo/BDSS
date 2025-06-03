import BloodDoc from "../components/BloodDoc";

export default function BloodDocs() {
  const bloodType = [
    {
      bloodType: "A+",
      description:
        "A positive blood group (A+): About 30% of Vietnam's population. Can receive blood from A+, A-, O+, O-. Can donate to A+, AB+.",
      image: "a_plus.jpg",
      document:
        "A+ blood contains A antigen and the Rh factor (D antigen) on the surface of red blood cells. This is one of the most common blood types in Vietnam and worldwide. People with A+ blood can safely receive blood from A+, A-, O+, and O- donors, but can only donate to A+ and AB+ recipients. The presence of the Rh factor means that A+ individuals cannot receive Rh-negative blood without risk of immune reaction. A+ blood is often needed for surgeries, trauma care, and cancer treatments. Regular donations from A+ individuals help maintain a stable blood supply. In addition to red blood cells, plasma and platelets from A+ donors are also valuable for various medical treatments.",
    },
    {
      bloodType: "A-",
      description:
        "A negative blood group (A-): Rare, only about 0.5% of the population. Can receive blood from A-, O-. Can donate to A-, A+, AB-, AB+.",
      image: "a_minus.jpg",
      document:
        "A- blood lacks the Rh factor, making it compatible only with other Rh-negative blood types. People with A- blood can receive from A- and O- donors, and can donate to all A and AB types regardless of Rh. Due to its rarity, A- blood is especially valuable for patients with the same type, and donors are encouraged to give regularly. In emergencies, O- blood may be used if A- is unavailable. Blood banks often keep a special reserve of A- blood for critical cases. A- blood is also important for women of childbearing age to prevent Rh incompatibility during pregnancy, which can lead to hemolytic disease of the newborn.",
    },
    {
      bloodType: "B+",
      description:
        "B positive blood group (B+): About 23% of the population. Can receive blood from B+, B-, O+, O-. Can donate to B+, AB+.",
      image: "b_plus.jpg",
      document:
        "B+ blood has the B antigen and the Rh factor. It is relatively common and can be transfused to B+ and AB+ recipients. B+ individuals can receive blood from B+, B-, O+, and O- donors. Compatibility checks are essential to prevent transfusion reactions. B+ blood is important for maintaining a balanced blood supply, especially in regions where this type is more prevalent. Donors with B+ blood are encouraged to donate regularly to help meet hospital needs. B+ plasma can be given to any B or AB recipient, making it versatile for plasma transfusions.",
    },
    {
      bloodType: "B-",
      description:
        "B negative blood group (B-): Very rare, about 0.4% of the population. Can receive blood from B-, O-. Can donate to B-, B+, AB-, AB+.",
      image: "b_minus.jpg",
      document:
        "B- blood lacks the Rh factor and is one of the rarest blood types. People with B- blood can receive only from B- and O- donors, and can donate to all B and AB types. Due to its scarcity, B- blood is highly valuable, especially for newborns and patients with rare blood requirements. Blood banks prioritize B- donations for critical and emergency cases. If you have B- blood, your donation can save lives in situations where no other type is compatible. B- is also important for platelet and plasma donations.",
    },
    {
      bloodType: "AB+",
      description:
        "AB positive blood group (AB+): About 6% of the population. Universal recipient. Can donate to AB+.",
      image: "ab_plus.jpg",
      document:
        "AB+ blood has both A and B antigens and the Rh factor, making it the universal recipient for red blood cell transfusions. AB+ individuals can receive blood from any type, but can only donate to other AB+ recipients. This versatility is crucial in emergencies when the patient's blood type is unknown. However, AB+ is relatively rare, so maintaining a supply is important for those who need it. Platelets and plasma from AB+ donors are also valuable for medical treatments. AB+ plasma is considered universal and can be given to any patient, making AB+ donors especially important for plasma donations.",
    },
    {
      bloodType: "AB-",
      description:
        "AB negative blood group (AB-): Extremely rare, less than 0.1% of the population. Can receive blood from AB-, A-, B-, O-. Can donate to AB-, AB+.",
      image: "ab_minus.jpg",
      document:
        "AB- blood is the rarest type, with both A and B antigens but no Rh factor. AB- individuals can receive from all negative blood types (AB-, A-, B-, O-) and can donate to AB- and AB+ recipients. Due to its rarity, AB- blood is in high demand for patients with the same type, especially in emergencies. Blood banks encourage AB- donors to give regularly to ensure availability for those in need. AB- plasma can be transfused to any recipient, making AB- donors valuable for plasma donations as well.",
    },
    {
      bloodType: "O+",
      description:
        "O positive blood group (O+): The most common, about 39% of the population. Can receive blood from O+, O-. Can donate to O+, A+, B+, AB+.",
      image: "o_plus.jpg",
      document:
        "O+ blood does not have A or B antigens but has the Rh factor. It is the most common blood type and can be given to any positive blood type (O+, A+, B+, AB+). O+ individuals can receive from O+ and O- donors. Because of its prevalence, O+ blood is always in high demand for transfusions, trauma care, and surgeries. Regular O+ donors play a vital role in maintaining the blood supply. O+ plasma can be given to O and A recipients, and O+ platelets are also widely used in hospitals.",
    },
    {
      bloodType: "O-",
      description:
        "O negative blood group (O-): Very rare, about 0.1% of the population. Universal donor. Can receive blood from O- only.",
      image: "o_minus.jpg",
      document:
        "O- blood has no A, B, or Rh antigens, making it the universal donor for red blood cell transfusions. O- can be given to anyone, regardless of blood type, which is critical in emergencies when the patient's blood type is unknown. However, O- individuals can only receive from O- donors. Because of its universal compatibility, O- blood is always in high demand, and O- donors are encouraged to donate as often as possible. O- blood is especially important for newborns and trauma patients, and is often the first choice in emergency situations.",
    },
  ];

  return (
    <div className="">
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-8">
        {bloodType.map((bloods) => (
          <BloodDoc
            key={bloods.bloodType}
            bloodType={bloods.bloodType}
            image={bloods.image}
            description={bloods.description}
            document={bloods.document}
          />
        ))}
      </ul>
    </div>
  );
}
