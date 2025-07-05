# Personal Accountant - Product Requirements Document

## Product Overview

Personal Accountant is a comprehensive budgeting and expense tracking application that provides real-time financial insights by connecting to bank accounts and credit cards. The application enables users to create detailed budgets with hierarchical categories, track spending against those budgets, and project future financial goals.

## Core Value Proposition

- **Real-time Budget Tracking**: Connect to bank accounts for automatic transaction import and real-time budget vs. actual spending analysis
- **Hierarchical Budgeting**: Create overarching categories with detailed subcategories for granular expense tracking
- **Flexible Budget Cycles**: Support both monthly and pay-period-based budgeting
- **Intelligent Spending Guidance**: Calculate daily spending limits to stay within budget
- **Goal Projection**: Model future savings goals and calculate required contributions

## Target User

Primary user is an individual seeking comprehensive personal financial management with real-time insights and goal tracking capabilities.

## MVP Scope

### Phase 1: Core Features
- Bank of America account integration (read-only API access)
- Hierarchical category management
- Real-time transaction import and categorization
- Budget creation and tracking
- Basic spending analysis and daily limits

## Functional Requirements

### 1. Account Integration

#### 1.1 Bank Account Connection
- **Requirement**: Connect to Bank of America accounts via read-only API
- **Details**: 
  - Support multiple checking/savings accounts from single bank
  - Automatic transaction synchronization
  - Real-time balance updates
  - Pending transaction visibility

#### 1.2 Credit Card Integration
- **Requirement**: Connect to Bank of America credit cards
- **Details**:
  - Track pending charges
  - Monitor credit utilization
  - Calculate impact on available cash

### 2. Category Management System

#### 2.1 Hierarchical Categories
- **Requirement**: Create and manage nested category structures
- **Example Structure**:
  ```
  Housing (Parent Category)
  ├── Rent
  ├── Utilities
  │   ├── Water
  │   ├── Electricity
  │   ├── Natural Gas
  └── Insurance
      └── Renters Insurance
  ```

#### 2.2 Category Operations
- **Requirements**:
  - Add new categories and subcategories dynamically
  - Edit existing categories
  - Delete unused categories
  - Assign transactions to categories
  - Reassign transactions between categories
  - Transfer funds between categories

### 3. Budget Management

#### 3.1 Budget Creation
- **Requirement**: Create budgets with flexible time periods
- **Features**:
  - Monthly budgeting
  - Pay-period-based budgeting
  - Category-specific budget amounts
  - Subcategory budget allocation

#### 3.2 Budget Tracking
- **Requirement**: Real-time budget vs. actual comparison
- **Features**:
  - Current period spending by category
  - Over/under budget calculations
  - Month-to-date spending summaries
  - Remaining budget by category

#### 3.3 Budget Adjustment
- **Requirement**: Allow users to modify budget amounts and allocations
- **Features**:
  - Edit budget amounts for existing categories
  - Reallocate budget between categories
  - Adjust budget periods and timeframes
  - Save budget templates for future use
  - View budget change history
  - Mid-period budget adjustments with recalculated daily limits

### 4. Transaction Management

#### 4.1 Transaction Import
- **Requirement**: Automatic transaction import from connected accounts
- **Features**:
  - Real-time transaction sync
  - Pending vs. cleared transaction distinction
  - Transaction categorization
  - Manual transaction entry capability

#### 4.2 Transaction Categorization
- **Requirement**: Assign transactions to appropriate categories
- **Features**:
  - Manual transaction categorization
  - Ability to recategorize transactions
  - Bulk categorization tools
  - Category transfer transactions

### 5. Financial Analytics

#### 5.1 Spending Analysis
- **Requirement**: Comprehensive spending insights
- **Features**:
  - Daily spending limits by category
  - Days until next payday calculations
  - Spending velocity analysis
  - Budget performance metrics

#### 5.2 Account Balance Projections
- **Requirement**: Calculate projected available funds
- **Features**:
  - Combined account balance calculation
  - Pending charge impact analysis
  - Net available funds after pending charges
  - Separate pending vs. cleared views

### 6. Goal Tracking and Projections

#### 6.1 Savings Goal Management
- **Requirement**: Set and track savings goals by category
- **Features**:
  - Goal amount setting
  - Current progress tracking
  - Percentage completion display
  - Timeline projections

#### 6.2 Contribution Planning
- **Requirement**: Calculate required contributions for goal achievement
- **Features**:
  - Target date-based contribution calculations
  - Per-pay-period contribution requirements
  - Goal achievement timeline estimates
  - Multiple scenario modeling

### 7. Income and Payroll Management

#### 7.1 Multiple Income Stream Support
- **Requirement**: Support multiple income sources with different pay schedules
- **Features**:
  - Configure multiple income streams (e.g., salary, freelance, side business)
  - Flexible pay schedule configuration per income stream
  - Examples:
    - Bi-monthly (15th and last day of month)
    - Monthly (3rd of each month)
    - Weekly, bi-weekly, or custom intervals
  - Income amount configuration per stream

#### 7.2 Holiday and Weekend Pay Date Management
- **Requirement**: Automatically adjust pay dates that fall on non-business days
- **Features**:
  - Configurable holiday calendar
  - Automatic bank holiday detection
  - Pay date shifting logic:
    - When pay date falls on weekend, shift to closest business day
    - When pay date falls on holiday, shift to closest business day
    - User-configurable shifting preference (before or after holiday/weekend)
  - Support for:
    - Federal holidays
    - Bank-specific holidays
    - User-defined company holidays

