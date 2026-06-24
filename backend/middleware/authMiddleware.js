const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {

    // ✅ Allow preflight requests to pass
    if (req.method === "OPTIONS") return next();

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};
module.exports = { protect, adminOnly };