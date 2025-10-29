# CrossFlow - Crossword & Flowchart Application

A React + Vite application featuring embedded crossword puzzles and an interactive flowchart editor with secure access key authentication.

## Features

- 🔐 **Secure Access Key Authentication** - One-time use keys with Supabase backend
- 🧩 **Interactive Crossword** - Embedded crossword puzzles
- 📊 **Flowchart Editor** - Full-featured flowchart builder with multiple question support
- 💾 **Persistent Sessions** - Stay logged in across browser sessions
- 🎨 **Modern UI** - Dark theme with smooth animations

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Setup the database table
- Get your API credentials

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Authentication

The application uses **one-time access keys** for authentication:

- Each access key can only be used **once globally** across all devices
- Authentication persists across browser sessions
- No logout functionality (session remains active)
- Keys are validated against Supabase database in real-time

### Sample Access Keys

```
ACCESS-123           → temp1-11
ACCESS-456           → temp4-2
ACCESS-789           → temp2
CFK-2024-M3N4O5P6   → user-demo
CFK-2024-Q7R8S9T0   → test-user
```

See [ACCESS_KEYS.md](./ACCESS_KEYS.md) for more information.

## Project Structure

```
crossflow/
├── src/
│   ├── components/
│   │   ├── Crossword.jsx      # Crossword puzzle component
│   │   ├── Flowchart.jsx       # Flowchart editor
│   │   ├── FlowchartNodes.jsx  # Custom flowchart nodes
│   │   └── Login.jsx           # Access key login
│   ├── config/
│   │   └── supabase.js         # Supabase configuration
│   ├── utils/
│   │   └── auth.js             # Authentication utilities
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── SUPABASE_SETUP.md           # Supabase setup guide
├── ACCESS_KEYS.md              # Access key documentation
└── .env.example                # Environment variables template
```

## Technologies

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Supabase** - Backend as a Service (authentication & database)
- **React Flow** - Flowchart editor library
- **CSS3** - Styling

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
