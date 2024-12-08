# watch-dir-unzip

A CLI tool for watching a directory for ZIP files, extracting them, and executing a specified command.

## Features

- Watch a directory for new ZIP files
- Automatically extract ZIP files
- Execute a specified command in the extracted directory

## Usage

Install dependencies:

```sh
npm install
```

Build the project:
```sh
npm run build
```

Run the CLI tool:

```sh
npx watchDirUnzip [dir] [command]
```

- dir (optional): The directory to watch, default is the Downloads directory on Mac.
- command: The command to execute after extracting the ZIP file.

Example:

```sh
npx watchDirUnzip "echo 'Hello, World!'"
```
## License

MIT ©suqingyao