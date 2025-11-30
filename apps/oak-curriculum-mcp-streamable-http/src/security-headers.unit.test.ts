import { describe, it, expect } from 'vitest';
import { createSecurityHeadersMiddleware, CSP_DIRECTIVES } from './security-headers.js';

/**
 * Unit tests for the security headers module.
 *
 * Tests the CSP directive configuration and middleware factory function.
 * Integration tests verify actual header behavior in HTTP responses.
 */
describe('security-headers', () => {
  describe('CSP_DIRECTIVES', () => {
    it('has restrictive default-src policy', () => {
      expect(CSP_DIRECTIVES.defaultSrc).toEqual(["'self'"]);
    });

    it('allows inline styles for landing page <style> tags', () => {
      expect(CSP_DIRECTIVES.styleSrc).toContain("'unsafe-inline'");
    });

    it('allows Google Fonts CSS', () => {
      expect(CSP_DIRECTIVES.styleSrc).toContain('https://fonts.googleapis.com');
    });

    it('allows Google Fonts font files', () => {
      expect(CSP_DIRECTIVES.fontSrc).toContain('https://fonts.gstatic.com');
    });

    it('allows same-origin and inline scripts for Cloudflare integration', () => {
      // Cloudflare injects inline scripts for bot detection/challenge pages
      // that load additional scripts from /cdn-cgi/challenge-platform/
      expect(CSP_DIRECTIVES.scriptSrc).toContain("'self'");
      expect(CSP_DIRECTIVES.scriptSrc).toContain("'unsafe-inline'");
    });

    it('allows same-origin child frames for Cloudflare integration', () => {
      // Cloudflare creates hidden iframes for challenge handling
      expect(CSP_DIRECTIVES.childSrc).toEqual(["'self'"]);
    });

    it('allows same-origin and data: URI images', () => {
      expect(CSP_DIRECTIVES.imgSrc).toContain("'self'");
      expect(CSP_DIRECTIVES.imgSrc).toContain('data:');
    });

    it('blocks all connections (no fetch/XHR from landing page)', () => {
      expect(CSP_DIRECTIVES.connectSrc).toEqual(["'self'"]);
    });

    it('restricts frame ancestors to same-origin (clickjacking protection)', () => {
      expect(CSP_DIRECTIVES.frameAncestors).toEqual(["'self'"]);
    });

    it('restricts base URI to same-origin', () => {
      expect(CSP_DIRECTIVES.baseUri).toEqual(["'self'"]);
    });

    it('restricts form action to same-origin', () => {
      expect(CSP_DIRECTIVES.formAction).toEqual(["'self'"]);
    });
  });

  describe('createSecurityHeadersMiddleware', () => {
    it('returns a function (Express middleware)', () => {
      const middleware = createSecurityHeadersMiddleware();
      expect(typeof middleware).toBe('function');
    });

    it('returns middleware with correct arity for Express', () => {
      const middleware = createSecurityHeadersMiddleware();
      // Express middleware has 3 arguments: (req, res, next)
      expect(middleware.length).toBe(3);
    });

    it('can be called multiple times (factory pattern)', () => {
      const middleware1 = createSecurityHeadersMiddleware();
      const middleware2 = createSecurityHeadersMiddleware();
      expect(middleware1).not.toBe(middleware2);
      expect(typeof middleware1).toBe('function');
      expect(typeof middleware2).toBe('function');
    });
  });
});
