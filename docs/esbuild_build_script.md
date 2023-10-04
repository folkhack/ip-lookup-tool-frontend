# esbuild `build.js`

This is a CLI-based build tool designed for TypeScript/React projects. The script is a part of a web application build process. It uses esbuild for bundling, minification, and other build tasks, and is designed to be fast, efficient, and flexible. The tool is written in plain JavaScript for simplicity and ease of modification.

https://esbuild.github.io/

##### Features:

- **CLI-Based**: All configurations are passed as command-line arguments.
- **Class-Based**: Internally uses classes for modularity and clarity.
- **Environment Variables**: 
  - Supports loading of environment variables with the prefix `REACT_APP_` into the esbuild define object.
  - Supports `.env` file for setting these environment variables.
- **Directory Structure**: 
  - `assets`: Holds static assets, watched by chokidar for changes.
  - `src`: Application source code and components.
  - `dist`: Build directory for compiled and copied files.
- **Live-Reloading via SSE**: Utilizes Server-Sent Events to provide live reloading. This is extended by a proxy to also watch for changes in the `assets` directory.

---

### Use

```bash
# Configure environment variables
# - OPTIONAL - Will read from .env.default if .env does not exist!
cp .env.default .env
nano .env

# Development build with live reload and watch enabled
node build.js --dev --watch --live-reload

# Basic usage
node build.js

# Development build with live reload and watch
node build.js --dev --watch --live-reload

# Production build with bundle analysis
node build.js --analyze

# Development build with a specific log level and ports
node build.js --dev --log-level debug --serve-port 8080 --proxied-port 8085

# Development build with SSL
node build.js --dev --ssl-key-file ./ssl/key.pem --ssl-cert-file ./ssl/cert.pem
```

---

### CLI Arguments

| Argument                  | Description                                             | Default  |
|---------------------------|---------------------------------------------------------|----------|
| `--dev`                   | Development build                                       | `false`  |
| `--clean`                 | Clean `./dist` build directory and stop                 |          |
| `--watch`                 | Enable watch                                            | `false`  |
| `--serve`                 | Enable serve                                            | `false`  |
| `--live-reload`           | Enable live reload                                      | `false`  |
| `--analyze`               | Analyze bundle                                          | `false`  |
| `--log-level <log_level>` | Logging level                                           | `info`   |
| `--serve-port <serve_port>` | Serve port                                            | `55490`  |
| `--proxied-port <proxied_port>` | Proxied serve port                                | `55495`  |
| `--ssl-key-file <ssl_key_file>` | SSL key file                                     |          |
| `--ssl-cert-file <ssl_cert_file>` | SSL certificate file                           |          |

---

## Why `build.js` is Not Written in TypeScript

- **Speed**: No build step is required for the build script itself, making it faster.
- **Fewer Dependencies**: No need for dependencies like `ts-node`.
- **Configuration Simplicity**: Avoids managing a separate TypeScript configuration for the build script.
- **Reduced Abstraction**: Running JavaScript directly eliminates an extra layer of abstraction.
- **Clear Separation**: Keeps the master build script distinct from the project's application code and tests.

---

## Live-Reloading via SSE

The tool utilizes Server-Sent Events (SSE) for live-reloading. SSE is a standard allowing the server to push updates to the client. More details can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).

In addition to the default esbuild SSE endpoint for reloading, we use a proxy to watch for changes in the `assets` directory using chokidar. When changes are detected, live-reload events are fired to update the client.
