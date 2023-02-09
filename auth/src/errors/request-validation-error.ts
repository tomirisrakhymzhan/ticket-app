import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
export class RequestValidationError extends CustomError {
  
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // TS technicality to explicitly set prototype: write this only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map((err) => {
        return { message: err.msg, field: err.param };
        });
    }

}
// THE ABOVE IS THE SAME AS THIS:
// export class RequestValidationError extends Error {
//     errors: ValidationError[];
//     constructor(errors: ValidationError[]) {
//       super();
//       this.errors = errors;
//       // Only because we are extending a built in class
//       Object.setPrototypeOf(this, RequestValidationError.prototype);
//     }
//  }
  