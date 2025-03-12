# Calendar Card Pro for Home Assistant

[![hacs][hacs-img]][hacs-url] [![GitHub Release][github-release-img]][github-release-url] [![Downloads][github-downloads-img]][github-release-url]

<img src="docs/images/preview.png" alt="Calendar Card Pro Preview" width="100%" style="max-width: 600px;">

## Table of Contents

- [1️⃣ Overview](#1️⃣-overview)
- [2️⃣ Installation](#2️⃣-installation)
- [3️⃣ Usage](#3️⃣-usage)
- [4️⃣ Configuration Guide](#4️⃣-configuration-guide)
- [5️⃣ Examples](#5️⃣-examples)
- [6️⃣ Contributing & Roadmap](#6️⃣-contributing--roadmap)

<p>&nbsp;</p>

## 1️⃣ Overview

### 🔍 About

**Calendar Card Pro** was inspired by a beautiful [calendar design using button-card and Hass calendar add-on](https://community.home-assistant.io/t/calendar-add-on-some-calendar-designs/385790) shared in the Home Assistant community. While the original design was visually stunning, implementing it with **button-card** and **card-mod** led to **performance issues**.

This motivated me to create a **dedicated calendar card** that excels in one thing: **displaying upcoming events beautifully and efficiently**.

Built with **performance in mind**, the card leverages **intelligent refresh mechanisms** and **smart caching** to ensure a **smooth experience**, even when multiple calendars are in use.

### ✨ Features

- 🎨 **Sleek & Minimalist Design** – Clean, modern, and visually appealing layout.
- ✅ **Multi-Calendar Support** – Display multiple calendars with unique styling.
- 📅 **Compact & Expandable Views** – Adaptive views to suit different dashboard needs.
- 🔧 **Highly Customizable** – Fine-tune layout, colors, event details, and behavior.
- ⚡ **Optimized Performance** – Smart caching, progressive rendering, and minimal API calls.
- 💡 **Deep Home Assistant Integration** – Theme-aware with native ripple effects.
- 🌍 **Multi-Language Support** – Available in **English** and **German** (more to come).
- 🧩 **Modular & Extensible** – Designed for future enhancements and easy customization.

### 🔗 Dependencies

**Calendar Card Pro** requires at least **one calendar entity** in Home Assistant. It is compatible with any integration that generates `calendar.*` entities, with **CalDAV** and **Google Calendar** being the primary tested integrations.

⚠️ **Important:** Ensure you have at least **one calendar integration set up** in Home Assistant before using this card.

<p>&nbsp;</p>

## 2️⃣ Installation

### 📦 HACS Installation (Recommended)

The easiest way to install **Calendar Card Pro** is via **[HACS (Home Assistant Community Store)](https://hacs.xyz/)**.

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=alexpfau&repository=calendar-card-pro&category=plugin)

#### Steps:

1. Ensure **[HACS](https://hacs.xyz/docs/setup/download)** is installed in Home Assistant.
2. Go to **HACS → Frontend → Custom Repositories**.
3. Add this repository: `https://github.com/alexpfau/calendar-card-pro`
4. Install **Calendar Card Pro** from HACS.
5. **Clear your browser cache** and reload Home Assistant.

### 📂 Manual Installation

<details>
<summary>📖 Click to expand manual installation instructions</summary>

#### Steps:

1. **Download** the latest release:  
   👉 [calendar-card-pro.js](https://github.com/alexpfau/calendar-card-pro/releases/latest)

2. **Move the file** to your Home Assistant `www` folder:  
   /config/www/

3. **Navigate to:**
   Home Assistant → Settings → Dashboards → Resources → Add Resource

4. **Add the resource** to your Lovelace Dashboard:

   ```yaml
   url: /local/calendar-card-pro.js
   type: module
   ```

5. **Clear cache & refresh** your browser to apply changes.

</details>

<p>&nbsp;</p>

## 3️⃣ Usage

Once **Calendar Card Pro** is installed, follow these steps to add and configure it in your Home Assistant dashboard.

### 📌 Adding the Card to Your Dashboard

1. **Ensure a Calendar Integration is Set Up**  
   Calendar Card Pro requires at least one `calendar.*` entity in Home Assistant (e.g., **Google Calendar, CalDAV**).
2. **Open Your Dashboard for Editing**

   - Navigate to **Home Assistant → Dashboard**
   - Click the three-dot menu (⋮) → **Edit Dashboard**

3. **Add Calendar Card Pro**

   - Click the ➕ **Add Card** button
   - Search for `"Calendar"` or scroll to find `"Calendar Card Pro"`
   - Select the card to add it to your dashboard

4. **Initial Setup & Configuration**
   - By default, the card will **automatically detect available calendars** and select the first one.
   - Use the **YAML mode** for advanced customization.

### ⚙️ Customizing the Card

Calendar Card Pro offers a range of **customization options** to match your needs.

- **Control which events are displayed**

  - Set `days_to_show` to define how many days are visible.
  - Use `max_events_to_show` to limit the number of events in compact mode.

- **Customize colors, fonts, and layout**

  - Apply different colors per calendar using the `color` option.
  - Adjust font sizes for event details, dates, and other elements.
  - Modify separators and spacing for a personalized look.

- **Modify tap/hold actions**
  - Set `tap_action` and `hold_action` to `expand`, `navigate`, or other HA-supported actions.

##### YAML Configuration (Example)

```yaml
type: custom:calendar-card-pro
title: 'Upcoming Events'
entities:
  - entity: calendar.family
    color: '#e63946' # Custom color for family events
  - entity: calendar.work
    color: '#457b9d' # Custom color for work events
days_to_show: 5
max_events_to_show: 5
show_location: true
```

### 🚀 Next Steps

- Explore the [📚 Configuration Guide](#4️⃣-configuration-guide) for a **detailed list of options**.
- Check out the [💡 Examples](#5️⃣-examples) section for **pre-configured setups**.
- Get involved! Check out the [Contributing & Roadmap](#6️⃣-contributing--roadmap) section to learn **how to contribute** and see **upcoming features**.

<p>&nbsp;</p>

## 4️⃣ Configuration Guide

### ⚙️ Variables

The following table provides an overview of all available configuration options.

| Name                        | Type    | Default                       | Description                                       |
| --------------------------- | ------- | ----------------------------- | ------------------------------------------------- |
| **entities**                | array   | Required                      | List of calendar entities with optional styling   |
| **days_to_show**            | number  | `3`                           | Number of days to display                         |
| **max_events_to_show**      | number  | `-`                           | Maximum number of events to show in compact mode  |
| **show_past_events**        | boolean | `false`                       | Show today's events that have already ended       |
| **language**                | string  | `System`                      | Interface language (`en`, `de`)                   |
| **refresh_interval**        | number  | `30`                          | Minutes between auto-refresh of events            |
| **cache_duration**          | number  | `30`                          | Cache validity of fetched events in minutes       |
| **time_24h**                | boolean | `true`                        | Use 24-hour time format                           |
| **show_end_time**           | boolean | `true`                        | Show event end times                              |
| **show_month**              | boolean | `true`                        | Show month names                                  |
| **show_location**           | boolean | `true`                        | Show event locations                              |
| **remove_location_country** | boolean | `true`                        | Remove country from location                      |
| **background_color**        | string  | `var(--ha-card-background)`   | Card background color                             |
| **row_spacing**             | string  | `5px`                         | Spacing between calendar day rows                 |
| **additional_card_spacing** | string  | `0px`                         | Additional top/bottom padding for the card        |
| **vertical_line_width**     | string  | `2px`                         | Width of vertical separator line                  |
| **vertical_line_color**     | string  | `#03a9f4`                     | Color of vertical separator line & ripple effects |
| **horizontal_line_width**   | string  | `0px`                         | Width of horizontal separator line                |
| **horizontal_line_color**   | string  | `var(--secondary-text-color)` | Color of horizontal separator line                |
| **title**                   | string  | `-`                           | Card title                                        |
| **title_font_size**         | string  | `20px`                        | Card title font size                              |
| **weekday_font_size**       | string  | `14px`                        | Weekday font size                                 |
| **day_font_size**           | string  | `26px`                        | Day number font size                              |
| **month_font_size**         | string  | `12px`                        | Month font size                                   |
| **event_font_size**         | string  | `14px`                        | Event title font size                             |
| **time_font_size**          | string  | `12px`                        | Event time font size                              |
| **location_font_size**      | string  | `12px`                        | Location text font size                           |
| **time_location_icon_size** | string  | `16px`                        | Size of time and location icons                   |
| **title_color**             | string  | `var(--primary-text-color)`   | Card title text color                             |
| **weekday_color**           | string  | `var(--primary-text-color)`   | Weekday text color                                |
| **day_color**               | string  | `var(--primary-text-color)`   | Day number text color                             |
| **month_color**             | string  | `var(--primary-text-color)`   | Month text color                                  |
| **event_color**             | string  | `var(--primary-text-color)`   | Default event title color                         |
| **time_color**              | string  | `var(--secondary-text-color)` | Event time text color                             |
| **location_color**          | string  | `var(--secondary-text-color)` | Location text color                               |
| **tap_action**              | object  | `{ action: "none" }`          | Action on tap/click                               |
| **hold_action**             | object  | `{ action: "none" }`          | Action on long press                              |

### 🗂️ Entity Configuration

The `entities` array accepts either:

1. **A simple entity ID** (default styling applies)
2. **An advanced object configuration** (custom styling per entity)

#### Example:

```yaml
entities:
  - calendar.family # Simple entity ID (default styling)
  - entity: calendar.work # Advanced entity configuration
    color: '#1e90ff' # Custom event color for this calendar
```

##### Explanation:

- A **simple string** (e.g., `calendar.family`) will apply the card’s **default styles**.
- An **object with `entity` and optional parameters** allows customization per calendar:
  - `entity`: The **calendar entity ID** (required).
  - `color`: Custom event title color (optional) – **Overrides** the default `event_color` setting.

### 🏗️ Event Display & Compact Mode

#### Default Behavior

By default, **Calendar Card Pro** displays all events for the next **3 days** (including today). This means:

- If there are **no events** in the next 3 days, the card will show an **empty state**.
- If there are **many events**, all will be displayed, making the card **taller**.
- The **card height adapts dynamically** based on content.
- By default, **past events from today are hidden**, but you can set `show_past_events: true` to display them.

#### Compact Mode

To control **Calendar Card Pro's size**, enable **compact mode** by setting `max_events_to_show`. This:

- Limits the number of events displayed at once.
- Maintains a **consistent card height**.
- Dynamically updates as new events appear.

You can **toggle between compact and full views** by configuring `tap_action` or `hold_action`.

### 🎛️ Actions

Both `tap_action` and `hold_action` support the following options:

| Action Type      | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| **expand**       | Toggles between compact and full view (when `max_events_to_show` is set). |
| **more-info**    | Opens the **More Info** dialog in Home Assistant.                         |
| **navigate**     | Navigates to a different **dashboard view**.                              |
| **call-service** | Calls a **Home Assistant service**.                                       |
| **url**          | Opens an **external URL**.                                                |

**Additional Parameters:**

- `navigation_path`: Path for **navigate** action.
- `url_path`: URL for **url** action.
- `service`: Home Assistant service for **call-service** action.
- `service_data`: Service payload for **call-service** action.

##### Example: Expand View on Tap

```yaml
tap_action:
  action: expand
```

##### Example: Navigate to Calendar Dashboard

```yaml
tap_action:
  action: navigate
  navigation_path: /lovelace/calendar
```

### 🏗️ Material Design Interaction

**Calendar Card Pro** integrates Home Assistant’s **native interaction patterns** for a seamless experience:

- **Ripple Effect** – Provides **visual feedback** on hover and touch.
- **Hold Actions** – Displays a **visual indicator** when the hold threshold is reached.
- **Keyboard Navigation** – Fully supports **Enter/Space** for activation.
- **Haptic Feedback** – Aligns with Home Assistant’s **design language**.

### 🔄 Smart Cache System

**Calendar Card Pro** efficiently handles API calls and refreshes:

- **Minimized API Polling** – Fetches new data **only when necessary**.
- **Automatic Refresh** – Updates **every `refresh_interval` minutes** (default: `30`).
- **Multi-level Caching** – Stores events locally with **configurable expiration**.
- **Reactive Updates** – Events update when:
  - A **calendar entity changes**.
  - **Home Assistant reconnects** after a disconnection.
  - The **dashboard becomes active again**.

### ⚡ Progressive Rendering

To maintain performance, **Calendar Card Pro** progressively renders events:

- **Renders events in small batches** to prevent UI lag.
- **Prevents browser freezing** with optimized rendering.
- **Ensures smooth interactions** even for large event lists.

<p>&nbsp;</p>

## 5️⃣ Examples

This section provides different **configuration setups** to help you get started with **Calendar Card Pro**.

### 📅 Basic Configuration

A simple setup displaying events from a **single calendar**.

<img src=".github/img/example_basic.png" alt="Basic Configuration" width="400">

```yaml
type: custom:calendar-card-pro
entities:
  - calendar.family
days_to_show: 3
show_end_time: true
show_location: false
show_month: false
```

### 🗂️ Multiple Calendars with Compact Mode

This setup includes **multiple calendars**, each with a **custom color**. The **compact mode** ensures that only a limited number of events are shown at once.

<img src=".github/img/advanced_basic.png" alt="Advanced Configuration" width="400">

```yaml
type: custom:calendar-card-pro
title: My Calendars
entities:
  - entity: calendar.family
    color: '#e63946' # Red for family events
  - entity: calendar.work
    color: '#457b9d' # Blue for work events
  - entity: calendar.holidays
    color: '#2a9d8f' # Green for holidays
days_to_show: 7
max_events_to_show: 3 # Always only show 3 events
tap_action:
  action: expand # Tap to expand/collapse
```

### 🎨 Complete Configuration with All Options

A fully **customized** configuration demonstrating **all available options**, including **styling, layout, and interactions**.

<img src=".github/img/example_complete.png" alt="Complete Configuration" width="400">

```yaml
type: custom:calendar-card-pro
# Core Settings
entities:
  - entity: calendar.family
    color: '#ff0000'
  - entity: calendar.work
    color: '#0000ff'
days_to_show: 7
max_events_to_show: 5
show_past_events: false

# Display Mode & Localization
language: 'en'
time_24h: true
show_end_time: true
show_month: true
show_location: true
remove_location_country: true

# Card Layout
title: 'Full Calendar Demo'
background_color: 'var(--ha-card-background)'
row_spacing: '5px'
additional_card_spacing: '0px'

# Visual Separators
vertical_line_width: '2px'
vertical_line_color: '#03a9f4'
horizontal_line_width: '0px'
horizontal_line_color: 'var(--secondary-text-color)'

# Typography: Sizes
title_font_size: '20px'
weekday_font_size: '14px'
day_font_size: '26px'
month_font_size: '12px'
event_font_size: '14px'
time_font_size: '12px'
location_font_size: '12px'
time_location_icon_size: '16px'

# Typography: Colors
title_color: 'var(--primary-text-color)'
weekday_color: 'var(--primary-text-color)'
day_color: 'var(--primary-text-color)'
month_color: 'var(--primary-text-color)'
event_color: 'var(--primary-text-color)'
time_color: 'var(--secondary-text-color)'
location_color: 'var(--secondary-text-color)'

# Actions
tap_action:
  action: expand
hold_action:
  action: more-info
```

<p>&nbsp;</p>

## 6️⃣ Contributing & Roadmap

### 🚀 How to Contribute

Want to improve **Calendar Card Pro**? We welcome contributions of all kinds—whether it’s **fixing bugs, improving performance, or adding new features**!

#### Getting Started

1. **Fork this repo** and clone it locally.
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Start development**:
   ```sh
   npm run dev
   ```
4. **Open a Pull Request** with your changes.

💡 For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

### 📅 Roadmap & Planned Features

We are continuously working on improving **Calendar Card Pro**. Here’s what’s planned for upcoming releases:

- **Enhanced Event Details** – Support for event descriptions, recurring event indicators, and more.
- **Visual Configuration Editor** – Configure all options through an intuitive UI without writing YAML.
- **Expanded Language Support** – Adding more languages (looking for community translations).

💡 Got a feature request? **Open a GitHub Issue** or start a **discussion**!

### 📖 Developer Documentation

For those interested in contributing code, we maintain detailed **architecture documentation** that explains:

- **Code Organization** – Structure and module responsibilities.
- **Data Flow & Processing** – How events are fetched, stored, and displayed.
- **Performance Optimization** – Techniques for fast rendering and caching.
- **Design Principles** – Best practices for UI consistency and accessibility.

### 🌍 Adding Translations

**Calendar Card Pro** currently supports:

- **English (`en`)**
- **German (`de`)**

To add a new language:

1. **Create a new file** in `src/translations/languages/[lang-code].json`
2. **Copy the structure** from an existing language file.
3. **Translate all strings** to your language.
4. **Submit a Pull Request** with your changes.

### 🏆 Acknowledgements

- **Original design inspiration** from [Calendar Add-on & Calendar Designs](https://community.home-assistant.io/t/calendar-add-on-some-calendar-designs/385790) by Home Assistant community member **@GHA_Steph**.
- **Interaction patterns** inspired by Home Assistant’s [Tile Card](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-tile-card.ts), which is licensed under the [Apache License 2.0](https://github.com/home-assistant/frontend/blob/dev/LICENSE.md).
- **Material Design ripple interactions**, originally by Google, used under the [Apache License 2.0](https://github.com/material-components/material-components-web/blob/master/LICENSE).

<!--Badges-->

[hacs-img]: https://img.shields.io/badge/HACS-Custom-orange.svg
[hacs-url]: https://github.com/alexpfau/calendar-card-pro/actions/workflows/hacs-validate.yml
[github-release-img]: https://img.shields.io/github/release/alexpfau/calendar-card-pro.svg
[github-downloads-img]: https://img.shields.io/github/downloads/alexpfau/calendar-card-pro/total.svg
[github-release-url]: https://github.com/alexpfau/calendar-card-pro/releases
