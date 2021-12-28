export class Util {
    static isMemberValid(member: any, typeValidation: Function): boolean {
        if (member === undefined) {
            return false;
        }

        if (!typeValidation(member)) {
            return false;
        }

        return true;
    }

    static isObject(value: any): boolean {
        return typeof value === "object";
    }

    static isString(value: any): boolean {
        return typeof value === "string";
    }

    static isNumber(value: any): boolean {
        return !isNaN(Number(value));
    }
}