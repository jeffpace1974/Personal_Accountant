# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal_Accountant is a comprehensive budgeting and expense tracking web application built with React and TypeScript. It provides real-time financial insights, hierarchical budget management, goal tracking, and integrates with Bank of America accounts (MVP).

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom component classes
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts (for future analytics)
- **Date Handling**: date-fns

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/
│   └── Layout/          # Main application layout and navigation
├── context/             # React Context for state management
├── data/               # Mock data and data utilities
├── pages/              # Main application pages/routes
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (date, currency formatting)
├── App.tsx            # Main app component with routing
├── main.tsx          # Application entry point
└── index.css         # Global styles and Tailwind imports
```

## Key Features Implemented

### Core Functionality
- **Dashboard**: Financial overview with account summaries, budget analysis, recent transactions
- **Accounts**: Bank account management with balance tracking and integration status
- **Budgets**: Create, edit, and track budgets with real-time spending analysis and adjustment capabilities
- **Transactions**: Transaction management with categorization, filtering, and bulk operations
- **Goals**: Savings goal tracking with progress visualization and projection calculations
- **Reports**: Comprehensive expense tracking with time-based comparisons and trend analysis
- **Settings**: Comprehensive settings for income streams, holidays, notifications, and security

### State Management
- Central state managed via React Context (`src/context/AppContext.tsx`)
- Comprehensive actions for CRUD operations on all data entities
- Mock data integration for development and testing

### Data Models
- **Account**: Bank account information with balance tracking
- **Transaction**: Financial transactions with categorization
- **Category**: Hierarchical expense categories
- **Budget**: Budget allocations with adjustment tracking
- **Goal**: Savings goals with contribution planning
- **IncomeStream**: Multiple income sources with flexible scheduling
- **Holiday**: Holiday calendar for pay date adjustments

## Architecture Highlights

### Budget Management
- Real-time budget vs. actual spending comparison
- Daily spending limit calculations based on remaining budget and days until payday
- Budget adjustment tracking with historical records
- Support for monthly and pay-period-based budgeting

### Financial Analytics
- Account balance projections with pending charge calculations
- Goal timeline projections with different contribution scenarios
- Spending analysis by category with visual progress indicators

### Income & Payroll Management
- Multiple income stream support with different pay schedules
- Holiday and weekend pay date adjustment logic
- Integration with budget calculations for accurate projections

## Development Notes

### Current State
The application is fully functional with a complete UI implementation using mock data. All major features from the PRD are implemented including:
- Hierarchical budget categories
- Real-time spending tracking
- Goal progress monitoring
- Income stream management
- Holiday calendar integration
- Budget adjustment capabilities
- Comprehensive expense reporting and analytics
- Bank of America account connection interface
- Historical transaction archives (18+ months of data)
- Year-over-year spending comparisons
- Category-based trend analysis
- Official US Bank Holiday calendar with automatic pay date adjustments
- Complete US Federal Holiday calendar sourced from OPM with year-specific data

### Mock Data
The application uses comprehensive mock data in `src/data/mockData.ts` to simulate:
- Bank of America account integration with realistic connection flow
- 18+ months of historical transaction data (Jan 2023 - July 2024)
- Multiple account types (checking, savings, credit cards)
- Recurring transactions (rent, utilities, groceries, gas, salary)
- Random expense variations to simulate real spending patterns
- Budget allocations and spending analysis
- Savings goals with progress tracking

### Styling System
- Custom CSS classes defined in `src/index.css` for consistent component styling
- Tailwind utility classes for layout and responsive design
- Color-coded status indicators (success, warning, danger)
- Progress bars and badges for visual feedback

## Future Development

### Phase 2 Enhancements
- Real Bank of America API integration
- Database integration (SQLite → PostgreSQL)
- Advanced analytics and reporting
- Transaction categorization ML
- Multi-user support

### Technical Debt
- Add comprehensive error handling
- Implement proper form validation
- Add loading states for async operations
- Include unit and integration tests
- Add proper authentication system

## Working with This Repository

The application is ready for development and can be extended by:
1. Replacing mock data with real API integrations
2. Adding database persistence layer
3. Implementing authentication and user management
4. Adding advanced analytics features
5. Extending bank integration beyond Bank of America