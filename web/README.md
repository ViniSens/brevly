# Brev.ly - URL Shortener Frontend

A modern, responsive URL shortener web application built with React, TypeScript, and Vite. This is the frontend client for the Brev.ly URL shortening service that provides a complete solution for creating, managing, and tracking shortened URLs with advanced analytics.

## ✅ Implemented Features

### Core Functionality 

- [x] Deve ser possível criar um link
    - [x] Validação de URL obrigatória
    - [x] Nome personalizado opcional
- [x] Deve ser possível deletar um link
- [x] Deve ser possível obter a URL original por meio do encurtamento
- [x] Deve ser possível listar todas as URL's cadastradas
- [x] Deve ser possível incrementar a quantidade de acessos de um link
- [x] Deve ser possível baixar um CSV com o relatório dos links criados

## ✅ Frontend Requirements

- [x] É obrigatória a criação de uma aplicação React no formato SPA utilizando o Vite como `bundler`;
- [x] Trabalhe com elementos que tragam uma boa experiência ao usuário (`empty state`, ícones de carregamento, bloqueio de ações a depender do estado da aplicação);
- [x] Foco na responsividade: essa aplicação deve ter um bom uso tanto em desktops quanto em celulares.


### Core Functionality Improvements


- [x] **Link Creation**: Create shortened URLs with comprehensive validation
    - [x] Required URL validation with protocol detection
    - [x] Custom name support with automatic prefix stripping
    - [x] Reserved word protection for system endpoints
    - [x] Duplicate code prevention with user-friendly error messages
- [x] **Link Management**: Full CRUD operations for link management
    - [x] View all created links in responsive table format
    - [x] Delete links with confirmation dialogs
    - [x] Copy links to clipboard with working frontend URLs
- [x] **URL Redirection**: Smart redirection system with analytics
    - [x] Automatic protocol detection and correction
    - [x] 1.5-second delay for better user experience
    - [x] Visit count increment before redirection
- [x] **Analytics**: Comprehensive visit tracking and reporting
    - [x] Real-time visit counter display
    - [x] Manual visit increment API
    - [x] CSV export with detailed analytics
- [x] **Data Export**: Advanced CSV generation and cloud storage
    - [x] Comprehensive CSV reports with all link metadata
    - [x] Cloud storage integration via Cloudflare R2
    - [x] Unique filename generation with UUID

### Frontend Requirements Compliance
- [x] **React SPA**: Built with React 19 and Vite bundler
- [x] **User Experience**: Comprehensive UX enhancements
    - [x] Loading states with Lucide spinners
    - [x] Empty states with encouraging messaging
    - [x] Action blocking during operations
    - [x] Real-time feedback and notifications
- [x] **Responsive Design**: Mobile-first approach with Tailwind CSS
    - [x] Adaptive layouts for desktop, tablet, and mobile
    - [x] Touch-friendly interactions
    - [x] Responsive images and typography
    - [x] Custom scrollbars for consistent styling


## 📱 Fully Responsive Design

This application was built with a **mobile-first** philosophy using **Tailwind CSS**, ensuring a seamless experience on any device, from smartphones to large desktops.

### Key Responsive Strategies:

*   **Adaptive Layouts**: The main layout on the [Home page](web/src/pages/Home.tsx) dynamically changes based on screen size. On mobile, it uses a simple, stacked single-column layout for easy scrolling. On larger screens (`lg` and `xl` breakpoints), it transforms into a multi-column grid, making better use of the available space.

*   **Responsive Tables**: The link table is designed to be user-friendly on small screens. It becomes horizontally scrollable to prevent content overflow, and less critical columns like "URL Original" are hidden on mobile to reduce clutter.

*   **Conditional Content**: The application serves different images for mobile and desktop on pages like [`RedirectPage`](web/src/pages/Redirect.tsx) and [`NotFound`](web/src/pages/NotFound.tsx), optimizing visuals and loading performance for the specific device.

