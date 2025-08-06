/**
 * Tests for environment loader - proving proper separation of concerns
 */

import { describe, it, expect, beforeEach, afterEach, vi, afterAll } from 'vitest';
import path from 'node:path';

// We'll import these after implementing
// import { ensureEnvironmentLoaded, loadEnvironmentIfAvailable } from './env-loader.js';

describe('env-loader', () => {
  let originalEnv: NodeJS.ProcessEnv;
  interface MockFs {
    existsSync: ReturnType<typeof vi.fn>;
    promises: {
      stat: ReturnType<typeof vi.fn>;
    };
  }

  interface MockDotenv {
    config: ReturnType<typeof vi.fn>;
  }

  let mockFs: MockFs;
  let mockFsPromises: { stat: ReturnType<typeof vi.fn> };
  let mockDotenv: MockDotenv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Clear test-related env vars
    delete process.env.TEST_VAR_1;
    delete process.env.TEST_VAR_2;
    delete process.env.NOTION_API_KEY;

    // Reset mocks
    vi.clearAllMocks();
    vi.resetModules();

    // Mock fs module
    mockFsPromises = {
      stat: vi.fn(),
    };
    mockFs = {
      existsSync: vi.fn(),
      promises: mockFsPromises,
    };
    vi.doMock('node:fs', () => mockFs);

    // Mock dotenv
    mockDotenv = {
      config: vi.fn(),
    };
    vi.doMock('dotenv', () => mockDotenv);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('ensureEnvironmentLoaded', () => {
    it('should do nothing if all required vars are already set', async () => {
      // Arrange
      process.env.TEST_VAR_1 = 'value1';
      process.env.TEST_VAR_2 = 'value2';

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert - should not throw
      await expect(ensureEnvironmentLoaded(['TEST_VAR_1', 'TEST_VAR_2'])).resolves.not.toThrow();

      // Should not attempt to load .env
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it('should load .env from cwd if vars are missing', async () => {
      // Arrange
      const cwdEnvPath = path.join(process.cwd(), '.env');
      mockFs.existsSync.mockImplementation((p: string) => p === cwdEnvPath);
      mockDotenv.config.mockReturnValue({
        parsed: { TEST_VAR_1: 'from-env' },
      });

      // When dotenv.config is called, set the env var
      mockDotenv.config.mockImplementation(() => {
        process.env.TEST_VAR_1 = 'from-env';
        return { parsed: { TEST_VAR_1: 'from-env' } };
      });

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert
      await expect(ensureEnvironmentLoaded(['TEST_VAR_1'])).resolves.not.toThrow();

      expect(mockFs.existsSync).toHaveBeenCalledWith(cwdEnvPath);
      expect(mockDotenv.config).toHaveBeenCalledWith({ path: cwdEnvPath });
      expect(process.env.TEST_VAR_1).toBe('from-env');
    });

    it('should find .env in repo root using .git directory', async () => {
      // Arrange
      const repoRoot = path.resolve('/Users/jim/code/oak/ai_experiments/oak-notion-mcp');
      const repoEnvPath = path.join(repoRoot, '.env');

      // Mock filesystem: no .env in cwd, but .git exists at repo root
      mockFs.existsSync.mockImplementation((p: string) => {
        if (p === path.join(process.cwd(), '.env')) return false;
        if (p === repoEnvPath) return true;
        return false;
      });

      // Mock .git directory detection - return stats for repo root .git
      mockFsPromises.stat.mockImplementation((p: string) => {
        if (p === path.join(repoRoot, '.git')) {
          return Promise.resolve({
            isDirectory: () => true,
            isFile: () => false,
          });
        }
        return Promise.reject(new Error('ENOENT'));
      });

      mockDotenv.config.mockImplementation((opts: { path: string }) => {
        if (opts.path === repoEnvPath) {
          process.env.TEST_VAR_1 = 'from-repo-env';
          return { parsed: { TEST_VAR_1: 'from-repo-env' } };
        }
        return { error: new Error('File not found') };
      });

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert
      await expect(ensureEnvironmentLoaded(['TEST_VAR_1'])).resolves.not.toThrow();

      expect(process.env.TEST_VAR_1).toBe('from-repo-env');
    });

    it('should find .env in repo root using .git file (worktree)', async () => {
      // Arrange
      const repoRoot = path.resolve('/Users/jim/code/oak/ai_experiments/oak-notion-mcp');
      const repoEnvPath = path.join(repoRoot, '.env');

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p === path.join(process.cwd(), '.env')) return false;
        if (p === repoEnvPath) return true;
        return false;
      });

      // Mock .git file detection (for worktrees)
      mockFsPromises.stat.mockImplementation((p: string) => {
        if (p === path.join(repoRoot, '.git')) {
          return Promise.resolve({
            isDirectory: () => false,
            isFile: () => true,
          });
        }
        return Promise.reject(new Error('ENOENT'));
      });

      mockDotenv.config.mockImplementation((opts: { path: string }) => {
        if (opts.path === repoEnvPath) {
          process.env.TEST_VAR_1 = 'from-worktree-env';
          return { parsed: { TEST_VAR_1: 'from-worktree-env' } };
        }
        return { error: new Error('File not found') };
      });

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert
      await expect(ensureEnvironmentLoaded(['TEST_VAR_1'])).resolves.not.toThrow();

      expect(process.env.TEST_VAR_1).toBe('from-worktree-env');
    });

    it('should throw helpful error if .env exists but vars still missing', async () => {
      // Arrange
      const cwdEnvPath = path.join(process.cwd(), '.env');
      mockFs.existsSync.mockImplementation((p: string) => p === cwdEnvPath);

      // .env loads successfully but doesn't contain required var
      mockDotenv.config.mockReturnValue({
        parsed: { OTHER_VAR: 'value' },
      });

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert
      await expect(ensureEnvironmentLoaded(['MISSING_VAR'])).rejects.toThrow(
        /Missing required environment variables: MISSING_VAR/,
      );
    });

    it('should throw helpful error if no .env file found', async () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(false);
      mockFsPromises.stat.mockImplementation(() => {
        return Promise.reject(new Error('ENOENT'));
      });

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert
      await expect(ensureEnvironmentLoaded(['MISSING_VAR'])).rejects.toThrow(
        /Missing required environment variables: MISSING_VAR/,
      );
    });

    it('should handle edge runtime (no filesystem)', async () => {
      // Arrange - simulate edge runtime by making fs undefined
      vi.mock('node:fs', () => {
        throw new TypeError('Test error: No filesystem available');
      });

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert
      await expect(ensureEnvironmentLoaded(['MISSING_VAR'])).rejects.toThrow(
        /Missing required environment variables: MISSING_VAR/,
      );

      // Cleanup
      vi.restoreAllMocks();
    });

    it('should list all missing vars in error message', async () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(false);

      const { ensureEnvironmentLoaded } = await import('./env-loader.js');

      // Act & Assert
      await expect(ensureEnvironmentLoaded(['VAR1', 'VAR2', 'VAR3'])).rejects.toThrow(
        /VAR1, VAR2, VAR3/,
      );
    });
  });

  describe('loadEnvironmentIfAvailable', () => {
    it('should silently load .env if available', async () => {
      // Arrange
      const cwdEnvPath = path.join(process.cwd(), '.env');
      mockFs.existsSync.mockImplementation((p: string) => p === cwdEnvPath);
      mockDotenv.config.mockImplementation(() => {
        process.env.LOADED_VAR = 'loaded';
        return { parsed: { LOADED_VAR: 'loaded' } };
      });

      const { loadEnvironmentIfAvailable } = await import('./env-loader.js');

      // Act
      await loadEnvironmentIfAvailable();

      // Assert
      expect(process.env.LOADED_VAR).toBe('loaded');
      expect(mockDotenv.config).toHaveBeenCalled();
    });

    it('should not throw if .env is not found', async () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(false);

      const { loadEnvironmentIfAvailable } = await import('./env-loader.js');

      // Act & Assert - should not throw
      await expect(loadEnvironmentIfAvailable()).resolves.not.toThrow();
    });

    it('should not throw in edge runtime', async () => {
      // Arrange
      vi.mock('node:fs', () => {
        throw new TypeError('Test error: No filesystem available');
      });

      const { loadEnvironmentIfAvailable } = await import('./env-loader.js');

      // Act & Assert - should not throw
      await expect(loadEnvironmentIfAvailable()).resolves.not.toThrow();

      // Cleanup
      vi.restoreAllMocks();
    });
  });
});
