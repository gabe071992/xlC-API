
# XLC API Routes Documentation

Base URL: `https://xlntapps.com/api/v1`

## Authentication Routes
| Route | Method | Status | Description |
|-------|---------|---------|-------------|
| `/auth/login` | POST | ✅ Implemented | Email/password authentication |
| `/auth/refresh` | POST | ⚠️ Partial | Token refresh endpoint |
| `/auth/logout` | POST | ⚠️ Partial | User logout |
| `/auth/health` | GET | ✅ Implemented | API health check |

## User Management Routes
| Route | Method | Status | Description |
|-------|---------|---------|-------------|
| `/users` | POST | ✅ Implemented | Create new user |
| `/users/:userId` | GET | ✅ Implemented | Get user profile |
| `/users/:userId` | PUT | ✅ Implemented | Update user profile |
| `/users/:userId` | DELETE | ✅ Implemented | Delete user (Admin only) |

## Wallet Routes
| Route | Method | Status | Description |
|-------|---------|---------|-------------|
| `/wallets` | POST | ⚠️ Partial | Create new wallet |
| `/wallets/:address` | GET | ⚠️ Partial | Get wallet details |
| `/wallets/:address/transfer` | POST | ⚠️ Partial | Transfer funds |

## Staking Routes
| Route | Method | Status | Description |
|-------|---------|---------|-------------|
| `/staking/pools` | GET | ⚠️ Partial | List staking pools |
| `/staking/stakes` | POST | ⚠️ Partial | Create new stake |
| `/staking/stakes/:stakeId` | GET | ⚠️ Partial | Get stake details |
| `/staking/stakes/:stakeId` | DELETE | ⚠️ Partial | Unstake funds |

### Authentication
All routes except `/auth/login` and `/auth/health` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Rate Limiting
- Authentication routes: 10 requests/minute
- User routes: Implementation-specific limits
- Wallet routes: Implementation-specific limits
- Staking routes: Implementation-specific limits

✅ = Fully Implemented
⚠️ = Partially Implemented / In Progress
❌ = Not Implemented
