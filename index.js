const { init } = require("tampermonkey-vscode-helper");
const path = require("path");
const cmdPath = process.cwd();
const fs = require("fs-extra");
const argv = require("process.argv");
const processArgv = argv(process.argv.slice(2));
const argvConfig = processArgv({
  config: "./tampermonkey.config.js",
});
const configPath = path.join(cmdPath, argvConfig.config);

if (fs.existsSync(configPath)) {
  import("file://" + configPath).then((module) => {
    const defaultResult = module.default;
    let watch = defaultResult.watch;
    if (typeof watch === "string") {
      watch = [watch];
    }
    watch = watch.map((item) => {
      if (typeof item === "string") {
        return {
          name: undefined,
          path: item,
        };
      }
      return item;
    });
    init({
      autoRefresh: defaultResult.autoRefresh,
      autoClose: defaultResult.autoClose,
    }).then(({ watchScriptFile }) => {
      console.log("watch", watch);
      for (let index = 0; index < watch.length; index++) {
        const watchItem = watch[index];
        watchScriptFile(watchItem.name, watchItem.path);
      }
    });
  });
} else {
  console.log("no find cmd have tampermonkey.config.js");
}
