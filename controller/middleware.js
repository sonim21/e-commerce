import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({message: 'Unauthorized: No token provided' });
  }

  const token = authHeader; 

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else
 
if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }

    req.user = user;
    next();
  });
};

export default verifyToken;