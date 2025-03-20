describe('validateUsername', () => {
    // Import the function directly if modularized, otherwise define it here for testing
    function validateUsername(username) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return regex.test(username);
    }

    test('should return true for a valid username', () => {
        const username = 'Valid123!';
        expect(validateUsername(username)).toBe(true);
    });

    test('should return false for a username shorter than 8 characters', () => {
        const username = 'Short1!';
        expect(validateUsername(username)).toBe(false);
    });

    test('should return false for a username without a lowercase letter', () => {
        const username = 'INVALID123!';
        expect(validateUsername(username)).toBe(false);
    });

    test('should return false for a username without an uppercase letter', () => {
        const username = 'invalid123!';
        expect(validateUsername(username)).toBe(false);
    });

    test('should return false for a username without a number', () => {
        const username = 'Invalid!';
        expect(validateUsername(username)).toBe(false);
    });

    test('should return false for a username without a special character', () => {
        const username = 'Invalid123';
        expect(validateUsername(username)).toBe(false);
    });
});