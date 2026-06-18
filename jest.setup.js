/**
 * Jest Setup File
 */

import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
