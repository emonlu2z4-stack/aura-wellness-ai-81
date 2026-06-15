# Aura Wellness AI - Project Methodology & Technology Documentation

## Executive Summary

**Project Name:** Aura Wellness AI  
**Repository:** emonlu2z4-stack/aura-wellness-ai-81  
**Project Type:** Full-Stack Web Application - AI-Powered Wellness Platform  
**Primary Language:** TypeScript (96.4%)  
**Created:** March 8, 2026  
**Status:** Active Development

---

## 1. Project Overview

### 1.1 Purpose
Aura Wellness AI is a comprehensive wellness and fitness tracking application designed to provide users with AI-driven insights, progress monitoring, and personalized goal tracking for their health and fitness journey.

### 1.2 Core Features
- User authentication and profile management
- Personal health and fitness progress tracking
- Group collaboration and community features
- Personalized goal setting and macronutrient tracking
- AI-powered recommendations and insights
- Weight history tracking
- Thesis and documentation features
- Use case diagram visualization

### 1.3 Target Audience
- Health-conscious individuals
- Fitness enthusiasts
- Users seeking AI-driven wellness guidance
- Collaborative fitness communities

---

## 2. Technology Stack

### 2.1 Frontend Framework & Build Tools

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | Core UI library for building interactive user interfaces |
| **TypeScript** | 5.8.3 | Type-safe JavaScript for improved code reliability |
| **Vite** | 5.4.19 | Fast build tool and development server |
| **Vite React SWC Plugin** | 3.11.0 | Optimized React compilation with SWC |

### 2.2 UI & Styling

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework for rapid UI development |
| **shadcn/ui** | Latest | Pre-built, accessible UI component library |
| **Radix UI** | Various | Unstyled, accessible primitive components |
| **Framer Motion** | 12.34.3 | Advanced animation and gesture library |
| **Lucide React** | 0.462.0 | Modern icon library |

### 2.3 State Management & Data Fetching

| Technology | Version | Purpose |
|-----------|---------|---------|
| **TanStack React Query** | 5.83.0 | Server state management and caching |
| **React Hook Form** | 7.61.1 | Performant form state management |
| **Zod** | 3.25.76 | TypeScript-first schema validation |

### 2.4 Routing & Navigation

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Router DOM** | 6.30.1 | Client-side routing and navigation |

### 2.5 Database & Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Supabase** | 2.98.0 | PostgreSQL database + authentication + real-time features |
| **PostgreSQL** | (via Supabase) | Relational database (1.7% PLpgSQL) |

### 2.6 Authentication & Theme

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Lovable Cloud Auth** | 0.0.3 | Cloud-based authentication service |
| **next-themes** | 0.3.0 | Dark mode and theme management |

### 2.7 Utilities & Helpers

| Technology | Version | Purpose |
|-----------|---------|---------|
| **date-fns** | 3.6.0 | Modern date manipulation library |
| **Recharts** | 2.15.4 | Composable charting library for data visualization |
| **Embla Carousel** | 8.6.0 | Lightweight carousel component |
| **html2canvas** | 1.4.1 | Screenshot/canvas rendering (for PDF export prep) |
| **jsPDF** | 4.2.0 | PDF generation from JavaScript |
| **Sonner** | 1.7.4 | Toast notification system |
| **input-otp** | 1.4.2 | OTP input component |
| **react-resizable-panels** | 2.1.9 | Resizable panel layout system |
| **Vaul** | 0.9.9 | Drawer component library |

### 2.8 Development Tools

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vitest** | 3.2.4 | Unit testing framework (Vite-native) |
| **Testing Library** | Latest | Testing utilities for React components |
| **ESLint** | 9.32.0 | Code linting and quality assurance |
| **PostCSS** | 8.5.6 | CSS transformation tool |
| **Lovable Tagger** | 1.1.13 | Component tagging for Lovable integration |

### 2.9 Language Composition
- **TypeScript**: 96.4% - Primary development language
- **PLpgSQL**: 1.7% - Database procedures and functions
- **CSS**: 1.5% - Styling and animations
- **Other**: 0.4% - Configuration and miscellaneous

