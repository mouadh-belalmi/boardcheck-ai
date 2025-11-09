# BoardCheck AI - Web Application

A modern, responsive web application for AI-powered PCB (Printed Circuit Board) defect detection. This application provides a user-friendly interface for uploading PCB images, analyzing them for defects, and managing analysis history.

## Features

### 🔍 PCB Defect Detection
- Upload PCB images (JPG, PNG, BMP) up to 10MB
- Real-time AI-powered analysis for 6 defect types:
  - Missing Hole (Red)
  - Mouse Bite (Green) 
  - Open Circuit (Blue)
  - Short Circuit (Orange)
  - Spur (Purple)
  - Spurious Copper (Teal)

### 🌐 Multi-Language Support
- English and Arabic with proper RTL layout
- Dynamic text direction switching
- Localized date/time formatting

### 📊 Comprehensive Results
- Side-by-side image comparison (original vs analyzed)
- Defect type breakdown with confidence scores
- Quality grading system (A-D)
- Zoom and pan functionality
- Visual defect annotations

### 📚 History Management
- Local storage for analysis history
- Filterable history (All, With Defects, Clean)
- Thumbnail previews with status badges
- Delete individual items or clear all

### 🚀 Modern UI/UX
- Responsive design (mobile-first)
- Smooth animations with Framer Motion
- Drag-and-drop file upload
- Real-time server status monitoring
- Loading states and progress indicators

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **File Upload**: React Dropzone
- **State Management**: React Hooks + Local Storage

## API Integration

The application integrates with a PCB defect detection API:

- **Base URL**: `http://5.135.79.195`
- **Endpoints**:
  - `GET /health` - Server health check
  - `POST /detect` - Upload image for analysis
  - `GET /history` - Retrieve detection history

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boardcheck-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## File Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # App header with language toggle
│   ├── Hero.tsx         # Hero section with animated logo
│   ├── UploadInterface.tsx  # File upload interface
│   ├── ResultsDisplay.tsx   # Analysis results display
│   └── HistorySection.tsx   # History management
├── services/            # API services
│   └── api.ts          # API integration layer
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts  # Local storage hook
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── App.tsx             # Main application component
├── App.css             # Custom CSS styles
├── index.tsx           # Application entry point
└── index.css           # Global styles with Tailwind
```

## Key Components

### Header
- Server status indicator with real-time monitoring
- Language toggle (EN/AR)
- Analysis history counter

### Upload Interface
- Drag-and-drop file upload
- File validation (format, size)
- Progress tracking during analysis
- Error handling with user-friendly messages

### Results Display
- Image comparison with zoom controls
- Defect type cards with confidence scores
- Quality grading visualization
- Save to history functionality

### History Section
- Filterable analysis history
- Thumbnail previews
- Individual item actions (view, delete)
- Bulk operations (clear all)

## Defect Types

The application supports detection of 6 PCB defect types:

| Defect Type | Color | Icon | Description |
|-------------|-------|------|-------------|
| Missing Hole | Red | ○ | Missing drill holes in PCB |
| Mouse Bite | Green | 🐛 | Small notches at board edges |
| Open Circuit | Blue | ⏻ | Broken electrical connections |
| Short Circuit | Orange | ⚡ | Unwanted electrical connections |
| Spur | Purple | 🔀 | Extra copper protrusions |
| Spurious Copper | Teal | 📊 | Unwanted copper deposits |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- Lazy loading for images
- Component memoization
- Efficient re-rendering
- Local caching strategies
- Optimized bundle size

## Security Features

- File type validation
- File size limits
- XSS protection
- CORS handling
- Input sanitization

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.