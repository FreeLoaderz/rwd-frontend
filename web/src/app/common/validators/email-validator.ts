export const EmailValidator = function (control: any): string | null {
    const value: string = control.value || control;
    if (!value) {
        return "No value given";
    }

    const emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g;

    if (!emailPattern.test(value)) {
        return 'Invalid email';
    } else {
        return null;
    }
};