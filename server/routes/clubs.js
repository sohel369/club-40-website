import express from 'express';
import { isUsingMockDb, mockDb } from '../config/db.js';
import Club from '../models/Club.js';
import Post from '../models/Post.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Private
router.get('/', async (req, res) => {
  try {
    if (isUsingMockDb) {
      return res.json(mockDb.clubs);
    } else {
      const clubs = await Club.find().sort({ id: 1 });
      return res.json(clubs);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching clubs' });
  }
});

// @desc    Get single club details
// @route   GET /api/clubs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  const clubId = parseInt(req.params.id, 10);

  try {
    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
      return res.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
      return res.json(club);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching club details' });
  }
});

// @desc    Get all posts for a club
// @route   GET /api/clubs/:id/posts
// @access  Public
router.get('/:id/posts', async (req, res) => {
  const clubId = parseInt(req.params.id, 10);

  try {
    if (isUsingMockDb) {
      const posts = mockDb.posts.filter(p => p.clubId === clubId).sort((a, b) => b.createdAt - a.createdAt);
      return res.json(posts);
    } else {
      const posts = await Post.find({ clubId }).sort({ createdAt: -1 });
      return res.json(posts);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching club posts' });
  }
});

// @desc    Create a post for a club (only if the user is a registered member of this club)
// @route   POST /api/clubs/:id/posts
// @access  Private
router.post('/:id/posts', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide a title and content for the post' });
    }

    // Auth check: User can only post to their registered club!
    if (req.user.clubId !== clubId) {
      return res.status(403).json({ message: 'You can only post updates to your registered club!' });
    }

    if (isUsingMockDb) {
      const newPost = {
        id: (mockDb.posts.length + 1).toString(),
        title,
        content,
        clubId,
        authorId: req.user.id || req.user._id,
        authorName: req.user.name,
        createdAt: new Date()
      };
      mockDb.posts.push(newPost);
      return res.status(201).json(newPost);
    } else {
      const post = await Post.create({
        title,
        content,
        clubId,
        authorId: req.user.id || req.user._id,
        authorName: req.user.name
      });
      return res.status(201).json(post);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error creating post' });
  }
});

