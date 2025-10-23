import React from "react";
import about from "../assets/about.jpeg";
import Title from "../components/Title.jsx";

function About() {
  return (
    <div className="bg-gray-50 py-10">
      {/* About Us Section Title */}
      <div className="max-w-6xl mx-auto px-6 pt-12 mb-4">
        <Title text1="About" text2="Us" addSolidLineAfter={true} />
      </div>

      {/* Hero Section */}
      <section className="flex flex-col sm:flex-row items-stretch gap-8 px-6 py-12 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
        {/* Left: Image */}
        <div className="flex-1">
          <img
            src={about}
            alt="About Buy Minute"
            className="rounded-2xl shadow-lg w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-6 space-y-6">
          {/* Buy Minute Title */}
          <div className="inline-flex items-center space-x-2">
            <span className="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900">
              Buy
            </span>
            <span className="font-bold text-xl sm:text-2xl lg:text-3xl text-blue-500">
              Minute
            </span>
          </div>

          {/* Paragraphs with responsive text */}
          <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
            Buy Minute was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </div>
          <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </div>

          {/* Our Mission Title */}
          <div className="inline-flex items-center space-x-2">
            <span className="font-semibold text-xl sm:text-2xl lg:text-3xl text-gray-900">
              Our
            </span>
            <span className="font-semibold text-xl sm:text-2xl lg:text-3xl text-blue-500">
              Mission
            </span>
          </div>

          {/* Paragraph with responsive text */}
          <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
            Our mission at Buy Minute is to empower customers with choice,
            convenience, and confidence. We're dedicated to providing a seamless
            shopping experience that exceeds expectations, from browsing and
            ordering to delivery and beyond.
          </div>
        </div>
      </section>

      {/* Why Choose Us Section Title */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <Title text1="Why" text2="Choose Us" addSolidLineAfter={true} />
      </div>

      {/* Features Section */}
      <div className="py-12 max-w-6xl mx-auto px-6 flex flex-col sm:flex-row gap-6">
        {/* Quality Assurance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 hover:shadow-xl transition-shadow duration-300">
          <div className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
            Quality Assurance
          </div>
          <div className="text-sm sm:text-base text-gray-700">
            We carefully select and rigorously vet every product to ensure it
            meets the highest standards.
          </div>
        </div>

        {/* Seamless Convenience Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 hover:shadow-xl transition-shadow duration-300">
          <div className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
            Seamless Convenience
          </div>
          <div className="text-sm sm:text-base text-gray-700">
            Enjoy a smooth, user-friendly shopping experience with effortless
            browsing and ordering.
          </div>
        </div>

        {/* Outstanding Customer Service Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 hover:shadow-xl transition-shadow duration-300">
          <div className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
            Outstanding Customer Service
          </div>
          <div className="text-sm sm:text-base text-gray-700">
            Our dedicated team is always ready to assist you, ensuring your
            satisfaction is our top priority.
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;