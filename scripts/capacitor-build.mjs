import { execSync } from "child_process";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

let exitCode = 0;

try {
  execSync("cross-env BUILD_TARGET=capacitor next build --webpack", {
    stdio: "inherit",
    cwd: root,
  });
} catch (error) {
  exitCode = error.status ?? 1;
}

process.exit(exitCode);
