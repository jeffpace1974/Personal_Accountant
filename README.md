# Personal Accountant 💰

A comprehensive personal financial management application that aggregates bank data via Plaid to provide real-time budgeting, expense tracking, and automated savings goal management.

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Plaid](https://img.shields.io/badge/Plaid-Integration-green)](https://plaid.com/)
[![Vite](https://img.shields.io/badge/Vite-4-purple)](https://vitejs.dev/)

## 🎯 Overview

Personal Accountant helps individuals manage their finances across multiple accounts and income streams with:

- **Real-time Budget Tracking** with hierarchical categories (Housing → Utilities → Electricity)
- **Multiple Income Streams** with different pay schedules (bi-monthly, monthly, custom)
- **Holiday-aware Payroll Management** with automatic pay date adjustments
- **Bank Integration** via Plaid API for read-only transaction import
- **Goal Tracking** with contribution projections and timeline estimates
- **Comprehensive Reporting** with 1+ year historical data and YTD comparisons

## ✨ Features

### 📊 Financial Dashboard
- Real-time account balances and spending overview
- Budget vs. actual spending visualization
- Upcoming bills and payment reminders
- Cash flow projections

### 💳 Bank Account Integration
- **Plaid Integration**: Connect to 11,000+ financial institutions
- Automatic transaction import and categorization
- Real-time balance updates
- Secure read-only access

### 📈 Budget Management
- Hierarchical budget categories with subcategories
- Mid-period budget adjustments with audit trail
- Spending alerts and notifications
- Daily spending limits based on remaining budget

### 🎯 Goals & Savings
- Multiple savings goals with target dates
- Automatic contribution tracking
- Progress visualization with projections
- Goal milestone notifications

### 📋 Comprehensive Reports
- Time-based expense analysis (week, month, quarter, year)
- Year-over-year spending comparisons
- Category breakdown with trend analysis
- Exportable reports and data

### 💼 Income Management
- Multiple income stream support
- Holiday-aware payroll calculations
- US Bank and Federal holiday calendars
- Automatic pay date adjustments for weekends/holidays

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Plaid developer account (for real bank connections)

### Installation

```bash
# Clone the repository
git clone https://github.com/jeffpace1974/Personal_Accountant.git
cd Personal_Accountant

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Plaid credentials (see Configuration section)

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Configuration

Create a `.env` file with your Plaid API credentials:

```env
VITE_PLAID_CLIENT_ID=your_plaid_client_id_here
VITE_PLAID_PUBLIC_KEY=your_plaid_public_key_here
VITE_PLAID_ENVIRONMENT=sandbox
```

To get Plaid credentials:
1. Sign up at [Plaid Dashboard](https://dashboard.plaid.com)
2. Create a new application
3. Copy your Client ID and Public Key
4. Use `sandbox` environment for development

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework with hooks and context
- **TypeScript** - Type safety and enhanced development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization and charts

### Integration & APIs
- **Plaid Link SDK** - Bank account connectivity
- **React Plaid Link** - React wrapper for Plaid Link
- **Date-fns** - Date manipulation and formatting

### Security & Compliance
- **AES-256 Encryption** - Data protection at rest
- **TLS 1.3** - Secure data transmission
- **Security Logging** - Comprehensive audit trails
- **Privacy Consent Management** - GDPR/CCPA compliance

## 📁 Project Structure

```
Personal_Accountant/
├── docs/                           # Documentation
│   ├── PRD.md                     # Product Requirements Document
│   ├── plaid-pricing.md           # Plaid API cost analysis
│   └── security/                  # Security policies and procedures
│       ├── governance-policy.md
│       ├── data-privacy-policy.md
│       ├── incident-response-plan.md
│       └── ...
├── src/
│   ├── components/                # React components
│   │   ├── BankConnection/        # Plaid integration components
│   │   ├── PlaidLink/            # Plaid Link wrapper
│   │   ├── PrivacyConsent/       # Privacy consent management
│   │   └── Layout/               # Application layout
│   ├── pages/                    # Main application pages
│   │   ├── Dashboard.tsx         # Financial overview
│   │   ├── Accounts.tsx          # Account management
│   │   ├── Budgets.tsx           # Budget tracking
│   │   ├── Transactions.tsx      # Transaction history
│   │   ├── Goals.tsx             # Savings goals
│   │   ├── Reports.tsx           # Financial reports
│   │   └── Settings.tsx          # Application settings
│   ├── utils/                    # Utility functions
│   │   ├── logger.ts             # Security logging
│   │   ├── encryption.ts         # Data encryption
│   │   ├── bankHolidays.ts       # US Bank holiday calculations
│   │   ├── federalHolidays.ts    # Federal holiday calculations
│   │   └── expenseAnalytics.ts   # Financial analysis
│   ├── context/                  # React Context providers
│   ├── types/                    # TypeScript type definitions
│   ├── data/                     # Mock data for development
│   └── config/                   # Configuration files
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔒 Security & Privacy

This application implements comprehensive security measures for financial data protection:

### Security Features
- **Bank-level Encryption**: AES-256 encryption for all financial data
- **Secure Authentication**: Multi-factor authentication support
- **Audit Logging**: Complete audit trails for all financial operations
- **Privacy Consent**: Granular consent management for data collection
- **Security Headers**: HTTPS enforcement and security headers

### Compliance
- **GLBA Compliance**: Gramm-Leach-Bliley Act financial privacy protection
- **FCRA Compliance**: Fair Credit Reporting Act compliance
- **Privacy Laws**: CCPA/CPRA and state privacy law compliance
- **SOC 2 Ready**: Designed for SOC 2 Type II certification

### Data Protection
- **Data Minimization**: Collect only necessary financial data
- **Retention Policies**: 7-year retention for financial records
- **Right to Delete**: User data deletion capabilities
- **No Data Sales**: We never sell consumer financial data

## 📊 Cost Management

The application is designed with Plaid's pay-as-you-go pricing in mind:

- **Transactions**: $0.30/month per connected account
- **Balance Calls**: $0.10 per API call
- **Optimized Usage**: Smart caching and efficient API usage
- **Cost Transparency**: Clear cost implications for users

Estimated monthly cost per user: ~$4.38 (with 3 accounts + regular syncing)

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Mock Data

The application includes comprehensive mock data for development:
- 18+ months of realistic transaction history
- Multiple account types (checking, savings, credit)
- Categorized transactions with various merchants
- Budget and goal tracking data

### Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Deployment Checklist

1. **Environment Configuration**
   - Set production Plaid credentials
   - Configure production database encryption
   - Set up SSL/TLS certificates

2. **Security Requirements**
   - Enable all security headers
   - Configure CORS policies
   - Set up monitoring and alerting
   - Implement backup procedures

3. **Compliance Verification**
   - Complete security audit
   - Verify data retention policies
   - Confirm privacy compliance
   - Document incident response procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Implement comprehensive error handling
- Add security logging for sensitive operations
- Update security documentation for new features
- Test with mock data before Plaid integration

## 📝 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Review the security documentation in `/docs/security/`
- Check the Product Requirements Document in `/docs/PRD.md`

## 🎉 Acknowledgments

- **Plaid** for secure bank connectivity
- **React** team for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Claude Code** for development assistance

---

**Built with ❤️ for better personal financial management**

*Last updated: July 5, 2025*