*   **Fluid Typography and Spacing**: All elements, including text, buttons, and padding, scale appropriately with the screen size, maintaining readability and a balanced design across all resolutions.

These techniques ensure that the application is not just functional but also aesthetically pleasing and easy to navigate, regardless of how it's accessed.

## 🚀 Enhanced Features

### Advanced URL Validation
- **Protocol Detection**: Automatically adds `https://` for incomplete URLs
- **Security Validation**: Blocks suspicious domains and localhost in production
- **Format Validation**: Comprehensive URL structure validation with RFC compliance
- **Length Limits**: Prevents extremely long URLs (2048 character limit)
- **Normalization**: Automatic URL normalization and trailing slash handling

### Smart Link Management
- **Custom Names Priority**: Custom names take precedence over generated codes
- **Prefix Stripping**: Automatically removes `brev.ly/` prefix from user input
- **Reserved Words**: Protects system endpoints with reserved word checking
- **Conflict Resolution**: Intelligent handling of duplicate codes with clear error messages

### Enhanced Analytics System
- **Dual Tracking Methods**: Both redirect-based and manual visit tracking
- **Real-time Updates**: Immediate UI updates using TanStack Query
- **Visit Counter Display**: Live visit count display in the interface
- **Analytics Export**: Detailed CSV reports with timestamps and visit data

### Advanced User Interface
- **Conditional Layouts**: Dynamic layout switching based on content availability
- **Loading States**: Granular loading indicators for each operation
- **Error Boundaries**: Comprehensive error handling with user-friendly messages
- **Responsive Tables**: Mobile-optimized table layouts with horizontal scrolling
- **Custom Components**: Reusable component library with Tailwind Variants

## 🛠️ Tech Stack

### Frontend Core
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety and developer experience
- **Vite** - Ultra-fast build tool with HMR
- **React Router DOM v7** - Modern routing with data loading

### State Management & Data Fetching
- **TanStack Query v5** - Powerful server state management
  - Intelligent caching and background updates
  - Optimistic updates and error recovery
  - Query invalidation and real-time synchronization
- **Axios** - HTTP client with interceptors and request/response transformation

### Styling & UI
- **Tailwind CSS v3** - Utility-first CSS framework
- **Tailwind Variants** - Type-safe component variants
- **Tailwind Merge** - Intelligent class merging
- **Lucide React** - Beautiful icon library
- **Custom Design System** - Comprehensive color palette and typography

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing with Autoprefixer
- **Modern ESLint Config** - Flat config format with React hooks support

## 📁 Enhanced Project Structure

```
src/
├── components/                    # Reusable UI components
│   ├── Button.tsx                # Multi-variant button with loading states
│   ├── IconButton.tsx            # Icon-based actions with danger variants
│   └── Input.tsx                 # Form input with validation and focus states
├── pages/                        # Route components
│   ├── Home.tsx                  # Main interface with conditional layouts
│   ├── Redirect.tsx              # Smart redirection with analytics
│   └── NotFound.tsx              # 404 handling with responsive design
├── services/                     # API integration layer
│   └── apiService.ts             # Complete API service with error handling
├── lib/                          # Utility libraries
│   └── axios.ts                  # Configured HTTP client
├── App.tsx                       # Main app with routing configuration
├── main.tsx                      # Entry point with providers
├── index.css                     # Global styles and custom scrollbar
└── App.css                       # Legacy component styles
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** version 18 or higher
- **npm** or **yarn** package manager
- **Backend API** server running (see server documentation)

### Installation & Setup

1. **Clone and navigate to the project**:
```bash
git clone <repository-url>
cd web
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment configuration**:
```bash
cp .env.example .env
```

4. **Configure environment variables**:
```env
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3333
```

### Development Workflow

**Start development server**:
```bash
npm run dev
```
*Application available at `http://localhost:5173`*

