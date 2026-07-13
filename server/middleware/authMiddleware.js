import jwt from 'jsonwebtoken';
import { isUsingMockDb, mockDb } from '../config/db.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      if (isUsingMockDb) {
        // Mock DB lookup — handle '-user' suffix for dual-password super admin
        const isUserMode = decoded.id.endsWith('-user');
        const baseId = isUserMode ? decoded.id.slice(0, -5) : decoded.id;
        const user = mockDb.users.find(u => u.id === baseId);
        if (!user) {
          return res.status(401).json({ message: 'User not found in mock database' });
        }
        // If logged in with user/member password, override role to 'member'
        const effectiveRole = isUserMode ? 'member' : (user.role || 'member');
        // Attach user info (except password)
        req.user = { id: decoded.id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, clubId: user.clubId, role: effectiveRole };
      } else {
        // MongoDB lookup
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
