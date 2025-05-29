import React from "react";
import { UserLock, UsersRound, UserSearch, Send } from "lucide-react";
const steps = [
  {
    title: "Register or Login",
    description:
      "Sign up for a new account or log in to access your dashboard and start using our services.",
    icon: <UserLock size={60} className=" text-red-700" />,
  },
  {
    title: "Donor's action",
    description:
      "As a donor, provide your information and specify your donation preferences to help those in need.",
    icon: <UsersRound size={60} className=" text-red-700" />,
  },
  {
    title: "Seeker's action",
    description:
      "If you are seeking help, submit your request and share your requirements to connect with donors.",
    icon: <UserSearch size={60} className=" text-red-700" />,
  },
  {
    title: "Donation Process",
    description:
      "Our platform matches donors and seekers, facilitating a smooth and secure donation process.",
    icon: <Send size={60} className=" text-red-700" />,
  },
];

const HowItWorkSection = () => (
  <section className="py-12 bg-white-50 relative">
    <img
      src="https://www.shutterstock.com/image-vector/red-blood-drop-cartoon-character-600nw-2521441917.jpg"
      alt=""
      className="absolute left-0 top-1/4 -translate-y-1/2 w-100 h-120 object-contain opacity-30 pointer-events-none select-none hidden md:block"
      style={{ zIndex: 0 }}
    />
    <img
      src="https://www.shutterstock.com/image-vector/cute-happy-smiling-blood-drop-600nw-1448123303.jpg"
      alt=""
      className="absolute right-0 top-1/2  w-100 h-120 object-contain opacity-30 pointer-events-none select-none hidden md:block"
      style={{ zIndex: 0 }}
    />
    <div className="max-w-3xl mx-auto text-center relative z-10">
      <h2 className="text-5xl font-bold text-red-700 mb-10">How It Works</h2>
      <div className="flex flex-col items-center gap-8">
        {steps.map((step, idx) => {
          const isRight = idx % 2 === 1;
          return (
            <div
              className="relative w-full flex flex-col items-center"
              key={step.title}
            >
              {/* Vertical line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-1/2 top-full w-1 h-15 bg-red-700 z-0 -translate-x-1/2" />
              )}
              <div
                className={`
                  relative z-10
                  w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 flex items-center
                  ${isRight ? "flex-row-reverse self-end" : "self-start"}
                  transition-all
                `}
              >
                <div className={`text-4xl ${isRight ? "ml-10" : "mr-10"}`}>
                  {step.icon}
                </div>
                <div className="flex flex-col items-start text-left">
                  <h3 className="text-3xl font-bold mb-3">{`${idx + 1}. ${
                    step.title
                  }`}</h3>
                  <p className="text-gray-600 text-2xl">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorkSection;
