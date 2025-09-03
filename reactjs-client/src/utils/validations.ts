export interface ValidationErrors {
    email?: string;
    name?: string;
    password?: string;
}

export const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
};

export const validateName = (name: string): string | undefined => {
    if (!name) return 'Name is required';
    if (name.length < 3) return 'Name must be at least 3 characters long';
    return undefined;
};

export const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        return 'Password must contain at least one special character';
    return undefined;
};

export const validateForm = (
    email: string,
    password: string,
    name?: string
): ValidationErrors => {
    const errors: ValidationErrors = {};

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = name !== undefined ? validateName(name) : undefined;

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (nameError) errors.name = nameError;

    return errors;
};