---

## 3. Architecture & Design Patterns

### 3.1 Application Structure

```
aura-wellness-ai-81/
├── src/
│   ├── pages/           # Route-based page components
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks (Auth, Theme)
│   ├── ui/             # shadcn/ui components
│   ├── App.tsx         # Main app routing configuration
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── supabase/           # Database configuration & migrations
├── vite.config.ts      # Vite build configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies & scripts
```

### 3.2 Routing Structure

The application implements client-side routing with the following key routes:

```
/ (Index)                           - Dashboard/Landing page
/auth                              - Authentication page
/progress                          - Progress tracking page
/groups                            - Community groups page
/profile                           - User profile page
/settings/personal                 - Personal settings
/settings/macros                   - Macronutrient tracking settings
/settings/goal                     - Goal settings
/settings/weight-history           - Weight history tracking
/thesis                            - Thesis/documentation page
/use-case-diagram                  - Use case diagram visualization
```

### 3.3 Key Architectural Patterns

#### 3.3.1 Provider Pattern
```typescript
// App-level providers for:
- QueryClientProvider (React Query)
- ThemeProvider (Dark mode management)
- TooltipProvider (Radix UI)
- AuthProvider (Authentication context)
- BrowserRouter (React Router)
```

#### 3.3.2 Custom Hooks
- `useAuth` - Authentication state and operations
- `useTheme` - Theme management and switching

#### 3.3.3 Component Hierarchy
- Page components (route-based)
- Feature components (business logic)
- UI components (shadcn/ui + Radix primitives)
- Layout components (navigation, sidebar)

### 3.4 State Management Strategy

| Level | Technology | Purpose |
|-------|-----------|---------|
| **Server State** | TanStack React Query | Backend data, caching, synchronization |
| **Form State** | React Hook Form | Form inputs and validation |
| **UI State** | React useState | Component-local UI state |
| **Theme State** | next-themes | Dark/light mode persistence |
| **Auth State** | Custom useAuth hook | User session and credentials |

---

## 4. Core Features & Implementation

### 4.1 Authentication
- **Provider**: Lovable Cloud Auth
- **Database**: Supabase PostgreSQL
- **Status**: Active with session management

### 4.2 User Profile Management
- Personal profile information
- Customizable settings (personal, goals, macros)
- Weight history tracking
- Profile picture/avatar support (via Radix UI Avatar)

### 4.3 Progress Tracking
- Real-time progress visualization using Recharts
- Historical data tracking
- Goal progress monitoring
- Weight trajectory analysis

### 4.4 Group & Community Features
- Create and join wellness groups
- Collaborative goal tracking
- Community engagement metrics

### 4.5 PDF Export Functionality
- **Libraries Used**:
  - `html2canvas` (1.4.1) - Convert DOM elements to canvas/images
  - `jsPDF` (4.2.0) - Generate PDF documents from JavaScript
- **Use Cases**: 
  - Export progress reports
  - Save wellness summaries
  - Share achievements

### 4.6 UI Animations
- Custom Tailwind animations:
  - `pulse-glow` - Glowing pulse effect
  - `bounce-in` - Bouncing entrance animation
  - `wiggle` - Wiggling motion
  - `slide-up` - Upward sliding animation
  - `celebrate` - Celebratory scale and rotation animation
- Powered by Framer Motion for complex interactions

---

## 5. Development Workflow

### 5.1 Setup & Installation
```bash
# Clone repository
git clone https://github.com/emonlu2z4-stack/aura-wellness-ai-81.git
cd aura-wellness-ai-81

# Install dependencies (requires Node.js & npm)
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run tests
npm test
npm run test:watch

# Lint code
npm run lint
```

### 5.2 Development Server
- **Host**: `::` (IPv6)
- **Port**: 8080
- **HMR Overlay**: Disabled for better UX
- **Auto-reload**: Enabled

