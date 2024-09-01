import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const PASSWORD_BASE = 'siriustecho7mqriz9@Vps';

export const encryptPassword = async (password: string) => {
  const iv = randomBytes(16);
  const key = (await promisify(scrypt)(PASSWORD_BASE, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);
  const passwordBuffer = Buffer.from(password);
  const encryptedText = Buffer.concat([
    cipher.update(passwordBuffer),
    cipher.final(),
  ]);

  const passwordCrypto = encryptedText.toString('hex');
  const ivCrypto = iv.toString('hex');

  return {
    password: passwordCrypto,
    iv: ivCrypto,
  };
};

export const comparePassword = async (
  storedPassword: string,
  storedIv: string,
  providedPassword: string,
) => {
  const key = (await promisify(scrypt)(PASSWORD_BASE, 'salt', 32)) as Buffer;
  const encryptedTextBuffer = Buffer.from(storedPassword, 'hex');
  const ivBuffer = Buffer.from(storedIv, 'hex');
  const decipher = createDecipheriv('aes-256-ctr', key, ivBuffer);
  const decryptedText = Buffer.concat([
    decipher.update(encryptedTextBuffer),
    decipher.final(),
  ]);
  return decryptedText.toString() === providedPassword;
};
