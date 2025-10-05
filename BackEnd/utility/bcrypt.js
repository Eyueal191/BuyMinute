import bcrypt from "bcrypt";

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // ✅ correct method
    return hashedPassword;
};

const comparePassword = async (plainPassword, hashedPassword) => {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match; // true or false
};

export {
    hashPassword,
    comparePassword
};