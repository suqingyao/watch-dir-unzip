import chokidar from "chokidar";
import unzipper from "unzipper";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { cac } from "cac";
import ora from "ora";

const cli = cac("watch-dir-unzip");

cli
  .command(
    "[dir] [command]",
    "Watch directory for zip files and execute a command"
  )
  .action((dir = ".", command) => {
    if (!command) {
      console.error("Please provide a command to execute after unzipping.");
      process.exit(1);
    }

    const spinner = ora("Watching for changes...").start();

    const watcher = chokidar.watch(dir, {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on("add", (filePath) => {
      if (path.extname(filePath) === ".zip") {
        spinner.info(`Detected zip file: ${filePath}`);
        const extractPath = path.join(dir, path.basename(filePath, ".zip"));

        fs.createReadStream(filePath)
          .pipe(unzipper.Extract({ path: extractPath }))
          .on("close", () => {
            spinner.succeed(`Extracted to: ${extractPath}`);
            const scriptSpinner = ora("Executing command...").start();
            exec(command, { cwd: extractPath }, (error, stdout, stderr) => {
              if (error) {
                scriptSpinner.fail(`Error executing command: ${error.message}`);
                return;
              }
              if (stderr) {
                scriptSpinner.fail(`Command stderr: ${stderr}`);
                return;
              }
              scriptSpinner.succeed(`Command output: ${stdout}`);
            });
          });
      }
    });

    spinner.succeed(`Watching for changes in ${dir}`);
  });

cli.help();
cli.parse();
