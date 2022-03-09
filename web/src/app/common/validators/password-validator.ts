export const PasswordValidator = function (control: any): string | null {
    let value: string = control || '';
    if (control.value != null) {
        value = control.value;
    }

    if (!value) {
        return null;
    }
    if (value.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    const upperCasePattern = /[A-Z]+/g;
    const lowerCasePattern = /[a-z]+/g;
    const numberPattern = /[0-9]+/g;
    const specialCasePattern = /[!|@|#|$|%|^|&|*]+/g;

    if ((!upperCasePattern.test(value))
        || (!lowerCasePattern.test(value))
        || (!numberPattern.test(value))
        || (!specialCasePattern.test(value))) {
        return 'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 of the following special characters; ! @ # $ % ^ & *';
    }
};