import { expect, test } from '@playwright/test';

const DESKTOP_WIDTH = 1280;

test.describe('sticky email bar on desktop', () => {
  test.use({ viewport: { width: DESKTOP_WIDTH, height: 800 } });

  test('focus ring contrasts with the navy bar', async ({ page }) => {
    await page.goto('/?skip=1');
    const link = page.locator('.sticky-email-link');
    await link.focus();
    const { outlineColor, outlineStyle, barBackground } = await link.evaluate((element) => ({
      outlineColor: getComputedStyle(element).outlineColor,
      outlineStyle: getComputedStyle(element).outlineStyle,
      barBackground: getComputedStyle(element.parentElement as HTMLElement).backgroundColor,
    }));
    expect(outlineStyle).not.toBe('none');
    expect(outlineColor).not.toBe(barBackground);
    expect(outlineColor).toBe('rgb(216, 255, 0)');
  });

  test('bar height matches the space reserved for it', async ({ page }) => {
    await page.goto('/?skip=1');
    const { barHeight, reserved } = await page.evaluate(() => ({
      barHeight: (document.querySelector('[data-sticky-email]') as HTMLElement).getBoundingClientRect().height,
      reserved: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-offset-top')),
    }));
    expect(barHeight).toBe(reserved);
  });

  test('featured visual sticks below the email bar', async ({ page }) => {
    await page.goto('/?skip=1');
    const stickyTop = await page
      .locator('.featured-visual')
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).top));
    const SPACE_6_PX = 24;
    const BAR_HEIGHT_PX = 48;
    expect(stickyTop).toBe(BAR_HEIGHT_PX + SPACE_6_PX);
  });
});

test.describe('Olympus cutout camera tiles', () => {
  for (const width of [320, 375, 900, 1280]) {
    test(`icon does not overlap the LIVE pill or camera name at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/?skip=1');
      const tiles = await page.locator('.camera-tile').evaluateAll((nodes) =>
        nodes.map((tile) => {
          const box = (selector: string) => {
            const rect = (tile.querySelector(selector) as Element).getBoundingClientRect();
            return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
          };
          return { icon: box('.camera-icon'), live: box('.camera-live'), name: box('.camera-name') };
        }),
      );
      expect(tiles.length).toBeGreaterThan(0);
      const overlaps = (a: (typeof tiles)[0]['icon'], b: (typeof tiles)[0]['icon']) =>
        a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      tiles.forEach((tile, index) => {
        expect(overlaps(tile.icon, tile.live), `tile ${index} icon vs LIVE`).toBe(false);
        expect(overlaps(tile.icon, tile.name), `tile ${index} icon vs name`).toBe(false);
      });
    });
  }
});

test('incident feedback region stays in the accessibility tree while empty', async ({ page }) => {
  await page.goto('/?skip=1');
  const display = await page
    .locator('[data-incident-feedback]')
    .evaluate((element) => getComputedStyle(element).display);
  expect(display).not.toBe('none');
});
test('Email me and Copy email buttons line up in the hero and contact sections', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/?skip=1');
    for (const section of ['#hero', '#contact']) {
      const emailBox = await page.locator(`${section} a[href^="mailto:"].button`).first().boundingBox();
      const copyBox = await page.locator(`${section} [data-copy-email]`).boundingBox();
      if (!emailBox || !copyBox) throw new Error(`buttons missing in ${section}`);
      // Side by side they share a centre line; wrapped onto separate rows they don't overlap.
      const sameRow = Math.abs(emailBox.y - copyBox.y) < emailBox.height;
      if (sameRow) {
        expect(Math.abs(emailBox.y + emailBox.height / 2 - (copyBox.y + copyBox.height / 2)), `${section} @${width}`).toBeLessThanOrEqual(1);
      }
    }
  }
});
