<div align="center" style="display:flex;flex-direction:column;">
  <a href="https://cycles.watch">
    <img src="https://github.com/peterpeterparker/cycles.watch/raw/main/static/images/social-image.jpg"alt="Cycles.watch" role="presentation" />
  </a>

<br/><br/>

[![GitHub release](https://img.shields.io/github/release/papyrs/cycles.watch/all?logo=GitHub&style=flat-square)](https://github.com/peterpeterparker/cycles.watch/releases/latest)

</div>

## Cycles.watch

[Cycles.watch] shows the current cycle balance of your canisters on the [Internet Computer](https://internetcomputer.org/) and monitors their status over time. It periodically refreshes the data and displays a local notification if any canister drops below a defined threshold.

It also offers an **ICP-to-cycles swap** feature to top up your canister using an external wallet 👛. Currently, this is supported through [OISY](https://oisy.com) .

The dapp is built with [Juno](https://juno.build) 👨‍💻.

[!NOTE]
Notifications are shown only while the app is open — even if it's running in the background. These are not push notifications.

## Hacking

Want to contribute or run it locally? Here's how.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (LTS recommended).
- [Juno CLI](https://juno.build/docs/reference/cli) installed globally:

```bash
npm install -g @junobuild/cli
```

### Clone the repo

```bash
git clone https://github.com/peterpeterparker/cycles.watch
cd cycles.watch
npm ci
```

### Run locally

Start local development

In one terminal, start the Juno emulator:

```bash
juno dev start
```

In another terminal, start the frontend:

```bash
npm run dev
```

This will launch the app in development mode and connect it to your local emulator environment.

The frontend starts on port `5173`. You’ll need the local Juno Console UI to create canisters — it’s available on port `5866`.

## License

Cycles.watch is released under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. See [GNU-AGPL-3.0](GNU-AGPL-3.0) and [COPYING](COPYING) for more details.

[cycles.watch]: https://cycles.watch
