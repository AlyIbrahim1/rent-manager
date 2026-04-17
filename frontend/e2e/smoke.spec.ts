import { expect, test } from "@playwright/test";

test("user can login and view dashboard", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Rent Manager Dashboard")).toBeVisible();
});
