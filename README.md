# 🌍 Place Guesser

An interactive geography guessing game where players identify locations from Street View images. Players progress through increasingly specific guesses: continent → country → state → city, with a scoring system that rewards accuracy and speed.

## 🎮 Game Features

- **Progressive Difficulty**: Start with continent, work your way to city
- **Smart Scoring**: More points for correct guesses on the first try
- **Google Places Integration**: Autocomplete suggestions for countries and cities
- **Beautiful UI**: Smooth animations and responsive design
- **Mobile Ready**: PWA-compatible for mobile app packaging

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Google Maps API key with Places and Street View APIs enabled

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd place-guesser
   npm install
   ```

2. **Set up Google Maps API:**
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Places API and Street View Static API
   - Create a `.env` file in the root directory:
     ```
     REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 How to Play

1. **View the Image**: A random Street View image from somewhere in the world appears
2. **Guess Continent**: Select from 7 continents (dropdown)
3. **Guess Country**: Type the country name (autocomplete suggestions)
4. **Guess State**: Select US state (dropdown, US locations only)
5. **Guess City**: Type the city name (autocomplete suggestions)
6. **Score Points**: Get more points for correct guesses on the first try!

### Scoring System

- **Continent**: 10 points (first try) / 5 points (subsequent)
- **Country**: 20 points (first try) / 10 points (subsequent)
- **State**: 30 points (first try) / 15 points (subsequent)
- **City**: 50 points (first try) / 25 points (subsequent)

**Total possible score**: 110 points (all correct on first try)

## 🛠️ Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Game.tsx        # Main game logic
│   ├── LocationImage.tsx # Street View display
│   ├── GuessInput.tsx  # Input handling
│   ├── ScoreDisplay.tsx # Score and progress
│   ├── GameOver.tsx    # End game screen
│   └── GoogleMapsLoader.tsx # API initialization
├── types/              # TypeScript interfaces
│   └── game.ts         # Game state types
├── utils/              # Game logic utilities
│   └── gameLogic.ts    # Core game functions
├── services/           # External API services
│   └── placesApi.ts    # Google Places integration
└── App.tsx             # Main application
```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📱 Mobile App Packaging

This app is designed to be easily packaged as a mobile app:

### PWA Features
- Service worker ready
- Responsive design
- Offline capability (with proper caching)

### Capacitor Integration
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Google Maps API Requirements

- **Places API**: For autocomplete suggestions
- **Street View Static API**: For location images
- **Maps JavaScript API**: For core functionality

## 🎨 Customization

### Adding New Locations

Edit `src/utils/gameLogic.ts` to add more sample locations:

```typescript
const SAMPLE_LOCATIONS: Location[] = [
  // Add your locations here
  {
    lat: 40.7128,
    lng: -74.0060,
    city: 'New York',
    state: 'New York',
    country: 'United States',
    continent: 'North America',
    imageUrl: 'your_street_view_url'
  }
];
```

### Styling

The app uses Tailwind CSS with custom animations. Modify `src/index.css` and `tailwind.config.js` for styling changes.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
- Connect your repository
- Set build command: `npm run build`
- Set publish directory: `build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your Google Maps API key is correct
3. Ensure all required APIs are enabled
4. Check the [Issues](../../issues) page for known problems

---

**Happy Guessing! 🌍✨**
