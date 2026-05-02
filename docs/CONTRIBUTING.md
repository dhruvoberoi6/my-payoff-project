# Contributing to OfflinePay

First off, thank you for considering contributing to OfflinePay! It's people like you that make OfflinePay such a great tool for the offline world.

## Git Workflow

We follow a standard feature-branch workflow:

1.  **Fork the Project**: Create your own fork of the repository.
2.  **Create a Feature Branch**: `git checkout -b feature/amazing-feature`.
3.  **Commit Your Changes**: Follow the conventional commit format (see below).
4.  **Push to the Branch**: `git push origin feature/amazing-feature`.
5.  **Open a Pull Request**: Submit a PR to the `main` branch for review.

## Code Style

### ESLint & Prettier
We use ESLint and Prettier to maintain code consistency.
- **Rules**: We follow the Airbnb base style with React-specific overrides.
- **Automatic Formatting**: Run `npm run lint` before committing to ensure all files meet the standard.

### Commit Message Format
We use **Conventional Commits**:
- `feat: add biometric unlock for mobile`
- `fix: resolve race condition in sync engine`
- `docs: update security threat model`
- `test: add unit tests for trust scoring`

## Running Tests Locally

Before submitting a PR, ensure all tests pass:

```bash
# Run unit tests (Vitest)
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (Playwright)
npx playwright test
```

## Security Vulnerability Reporting
If you find a security vulnerability, please do **NOT** open an issue. Instead, email security@offlinepay.io so we can resolve it privately.
