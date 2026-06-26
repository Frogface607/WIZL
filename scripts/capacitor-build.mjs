/**
 * Capacitor build script.
 * Swaps auth/callback/route.ts with a static-export-safe stub before building,
 * then restores the real implementation regardless of build success/failure.
 */
import { execSync } from "child_process";
import { copyFileSync, existsSync } from "fs";
import { resolve } from "path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const real = resolve(root, "src/app/auth/callback/route.ts");
const stub = resolve(root, "src/app/auth/callback/route.capacitor.ts");
const backup = resolve(root, "src/app/auth/callback/route.ts.bak");

function swap(from, to) {
  copyFileSync(from, to);
}

let exitCode = 0;
try {
  // Back up real route, put stub in place
  swap(real, backup);
  swap(stub, real);

  // Run the build
  execSync("cross-env BUILD_TARGET=capacitor next build --webpack", {
    stdio: "inherit",
    cwd: root,
  });
} catch (err) {
  exitCode = err.status ?? 1;
} finally {
  // Always restore the real route
  if (existsSync(backup)) {
    swap(backup, real);
    const { unlinkSync } = await import("fs");
    unlinkSync(backup);
  }
}

process.exit(exitCode);
