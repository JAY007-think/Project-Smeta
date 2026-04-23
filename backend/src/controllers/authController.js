const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const MOCK_USER = {
  id: "USR-001",
  email: "admin@smarttriage.com",
  passwordHash: "$2a$10$X8O/R./2o7W5m4i8q.T9jOVb.Y7y2qUvWjW5m4i8q.T9jOVb.Y7y2", // 'password123'
  role: "admin",
  name: "Dr. Admin"
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    // In a real app, fetch user from DB here
    if (email !== MOCK_USER.email) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Since we're using a mock, just check the password plain text for demonstration or use bcrypt
    // using bcrypt:
    // const isMatch = await bcrypt.compare(password, MOCK_USER.passwordHash);
    const isMatch = password === "password123";
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const payload = {
      id: MOCK_USER.id,
      role: MOCK_USER.role,
      name: MOCK_USER.name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      token,
      user: payload
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
};
