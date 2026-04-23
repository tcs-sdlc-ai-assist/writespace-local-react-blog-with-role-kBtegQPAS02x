import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';

vi.mock('../utils/auth.js', () => ({
  isAuthenticated: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../utils/storage.js', () => ({
  getPosts: vi.fn(),
  getUsers: vi.fn(),
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

import { isAuthenticated, getCurrentUser } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    isAuthenticated.mockReturnValue(false);
    getCurrentUser.mockReturnValue(null);
    getPosts.mockReturnValue([]);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  function renderLandingPage() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );
  }

  describe('hero section', () => {
    it('should render the hero heading with WriteSpace', () => {
      renderLandingPage();

      expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
    });

    it('should render the hero description text', () => {
      renderLandingPage();

      expect(
        screen.getByText(/A distraction-free writing platform for sharing your ideas with the world/i)
      ).toBeInTheDocument();
    });
  });

  describe('features section', () => {
    it('should render the Why WriteSpace heading', () => {
      renderLandingPage();

      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('should render the features description', () => {
      renderLandingPage();

      expect(
        screen.getByText('Everything you need to write, publish, and share your stories.')
      ).toBeInTheDocument();
    });

    it('should render the Distraction-Free Writing feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Distraction-Free Writing')).toBeInTheDocument();
      expect(
        screen.getByText(/A clean, minimal editor that lets you focus on what matters most/i)
      ).toBeInTheDocument();
    });

    it('should render the Auto-Save Locally feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Auto-Save Locally')).toBeInTheDocument();
      expect(
        screen.getByText(/Your work is automatically saved to your browser/i)
      ).toBeInTheDocument();
    });

    it('should render the Publish Instantly feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Publish Instantly')).toBeInTheDocument();
      expect(
        screen.getByText(/Create an account and publish your posts in seconds/i)
      ).toBeInTheDocument();
    });
  });

  describe('latest posts section', () => {
    it('should render the Latest Posts heading', () => {
      renderLandingPage();

      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    });

    it('should render the latest posts description', () => {
      renderLandingPage();

      expect(
        screen.getByText('Discover the most recent stories from our community.')
      ).toBeInTheDocument();
    });

    it('should render empty state when no posts exist', () => {
      getPosts.mockReturnValue([]);

      renderLandingPage();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(/Be the first to share your thoughts/i)
      ).toBeInTheDocument();
    });

    it('should render post cards when posts exist', () => {
      getPosts.mockReturnValue([
        {
          id: 'p_test_001',
          title: 'First Test Post',
          content: 'This is the content of the first test post for the landing page.',
          createdAt: '2024-06-15T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Test Author',
        },
        {
          id: 'p_test_002',
          title: 'Second Test Post',
          content: 'This is the content of the second test post for the landing page.',
          createdAt: '2024-06-14T10:00:00.000Z',
          authorId: 'u_user_002',
          authorName: 'Another Author',
        },
      ]);

      renderLandingPage();

      expect(screen.getByText('First Test Post')).toBeInTheDocument();
      expect(screen.getByText('Second Test Post')).toBeInTheDocument();
    });

    it('should display at most 3 posts', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'Post One',
          content: 'Content for post one that is long enough.',
          createdAt: '2024-06-15T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author One',
        },
        {
          id: 'p_2',
          title: 'Post Two',
          content: 'Content for post two that is long enough.',
          createdAt: '2024-06-14T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author One',
        },
        {
          id: 'p_3',
          title: 'Post Three',
          content: 'Content for post three that is long enough.',
          createdAt: '2024-06-13T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author One',
        },
        {
          id: 'p_4',
          title: 'Post Four',
          content: 'Content for post four that is long enough.',
          createdAt: '2024-06-12T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author One',
        },
      ];

      getPosts.mockReturnValue(posts);

      renderLandingPage();

      expect(screen.getByText('Post One')).toBeInTheDocument();
      expect(screen.getByText('Post Two')).toBeInTheDocument();
      expect(screen.getByText('Post Three')).toBeInTheDocument();
      expect(screen.queryByText('Post Four')).not.toBeInTheDocument();
    });

    it('should render View all posts link when posts exist', () => {
      getPosts.mockReturnValue([
        {
          id: 'p_test_001',
          title: 'A Post',
          content: 'Content for the post that is long enough to display.',
          createdAt: '2024-06-15T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author',
        },
      ]);

      renderLandingPage();

      const viewAllLink = screen.getByText('View all posts →');
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink.closest('a')).toHaveAttribute('href', '/blogs');
    });
  });

  describe('guest CTA buttons', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);
    });

    it('should render Get Started button linking to register', () => {
      renderLandingPage();

      const getStartedLink = screen.getByRole('link', { name: /get started/i });
      expect(getStartedLink).toBeInTheDocument();
      expect(getStartedLink).toHaveAttribute('href', '/register');
    });

    it('should render Sign In button linking to login', () => {
      renderLandingPage();

      const signInLink = screen.getByRole('link', { name: /sign in/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('should not render Write a Post button for guests', () => {
      renderLandingPage();

      expect(screen.queryByRole('link', { name: /write a post/i })).not.toBeInTheDocument();
    });

    it('should not render View Blogs hero button for guests', () => {
      renderLandingPage();

      expect(screen.queryByRole('link', { name: /^view blogs$/i })).not.toBeInTheDocument();
    });

    it('should not render Go to Dashboard button for guests', () => {
      renderLandingPage();

      expect(screen.queryByRole('link', { name: /go to dashboard/i })).not.toBeInTheDocument();
    });

    it('should render Create Account button in empty posts state for guests', () => {
      getPosts.mockReturnValue([]);

      renderLandingPage();

      const createAccountLink = screen.getByRole('link', { name: /create account/i });
      expect(createAccountLink).toBeInTheDocument();
      expect(createAccountLink).toHaveAttribute('href', '/register');
    });
  });

  describe('authenticated regular user CTA buttons', () => {
    const userSession = {
      userId: 'u_user_001',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    };

    beforeEach(() => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue(userSession);
    });

    it('should render View Blogs button for authenticated regular user', () => {
      renderLandingPage();

      const viewBlogsLink = screen.getByRole('link', { name: /view blogs/i });
      expect(viewBlogsLink).toBeInTheDocument();
      expect(viewBlogsLink).toHaveAttribute('href', '/blogs');
    });

    it('should render Write a Post button for authenticated user', () => {
      renderLandingPage();

      const writePostLink = screen.getByRole('link', { name: /write a post/i });
      expect(writePostLink).toBeInTheDocument();
      expect(writePostLink).toHaveAttribute('href', '/blog/new');
    });

    it('should not render Get Started button for authenticated user', () => {
      renderLandingPage();

      expect(screen.queryByRole('link', { name: /get started/i })).not.toBeInTheDocument();
    });

    it('should not render Sign In hero button for authenticated user', () => {
      renderLandingPage();

      // The hero section should not have a Sign In link for authenticated users
      // Note: the navbar may have logout, but the hero CTA should not have Sign In
      const heroSection = screen.getByText(/Welcome to/i).closest('section');
      const signInLinks = heroSection
        ? heroSection.querySelectorAll('a[href="/login"]')
        : [];
      expect(signInLinks.length).toBe(0);
    });

    it('should not render Go to Dashboard button for regular user', () => {
      renderLandingPage();

      expect(screen.queryByRole('link', { name: /go to dashboard/i })).not.toBeInTheDocument();
    });
  });

  describe('authenticated admin user CTA buttons', () => {
    const adminSession = {
      userId: 'u_admin_001',
      username: 'admin',
      displayName: 'Administrator',
      role: 'admin',
    };

    beforeEach(() => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue(adminSession);
    });

    it('should render Go to Dashboard button for admin user', () => {
      renderLandingPage();

      const dashboardLink = screen.getByRole('link', { name: /go to dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/admin');
    });

    it('should render Write a Post button for admin user', () => {
      renderLandingPage();

      const writePostLink = screen.getByRole('link', { name: /write a post/i });
      expect(writePostLink).toBeInTheDocument();
      expect(writePostLink).toHaveAttribute('href', '/blog/new');
    });

    it('should not render View Blogs hero button for admin user', () => {
      renderLandingPage();

      // Admin sees "Go to Dashboard" instead of "View Blogs" in the hero
      const heroSection = screen.getByText(/Welcome to/i).closest('section');
      const viewBlogsLinks = heroSection
        ? Array.from(heroSection.querySelectorAll('a')).filter(
            (a) => a.textContent.trim() === 'View Blogs'
          )
        : [];
      expect(viewBlogsLinks.length).toBe(0);
    });

    it('should not render Get Started button for admin user', () => {
      renderLandingPage();

      expect(screen.queryByRole('link', { name: /get started/i })).not.toBeInTheDocument();
    });
  });

  describe('navigation rendering', () => {
    it('should render PublicNavbar for unauthenticated users', () => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);

      renderLandingPage();

      // PublicNavbar has Login and Register links
      const loginLink = screen.getByRole('link', { name: /^login$/i });
      expect(loginLink).toBeInTheDocument();

      const registerLink = screen.getByRole('link', { name: /^register$/i });
      expect(registerLink).toBeInTheDocument();
    });

    it('should render Navbar for authenticated users', () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'u_user_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderLandingPage();

      // Navbar shows the user's display name and a Logout button
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });
  });

  describe('footer', () => {
    it('should render the footer with WriteSpace brand', () => {
      renderLandingPage();

      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();

      const brandElements = footer.querySelectorAll('span');
      const brandText = Array.from(brandElements).find(
        (el) => el.textContent === 'WriteSpace'
      );
      expect(brandText).toBeDefined();
    });

    it('should render the Blogs link in footer', () => {
      renderLandingPage();

      const footer = document.querySelector('footer');
      const blogsLink = footer.querySelector('a[href="/blogs"]');
      expect(blogsLink).toBeInTheDocument();
      expect(blogsLink).toHaveTextContent('Blogs');
    });

    it('should render Login and Register links in footer for guests', () => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);

      renderLandingPage();

      const footer = document.querySelector('footer');
      const loginLink = footer.querySelector('a[href="/login"]');
      const registerLink = footer.querySelector('a[href="/register"]');
      expect(loginLink).toBeInTheDocument();
      expect(registerLink).toBeInTheDocument();
    });

    it('should render Write link in footer for authenticated users', () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'u_user_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderLandingPage();

      const footer = document.querySelector('footer');
      const writeLink = footer.querySelector('a[href="/blog/new"]');
      expect(writeLink).toBeInTheDocument();
      expect(writeLink).toHaveTextContent('Write');
    });

    it('should not render Login and Register links in footer for authenticated users', () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'u_user_001',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderLandingPage();

      const footer = document.querySelector('footer');
      const loginLink = footer.querySelector('a[href="/login"]');
      const registerLink = footer.querySelector('a[href="/register"]');
      expect(loginLink).toBeNull();
      expect(registerLink).toBeNull();
    });

    it('should render copyright text with current year', () => {
      renderLandingPage();

      const currentYear = new Date().getFullYear().toString();
      expect(
        screen.getByText((content) =>
          content.includes(currentYear) && content.includes('WriteSpace')
        )
      ).toBeInTheDocument();
    });
  });

  describe('posts sorting', () => {
    it('should display posts sorted by most recent first', () => {
      getPosts.mockReturnValue([
        {
          id: 'p_old',
          title: 'Old Post',
          content: 'This is an older post with enough content.',
          createdAt: '2024-01-01T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author',
        },
        {
          id: 'p_new',
          title: 'New Post',
          content: 'This is a newer post with enough content.',
          createdAt: '2024-06-15T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author',
        },
        {
          id: 'p_mid',
          title: 'Middle Post',
          content: 'This is a middle post with enough content.',
          createdAt: '2024-03-10T10:00:00.000Z',
          authorId: 'u_user_001',
          authorName: 'Author',
        },
      ]);

      renderLandingPage();

      const postTitles = screen.getAllByRole('heading', { level: 3 });
      const titleTexts = postTitles.map((h) => h.textContent);

      const newIndex = titleTexts.indexOf('New Post');
      const midIndex = titleTexts.indexOf('Middle Post');
      const oldIndex = titleTexts.indexOf('Old Post');

      expect(newIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(oldIndex);
    });
  });
});