### 5.3 Build Configuration
- **Builder**: Vite
- **Mode Support**: Development and production builds
- **Path Aliases**: `@` → `./src`
- **Output**: Optimized JavaScript bundles with code splitting

### 5.4 TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
```

---

## 6. Database Architecture

### 6.1 Database Provider
- **Platform**: Supabase (PostgreSQL)
- **Type**: Relational Database
- **Real-time Capabilities**: Enabled
- **Features**: 
  - Built-in authentication
  - Row-level security
  - Real-time subscriptions
  - RESTful API
  - PostgreSQL functions (PLpgSQL - 1.7% of codebase)

### 6.2 Potential Data Models

#### Users Table
```sql
- id (UUID, PK)
- email (String, Unique)
- password_hash (String)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Profile Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- display_name (String)
- avatar_url (String)
- bio (Text)
```

#### Goals Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- goal_type (String)
- target (Numeric)
- deadline (Date)
- status (String)
```

#### Progress Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- metric_type (String)
- value (Numeric)
- recorded_at (Timestamp)
```

#### Weight_History Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- weight (Numeric)
- recorded_at (Timestamp)
```

#### Groups Table
```sql
- id (UUID, PK)
- name (String)
- description (Text)
- created_by (UUID, FK)
- created_at (Timestamp)
```

#### Group_Members Table
```sql
- group_id (UUID, FK)
- user_id (UUID, FK)
- joined_at (Timestamp)
```

---

## 7. Styling & Design System

### 7.1 Tailwind CSS Customization

#### Custom Colors
```typescript
colors: {
  // Theme colors
  primary, secondary, destructive, muted, accent, popover, card
  
  // Duo palette (6 main colors)
  duo: { green, blue, orange, red, purple, yellow, pink, cyan }
  
  // Neon colors
  neon: { blue, violet, green, orange, pink, cyan }
  
  // Sidebar styling
  sidebar: { background, foreground, primary, accent, border, ring }
}
```

#### Custom Animations
```typescript
keyframes: {
  'accordion-down'   // Accordion open animation
  'accordion-up'     // Accordion close animation
  'pulse-glow'       // Glowing pulse effect
  'bounce-in'        // Bouncing entrance
  'wiggle'           // Wiggling motion
  'slide-up'         // Upward slide
  'celebrate'        // Celebration animation
}
```

### 7.2 Typography
- **Display Font**: Fredoka (Modern, friendly)
- **Body Font**: Nunito (Readable, clean)

### 7.3 Container & Responsive Design
```typescript
container: {
  center: true,
  padding: '1rem',
  screens: {
    '2xl': '430px'  // Mobile-first breakpoint
  }
}
```

---

## 8. Testing Strategy

### 8.1 Testing Framework
- **Unit Testing**: Vitest
- **Component Testing**: React Testing Library
- **DOM Testing**: jsdom (Vite integration)

### 8.2 Test Scripts
```bash
npm run test          # Run tests once
npm run test:watch   # Run tests in watch mode
```

### 8.3 Testing Approach
- Unit tests for utilities and hooks
- Component tests for UI elements
- Integration tests for features

---

## 9. Code Quality & Linting

### 9.1 ESLint Configuration
- **Parser**: TypeScript ESLint
- **Rules**: 
  - React hooks rules enforcement
  - React refresh rules
  - JavaScript best practices
- **Global Scope**: `globalThis` configuration for Vite

### 9.2 Code Quality Checks
```bash
npm run lint         # Check for linting issues
```

---

## 10. Deployment & Build Process

### 10.1 Build Optimization
- **Build Mode**: Production (default) and Development (via `--mode development`)
- **Output Format**: Optimized ES modules with tree-shaking
- **Bundle Analysis**: Vite automatically optimizes code splitting

### 10.2 Production Build
```bash
npm run build        # Create optimized production bundle
npm run build:dev   # Create development build (for testing)
npm run preview     # Preview production build locally
```

### 10.3 Deployment Targets
The application can be deployed to:
- **Lovable Platform** (Native integration) - Click Share → Publish
- **Vercel** (Recommended for Vite/React)
- **Netlify** (Vite support)
- **GitHub Pages** (Static hosting)
- **Docker** (Containerized deployment)
- Custom servers (Node.js compatible)

