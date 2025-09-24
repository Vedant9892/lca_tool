# LCA Dashboard - Life Cycle Assessment Web Application

A comprehensive web application for analyzing the environmental impact of aluminum production through Life Cycle Assessment (LCA) calculations.

## Features

### 🔐 Authentication System
- Secure user authentication with Supabase
- Responsive sign-in and sign-up pages
- Protected routes requiring user login

### 📊 Dashboard
- Clean, modern interface with four main sections:
  - **LCA Tool**: Real-time environmental impact calculations
  - **View History**: Access previous calculations and reports
  - **Compare Routes**: Side-by-side analysis of conventional vs recycled routes
  - **Product Input**: Personalized product specifications

### 🧮 LCA Calculation Tool
- Comprehensive input form with:
  - Product selection (pipes, sheets)
  - Production route options (conventional/recycled)
  - Energy source selection (renewable/non-renewable)
  - Detailed dimension inputs
  - End-of-life options

### 📈 Advanced Visualizations
- **Primary Factor**: CO₂ emissions (highlighted)
- **Secondary Factors**: Electricity, quality, cost, natural gas, wastewater, manufacturing, transport
- Multiple chart types: Sankey diagrams, bar charts, line graphs, pie charts, radar charts
- Interactive expandable results with detailed breakdowns

### 💡 Intelligent Recommendations
- Alternative pathway suggestions
- Renewable vs non-renewable energy comparisons
- Conventional vs recycled route analysis
- Cost-benefit analysis with environmental impact

## Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Google Sans (Inter fallback)

## Getting Started

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Setup Supabase**
   - Click "Connect to Supabase" button in the top right
   - Copy your Supabase URL and anon key to `.env`

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Backend API**
   ```bash
   python -m uvicorn api.main:app --reload --port 8000
   ```

## Environment Variables

Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

## API Integration

The application integrates with the existing Python FastAPI backend for ML model calculations. The LCA tool sends requests to `/dashboard/stages` endpoint and processes the response for visualization.

## Design Features

- **Light Theme**: Clean, professional appearance
- **Responsive Design**: Works on all device sizes
- **Micro-interactions**: Smooth animations and hover effects
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Modern UI**: Card-based layout with consistent spacing (8px system)

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard pages
│   ├── LCA/           # LCA tool components
│   └── Layout/        # Layout components
├── contexts/          # React contexts
├── lib/              # Utility libraries
└── styles/           # Global styles
```

This application provides a comprehensive solution for Life Cycle Assessment with modern web technologies, intuitive user experience, and powerful analytical capabilities.
