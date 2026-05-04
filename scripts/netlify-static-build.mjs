import { execFileSync } from "node:child_process";
import { constants } from "node:fs";
import { access, copyFile, cp, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const appBuildDir = path.join(root, ".next", "server", "app");

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function copyIfExists(from, to) {
  if (await exists(from)) {
    await mkdir(path.dirname(to), { recursive: true });
    await copyFile(from, to);
  }
}

const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");

execFileSync(process.execPath, [nextCli, "build"], { stdio: "inherit" });

await mkdir(outDir, { recursive: true });
await copyIfExists(path.join(appBuildDir, "index.html"), path.join(outDir, "index.html"));
await copyIfExists(path.join(appBuildDir, "_not-found.html"), path.join(outDir, "404.html"));

await cp(path.join(root, ".next", "static"), path.join(outDir, "_next", "static"), {
  recursive: true
});
await cp(path.join(root, "public"), outDir, { recursive: true });

if (!(await exists(path.join(outDir, "index.html")))) {
  throw new Error("Netlify static build did not create out/index.html");
}