**Build for production**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

**Run linting**:
```bash
npm run lint
```

## 📚 Enhanced API Integration

The application integrates with a comprehensive backend API through [`apiService.ts`](src/services/apiService.ts):

### Core API Functions
- **`createShortLink(url, customName?)`** - Create links with validation and custom naming
- **`getLinks()`** - Fetch paginated link list with analytics
- **`deleteLink(code)`** - Remove specific links by code
- **`getLinkByCode(code)`** - Retrieve link data for redirection
- **`incrementVisitCount(code)`** - Manual analytics tracking
- **`exportLinksToCSV()`** - Generate comprehensive CSV reports

### Enhanced API Response Format
```typescript
interface ShortLink {
  id: string
  code: string
  original_url: string
  custom_name?: string
  created_at: string
  access_count?: number
  short_url?: string  // Computed field for display
}
```

### Error Handling Strategy
- **Validation Errors**: Real-time form validation with specific error messages
- **Network Errors**: Graceful degradation with retry mechanisms
- **Server Errors**: User-friendly error notifications with technical details in development
- **Offline Support**: Cached data display when offline

## 🎨 Advanced UI Components

### Enhanced Component Library

#### Button Component ([`Button.tsx`](src/components/Button.tsx))
- **Variants**: `primary`, `secondary`, `tertiary` with consistent theming
- **States**: Loading with Lucide spinner, disabled with visual feedback
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Styling**: Tailwind Variants for maintainable variant management

#### Input Component ([`Input.tsx`](src/components/Input.tsx))
- **Validation States**: Error, focused, and default with color coding
- **Accessibility**: Associated labels and proper form semantics
- **Prefix Support**: `brev.ly/` prefix for custom URL input
- **Focus Management**: Visual feedback and state tracking

#### IconButton Component ([`IconButton.tsx`](src/components/IconButton.tsx))
- **Action Types**: Copy, delete with appropriate visual feedback
- **Danger Variant**: Red theming for destructive actions
- **Loading States**: Individual loading indicators for async operations
- **Accessibility**: Proper button semantics and tooltips

### Advanced Page Components

#### Home Page ([`Home.tsx`](src/pages/Home.tsx)) - Enhanced Features
- **Adaptive Layout**: 
  - Desktop: Side-by-side form and table when links exist
  - Mobile: Stacked layout with responsive breakpoints
  - Empty State: Centered form with encouraging messaging
- **Form Section Enhancements**:
  - Real-time URL validation with immediate feedback
  - Custom name input with automatic prefix handling
  - Loading states with disabled form during submission
- **Advanced Table Features**:
  - Sticky header with CSV export functionality
  - Scrollable container with custom branded scrollbar
  - Click-to-visit with smart redirection handling
  - Copy-to-clipboard with working frontend URLs
  - Individual delete confirmations with loading states
  - Real-time visit count updates
- **Enhanced User Experience**:
  - Confirmation dialogs for destructive actions
  - Success/error notifications with specific messaging
  - Responsive breakpoint optimization
  - Touch-friendly mobile interactions

#### Redirect Page ([`Redirect.tsx`](src/pages/Redirect.tsx)) - Smart Redirection
- **User Experience Optimization**:
  - 1.5-second delay with loading animation
  - Responsive loading images for different screen sizes
  - Clear messaging about redirection status
- **Analytics Integration**:
  - Automatic visit count increment before redirect
  - Fallback handling if analytics fails
  - Query invalidation for real-time updates
- **Protocol Handling**:
  - Automatic `https://` addition for incomplete URLs
  - Validation of URL format before redirection
- **Error Handling**:
  - Navigation to NotFound for invalid links
  - Graceful error recovery with user notification

#### NotFound Page ([`NotFound.tsx`](src/pages/NotFound.tsx))
- **Responsive Design**: Different images for mobile and desktop
- **Consistent Branding**: Matches overall application theme
- **User Guidance**: Clear 404 messaging with proper typography

