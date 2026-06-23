import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, readFileSync } from "fs";
import { MongoClient } from "mongodb";
import { createHash, randomInt, randomUUID } from "crypto";
import { createUser, getUserByEmail, getUserByPhone, getUserById, incrementSearchCount, updateUserPassword, toggleQuestionSolved } from "./db.js";

function loadLocalEnvironment() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnvironment();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "careerforge_jwt_secret_key_13579_auth";
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigin = process.env.CORS_ORIGIN || true;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../dist");
const resetRequests = new Map();
const RESET_CODE_TTL_MS = 10 * 60 * 1000;

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "careerforge-api" });
});

// Optional authentication middleware (supports guest & logged-in user routing)
const resolveUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null; // invalid token, treat as guest or allow route to fail if strict
    } else {
      req.user = decoded;
    }
    next();
  });
};

// Strict authentication middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. Sign in required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired session. Please sign in again." });
    }
    req.user = decoded;
    next();
  });
};

// --- Auth Endpoints ---

const hashResetCode = code => createHash("sha256").update(String(code)).digest("hex");

async function deliverResetCode(method, destination, code) {
  const webhook = method === "sms" ? process.env.RESET_SMS_WEBHOOK : process.env.RESET_EMAIL_WEBHOOK;
  const message = `Your CareerForge AI verification code is ${code}. It expires in 10 minutes.`;

  if (webhook) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: destination,
        code,
        subject: "CareerForge AI password reset",
        message
      })
    });
    if (!response.ok) throw new Error(`The ${method} delivery service rejected the request`);
    return;
  }

  if (method === "email" && process.env.RESEND_API_KEY && process.env.RESET_FROM_EMAIL) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.RESET_FROM_EMAIL,
        to: [destination],
        subject: "CareerForge AI password reset",
        text: message,
        html: `<div style="font-family:Arial,sans-serif;color:#0f172a"><h2>Reset your CareerForge AI password</h2><p>Your verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:8px;color:#2563eb">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`
      })
    });
    if (!response.ok) {
      const details = await response.json().catch(() => ({}));
      throw new Error(details.message || "Email delivery was rejected by Resend");
    }
    return;
  }

  if (
    method === "sms" &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  ) {
    const body = new URLSearchParams({ To: destination, From: process.env.TWILIO_FROM_NUMBER, Body: message });
    const credentials = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      }
    );
    if (!response.ok) {
      const details = await response.json().catch(() => ({}));
      throw new Error(details.message || "SMS delivery was rejected by Twilio");
    }
    return;
  }

  throw new Error(
    method === "sms"
      ? "SMS delivery is not configured. Add Twilio credentials to the server .env file."
      : "Email delivery is not configured. Add Resend credentials to the server .env file."
  );
}

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, phone } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const user = await createUser(String(name), String(email), String(password), phone ? String(phone) : "");
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({
      message: "Signup successful",
      token,
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const method = String(req.body?.method || "").toLowerCase();
  const identifier = String(req.body?.identifier || "").trim();

  if (!['email', 'sms'].includes(method) || !identifier) {
    return res.status(400).json({ message: "Choose email or SMS and enter your account details" });
  }

  try {
    const user = method === "sms" ? await getUserByPhone(identifier) : await getUserByEmail(identifier);
    if (!user) {
      return res.status(404).json({
        message: method === "sms"
          ? "No account is linked to that mobile number. Try email recovery instead."
          : "No account was found with that email address."
      });
    }

    const code = String(randomInt(100000, 1000000));
    const requestId = randomUUID();
    await deliverResetCode(method, method === "sms" ? user.phone : user.email, code);
    resetRequests.set(requestId, {
      userId: user.id,
      codeHash: hashResetCode(code),
      expiresAt: Date.now() + RESET_CODE_TTL_MS,
      attempts: 0
    });

    res.json({
      requestId,
      message: `Verification code sent by ${method === "sms" ? "SMS" : "email"}`
    });
  } catch (error) {
    res.status(503).json({ message: error.message || "Unable to send the verification code" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const requestId = String(req.body?.requestId || "");
  const code = String(req.body?.code || "").trim();
  const password = String(req.body?.password || "");
  const reset = resetRequests.get(requestId);

  if (!reset || reset.expiresAt < Date.now()) {
    resetRequests.delete(requestId);
    return res.status(400).json({ message: "This verification code has expired. Request a new one." });
  }
  if (reset.attempts >= 5) {
    resetRequests.delete(requestId);
    return res.status(429).json({ message: "Too many incorrect attempts. Request a new code." });
  }
  if (hashResetCode(code) !== reset.codeHash) {
    reset.attempts += 1;
    return res.status(400).json({ message: "The verification code is incorrect" });
  }

  try {
    await updateUserPassword(reset.userId, password);
    resetRequests.delete(requestId);
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: error.message || "Unable to reset password" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    
    // Remove password hash from response
    const { password: _, ...userWithoutPass } = user;

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPass
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error retrieving user data" });
  }
});

app.post("/api/user/progress/toggle", requireAuth, async (req, res) => {
  const { questionId } = req.body || {};
  if (questionId === undefined) {
    return res.status(400).json({ message: "questionId is required" });
  }

  try {
    const updatedUser = await toggleQuestionSolved(req.user.id, questionId);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error toggling question status" });
  }
});

// --- MongoDB Configuration ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const mongoClient = new MongoClient(MONGO_URI);
let dbConnection = null;

async function getCollegesCollection() {
  if (!dbConnection) {
    await mongoClient.connect();
    dbConnection = mongoClient.db("collegehub");
  }
  return dbConnection.collection("colleges");
}

async function getQuestionsCollection(setNum = 1) {
  if (!dbConnection) {
    await mongoClient.connect();
    dbConnection = mongoClient.db("collegehub");
  }

  const parsedSet = Number(setNum);
  const collectionName = Number.isInteger(parsedSet) && parsedSet >= 1 && parsedSet <= 5
    ? `questions_set${parsedSet}`
    : "questions_set1";

  return dbConnection.collection(collectionName);
}

async function getAllCodingQuestions() {
  if (!dbConnection) {
    await mongoClient.connect();
    dbConnection = mongoClient.db("collegehub");
  }

  const questions = [];
  for (let setIndex = 1; setIndex <= 5; setIndex += 1) {
    const collection = dbConnection.collection(`questions_set${setIndex}`);
    const docs = await collection.find({}).toArray();
    if (Array.isArray(docs)) {
      questions.push(...docs);
    }
  }

  return questions;
}

// --- Colleges Endpoint ---
app.get("/api/colleges", async (req, res) => {
  try {
    const collection = await getCollegesCollection();
    const colleges = await collection.find({}).toArray();
    res.json(colleges);
  } catch (error) {
    console.error("Error retrieving colleges:", error);
    res.status(500).json({ message: "Error retrieving colleges from database" });
  }
});

// --- Coding Questions Endpoint ---
app.get("/api/coding/questions", async (req, res) => {
  try {
    const requestedSet = req.query.set ? String(req.query.set) : "1";
    const collection = await getQuestionsCollection(requestedSet);
    const questions = await collection.find({}).toArray();
    res.json(questions);
  } catch (error) {
    console.error("Error retrieving coding questions:", error);
    res.status(500).json({ message: "Error retrieving coding questions from database" });
  }
});

app.get("/api/testing/daily", async (req, res) => {
  try {
    const allQuestions = await getAllCodingQuestions();
    const totalQuestions = allQuestions.length;

    if (totalQuestions === 0) {
      return res.status(404).json({ message: "No coding questions are available in any set." });
    }

    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const startIndex = (dayIndex * 2) % totalQuestions;
    const selected = [];

    for (let offset = 0; offset < 2; offset += 1) {
      selected.push(allQuestions[(startIndex + offset) % totalQuestions]);
    }

    const test = {
      id: "daily-coding-challenge",
      title: "Daily Coding Challenge Assessment",
      desc: "Solve two curated coding problems from across all practice sets. Refresh daily for a new selection.",
      duration: 300,
      difficulty: "Medium",
      questions: selected.map((question, questionIndex) => ({
        id: question.id ?? `daily-${questionIndex}`,
        question: question.title || question.question || "Coding challenge prompt",
        options: question.options && Array.isArray(question.options) && question.options.length > 0
          ? question.options
          : [
              "Analyze the prompt and design an algorithm",
              "Write test cases for the input range",
              "Implement the solution in code",
              "Optimize for time and space complexity"
            ],
        correct: 0,
        explanation: `Topic: ${question.topic || "General"}. Difficulty: ${question.diff || "Medium"}.`
      }))
    };

    res.json(test);
  } catch (error) {
    console.error("Error generating daily testing challenge:", error);
    res.status(500).json({ message: "Error generating daily testing challenge" });
  }
});

// --- Search Endpoint ---

app.post("/api/college/search", resolveUser, async (req, res) => {
  if (req.user) {
    // Authenticated user: unlimited searches, logged to DB
    try {
      const updatedCount = await incrementSearchCount(req.user.id);
      res.json({
        success: true,
        authenticated: true,
        searchCount: updatedCount,
        limitReached: false
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating search count" });
    }
  } else {
    
    const rawGuestCount = Number(req.body?.guestCount || 0);
    const guestCount = Number.isFinite(rawGuestCount) ? Math.min(3, Math.max(0, rawGuestCount)) : 0;
    if (guestCount >= 5) {
      return res.status(403).json({
        success: false,
        authenticated: false,
        limitReached: true,
        message: "Trial limit reached. Sign in to unlock unlimited searches!"
      });
    }

    res.json({
      success: true,
      authenticated: false,
      searchCount: guestCount + 1,
      limitReached: false
    });
  }
});

if (isProduction) {
  app.use(express.static(clientDistPath));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
