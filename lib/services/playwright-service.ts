// lib/services/playwright-service.ts
// Core Playwright automation service for social channel management

import { Browser, Page, BrowserContext } from 'playwright';
import { chromium } from 'playwright';
import * as crypto from 'crypto';

export type SocialPlatform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'threads';

interface SessionConfig {
  platform: SocialPlatform;
  email: string;
  password?: string;
  twoFactorCode?: string;
  headless?: boolean;
}

interface EncryptedSession {
  iv: string;
  encryptedData: string;
}

export class PlaywrightService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private encryptionKey: string;

  constructor(encryptionKey: string = process.env.SESSION_ENCRYPTION_KEY!) {
    this.encryptionKey = encryptionKey;
  }

  /**
   * Initialize browser instance
   */
  async initializeBrowser(headless: boolean = true) {
    if (this.browser) return this.browser;
    
    this.browser = await chromium.launch({
      headless,
      args: ['--disable-blink-features=AutomationControlled'],
    });

    // Create context with user agent
    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    return this.browser;
  }

  /**
   * Close browser and cleanup
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }

  /**
   * Encrypt session data for secure storage
   */
  encryptSession(sessionData: object): EncryptedSession {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey, 'hex'),
      iv
    );

    let encrypted = cipher.update(JSON.stringify(sessionData), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
    };
  }

  /**
   * Decrypt session data
   */
  decryptSession(encrypted: EncryptedSession): object {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey, 'hex'),
      Buffer.from(encrypted.iv, 'hex')
    );

    let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  /**
   * YouTube Login Workflow
   */
  async loginYouTube(email: string, password: string, twoFactorCode?: string): Promise<object> {
    const page = await this.context!.newPage();
    
    try {
      // Navigate to YouTube login
      await page.goto('https://www.youtube.com/account', { waitUntil: 'networkidle' });

      // Check if already authenticated
      const isAuthenticated = await page.evaluate(() => {
        return !!document.querySelector('[aria-label="Sign out"]');
      });

      if (isAuthenticated) {
        return this.saveSessionData(page, 'youtube');
      }

      // Click sign in
      await page.click('a:has-text("Sign in")');
      await page.waitForNavigation();

      // Enter email
      await page.fill('input[type="email"]', email);
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(2000);

      // Enter password
      await page.fill('input[type="password"]', password);
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(3000);

      // Handle 2FA if needed
      if (twoFactorCode) {
        const smsInput = await page.$('input[type="text"]');
        if (smsInput) {
          await smsInput.fill(twoFactorCode);
          await page.click('button:has-text("Next")');
        }
      }

      // Wait for authentication complete
      await page.waitForNavigation();
      
      return this.saveSessionData(page, 'youtube');
    } finally {
      await page.close();
    }
  }

  /**
   * TikTok Login Workflow
   */
  async loginTikTok(email: string, password: string): Promise<object> {
    const page = await this.context!.newPage();
    
    try {
      await page.goto('https://www.tiktok.com/login', { waitUntil: 'networkidle' });

      // Choose email login method
      await page.click('button:has-text("Log in with email or phone number")');
      await page.waitForTimeout(1000);

      // Enter credentials
      await page.fill('input[placeholder*="Email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button:has-text("Log in")');

      // Wait for redirect to main page
      await page.waitForNavigation();
      await page.waitForTimeout(3000);

      return this.saveSessionData(page, 'tiktok');
    } finally {
      await page.close();
    }
  }

  /**
   * Instagram Login Workflow
   */
  async loginInstagram(email: string, password: string): Promise<object> {
    const page = await this.context!.newPage();
    
    try {
      await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle' });

      // Enter credentials
      await page.fill('input[name="username"]', email);
      await page.fill('input[name="password"]', password);
      
      // Submit
      const submitButton = await page.$('button[type="button"]:has-text("Log in")');
      if (submitButton) await submitButton.click();

      // Handle "Save login info?" dialog
      await page.waitForTimeout(2000);
      const saveButton = await page.$('button:has-text("Save information")');
      if (saveButton) await saveButton.click();

      await page.waitForNavigation();
      return this.saveSessionData(page, 'instagram');
    } finally {
      await page.close();
    }
  }

  /**
   * Twitter/X Login Workflow
   */
  async loginTwitter(email: string, password: string): Promise<object> {
    const page = await this.context!.newPage();
    
    try {
      await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle' });

      // Enter email/username
      await page.fill('input[autocomplete="username"]', email);
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(2000);

      // Enter password
      await page.fill('input[type="password"]', password);
      await page.click('button[type="button"]:has-text("Log in")');

      await page.waitForNavigation();
      return this.saveSessionData(page, 'twitter');
    } finally {
      await page.close();
    }
  }

  /**
   * LinkedIn Login Workflow
   */
  async loginLinkedIn(email: string, password: string): Promise<object> {
    const page = await this.context!.newPage();
    
    try {
      await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle' });

      // Enter credentials
      await page.fill('input#username', email);
      await page.fill('input#password', password);
      await page.click('button[type="submit"]');

      await page.waitForNavigation();
      return this.saveSessionData(page, 'linkedin');
    } finally {
      await page.close();
    }
  }

  /**
   * Facebook Login Workflow
   */
  async loginFacebook(email: string, password: string): Promise<object> {
    const page = await this.context!.newPage();
    
    try {
      await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle' });

      // Enter credentials
      await page.fill('input#email', email);
      await page.fill('input#pass', password);
      await page.click('button[name="login"]');

      await page.waitForNavigation();
      return this.saveSessionData(page, 'facebook');
    } finally {
      await page.close();
    }
  }

  /**
   * Disconnect/logout from channel
   */
  async disconnectChannel(platform: SocialPlatform): Promise<void> {
    const page = await this.context!.newPage();
    
    try {
      const logoutUrls: Record<SocialPlatform, string> = {
        youtube: 'https://www.youtube.com/account',
        tiktok: 'https://www.tiktok.com/setting',
        instagram: 'https://www.instagram.com/accounts/login/',
        facebook: 'https://www.facebook.com/',
        twitter: 'https://x.com/logout',
        linkedin: 'https://www.linkedin.com/m/logout/',
        threads: 'https://www.threads.net/',
      };

      await page.goto(logoutUrls[platform]);
      
      // Platform-specific logout
      switch (platform) {
        case 'youtube':
          const signOutBtn = await page.$('[aria-label="Sign out"]');
          if (signOutBtn) await signOutBtn.click();
          break;
        case 'instagram':
          const menuBtn = await page.$('[aria-label="Menu"]');
          if (menuBtn) await menuBtn.click();
          await page.click('button:has-text("Log out")');
          break;
        case 'twitter':
          await page.waitForNavigation();
          break;
      }
    } finally {
      await page.close();
    }
  }

  /**
   * Save session data from authenticated page
   */
  private async saveSessionData(page: Page, platform: SocialPlatform): Promise<object> {
    const cookies = await page.context().cookies();
    const localStorage = await page.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) items[key] = window.localStorage.getItem(key) || '';
      }
      return items;
    });

    return {
      platform,
      cookies,
      localStorage,
      timestamp: new Date().toISOString(),
    };
  }
}