## 🔄 Advanced State Management

### TanStack Query Integration
The application uses TanStack Query v5 for sophisticated server state management:

#### Caching Strategy
- **Intelligent Caching**: Automatic background updates and stale-while-revalidate
- **Query Invalidation**: Precise cache updates after mutations
- **Background Refetching**: Keeps data fresh without user intervention
- **Optimistic Updates**: Immediate UI feedback before server confirmation

#### Query Configuration
```typescript
// Query Keys Structure
['links']                    // All user links with pagination
['redirectLink', shortUrl]   // Individual link for redirection

// Mutation Handling
- Individual loading states for granular UX
- Success/error feedback with user notifications
- Automatic query invalidation for real-time updates
- Error recovery with retry mechanisms
```

#### Error Handling & Loading States
- **Granular Loading**: Individual loading indicators per operation
- **Error Boundaries**: Graceful error recovery with user-friendly messages
- **Retry Logic**: Automatic retry for transient failures
- **Offline Support**: Cached data display when network unavailable

## 🎯 Environment Configuration & Security

### Environment Variables
The application uses environment-specific configuration:

```env
VITE_FRONTEND_URL=http://localhost:5173  # Frontend hosting URL
VITE_BACKEND_URL=http://localhost:3333   # Backend API URL
```

### Usage Throughout Application
- **API Requests**: Configured in [`axios.ts`](src/lib/axios.ts) for backend communication
- **Link Generation**: Creates copyable URLs for sharing and CSV export
- **Redirect System**: Generates working redirect URLs for the frontend routing

### Security Considerations
- **Environment Validation**: Runtime validation of required environment variables
- **URL Validation**: Client-side validation before API submission
- **CORS Configuration**: Proper cross-origin request handling
- **Error Information**: Sanitized error messages in production

## 📱 Responsive Design System

### Mobile-First Approach
Built with Tailwind CSS using a comprehensive mobile-first strategy:

#### Design System Components
- **Color Palette**: Custom brand colors with semantic naming
  - Brand Colors: `#2C46B1` (base), `#2C4091` (dark)
  - Danger Color: `#B12C4D`
  - Gray Scale: 6-shade system from `#F9F9FB` to `#1F2025`
- **Typography**: Open Sans font family with custom size scale
- **Spacing**: Consistent spacing system with responsive modifiers

#### Responsive Features Implementation
- **Conditional Layout Switching**: 
  ```jsx
  // Desktop: side-by-side layout when content exists
  // Mobile: stacked layout with full width
  className={`${hasLinksToShow 
    ? "grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8" 
    : "flex justify-center"
  }`}
  ```
- **Responsive Table Design**:
  - Horizontal scrolling on mobile devices
  - Hidden columns on smaller screens
  - Touch-friendly button sizing
- **Adaptive Images**: Different images for mobile (`_mobile.png`) and desktop (`_desktop.png`)
- **Breakpoint-Specific Visibility**: Strategic show/hide elements based on screen size

#### Custom Scrollbar Implementation
Implemented in [`index.css`](src/index.css) with brand colors:
```css
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2C46B1; /* brand-base */
  border-radius: 4px;
}
```

## 🔧 Modern Development Setup

### TypeScript Configuration
- **App Config** ([`tsconfig.app.json`](tsconfig.app.json)): React-specific TypeScript configuration
- **Node Config** ([`tsconfig.node.json`](tsconfig.node.json)): Vite tooling configuration
- **Root Config** ([`tsconfig.json`](tsconfig.json)): Project references and global settings

### Build & Development Tools
- **Vite Configuration** ([`vite.config.ts`](vite.config.ts)): Optimized build with React plugin
- **ESLint Setup** ([`eslint.config.js`](eslint.config.js)): Modern flat config with React rules
- **PostCSS** ([`postcss.config.js`](postcss.config.js)): Tailwind processing and Autoprefixer

