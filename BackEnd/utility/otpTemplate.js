// otpTemplate.js
const otpTemplate = (otp, url) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p style="font-size: 16px; color: #555;">
        Use the following verification code to complete your signup:
      </p>
      <div style="
        display: inline-block;
        background-color: #f0f0f0;
        padding: 15px 25px;
        margin: 20px 0;
        font-size: 24px;
        font-weight: bold;
        color: #000;
        border-radius: 8px;
        letter-spacing: 4px;
      ">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #999;">
        <a href="${url}" style="color: #1a73e8; text-decoration: none;">
          Click here to verify your email
        </a>
      </p>
    </div>
  `;
};
export default otpTemplate;