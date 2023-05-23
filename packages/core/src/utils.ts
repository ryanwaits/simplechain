import fs from "fs";

export function isDirectory(filePath: string) {
  const stats = fs.statSync(filePath);
  return stats.isDirectory();
}