### Development Scripts
```bash
npm run dev      # Development server with HMR
npm run build    # Production build (TypeScript + Vite)
npm run preview  # Preview production build locally
npm run lint     # ESLint code quality check
```

## 🚀 Deployment & Production

### Build Configuration
- **TypeScript Compilation**: Full type checking before build
- **Vite Optimization**: Tree shaking, code splitting, and asset optimization
- **Static Asset Handling**: Optimized images and font loading
- **Environment Variable Injection**: Runtime environment configuration

### Deployment Options
1. **Static Hosting**: Vercel, Netlify, GitHub Pages
2. **CDN Distribution**: Cloudflare Pages, AWS CloudFront
3. **Container Deployment**: Docker with Nginx
4. **Server-Side Rendering**: Adaptation for Next.js or Remix

## 🔍 Advanced Features Deep Dive

### Custom Short URL System
- **Naming Priority**: Custom names override generated codes
- **Prefix Handling**: Automatic `brev.ly/` prefix stripping from user input
- **Validation**: Character restrictions and length limits
- **Conflict Resolution**: Duplicate detection with user-friendly error messages

### Analytics & Visit Tracking
- **Dual Tracking Methods**:
  - Automatic increment on redirect for organic visits
  - Manual increment API for programmatic tracking
- **Real-time Updates**: Immediate UI reflection of visit count changes
- **Data Persistence**: Server-side storage with PostgreSQL

### CSV Export System
- **Comprehensive Reporting**: All link metadata in structured format
- **Cloud Storage**: Integration with Cloudflare R2 for reliable file access
- **Unique Naming**: UUID-based filenames prevent conflicts
- **Data Format**: Business-ready CSV with proper headers and formatting

### Smart Redirection Logic
```typescript
// Protocol detection and correction
let urlToRedirect = data.original_url
if (!urlToRedirect.startsWith('http://') && !urlToRedirect.startsWith('https://')) {
  urlToRedirect = 'https://' + urlToRedirect
}

// User experience optimization with delay
setTimeout(() => {
  window.location.href = urlToRedirect
}, 1500)
```

### Error Handling Strategy
- **Validation Errors**: Real-time feedback with specific field-level messages
- **Network Failures**: Graceful degradation with retry options
- **Server Errors**: Development-friendly error details with production-safe user messages
- **404 Handling**: Custom NotFound page with navigation options

## 🤝 Contributing & Development

### Development Workflow
1. **Setup**: Clone repository and install dependencies
2. **Environment**: Configure local environment variables
3. **Development**: Use `npm run dev` for local development
4. **Testing**: Manual testing with backend integration
5. **Building**: Verify production build with `npm run build`
6. **Linting**: Ensure code quality with `npm run lint`

### Code Quality Standards
- **TypeScript**: Full type safety with strict mode enabled
- **ESLint**: Consistent code style and React best practices
- **Component Structure**: Reusable components with clear prop interfaces
- **Error Handling**: Comprehensive error boundaries and user feedback

### Project Enhancement Areas
- **Testing**: Unit tests with Jest and React Testing Library
- **Performance**: Bundle analysis and optimization
- **Accessibility**: WCAG compliance and screen reader support
- **Internationalization**: Multi-language support with i18n

## 📄 License & Usage

This project is developed as part of the RocketSeat POS program and is intended for educational purposes. The codebase demonstrates modern React development practices and can serve as a reference for similar projects.

## 🔗 Backend Integration

This frontend application requires the backend API service for full functionality. The backend provides:
- **URL Management**: CRUD operations for shortened URLs
- **Analytics**: Visit tracking and reporting
- **File Storage**: CSV export with cloud storage
- **Validation**: Server-side URL and data validation

Ensure the backend server is running and properly configured with the corresponding environment variables for seamless integration.

---

**Built with ❤️ using modern React ecosystem and best practices**