export const validators = {
  email: (value: string): string | undefined => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return undefined;
  },

  password: (value: string): string | undefined => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  },

  required: (value: string, fieldName: string): string | undefined => {
    if (!value?.trim()) return `${fieldName} is required`;
    return undefined;
  },

  mobileNo: (value: string): string | undefined => {
    if (!value) return undefined;
    const mobileRegex = /^[+]?[\d\s-]{10,}$/;
    if (!mobileRegex.test(value)) return 'Invalid mobile number format';
    return undefined;
  },

  pincode: (value: string): string | undefined => {
    if (!value) return undefined;
    if (!/^\d{5,6}$/.test(value)) return 'Invalid pincode';
    return undefined;
  },
};

export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, (value: unknown) => string | undefined>
): Record<keyof T, string | undefined> {
  const errors = {} as Record<keyof T, string | undefined>;

  for (const key in rules) {
    const error = rules[key](data[key]);
    errors[key] = error;
  }

  return errors;
}


