import React from "react";
import Title from "../components/Title.jsx";
import contact from "../assets/contact.jpg";

function Contact() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50 pt-10 pb-20">
      {/* Section Title */}
      <section className="py-8 text-left w-full max-w-6xl mx-auto px-6">
        <Title text1="Contact" text2="Us" addSolidLineAfter={true} />
      </section>

      {/* Main Content Section */}
      <section className="flex flex-col md:flex-row w-full max-w-6xl overflow-hidden shadow-lg bg-white rounded-2xl">
        {/* Left: Image */}
        <div className="w-full md:w-1/2">
          <img
            src={contact}
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-white px-6 sm:px-12 py-12 space-y-12">
          {/* Store Info */}
          <div className="space-y-3 w-full">
            <Title text1="Our" text2="Store" addSolidLineAfter={true} />
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              Addis Abeba 22
            </p>
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              Golagol Building
            </p>
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              Tel: 0909040610
            </p>
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              Email: eyuealayalew191@gmail.com
            </p>
          </div>

          {/* Careers Info */}
          <div className="space-y-3 w-full">
            <Title
              text1="Careers at"
              text2={<span className="text-blue-500">Buy Minute</span>}
              addSolidLineAfter={true}
            />
            <h1 className="text-gray-900 text-xl sm:text-2xl lg:text-3xl font-bold">
              Join Our Team
            </h1>
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              We’re always looking for passionate individuals to join our team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;