# Lablary

![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey?style=flat&logo=android&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Stars](https://img.shields.io/github/stars/yourusername/lablary?style=flat&logo=github)

**A mobile label design tool for people who own thermal printers and refuse to use the terrible apps that come with them.**

---

## The Problem (or: Why This Exists)

If you own a thermal label printer — a Niimbot, a DYMO, a Brother — you already know the frustration. The official apps are, to put it diplomatically, not great. Ugly interfaces, fonts that look like they were chosen by someone who had never *seen* a font before, icon libraries with about forty clipart-style images last updated in 2011, and customization options that feel like an afterthought.

I bought a Niimbot D110 to organize my home office. Cables, storage bins, chargers. Nothing fancy — just clean, consistent labels. What I wanted was simple: *pick an icon, type some text, make it look nice, and print it.* What the official app gave me was a 40-step journey through a UI that seemed actively hostile to that goal.

So I built Lablary instead.

---

## What It Is

Lablary is a **mobile label design studio** built with React Native and Expo. You open it, design a label on an interactive canvas, and export it as a PNG. That's the loop. No accounts, no cloud sync, no subscription tier that unlocks the good fonts.

The app is designed around thermal printer workflows — small, high-contrast labels that need to be legible at a glance and look like they belong together. But nothing stops you from designing labels for anything else.

---

## Screenshots

| Editor | Icon Search | Style Panel |
|--------|-------------|-------------|
| ![Editor Screen](docs/screens/editor.png) | ![Icon Search](docs/screens/icon-search.png) | ![Style Panel](docs/screens/style.png) |

![Canvas Zoom](docs/screens/canvas.png)

---

## Demo

**Creating a label from scratch** — picking a font, searching for an icon, tweaking the layout, and exporting.

![Creating a Label](docs/demo/create-label.gif)

**Icon search in action** — searching across 18+ icon libraries in real time.

![Icon Search Demo](docs/demo/icon-search.gif)

**Export flow** — saving to gallery, sharing, and sending to a printer.

![Export Demo](docs/demo/export.gif)

---

## Features

### Text & Typography

Lablary ships with 10 Google Fonts (Inter, Roboto, Lato, Montserrat, Nunito, Oswald, Raleway, Playfair Display, Courier Prime, Pacifico) and lets you dial in font size anywhere from 8px to 120px. You can toggle between regular and bold when the font supports it. Text color is fully customizable with a proper color picker — hex values, hue sliders, the works.

### Layout System

There are four layout modes: icon on the left, icon on the right, icon on top, or text only. Inner padding is adjustable, three border radius styles control the shape of your label, and five aspect ratio presets (1:1, 2:1, 3:1, 4:3, 16:9) cover most real-world label formats. You can also type in custom dimensions if none of those fit your tape.

### Interactive Canvas

The canvas is the core of the design experience. Pinch to zoom from 0.25× to 4× to check fine detail. Two-finger pan to reposition the canvas in the workspace. Drag the corner and edge handles to resize the label directly. None of this affects the exported PNG — it's all for comfortable editing. The canvas renders exactly what will be exported, with a checkerboard background so transparency is always obvious.

---

## Icon Search

One of the reasons official label apps are so limited is that they bundle a fixed set of icons. Lablary takes a different approach: it queries the **[Iconify API](https://iconify.design/)** at search time, giving you live access to **18+ icon libraries** including Material Design, Lucide, Font Awesome, Phosphor, Tabler, Remix Icons, and more. That's tens of thousands of searchable icons, all rendered as crisp SVGs at any size.

You can filter by library if you want a consistent visual style across your labels — all Lucide icons, for instance, have the same stroke weight and feel cohesive together. The app remembers which libraries you have enabled in settings, so your preferred source is always front and center.

---

## Export & Printing

Once your label is ready, you have three options from the Export tab or the top bar:

- **Save to Gallery** — exports a PNG to your device's photo library at your chosen quality setting (low, medium, or high resolution).
- **Share** — opens the native OS share sheet. Useful for sending the PNG to another app, AirDropping it, or using your printer's companion app directly.
- **Print** — sends the label to Android's built-in Print Manager, which works with network printers and compatible USB printers.

For **Niimbot printers specifically**, the official app doesn't support receiving images from other apps. To bridge that gap, check out [NiimbotPrintHandlerApp](https://github.com/terratempest/NiimbotPrintHandlerApp) — a small Android helper app that listens for shared images and forwards them directly to your Niimbot device over Bluetooth. Share the PNG from Lablary → NiimbotPrintHandlerApp → printed label.

---

## Tech Stack

| Library | Role |
|---------|------|
| [React Native 0.81.5](https://reactnative.dev/) | Mobile UI framework |
| [Expo SDK 54](https://expo.dev/) | Build toolchain, native APIs |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | All animations — canvas gestures, UI transitions, button feedback |
| [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) | Pinch, pan, and tap gesture recognition |
| [@gorhom/bottom-sheet](https://gorhom.dev/react-native-bottom-sheet/) | Animated editor panel on phones |
| [NativeWind](https://www.nativewind.dev/) | Tailwind CSS utility classes for React Native |
| [Iconify API](https://iconify.design/) | Live icon search across 18+ libraries |
| [react-native-view-shot](https://github.com/gre/react-native-view-shot) | Canvas capture for PNG export |
| [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) | Native OS share intent |
| [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/) | Save to device gallery |
| [expo-print](https://docs.expo.dev/versions/latest/sdk/print/) | Send to Android Print Manager |
| [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | Tactile feedback on button presses |

---

## Architecture

State is managed through custom hooks using a reducer pattern: `useLabel` owns the label design state, `useSettings` handles user preferences, and `useAdaptiveLayout` handles the phone/tablet split.

**On phones**, the canvas takes up the upper portion of the screen with the editor living in a bottom sheet that can be expanded or collapsed. A floating reset button sits over the canvas for quick style resets without opening the editor.

**On tablets** (≥768px wide), the layout shifts to a side-by-side view — canvas on the left, a fixed 320px editor panel on the right. No bottom sheet needed.

All animations — button press feedback, entrance transitions, the settings gear rotation, the download state indicator — are implemented with `react-native-reanimated` shared values and spring physics. Haptic feedback is layered on top of key interactions via `expo-haptics`.

---

## Future Ideas

A few things that would make Lablary genuinely more powerful:

- **Direct Bluetooth printer integration** — remove the need for a helper app entirely by speaking CPCL/ZPL or the Niimbot protocol directly.
- **Label templates** — start from a pre-built layout instead of a blank canvas.
- **Saved presets** — save your favorite color schemes and font pairings for reuse.
- **QR codes and barcodes** — useful for inventory, asset tracking, and the occasional nerd flex.
- **Icon favorites** — bookmark frequently used icons instead of searching every time.

---

## About

Lablary started as a Saturday afternoon project to get my home office organized. It's since turned into a small label design studio that I genuinely use every week. If you own a thermal printer and have ever stared at its official app in quiet despair, I hope this helps.

Built with ☕ and mild frustration by someone with too many unlabeled cables.

---

*MIT License — do whatever you want with it.*