#### 7.3 Paycheck Projection Integration
- **Requirement**: Integrate adjusted pay dates into financial projections
- **Features**:
  - Account balance projections considering actual pay dates
  - Budget period calculations using realistic pay schedules
  - Goal timeline adjustments based on actual pay dates
  - Cash flow projections accounting for holiday delays

### 8. User Interface Requirements

#### 8.1 Dashboard Views
- **Overall Financial Summary**:
  - Total account balances
  - Pending charges summary
  - Net available funds
  - Budget performance overview

- **Category Budget View**:
  - Budget vs. actual by category
  - Remaining budget amounts
  - Daily spending limits
  - Over/under budget indicators

- **Transaction Ledger**:
  - Chronological transaction list
  - Category assignments
  - Pending/cleared status
  - Search and filter capabilities

#### 8.2 Goal Tracking Interface
- **Goal Progress View**:
  - Visual progress indicators
  - Goal completion percentages
  - Timeline projections
  - Required contribution calculations

## Technical Requirements

### 9. Data Management

#### 9.1 Transaction Processing
- **Requirements**:
  - Real-time transaction import
  - Duplicate transaction detection
  - Transaction state management (pending/cleared)
  - Category assignment persistence

#### 9.2 Budget Calculations
- **Requirements**:
  - Real-time budget vs. actual calculations
  - Multi-period budget support
  - Category rollup calculations
  - Projection algorithms

### 10. Integration Requirements

#### 10.1 Bank API Integration
- **Requirements**:
  - Bank of America API integration
  - OAuth authentication
  - Rate limiting compliance
  - Error handling and retry logic

#### 10.2 Data Security
- **Requirements**:
  - Read-only account access
  - Secure credential storage
  - Data encryption at rest and in transit
  - User data privacy compliance

## User Stories

### Core User Stories

**As a user, I want to:**

1. **Connect my Bank of America accounts** so that I can automatically import transactions
2. **Create budget categories with subcategories** so that I can organize my expenses hierarchically
3. **Set monthly and pay-period budgets** so that I can control my spending across different time frames
4. **See real-time spending vs. budget comparisons** so that I can stay within my financial limits
5. **View daily spending limits by category** so that I know how much I can spend before my next paycheck
6. **Track pending vs. cleared transactions** so that I have accurate account balance projections
7. **Set savings goals with target dates** so that I can plan for future expenses
8. **Calculate required contributions for goals** so that I can determine how much to save per pay period
9. **Manually categorize transactions** so that I can ensure accurate expense tracking
10. **Transfer funds between categories** so that I can rebalance my budget as needed

### Advanced User Stories

**As a user, I want to:**

11. **Project my emergency fund growth** so that I can see when I'll reach my target amount
12. **See percentage progress toward savings goals** so that I can track my advancement
13. **View combined account balances across all accounts** so that I have a complete financial picture
14. **Calculate net available funds after pending charges** so that I know my true spending capacity
15. **Model different contribution scenarios** so that I can optimize my savings strategy
16. **Configure multiple income streams with different pay schedules** so that I can track all my income sources
17. **Automatically adjust pay dates for holidays and weekends** so that my financial projections are accurate
18. **Set up holiday calendars** so that the system knows when pay dates should be shifted
19. **Adjust my budget amounts mid-period** so that I can respond to changing financial circumstances
20. **Reallocate budget between categories** so that I can optimize my spending based on actual needs

## Success Metrics

### User Engagement
- Daily active users
- Transaction categorization rate
- Budget completion rate
- Goal achievement rate

### Financial Impact
- Average budget variance reduction
- Savings goal completion time
- User-reported financial improvements

## Future Enhancements (Post-MVP)

### Phase 2: Multi-Bank Support
- Integration with additional banks
- Universal account aggregation
- Cross-bank transaction analysis

### Phase 3: Advanced Analytics
- Spending pattern analysis
- Predictive budgeting
- Automated category suggestions
- Financial health scoring

### Phase 4: Collaboration Features
- Shared budgets for couples/families
- Expense splitting capabilities
- Financial goal sharing

## Technical Architecture Considerations

### Data Models
- **Account**: Bank account information and balances
- **Transaction**: Individual financial transactions
- **Category**: Hierarchical expense categories
- **Budget**: Budget allocations by category and time period
- **Goal**: Savings goals with targets and timelines
- **IncomeStream**: Multiple income sources with flexible pay schedules
- **Holiday**: Holiday calendar for pay date adjustments

### API Design
- RESTful API architecture
- Real-time data synchronization
- Scalable transaction processing
- Secure authentication and authorization

## Risk Assessment

### Technical Risks
- Bank API reliability and changes
- Transaction processing accuracy
- Data synchronization delays
- Security vulnerabilities

### Business Risks
- User adoption challenges
- Competition from established players
- Regulatory compliance requirements
- Bank partnership dependencies

## Conclusion

Personal Accountant addresses the need for comprehensive, real-time financial management with intelligent budgeting and goal tracking capabilities. The hierarchical category system, combined with real-time bank integration and projection tools, provides users with unprecedented insight into their financial habits and future planning capabilities.