// @desc    Update (edit) a post
// @route   PUT /api/clubs/:id/posts/:postId
// @access  Private (author or super_admin)
router.put('/:id/posts/:postId', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (isUsingMockDb) {
      const post = mockDb.posts.find(p => (p.id || p._id) === postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const authorId = post.authorId?.toString().replace('-user', '');
      const userId = req.user.id?.toString().replace('-user', '');
      if (req.user.role !== 'super_admin' && authorId !== userId) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      post.title = title.trim();
      post.content = content.trim();
      post.updatedAt = new Date();
      return res.json(post);
    } else {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (req.user.role !== 'super_admin' && post.authorId.toString() !== req.user.id?.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      post.title = title.trim();
      post.content = content.trim();
      post.updatedAt = new Date();
      await post.save();
      return res.json(post);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error updating post' });
  }
});

// @desc    Delete a post
// @route   DELETE /api/clubs/:id/posts/:postId
// @access  Private (author or super_admin)
router.delete('/:id/posts/:postId', protect, async (req, res) => {
  const { postId } = req.params;

  try {
    if (isUsingMockDb) {
      const idx = mockDb.posts.findIndex(p => (p.id || p._id) === postId);
      if (idx === -1) return res.status(404).json({ message: 'Post not found' });

      const post = mockDb.posts[idx];
      const authorId = post.authorId?.toString().replace('-user', '');
      const userId = req.user.id?.toString().replace('-user', '');
      if (req.user.role !== 'super_admin' && authorId !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      mockDb.posts.splice(idx, 1);
      return res.json({ message: 'Post deleted successfully' });
    } else {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (req.user.role !== 'super_admin' && post.authorId.toString() !== req.user.id?.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      await Post.deleteOne({ _id: postId });
      return res.json({ message: 'Post deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error deleting post' });
  }
});

// @desc    Get all chat messages for a club
// @route   GET /api/clubs/:id/messages
// @access  Private
router.get('/:id/messages', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  try {
    if (isUsingMockDb) {
      if (!mockDb.messages) mockDb.messages = [];
      const msgs = mockDb.messages.filter(m => m.clubId === clubId).sort((a, b) => a.createdAt - b.createdAt);
      return res.json(msgs);
    } else {
      const msgs = await Message.find({ clubId }).sort({ createdAt: 1 });
      return res.json(msgs);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching chat messages' });
  }
});

// @desc    Post a new chat message inside a club chat room (only members/super-admins)
// @route   POST /api/clubs/:id/messages
// @access  Private
router.post('/:id/messages', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  const { content } = req.body;

  try {
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Auth check: Must be a member of the club, or a super admin
    if (req.user.role !== 'super_admin' && req.user.clubId !== clubId) {
      return res.status(403).json({ message: 'You can only message in your own club chat room!' });
    }

    if (isUsingMockDb) {
      if (!mockDb.messages) mockDb.messages = [];
      const newMsg = {
        id: (mockDb.messages.length + 1).toString(),
        content,
        clubId,
        senderId: req.user.id || req.user._id,
        senderName: req.user.name,
        createdAt: new Date()
      };
      mockDb.messages.push(newMsg);
      return res.status(201).json(newMsg);
    } else {
      const msg = await Message.create({
        content,
        clubId,
        senderId: req.user.id || req.user._id,
        senderName: req.user.name
      });
      return res.status(201).json(msg);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error posting message' });
  }
});

// @desc    Get members and admins for a specific club
// @route   GET /api/clubs/:id/members
// @access  Private
router.get('/:id/members', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  try {
    if (isUsingMockDb) {
      const clubUsers = mockDb.users.filter(u => u.clubId === clubId);
      const admins = clubUsers.filter(u => u.role === 'club_admin').map(u => ({ id: u.id, name: u.name, email: u.email }));
      const members = clubUsers.filter(u => u.role === 'member').map(u => ({ id: u.id, name: u.name, email: u.email }));
      return res.json({ admins, members });
    } else {
      const clubUsers = await User.find({ clubId }).select('name email role');
      const admins = clubUsers.filter(u => u.role === 'club_admin').map(u => ({ id: u._id, name: u.name, email: u.email }));
      const members = clubUsers.filter(u => u.role === 'member').map(u => ({ id: u._id, name: u.name, email: u.email }));
      return res.json({ admins, members });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching members' });
  }
});

// @desc    Update club details (Super Admin only - NAME IS EXCLUDED from here!)
// @route   PUT /api/clubs/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  const { category, shortDescription, longDescription, location, email, phone } = req.body;

  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admins can manage club information!' });
    }

    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return res.status(404).json({ message: 'Club not found' });
      
      if (category) club.category = category;
      if (shortDescription) {
        club.shortDescription = typeof shortDescription === 'object' ? shortDescription : { bn: shortDescription, en: shortDescription };
      }
      if (longDescription) {
        club.longDescription = typeof longDescription === 'object' ? longDescription : { bn: longDescription, en: longDescription };
      }
      if (location) {
        club.location = typeof location === 'object' ? location : { bn: location, en: location };
      }
      if (email) club.email = email;
      if (phone) {
        club.phone = typeof phone === 'object' ? phone : { bn: phone, en: phone };
      }

      return res.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return res.status(404).json({ message: 'Club not found' });

      if (category) club.category = category;
      if (shortDescription) {
        club.shortDescription = typeof shortDescription === 'object' ? shortDescription : { bn: shortDescription, en: shortDescription };
      }
      if (longDescription) {
        club.longDescription = typeof longDescription === 'object' ? longDescription : { bn: longDescription, en: longDescription };
      }
      if (location) {
        club.location = typeof location === 'object' ? location : { bn: location, en: location };
      }
      if (email) club.email = email;
      if (phone) {
        club.phone = typeof phone === 'object' ? phone : { bn: phone, en: phone };
      }

      await club.save();
      return res.json(club);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error updating club details' });
  }
});

