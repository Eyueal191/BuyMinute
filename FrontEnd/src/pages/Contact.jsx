import React from "react";
import Title from "../components/Title.jsx";
import contact from "../assets/contact.jpg";

function Contact() {
  return (
    <div className="w-full flex flex-col items-center bg-white pb-8">
      {/* Section Title */}
      <section className="py-8 text-center w-full">
        <Title text1="CONTACT" text2="US" addSolidLineAfter={true} />
      </section>

      {/* Contact Info Section */}
      <section className="flex flex-col sm:flex-row w-full max-w-6xl overflow-hidden shadow-lg bg-white">
        {/* Left: Image */}
        <div className="w-full sm:w-1/2">
          <img
            src={contact}
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center bg-white px-6 sm:px-12">
          {/* Store Info */}
          <div className="py-12 space-y-2 text-justify w-full">
            <Title text1="Our" text2="Store" addSolidLineAfter={true} />
            <h2 className="text-gray-700 text-sm md:text-base font-medium">
              Addis Abeba 22
            </h2>
            <h2 className="text-gray-700 text-sm md:text-base font-medium">
              Golagol Building
            </h2>
            <h2 className="text-gray-700 text-sm md:text-base font-medium">
              Tel: 0909040610
            </h2>
            <h2 className="text-gray-700 text-sm md:text-base font-medium">
              Email: eyuealayalew191@gmail.com
            </h2>
          </div>

          {/* Careers Info */}
          <div className="py-12 space-y-2 text-justify w-full">
            <Title text1="Careers at" text2="Buy Minute" addSolidLineAfter={true} />
            <h1 className="text-black text-2xl md:text-3xl font-bold">
              Join Our Team
            </h1>
            <h2 className="text-gray-700 text-sm md:text-base font-medium">
              We’re always looking for passionate individuals to join our team.
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Contact;
