[![](./material/github_banner.png?raw=true)](https://github.com/hieuhani/simpos)

<p>
  <a href="https://simpos.vercel.app/"><strong>Web Demo</strong></a> ·
  <a href="https://github.com/hieuhani/simpos/releases"><strong>Download Demo App</strong></a> ·
  <a href="#️-technical-specifications"><strong>Technical specifications</strong></a> ·
  <a href="#-contributing"><strong>Contributing</strong></a>
</p>




# Simpos 🧑‍🍳

Simpos is an intuitive interface and powerful features point of sale client software for Odoo back end using React.

It brings better experiences and easy to customize your point of sale and still keeping a comprehensive Odoo features for back end operations such as accounting and inventory. Some highlight features of the this version:

- Compatible with any hardware including Sunmi devices (I'm using Sumni T2 at my bakery shop)
- Offline POS support
- Multiple orders simultaneously (for restaurant mode use-case)
- Record customer information
- Multiple payment methods support
- Multiple cashiers
- Vibration card order support
- Table tag order support
- Bar code scanner support
- Kitchen printer via network support
- Customer screen support (for advertising, customer order review use-case)
- Discount directly or percentage discount support
- Responsive layout
- Multiple price list support
- ...and many more

## ❤️ Technical specifications

Basic dependencies used:

- Web library uses [ReactJS](https://github.com/facebook/react)
- Web router uses [React Router](https://github.com/remix-run/react-router)
- Multi-platform app is built with [Tauri](https://github.com/tauri-apps/tauri)
- Offline database is IndexedDB and uses [Dexie.js](https://dexie.org/)
- UI framework uses [Chakra UI](https://github.com/chakra-ui/chakra-ui)
- Front end tooling uses [Vite](https://github.com/vitejs/vite)
- Complex state uses [XState](https://github.com/statelyai/xstate)
- HTTP client uses [Axios](https://github.com/axios/axios)


Advanced technologies used and why:

1. Web Worker
    - To continuous bulk download product images as blob
    - To sync data between multiple browser tabs
    - Not at this version but will use for background sync
2. IndexedDB
    - To store all application data including products, orders
    - To create composite index base on several product key-paths to support full product text search

3. Tauri
    - To create multi-platform desktop app

## ⚡️ Quick start

1. Run `pnpm install` to install dependencies
2. Run `pnpm dev` to start development
3. Open [http://localhost:5173](http://localhost:5173)

## 📸 Screenshots

<img
  src="./material/screenshot_1.png?raw=true"
  alt="Simpos"
  width="100%"
/>

<img
  src="./material/screenshot_3.png?raw=true"
  alt="Simpos"
  width="100%"
/>

<img
  src="./material/screenshot_5.png?raw=true"
  alt="Simpos"
  width="100%"
/>

<img
  src="./material/screenshot_7.png?raw=true"
  alt="Simpos"
  width="100%"
/>


## 📚 Contributing

- [Open an issue](https://github.com/hieuhani/simpos/issues) if you believe you've encountered a bug with the module.

## ⛓️ License

[MIT License](./LICENSE)
