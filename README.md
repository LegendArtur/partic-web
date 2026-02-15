# Partic Web

Partic is a secure, private Matrix web client, forked from [Element Web](https://github.com/element-hq/element-web).

**Focus**: Total Privacy, Self-Hosting, and Independence.

## Features

*   **Private & Secure**: Built on the Matrix protocol for end-to-end encryption.
*   **Self-Hosted First**: Optimized for deployment on your own infrastructure (e.g., DigitalOcean via Coolify).
*   **Clean Experience**: Removed Element-specific analytics, cloud integrations, and "production" bloat to ensure a lightweight, private experience.
*   **Video Calls**: Integrated Jitsi support (defaults to `meet.element.io`, configurable).

## Getting Started

### Self-Hosting (Recommended)

Partic is designed to be hosted on your own servers. We provide a `Dockerfile.coolify` optimized for deployment platforms like [Coolify](https://coolify.io/).

1.  **Coolify / Docker**: Point your deployment tool to this repository.
2.  **Configuration**: The build process automatically copies `config.sample.json` to `config.json`. You can mount a custom `config.json` volume to override settings.

### Building from Source

Ensure you have [Node.js](https://nodejs.org/) (LTS) and [pnpm](https://pnpm.io/) installed.

1.  Clone the repo:
    ```bash
    git clone https://github.com/LegendArtur/partic-web.git
    cd partic-web
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Build the application:
    ```bash
    pnpm build
    ```
    This creates a `webapp` directory with the static assets.

4.  Create a distribution tarball (Linux/macOS):
    ```bash
    pnpm dist
    ```
    This generates `dist/partic-web-x.x.x.tar.gz`.

## Configuration

Partic allows extensive configuration via `config.json`.
*   **Homeserver**: Set your default Matrix homeserver URL.
*   **Jitsi**: Configure your own Jitsi instance for privacy-respecting video calls.
*   **Brand**: All branding strings have been updated to "Partic".

Copy `config.sample.json` to `config.json` to start customizing:
```bash
cp config.sample.json config.json
```

## Security & Privacy

*   **Separate Domains**: We recommend hosting Partic on a different domain/subdomain than your Synapse homeserver to prevent XSS risks.
*   **Headers**: Ensure your web server (Nginx/Apache) sets `X-Frame-Options: SAMEORIGIN` and `Content-Security-Policy`.

## Development

*   **Linting**: `pnpm lint`
*   **Testing**: `pnpm test`
*   **Clean**: `pnpm nx clean`

## License

Partic is a fork of Element Web.

*   Copyright (c) 2014-2017 OpenMarket Ltd
*   Copyright (c) 2017 Vector Creations Ltd
*   Copyright (c) 2017-2025 New Vector Ltd
*   Copyright (c) 2025 Partic Team

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
