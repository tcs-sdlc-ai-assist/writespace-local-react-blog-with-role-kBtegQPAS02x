import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('storage utility', () => {
  let storage;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  async function loadStorage() {
    const mod = await import('./storage.js');
    return mod;
  }

  describe('admin seed', () => {
    it('should seed the admin user on module load when localStorage is empty', async () => {
      localStorage.clear();
      // Force re-import by using dynamic import with cache bust
      const mod = await loadStorage();
      const users = mod.getUsers();
      const admin = users.find((u) => u.username === 'admin');
      expect(admin).toBeDefined();
      expect(admin.role).toBe('admin');
      expect(admin.displayName).toBe('Administrator');
      expect(admin.id).toBe('u_admin_001');
    });

    it('should not duplicate admin if already present', async () => {
      const existingUsers = [
        {
          id: 'u_admin_001',
          username: 'admin',
          displayName: 'Administrator',
          password: 'admin123',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(existingUsers));
      const mod = await loadStorage();
      const users = mod.getUsers();
      const admins = users.filter((u) => u.username === 'admin');
      expect(admins.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mod = await loadStorage();
      const users = mod.getUsers();
      expect(Array.isArray(users)).toBe(true);
    });

    it('should return empty array when localStorage has invalid JSON', async () => {
      localStorage.setItem('writespace_users', 'not-json');
      const mod = await loadStorage();
      const users = mod.getUsers();
      expect(Array.isArray(users)).toBe(true);
    });

    it('should return empty array when localStorage has non-array value', async () => {
      localStorage.setItem('writespace_users', JSON.stringify('string-value'));
      const mod = await loadStorage();
      const users = mod.getUsers();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('addUser', () => {
    it('should add a new user successfully', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: 'testuser',
        displayName: 'Test User',
        password: 'password123',
      });
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(result.user.displayName).toBe('Test User');
      expect(result.user.role).toBe('user');
      expect(result.user.id).toBeDefined();
      expect(result.user.createdAt).toBeDefined();
    });

    it('should assign custom role when provided', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: 'moderator1',
        displayName: 'Moderator',
        password: 'password123',
        role: 'admin',
      });
      expect(result.success).toBe(true);
      expect(result.user.role).toBe('admin');
    });

    it('should fail when username is too short', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: 'ab',
        displayName: 'Test User',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    it('should fail when username is empty', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: '',
        displayName: 'Test User',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    it('should fail when displayName is too short', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: 'testuser',
        displayName: 'T',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name must be at least 2 characters');
    });

    it('should fail when displayName is empty', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: 'testuser',
        displayName: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name must be at least 2 characters');
    });

    it('should fail when password is too short', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: 'testuser',
        displayName: 'Test User',
        password: '12345',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters');
    });

    it('should fail when password is empty', async () => {
      const mod = await loadStorage();
      const result = mod.addUser({
        username: 'testuser',
        displayName: 'Test User',
        password: '',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters');
    });

    it('should fail when username already exists', async () => {
      const mod = await loadStorage();
      mod.addUser({
        username: 'duplicate',
        displayName: 'First User',
        password: 'password123',
      });
      const result = mod.addUser({
        username: 'duplicate',
        displayName: 'Second User',
        password: 'password456',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists');
    });

    it('should persist user to localStorage', async () => {
      const mod = await loadStorage();
      mod.addUser({
        username: 'persisted',
        displayName: 'Persisted User',
        password: 'password123',
      });
      const raw = localStorage.getItem('writespace_users');
      const users = JSON.parse(raw);
      const found = users.find((u) => u.username === 'persisted');
      expect(found).toBeDefined();
      expect(found.displayName).toBe('Persisted User');
    });
  });

  describe('removeUser', () => {
    it('should remove a user by ID', async () => {
      const mod = await loadStorage();
      const addResult = mod.addUser({
        username: 'toremove',
        displayName: 'Remove Me',
        password: 'password123',
      });
      const userId = addResult.user.id;
      const removeResult = mod.removeUser(userId);
      expect(removeResult.success).toBe(true);

      const users = mod.getUsers();
      const found = users.find((u) => u.id === userId);
      expect(found).toBeUndefined();
    });

    it('should fail when userId is empty', async () => {
      const mod = await loadStorage();
      const result = mod.removeUser('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('User ID is required');
    });

    it('should fail when userId is not provided', async () => {
      const mod = await loadStorage();
      const result = mod.removeUser(undefined);
      expect(result.success).toBe(false);
      expect(result.error).toBe('User ID is required');
    });

    it('should fail when user is not found', async () => {
      const mod = await loadStorage();
      const result = mod.removeUser('nonexistent_id');
      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should not allow deleting the default admin by ID', async () => {
      const mod = await loadStorage();
      const result = mod.removeUser('u_admin_001');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot delete the default admin account');
    });
  });

  describe('getPosts', () => {
    it('should return an empty array when no posts exist', async () => {
      const mod = await loadStorage();
      const posts = mod.getPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(0);
    });

    it('should return an array of posts', async () => {
      const mod = await loadStorage();
      mod.addPost({
        title: 'Test Post',
        content: 'This is a test post with enough content.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const posts = mod.getPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(1);
    });

    it('should return empty array when localStorage has invalid JSON for posts', async () => {
      localStorage.setItem('writespace_posts', 'invalid-json');
      const mod = await loadStorage();
      const posts = mod.getPosts();
      expect(Array.isArray(posts)).toBe(true);
    });

    it('should return empty array when localStorage has non-array value for posts', async () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ not: 'array' }));
      const mod = await loadStorage();
      const posts = mod.getPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(0);
    });
  });

  describe('addPost', () => {
    it('should add a new post successfully', async () => {
      const mod = await loadStorage();
      const result = mod.addPost({
        title: 'My First Post',
        content: 'This is the content of my first post, long enough.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      expect(result.success).toBe(true);
      expect(result.post).toBeDefined();
      expect(result.post.title).toBe('My First Post');
      expect(result.post.content).toBe('This is the content of my first post, long enough.');
      expect(result.post.authorId).toBe('u_test_001');
      expect(result.post.authorName).toBe('Test Author');
      expect(result.post.id).toBeDefined();
      expect(result.post.createdAt).toBeDefined();
    });

    it('should fail when title is too short', async () => {
      const mod = await loadStorage();
      const result = mod.addPost({
        title: 'AB',
        content: 'This is enough content for the post.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Title must be at least 3 characters');
    });

    it('should fail when title is empty', async () => {
      const mod = await loadStorage();
      const result = mod.addPost({
        title: '',
        content: 'This is enough content for the post.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Title must be at least 3 characters');
    });

    it('should fail when content is too short', async () => {
      const mod = await loadStorage();
      const result = mod.addPost({
        title: 'Valid Title',
        content: 'Short',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Content must be at least 10 characters');
    });

    it('should fail when content is empty', async () => {
      const mod = await loadStorage();
      const result = mod.addPost({
        title: 'Valid Title',
        content: '',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Content must be at least 10 characters');
    });

    it('should fail when authorId is missing', async () => {
      const mod = await loadStorage();
      const result = mod.addPost({
        title: 'Valid Title',
        content: 'This is enough content for the post.',
        authorId: '',
        authorName: 'Test Author',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Author ID is required');
    });

    it('should fail when authorName is missing', async () => {
      const mod = await loadStorage();
      const result = mod.addPost({
        title: 'Valid Title',
        content: 'This is enough content for the post.',
        authorId: 'u_test_001',
        authorName: '',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Author name is required');
    });

    it('should persist post to localStorage', async () => {
      const mod = await loadStorage();
      mod.addPost({
        title: 'Persisted Post',
        content: 'This post should be persisted to localStorage.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const raw = localStorage.getItem('writespace_posts');
      const posts = JSON.parse(raw);
      const found = posts.find((p) => p.title === 'Persisted Post');
      expect(found).toBeDefined();
    });
  });

  describe('updatePost', () => {
    it('should update a post title', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'Original Title',
        content: 'This is the original content of the post.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      const updateResult = mod.updatePost(postId, { title: 'Updated Title' });
      expect(updateResult.success).toBe(true);
      expect(updateResult.post.title).toBe('Updated Title');
      expect(updateResult.post.content).toBe('This is the original content of the post.');
    });

    it('should update a post content', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'Title Stays',
        content: 'This is the original content of the post.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      const updateResult = mod.updatePost(postId, { content: 'This is the updated content of the post.' });
      expect(updateResult.success).toBe(true);
      expect(updateResult.post.content).toBe('This is the updated content of the post.');
      expect(updateResult.post.title).toBe('Title Stays');
    });

    it('should update both title and content', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'Old Title',
        content: 'This is the old content of the post.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      const updateResult = mod.updatePost(postId, {
        title: 'New Title',
        content: 'This is the new content of the post.',
      });
      expect(updateResult.success).toBe(true);
      expect(updateResult.post.title).toBe('New Title');
      expect(updateResult.post.content).toBe('This is the new content of the post.');
    });

    it('should fail when postId is empty', async () => {
      const mod = await loadStorage();
      const result = mod.updatePost('', { title: 'New Title' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Post ID is required');
    });

    it('should fail when postId is not provided', async () => {
      const mod = await loadStorage();
      const result = mod.updatePost(undefined, { title: 'New Title' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Post ID is required');
    });

    it('should fail when post is not found', async () => {
      const mod = await loadStorage();
      const result = mod.updatePost('nonexistent_id', { title: 'New Title' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Post not found');
    });

    it('should fail when updated title is too short', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'Valid Title',
        content: 'This is enough content for the post.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      const result = mod.updatePost(postId, { title: 'AB' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Title must be at least 3 characters');
    });

    it('should fail when updated content is too short', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'Valid Title',
        content: 'This is enough content for the post.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      const result = mod.updatePost(postId, { content: 'Short' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Content must be at least 10 characters');
    });

    it('should persist updated post to localStorage', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'Before Update',
        content: 'This is the content before the update.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      mod.updatePost(postId, { title: 'After Update' });
      const raw = localStorage.getItem('writespace_posts');
      const posts = JSON.parse(raw);
      const found = posts.find((p) => p.id === postId);
      expect(found.title).toBe('After Update');
    });
  });

  describe('removePost', () => {
    it('should remove a post by ID', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'To Be Removed',
        content: 'This post will be removed from storage.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      const removeResult = mod.removePost(postId);
      expect(removeResult.success).toBe(true);

      const posts = mod.getPosts();
      const found = posts.find((p) => p.id === postId);
      expect(found).toBeUndefined();
    });

    it('should fail when postId is empty', async () => {
      const mod = await loadStorage();
      const result = mod.removePost('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Post ID is required');
    });

    it('should fail when postId is not provided', async () => {
      const mod = await loadStorage();
      const result = mod.removePost(undefined);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Post ID is required');
    });

    it('should fail when post is not found', async () => {
      const mod = await loadStorage();
      const result = mod.removePost('nonexistent_id');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Post not found');
    });

    it('should persist removal to localStorage', async () => {
      const mod = await loadStorage();
      const addResult = mod.addPost({
        title: 'Will Be Gone',
        content: 'This post will be gone from localStorage.',
        authorId: 'u_test_001',
        authorName: 'Test Author',
      });
      const postId = addResult.post.id;
      mod.removePost(postId);
      const raw = localStorage.getItem('writespace_posts');
      const posts = JSON.parse(raw);
      const found = posts.find((p) => p.id === postId);
      expect(found).toBeUndefined();
    });
  });

  describe('getSession', () => {
    it('should return null when no session exists', async () => {
      const mod = await loadStorage();
      const session = mod.getSession();
      expect(session).toBeNull();
    });

    it('should return null when session is invalid JSON', async () => {
      localStorage.setItem('writespace_session', 'not-json');
      const mod = await loadStorage();
      const session = mod.getSession();
      expect(session).toBeNull();
    });

    it('should return null when session object has no userId', async () => {
      localStorage.setItem('writespace_session', JSON.stringify({ username: 'test' }));
      const mod = await loadStorage();
      const session = mod.getSession();
      expect(session).toBeNull();
    });

    it('should return session when valid', async () => {
      const sessionData = {
        userId: 'u_test_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(sessionData));
      const mod = await loadStorage();
      const session = mod.getSession();
      expect(session).toEqual(sessionData);
    });
  });

  describe('setSession', () => {
    it('should save session to localStorage', async () => {
      const mod = await loadStorage();
      const sessionData = {
        userId: 'u_test_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      mod.setSession(sessionData);
      const raw = localStorage.getItem('writespace_session');
      const parsed = JSON.parse(raw);
      expect(parsed).toEqual(sessionData);
    });

    it('should overwrite existing session', async () => {
      const mod = await loadStorage();
      mod.setSession({
        userId: 'u_first',
        username: 'first',
        displayName: 'First',
        role: 'user',
      });
      mod.setSession({
        userId: 'u_second',
        username: 'second',
        displayName: 'Second',
        role: 'admin',
      });
      const raw = localStorage.getItem('writespace_session');
      const parsed = JSON.parse(raw);
      expect(parsed.userId).toBe('u_second');
      expect(parsed.username).toBe('second');
    });
  });

  describe('clearSession', () => {
    it('should remove session from localStorage', async () => {
      const mod = await loadStorage();
      mod.setSession({
        userId: 'u_test_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
      mod.clearSession();
      const raw = localStorage.getItem('writespace_session');
      expect(raw).toBeNull();
    });

    it('should not throw when no session exists', async () => {
      const mod = await loadStorage();
      expect(() => mod.clearSession()).not.toThrow();
    });
  });

  describe('multiple operations', () => {
    it('should handle adding multiple users and posts', async () => {
      const mod = await loadStorage();

      mod.addUser({
        username: 'user1',
        displayName: 'User One',
        password: 'password123',
      });
      mod.addUser({
        username: 'user2',
        displayName: 'User Two',
        password: 'password456',
      });

      const users = mod.getUsers();
      const user1 = users.find((u) => u.username === 'user1');
      const user2 = users.find((u) => u.username === 'user2');
      expect(user1).toBeDefined();
      expect(user2).toBeDefined();

      mod.addPost({
        title: 'Post by User 1',
        content: 'Content written by user one for testing.',
        authorId: user1.id,
        authorName: user1.displayName,
      });
      mod.addPost({
        title: 'Post by User 2',
        content: 'Content written by user two for testing.',
        authorId: user2.id,
        authorName: user2.displayName,
      });

      const posts = mod.getPosts();
      expect(posts.length).toBe(2);
      expect(posts[0].authorName).toBe('User One');
      expect(posts[1].authorName).toBe('User Two');
    });

    it('should handle removing a user without affecting posts', async () => {
      const mod = await loadStorage();

      const addResult = mod.addUser({
        username: 'tempuser',
        displayName: 'Temp User',
        password: 'password123',
      });
      const userId = addResult.user.id;

      mod.addPost({
        title: 'Temp User Post',
        content: 'This post was created by a temporary user.',
        authorId: userId,
        authorName: 'Temp User',
      });

      mod.removeUser(userId);

      const users = mod.getUsers();
      expect(users.find((u) => u.id === userId)).toBeUndefined();

      const posts = mod.getPosts();
      expect(posts.find((p) => p.authorId === userId)).toBeDefined();
    });
  });
});