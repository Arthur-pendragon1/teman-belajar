# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this application, please send an email to the developer. All security vulnerabilities will be promptly addressed.

## Security Considerations

### Data Storage
- Data is stored in browser's localStorage
- No server-side storage or database
- Users are responsible for their own data backup

### Authentication
- Simple username/password authentication
- Default credentials are provided for demo purposes
- **Change default passwords in production environment**

### Best Practices
1. **Change default credentials** before deploying to production
2. **Regularly backup** your localStorage data
3. **Do not store sensitive information** in this application
4. Use in a controlled, private network environment

### Limitations
- This is a client-side only application
- No server-side validation or security
- No encryption for stored data
- Not intended for sensitive or production financial data

## Contact

For security issues, please contact the developer directly.

