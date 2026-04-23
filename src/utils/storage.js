const USERS_KEY = 'writespace_users';
const POSTS_KEY = 'writespace_posts';
const SESSION_KEY = 'writespace_session';

const ADMIN_SEED = {
  id: 'u_admin_001',
  username: 'admin',
  displayName: 'Administrator',
  password: 'admin123',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

/**
 * Generate a unique user ID
 * @returns {string}
 */
function genUserId() {
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Generate a unique post ID
 * @returns {string}
 */
function genPostId() {
  return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Safely read and parse JSON from localStorage
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
}

/**
 * Safely write JSON to localStorage
 * @param {string} key
 * @param {*} value
 * @returns {{ success: boolean, error?: string }}
 */
function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch {
    return { success: false, error: 'localStorage unavailable' };
  }
}

/**
 * Ensure the admin seed user exists in localStorage on first load
 */
function ensureAdminSeed() {
  const users = safeRead(USERS_KEY, null);
  if (users === null || !Array.isArray(users)) {
    safeWrite(USERS_KEY, [ADMIN_SEED]);
  } else {
    const adminExists = users.some((u) => u.id === ADMIN_SEED.id || u.username === ADMIN_SEED.username);
    if (!adminExists) {
      users.push(ADMIN_SEED);
      safeWrite(USERS_KEY, users);
    }
  }
}

// Seed admin on module load
ensureAdminSeed();

/**
 * Get all users from localStorage
 * @returns {Array<Object>}
 */
export function getUsers() {
  const users = safeRead(USERS_KEY, []);
  if (!Array.isArray(users)) {
    return [];
  }
  return users;
}

/**
 * Add a new user (registration)
 * @param {{ username: string, displayName: string, password: string, role?: string }} userData
 * @returns {{ success: boolean, user?: Object, error?: string }}
 */
export function addUser({ username, displayName, password, role }) {
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }
  if (!displayName || displayName.length < 2) {
    return { success: false, error: 'Display name must be at least 2 characters' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    return { success: false, error: 'Username already exists' };
  }

  const user = {
    id: genUserId(),
    username,
    displayName,
    password,
    role: role || 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  const writeResult = safeWrite(USERS_KEY, users);
  if (!writeResult.success) {
    return { success: false, error: writeResult.error };
  }

  return { success: true, user };
}

/**
 * Remove a user by ID
 * @param {string} userId
 * @returns {{ success: boolean, error?: string }}
 */
export function removeUser(userId) {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  if (userId === ADMIN_SEED.id) {
    return { success: false, error: 'Cannot delete the default admin account' };
  }

  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, error: 'User not found' };
  }

  if (users[index].username === ADMIN_SEED.username) {
    return { success: false, error: 'Cannot delete the default admin account' };
  }

  users.splice(index, 1);
  const writeResult = safeWrite(USERS_KEY, users);
  if (!writeResult.success) {
    return { success: false, error: writeResult.error };
  }

  return { success: true };
}

/**
 * Get all posts from localStorage
 * @returns {Array<Object>}
 */
export function getPosts() {
  const posts = safeRead(POSTS_KEY, []);
  if (!Array.isArray(posts)) {
    return [];
  }
  return posts;
}

/**
 * Add a new post
 * @param {{ title: string, content: string, authorId: string, authorName: string }} postData
 * @returns {{ success: boolean, post?: Object, error?: string }}
 */
export function addPost({ title, content, authorId, authorName }) {
  if (!title || title.length < 3) {
    return { success: false, error: 'Title must be at least 3 characters' };
  }
  if (!content || content.length < 10) {
    return { success: false, error: 'Content must be at least 10 characters' };
  }
  if (!authorId) {
    return { success: false, error: 'Author ID is required' };
  }
  if (!authorName) {
    return { success: false, error: 'Author name is required' };
  }

  const posts = getPosts();
  const post = {
    id: genPostId(),
    title,
    content,
    createdAt: new Date().toISOString(),
    authorId,
    authorName,
  };

  posts.push(post);
  const writeResult = safeWrite(POSTS_KEY, posts);
  if (!writeResult.success) {
    return { success: false, error: writeResult.error };
  }

  return { success: true, post };
}

/**
 * Update an existing post by ID
 * @param {string} postId
 * @param {{ title?: string, content?: string }} updates
 * @returns {{ success: boolean, post?: Object, error?: string }}
 */
export function updatePost(postId, updates) {
  if (!postId) {
    return { success: false, error: 'Post ID is required' };
  }

  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    return { success: false, error: 'Post not found' };
  }

  if (updates.title !== undefined) {
    if (!updates.title || updates.title.length < 3) {
      return { success: false, error: 'Title must be at least 3 characters' };
    }
    posts[index].title = updates.title;
  }

  if (updates.content !== undefined) {
    if (!updates.content || updates.content.length < 10) {
      return { success: false, error: 'Content must be at least 10 characters' };
    }
    posts[index].content = updates.content;
  }

  const writeResult = safeWrite(POSTS_KEY, posts);
  if (!writeResult.success) {
    return { success: false, error: writeResult.error };
  }

  return { success: true, post: posts[index] };
}

/**
 * Remove a post by ID
 * @param {string} postId
 * @returns {{ success: boolean, error?: string }}
 */
export function removePost(postId) {
  if (!postId) {
    return { success: false, error: 'Post ID is required' };
  }

  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    return { success: false, error: 'Post not found' };
  }

  posts.splice(index, 1);
  const writeResult = safeWrite(POSTS_KEY, posts);
  if (!writeResult.success) {
    return { success: false, error: writeResult.error };
  }

  return { success: true };
}

/**
 * Get the current session from localStorage
 * @returns {Object|null}
 */
export function getSession() {
  const session = safeRead(SESSION_KEY, null);
  if (session && typeof session === 'object' && session.userId) {
    return session;
  }
  return null;
}

/**
 * Set the current session in localStorage
 * @param {{ userId: string, username: string, displayName: string, role: string }} session
 */
export function setSession(session) {
  safeWrite(SESSION_KEY, session);
}

/**
 * Clear the current session from localStorage
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}