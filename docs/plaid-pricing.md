# Plaid Integration - Rate Plan Details

## Current Plan: Pay-as-you-go Plan

**Contract Type**: Month-to-month plan with no upfront commitments

### Benefits
- Access to GA (Generally Available) products
- No monthly minimum
- Volume discounts available
- Implementation package options
- Account management support

### Pricing Structure

| Product | Rate |
|---------|------|
| **Balance** | $0.10 per call |
| **Enrich** | $2.00 per thousand transactions |
| **Statements** | $0.50 per statement |
| **Transactions** | $0.30 per connected account/month |
| **Recurring Transactions** | $0.15 per connected account/month |
| **Transactions Refresh** | $0.12 per successful call |

### Cost Implications for Personal Accountant App

**Primary Usage**:
- **Transactions**: $0.30/month per connected account (main cost driver)
- **Balance**: $0.10 per balance check call
- **Transactions Refresh**: $0.12 per sync operation

**Example Monthly Cost** (per user):
- 3 connected accounts: $0.90/month in base transaction fees
- Daily balance checks (30 calls): $3.00/month
- Weekly transaction refreshes (4 calls): $0.48/month
- **Total**: ~$4.38/month per user with 3 accounts

**Optimization Strategies**:
- Limit balance calls to essential operations
- Batch transaction refreshes
- Consider user limits on connected accounts
- Implement efficient caching to reduce API calls

**Date Recorded**: July 5, 2025