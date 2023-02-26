<div align="center" style="display:flex;flex-direction:column;">
  <a href="https://cycles.watch">
    <img src="https://github.com/peterpeterparker/cycles.watch/raw/main/static/icons/icon-256x256.png" width="140px" alt="Cycles.watch" role="presentation" />
  </a>

<h3>Cycles.watch</h3>

  <br/>

[![GitHub release](https://img.shields.io/github/release/papyrs/cycles.watch/all?logo=GitHub&style=flat-square)](https://github.com/peterpeterparker/cycles.watch/releases/latest)

</div>

## Cycles.watch

[Cycles.watch] tracks the cycles' consumption of your canisters (on the [Internet Computer](https://internetcomputer.org/)). It refreshes periodically their state and notifies you when they are about to get out of resources.

Its usage is anonymous and settings are saved offline - i.e. in your browser ([IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)).

Notifications are optional and thrown locally ([Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)). Please note that on the contrary to "Push Notifications", these are emitted only if the dapp is opened on your device (regardless if active, idle or in the background).

## Hacking

How to run locally the application.

### Prerequisite

Make sure you have a recent version of [Node.js installed](https://nodejs.org/en/) (LTS recommended).

### Clone the repo

Clone the repo (or a fork) and install the dependencies.

```
git clone https://github.com/peterpeterparker/cycles.watch
cd cycles.watch
npm ci
```

### Run locally

To start the local dev server, run following command:

```
npm run dev
```

Per default, it will interact with `mainnet`. If you wish to develop locally, deploy the CMC and II canisters locally and set their respective local canister ID in `.env.hack` and run the development service with the `--mode hack` flag.

## License

Cycles.watch is released under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. See [GNU-AGPL-3.0](GNU-AGPL-3.0) and [COPYING](COPYING) for more details.

[cycles.watch]: https://cycles.watch
