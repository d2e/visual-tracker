# 🎯 Visual Activity Tracker

A beautiful, mobile-responsive activity tracker built with React and Tailwind CSS. Perfect for tracking daily activities with integrated timers, progress visualization, and customizable mascots.

![Activity Tracker](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0.6-646CFF?logo=vite)
![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-brightgreen)

## ✨ Features

- 📱 **Fully Mobile Responsive** - Optimized for phones, tablets, and desktops
- ⏱️ **Built-in Timers** - 5 and 10-minute timers for each activity
- 🎨 **Customizable Activities** - Configure via simple JSON file
- 🎭 **Mascot System** - Assign fun mascots to activities
- 📊 **Progress Tracking** - Visual progress bar for daily completion
- 📅 **Weekday Navigation** - Switch between Monday-Friday schedules
- 🎯 **Touch-Optimized** - Large touch targets for easy mobile interaction
- ✅ **Task Completion** - Check off completed activities
- 🔄 **Daily Reset** - Reset all tasks for a fresh start

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/d2e/visual-tracker.git

# Navigate to the project
cd visual-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

The tracker is configured via the `public/activity.json` file:

```json
{
  "title": "Your Name",
  "activities": [
    {
      "id": "unique-id",
      "time": "08:00",
      "task": "Activity Name",
      "icon": "Coffee",
      "color": "orange",
      "mascot": "MascotName",
      "isMain": false
    }
  ],
  "mascots": [
    { "name": "Fuse", "color": "red", "emoji": "🔴" }
  ]
}
```

### Available Icons

`Coffee`, `BookOpen`, `PauseCircle`, `Calculator`, `Trophy`, `Car`, `Utensils`, `Music`, `Gamepad2`, `Pencil`, `Bath`, `Bed`, `Tv`, `Apple`, `Heart`, `Smile`, `Sun`, `Moon`

### Available Colors

`orange`, `blue`, `green`, `purple`, `yellow`, `red`, `cyan`, `pink`, `indigo`, `teal`

## 🎮 Usage

1. **Navigate Days** - Use the left/right arrows to switch between weekdays
2. **Start Timer** - Click the 5m or 10m button to start a timer for an activity
3. **Pause/Resume** - Click the play/pause button to control the timer
4. **Complete Task** - Click anywhere on the activity card to mark it as complete
5. **Reset Day** - Click "Reset" button at the bottom to clear all completions

## 🏗️ Tech Stack

- **React 18.3.1** - UI framework
- **Vite 6.0.6** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **PostCSS & Autoprefixer** - CSS processing

## 📱 Mobile Optimizations

- Progressive sizing system (mobile → tablet → desktop)
- Touch-optimized buttons with `touch-manipulation`
- Active states instead of hover for better mobile feedback
- Reduced padding and borders on small screens
- Responsive text that wraps instead of truncating
- Large, easy-to-tap timer buttons (min 44x44px)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💡 Customization Ideas

- Add more activities to your schedule
- Create different configurations for weekends
- Add custom mascots with different emojis
- Modify timer durations in the component
- Integrate with calendar APIs
- Add sound notifications when timers complete
- Export completion data for tracking progress

## 🐛 Known Issues

- None currently! Report issues [here](https://github.com/d2e/visual-tracker/issues)

## 📞 Support

For questions or support, please [open an issue](https://github.com/d2e/visual-tracker/issues) on GitHub.

---

Made with ❤️ using React and Tailwind CSS