### 10.4 Custom Domain Setup
- **Platform**: Lovable
- **Process**: Project Settings → Domains → Connect Domain
- **Documentation**: [Lovable Custom Domain Guide](https://docs.lovable.dev/features/custom-domain)

---

## 11. PDF Export Methodology

### 11.1 Why PDF Export?
For project submission, documentation, and sharing:
- Create professional reports
- Generate progress summaries
- Export methodology documentation
- Share project specifications

### 11.2 PDF Generation Libraries Used

#### jsPDF (4.2.0)
```javascript
import jsPDF from 'jspdf';

// Create PDF document
const pdf = new jsPDF();

// Add content
pdf.text('Your Content', 10, 10);
pdf.addPage();

// Save
pdf.save('filename.pdf');
```

**Capabilities:**
- Create multi-page PDFs
- Add text, images, and graphics
- Customize fonts and colors
- Control layout and positioning
- Support for A4, letter, and custom sizes

#### html2canvas (1.4.1)
```javascript
import html2canvas from 'html2canvas';

// Convert DOM element to canvas
const canvas = await html2canvas(element);

// Get image data
const imgData = canvas.toDataURL('image/png');

// Integrate with jsPDF
pdf.addImage(imgData, 'PNG', 0, 0, width, height);
```

**Capabilities:**
- Render HTML/CSS to canvas
- Preserve styling and layout
- Support for complex components
- Handle images and graphics
- Generate high-quality screenshots

### 11.3 PDF Export Workflow

```
User Interface
     ↓
[HTML/React Component]
     ↓
html2canvas (Convert to Image)
     ↓
[Canvas/Image Data]
     ↓
jsPDF (Create PDF Document)
     ↓
[PDF File]
     ↓
Download/Save
```

### 11.4 Typical PDF Export Implementation

```typescript
// Example implementation
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const exportToPDF = async (elementId: string, filename: string) => {
  // Get the element to export
  const element = document.getElementById(elementId);
  
  if (!element) return;
  
  try {
    // Convert DOM to canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff'
    });
    
    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add multiple pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
  }
};
```

### 11.5 Using Browser's Print Dialog

For simpler PDF generation:

```typescript
// Native browser approach
window.print();

// User selects: Save as PDF
// Advantages: No dependencies, native styling
// Disadvantages: Less programmatic control
```

---

## 12. Project Submission Methodology

### 12.1 Documentation Artifacts

When submitting this project, the following should be included:

1. **README.md** - Project overview and setup instructions ✓
2. **METHODOLOGY.md** - This document (Technical specifications)
3. **Architecture Diagram** - System design overview
4. **Database Schema** - Entity-relationship diagram
5. **API Documentation** - Endpoint specifications
6. **User Guide** - Feature documentation
7. **Installation Guide** - Setup instructions
8. **Testing Report** - Test coverage and results

### 12.2 PDF Generation for Submission

**Method 1: Using Lovable's Built-in Export**
1. Go to Lovable Dashboard
2. Select Project Settings
3. Use Export/Share functionality
4. Download as PDF

**Method 2: Using Browser**
1. Open project at `http://localhost:8080`
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
3. Select "Save as PDF"
4. Choose "More Settings" for customization
5. Print to file

**Method 3: Programmatic Export**
1. Create a dedicated export page component
2. Use html2canvas + jsPDF
3. Call export function via button click
4. PDF saves automatically

**Method 4: CLI Tools**
```bash
# Using puppeteer (headless browser)
npm install --save-dev puppeteer

# Create export script
# node export-pdf.js
```

### 12.3 Recommended Submission Structure

```
aura-wellness-ai-81-submission/
├── 📄 README.md
├── 📄 METHODOLOGY.md (generated from this)
├── 📁 Documentation/
│   ├── 📊 Architecture-Diagram.pdf
│   ├── 📊 Database-Schema.pdf
│   ├── 📘 User-Guide.pdf
│   └── 📘 Installation-Guide.pdf
├── 📁 Source Code/
│   └── (Full repository)
├── 📁 Screenshots/
│   ├── Dashboard.png
│   ├── Progress-Tracking.png
│   ├── Profile-Settings.png
│   └── Group-Features.png
└── 📄 Project-Summary.pdf
```

---

## 13. Performance Considerations

### 13.1 Code Splitting
- React Router enables automatic code splitting per route
- Vite handles dynamic imports efficiently
- Lazy loading for heavy components

### 13.2 Caching Strategy
- React Query handles server state caching
- Browser cache for static assets
- Service Worker capability for PWA enhancement

### 13.3 Bundle Optimization
- Tree-shaking removes unused code
- Modern ES modules for smaller bundles
- Tailwind CSS purging of unused styles
- Image optimization recommended for deployment

### 13.4 Database Query Optimization
- Supabase built-in query optimization
- Row-level security reduces data exposure
- Index recommendations for large tables

---

## 14. Security Considerations

### 14.1 Authentication & Authorization
- **Method**: Lovable Cloud Auth + Supabase Auth
- **Session Management**: Secure token-based
- **HTTPS**: Required for deployment

### 14.2 Data Protection
- **Database**: Supabase row-level security
- **Environment Variables**: `.env` file (not committed)
- **API Calls**: Through authenticated Supabase client

### 14.3 Frontend Security
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Handled by authentication layer
- **Dependency Audits**: Regular npm audit checks

```bash
npm audit              # Check for vulnerabilities
npm audit fix         # Auto-fix where possible
```

---

## 15. Maintenance & Future Enhancements

### 15.1 Dependency Management
- Regular updates via `npm update`
- Security patches: `npm audit fix`
- Major version updates: Reviewed and tested carefully

### 15.2 Potential Enhancements
1. **Mobile App**: React Native version
2. **AI Integration**: Advanced ML models for wellness insights
3. **Wearable Integration**: Connect with fitness trackers
4. **Social Features**: Sharing and leaderboards
5. **Offline Support**: Service Workers for offline access
6. **Advanced Analytics**: Machine learning for predictions
7. **API Monetization**: Third-party integrations

### 15.3 Performance Monitoring
- Implement error tracking (Sentry)
- Analytics integration (Mixpanel, Plausible)
- Performance metrics (Web Vitals)

---

## 16. Getting Started for Contributors

### 16.1 Prerequisites
- Node.js 18+ (use nvm for version management)
- npm or bun (package manager)
- Git for version control
- Code editor (VS Code recommended)

### 16.2 Development Setup
```bash
# 1. Clone repository
git clone https://github.com/emonlu2z4-stack/aura-wellness-ai-81.git
cd aura-wellness-ai-81

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env example)
cp .env.example .env
# Add your Supabase credentials

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:8080
```

### 16.3 Development Best Practices
- Write TypeScript (avoid `any` types)
- Follow existing code style (ESLint)
- Create components in dedicated files
- Use custom hooks for shared logic
- Write tests for critical features
- Use meaningful commit messages

---

## 17. Useful Resources

### Official Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)

### Community & Support
- GitHub Discussions (this repository)
- Lovable Platform Documentation
- Supabase Discord Community
- React Community Forums

---

## 18. Conclusion

The **Aura Wellness AI** project demonstrates a modern, production-ready web application built with:
- ✅ **Type-Safe Development** via TypeScript
- ✅ **Fast Build Process** via Vite
- ✅ **Beautiful UI** via Tailwind + shadcn/ui
- ✅ **Robust Backend** via Supabase
- ✅ **Scalable Architecture** via React patterns
- ✅ **PDF Export Capabilities** via jsPDF + html2canvas

This methodology document serves as a comprehensive guide for understanding, developing, maintaining, and deploying this wellness application.

---

**Document Generated:** 2026-06-15  
**Repository:** emonlu2z4-stack/aura-wellness-ai-81  
**Version:** 1.0  
**Status:** Complete Documentation
