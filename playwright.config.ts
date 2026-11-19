import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Thời gian tối đa cho 1 test case: 30 giây */
  timeout: 30 * 1000,
  expect: {
    /* Timeout tối đa cho 1 assertion: 5 giây */
    timeout: 5000,
  },
  /* Chạy song song tất cả các file test */
  fullyParallel: true,
  /* Tự động retry 1 lần nếu chạy trên môi trường staging bị chập chờn */
  retries: 1,
  /* Xuất báo cáo HTML khi hoàn thành */
  reporter: [['html', { open: 'never' }]],

  use: {
    /* URL gốc của Medusa Storefront Staging */
    baseURL: 'https://atqaa-medusa-storefront.vercel.app/vn',

    /* Chỉ chụp màn hình và quay video khi test bị FAIL */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Bật tính năng hộp đen Trace Viewer khi retry */
    trace: 'on-first-retry',
  },

  /* Cấu hình các trình duyệt mục tiêu */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});