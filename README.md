# DART - Anonymous Review Website

Anonymous submission website for ICLR review, featuring trajectory visualization, source code download, and model checkpoint access.

## Features

- **Anonymous Submission**: Fully anonymized for double-blind review process
- **Three-Section Interface**: 
  - Overview: Introduction, resources (code & checkpoint), and key statistics
  - Trajectories: Interactive trajectory visualization with step-by-step navigation
  - Code & Model: Detailed resource access and quick start guide
- **Source Code Download**: Direct download of implementation code (ZIP)
- **Model Checkpoint Access**: Instructions for accessing 7B model checkpoint
- **Interactive Visualization**: 
  - Step-by-step trajectory navigation
  - Mouse action markers (crosshairs and arrows)
  - Keyword highlighting for "Thought:" and "Action:"
- **Modern UI**: Clean, responsive design with smooth transitions

## Prerequisites

- Node.js (v16 or higher)
- npm

## Installation

Install dependencies:
```bash
npm install
```

## Usage

### Development Mode

Simply run:
```bash
npm run dev
```

Then open your browser and navigate to:
```
http://localhost:3000
```

That's it! The application will automatically load all trajectories from the `trajectories/` folder.

### Production Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
iclr-dart-page/
├── src/
│   ├── components/
│   │   └── MarkedImage.vue         # Image with mouse action markers
│   ├── App.vue                      # Main single-page application
│   └── main.js                      # Application entry point
├── trajectories/                    # Trajectory data folders
│   └── [trajectory-id]/
│       ├── task_config.json
│       ├── final_messages.json
│       ├── reward.txt
│       └── image_*.png
├── index.html
├── vite.config.js                   # Vite config with integrated API
└── package.json
```

## Data Format

Each trajectory folder should contain:
- `task_config.json`: Task configuration and instruction
- `final_messages.json`: Message history with actions
- `reward.txt`: Reward score
- `image_*.png`: Screenshots for each step

## Technologies Used

- **Vue 3**: Frontend framework
- **Vite**: Build tool and dev server with integrated API
- **Canvas API**: For drawing mouse action markers

## How It Works

The application processes trajectory data at build time:
1. `build-data.js` reads all trajectories from the `trajectories/` folder
2. Converts images to base64 and processes mouse coordinates
3. Generates static JSON files in `public/data/`
4. The Vue app loads these JSON files directly

This approach allows the app to be deployed as a static site on GitHub Pages.

## Deployment to GitHub Pages

See [DEPLOY.md](./DEPLOY.md) for detailed instructions on deploying to GitHub Pages.

Quick steps:
```bash
# Build the data and application
npm run build

# The dist/ folder is ready for deployment
```

## License

MIT

# dart-fig
# dart-fig
