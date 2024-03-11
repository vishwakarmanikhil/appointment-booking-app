export function maximumLengthExceeded(value, limit){
    if (value !== undefined && value !== null && value !== "") {
        if(typeof(value) !== "string") {
            value = value?.toString();
        }
        if (value?.length > limit) {
            return true;
        }else {
            return false;
        }
    }
}

export const inputFieldValidator = (_, value) => {
    let limit = 50;
    let field_type = _.field;
    let field_name = "Field";

    if(field_type?.includes("First")) {
        field_name = "First Name"
    } else if(field_type?.includes("Last")) {
        field_name = "Last Name"
    }

    if(value !== '' && value !== null && value !== undefined) {
        if(maximumLengthExceeded(value, limit) === true) {
            return Promise.reject(new Error(`${field_name} should not be more than ${limit} characters!`));
        }
    } else {
        return Promise.reject(new Error(`Please input your ${field_name}!`));
    }

    return Promise.resolve();
}

export function passwordValidator(_, value) {
    // validation for password
    let limit = 30;
    if (value !== undefined && value !== null && value !== "") {
        if(value?.length > limit) {
            return Promise.reject(new Error(`Password must be less than ${limit} characters!`));
        }
    } else {
        return Promise.reject(new Error("Please input your password!"));
    }
    return Promise.resolve();
};