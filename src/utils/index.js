import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

export const passwordValidation = async (password, hash) =>
  bcrypt.compare(password, hash);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
