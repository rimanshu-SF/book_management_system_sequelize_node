class apiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];
    stack!: string;

    constructor(
        statusCode: number,
        message: string = "Something went wrong. It's not you, it's us.",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.name = this.constructor.name; 
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default apiError;