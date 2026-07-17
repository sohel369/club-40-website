import jwt from 'jsonwebtoken';
import { isUsingMockDb, mockDb } from '../db.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

// Helper function to extract user from Next.js Request
export const protect = async (req) => {
  let token;
  const authHeader = req.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (isUsingMockDb) {
        const isUserMode = decoded.id.endsWith('-user');
        const baseId = isUserMode ? decoded.id.slice(0, -5) : decoded.id;
        const user = mockDb.users.find(u => u.id === baseId);
        
        if (!user) {
          return { error: 'User not found in mock database', status: 401 };
        }
        
        const effectiveRole = isUserMode ? 'member' : (user.role || 'member');
        return { user: { id: decoded.id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, clubId: user.clubId, role: effectiveRole } };
      } else {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return { error: 'User not found', status: 401 };
        }
        return { user };
      }
    } catch (error) {
      console.error('Auth Error:', error);
      return { error: 'Not authorized, token failed', status: 401 };
    }
  }

  if (!token) {
    return { error: 'Not authorized, no token', status: 401 };
  }
};