// @desc    Submit a request to change club name (Club Admin of this club only)
// @route   POST /api/clubs/:id/request-name-change
// @access  Private
router.post('/:id/request-name-change', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  const { requestedName } = req.body;

  try {
    if (req.user.role !== 'club_admin' || req.user.clubId !== clubId) {
      return res.status(403).json({ message: 'Only the Club Admin of this club can request a name change!' });
    }

    if (!requestedName || !requestedName.en || !requestedName.bn) {
      return res.status(400).json({ message: 'Requested name in English and Bangla is required' });
    }

    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return res.status(404).json({ message: 'Club not found' });

      club.nameChangeRequest = {
        requestedName: { en: requestedName.en.trim(), bn: requestedName.bn.trim() },
        status: 'pending',
        requestedBy: req.user.id || req.user._id,
        createdAt: new Date()
      };

      return res.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return res.status(404).json({ message: 'Club not found' });

      club.nameChangeRequest = {
        requestedName: { en: requestedName.en.trim(), bn: requestedName.bn.trim() },
        status: 'pending',
        requestedBy: req.user.id || req.user._id,
        createdAt: new Date()
      };

      await club.save();
      return res.json(club);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error requesting name change' });
  }
});

// @desc    Approve club name change (Super Admin only)
// @route   POST /api/clubs/:id/approve-name-change
// @access  Private
router.post('/:id/approve-name-change', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);

  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admins can approve club name changes!' });
    }

    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return res.status(404).json({ message: 'Club not found' });

      if (!club.nameChangeRequest || club.nameChangeRequest.status !== 'pending') {
        return res.status(400).json({ message: 'No pending name change request for this club!' });
      }

      // Update club name
      club.name = {
        en: club.nameChangeRequest.requestedName.en,
        bn: club.nameChangeRequest.requestedName.bn
      };

      // Reset nameChangeRequest
      club.nameChangeRequest = {
        requestedName: { en: '', bn: '' },
        status: 'none',
        requestedBy: '',
        createdAt: null
      };

      return res.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return res.status(404).json({ message: 'Club not found' });

      if (!club.nameChangeRequest || club.nameChangeRequest.status !== 'pending') {
        return res.status(400).json({ message: 'No pending name change request for this club!' });
      }

      club.name = {
        en: club.nameChangeRequest.requestedName.en,
        bn: club.nameChangeRequest.requestedName.bn
      };

      club.nameChangeRequest = {
        requestedName: { en: '', bn: '' },
        status: 'none',
        requestedBy: '',
        createdAt: null
      };

      await club.save();
      return res.json(club);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error approving name change' });
  }
});

// @desc    Reject club name change (Super Admin only)
// @route   POST /api/clubs/:id/reject-name-change
// @access  Private
router.post('/:id/reject-name-change', protect, async (req, res) => {
  const clubId = parseInt(req.params.id, 10);

  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admins can reject club name changes!' });
    }

    if (isUsingMockDb) {
      const club = mockDb.clubs.find(c => c.id === clubId);
      if (!club) return res.status(404).json({ message: 'Club not found' });

      if (!club.nameChangeRequest || club.nameChangeRequest.status !== 'pending') {
        return res.status(400).json({ message: 'No pending name change request for this club!' });
      }

      club.nameChangeRequest = {
        requestedName: { en: '', bn: '' },
        status: 'none',
        requestedBy: '',
        createdAt: null
      };

      return res.json(club);
    } else {
      const club = await Club.findOne({ id: clubId });
      if (!club) return res.status(404).json({ message: 'Club not found' });

      if (!club.nameChangeRequest || club.nameChangeRequest.status !== 'pending') {
        return res.status(400).json({ message: 'No pending name change request for this club!' });
      }

      club.nameChangeRequest = {
        requestedName: { en: '', bn: '' },
        status: 'none',
        requestedBy: '',
        createdAt: null
      };

      await club.save();
      return res.json(club);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error rejecting name change' });
  }
});

export default router;
