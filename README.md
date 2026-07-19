<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# THE UNIVERSE - NASA-Level 3D Space Exploration

A comprehensive 3D space exploration application featuring:
- Interactive Solar System with all planets
- Earth Explorer with globe.gl
- Space News feed
- AI Chat Assistant (Gemini-powered)

View your app in AI Studio: https://ai.studio/apps/65ef8b16-3777-4892-9139-a6f0587fc717

## Run Locally

**Prerequisites:** Node.js (v18+ recommended)

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from: https://aistudio.google.com/apikey

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to: http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Security Notes

⚠️ **IMPORTANT:** Never commit your API keys to version control.
- The `.env.local` file is in `.gitignore`
- The hardcoded API key has been removed from the source code
- All API calls should go through the server-side proxy (`/api/chat`)

## Features

### Solar System
- 3D interactive model of all 8 planets
- Realistic orbits and scaling
- Click on planets for detailed information
- OrbitControls for smooth navigation

### Earth Explorer
- Interactive 3D globe with globe.gl
- Space launch sites marked
- Click on locations for details
- Multiple view modes (default, atmosphere, space)

### Space News
- Latest space and astronomy news
- Categorized articles
- Search functionality

### AI Chat
- Gemini-powered AI assistant
- Context-aware responses
- Fallback responses when API is unavailable
- Conversation history

## Project Structure

```
THE-UNIVERSE/
├── index.html          # Main application HTML
├── server.ts           # Express server with API proxy
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── .env.local          # Environment variables (not committed)
└── README.md           # This file
```

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **3D Rendering:** Three.js, globe.gl
- **Animations:** GSAP
- **Backend:** Express.js, TypeScript
- **AI:** Google Gemini API
- **Styling:** Tailwind CSS (via CDN)

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure your API key is valid
   - Check that billing is enabled for your Google Cloud project
   - Verify the key has the correct permissions

2. **Three.js Not Loading**
   - Check your internet connection (CDN dependencies)
   - Try clearing your browser cache
   - Ensure CORS is not blocking the scripts

3. **Server Not Starting**
   - Make sure port 3000 is available
   - Check that all dependencies are installed (`npm install`)
   - Verify Node.js is installed correctly

4. **Globe Not Rendering**
   - The globe.gl library requires WebGL support
   - Ensure your browser supports WebGL
   - Try a different browser (Chrome, Firefox, Edge recommended)

## License

MIT License - Feel free to use, modify, and distribute.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## Acknowledgments

- NASA for inspiration and data
- Three.js community for 3D rendering
- Google for the Gemini API
- All contributors and supporters
