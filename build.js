import esbuild from "esbuild";
import { copyFile } from "node:fs";

const copyToDist = (path) => {
  copyFile(path, `./dist/${path.substring(1)}`, (err) => {
    if (err) throw err;
  });
};

const copyFiles = {
  name: "copy",
  setup(build) {
    build.onEnd(() => {
      copyToDist("./manifest.json");
      copyToDist("./popup.html");
    });
  },
};

esbuild
  .build({
    entryPoints: ["background.js", "popup.js"],
    bundle: true,
    outdir: "dist",
    plugins: [copyFiles],
  })
  .catch(() => process.exit(1));
