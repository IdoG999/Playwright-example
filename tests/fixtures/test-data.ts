/**
 * Typed test data for XQA.io E2E tests.
 * Use with fixtures for consistent, reusable test data.
 */

export interface TextBoxFormData {
  fullName: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
}

export interface PracticeFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  dateOfBirth: string;
  hobbies: ('sports' | 'reading' | 'music')[];
  address: string;
  state: string;
  city: string;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

/**
 * Factory: returns text box form data.
 * Pass empty or override specific fields for variations.
 */
export function createTextBoxData(overrides?: Partial<TextBoxFormData>): TextBoxFormData {
  return {
    fullName: 'John Doe',
    email: 'john@example.com',
    currentAddress: '123 Main St',
    permanentAddress: '456 Oak Ave',
    ...overrides,
  };
}

/**
 * Factory: returns practice form data.
 */
export function createPracticeFormData(overrides?: Partial<PracticeFormData>): PracticeFormData {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    mobile: '9876543210',
    dateOfBirth: '1995-05-15',
    hobbies: ['sports'],
    address: '123 Main Street, City',
    state: 'NCR',
    city: 'Delhi',
    ...overrides,
  };
}

/**
 * Factory: returns login credentials (for negative tests, use invalid values).
 */
export function createLoginCredentials(overrides?: Partial<LoginCredentials>): LoginCredentials {
  return {
    userName: 'invaliduser',
    password: 'wrongpassword',
    ...overrides,
  };
}
