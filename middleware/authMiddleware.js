import pkg from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET

const { verify } = pkg;
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded mobileNumber from JWT
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
