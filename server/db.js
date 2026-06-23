import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DB_DIR, "users.json");
const BACKUP_FILE = path.join(DB_DIR, "users.backup.json");

let writeQueue = Promise.resolve();

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function assertUsersShape(users) {
  if (!Array.isArray(users)) {
    throw new Error("Users database must be a JSON array");
  }

  for (const user of users) {
    if (!user || typeof user !== "object") {
      throw new Error("Users database contains an invalid user record");
    }
    if (typeof user.id !== "string" || typeof user.email !== "string") {
      throw new Error("Users database contains a user without id/email");
    }
  }
}

async function init() {
  await fs.mkdir(DB_DIR, { recursive: true });
  if (!(await fileExists(DB_FILE))) {
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

async function readUsers() {
  await init();
  const data = await fs.readFile(DB_FILE, "utf-8");
  const users = JSON.parse(data);
  assertUsersShape(users);
  return users;
}

async function writeUsers(users) {
  assertUsersShape(users);
  await init();

  const tempFile = `${DB_FILE}.tmp`;
  try {
    if (await fileExists(DB_FILE)) {
      await fs.copyFile(DB_FILE, BACKUP_FILE);
    }
    await fs.writeFile(tempFile, JSON.stringify(users, null, 2), "utf-8");
    await fs.rename(tempFile, DB_FILE);
  } catch (error) {
    try {
      await fs.unlink(tempFile);
    } catch {}
    throw error;
  }
}

async function withUserWrite(mutator) {
  const run = writeQueue.then(async () => {
    const users = await readUsers();
    const result = await mutator(users);
    await writeUsers(users);
    return result;
  });

  writeQueue = run.catch(() => {});
  return run;
}

function publicUser(user) {
  const { password: _, ...userWithoutPass } = user;
  if (!userWithoutPass.solvedQuestions) {
    userWithoutPass.solvedQuestions = [];
  }
  return userWithoutPass;
}

function normalizePhone(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return `+${digits}`;
  return "";
}

export async function createUser(name, email, password, phone = "") {
  const normalizedEmail = String(email).trim().toLowerCase();
  const displayName = String(name).trim();
  const normalizedPhone = normalizePhone(phone);

  if (!displayName || !normalizedEmail || !password) {
    throw new Error("Name, email, and password are required");
  }

  return withUserWrite(async users => {
    const exists = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      throw new Error("Email already registered with another account");
    }
    if (phone && !normalizedPhone) {
      throw new Error("Please enter a valid mobile number");
    }
    if (normalizedPhone && users.some(u => normalizePhone(u.phone) === normalizedPhone)) {
      throw new Error("Mobile number already registered with another account");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${randomUUID()}`,
      name: displayName,
      email: normalizedEmail,
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
      password: hashedPassword,
      searchCount: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    return publicUser(newUser);
  });
}

export async function getUserByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const users = await readUsers();
  return users.find(u => u.email && u.email.toLowerCase() === normalizedEmail) || null;
}

export async function getUserByPhone(phone) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return null;
  const users = await readUsers();
  return users.find(u => normalizePhone(u.phone) === normalizedPhone) || null;
}

export async function updateUserPassword(userId, password) {
  if (String(password || "").length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  return withUserWrite(async users => {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.password = await bcrypt.hash(String(password), 10);
    user.passwordUpdatedAt = new Date().toISOString();
    return publicUser(user);
  });
}

export async function getUserById(id) {
  const users = await readUsers();
  const user = users.find(u => u.id === id);
  return user ? publicUser(user) : null;
}

export async function incrementSearchCount(userId) {
  return withUserWrite(async users => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.searchCount = (Number.isFinite(user.searchCount) ? user.searchCount : 0) + 1;
    return user.searchCount;
  });
}

export async function getSearchCount(userId) {
  const users = await readUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  return Number.isFinite(user.searchCount) ? user.searchCount : 0;
}

export async function toggleQuestionSolved(userId, questionId) {
  return withUserWrite(async users => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.solvedQuestions) {
      user.solvedQuestions = [];
    }

    // questionId might be passed as a string or number, so let's normalize or check compatibility
    const qId = typeof questionId === "string" ? parseInt(questionId, 10) : questionId;
    const index = user.solvedQuestions.indexOf(qId);
    if (index > -1) {
      user.solvedQuestions.splice(index, 1);
    } else {
      user.solvedQuestions.push(qId);
    }

    return publicUser(user);
  });
}

