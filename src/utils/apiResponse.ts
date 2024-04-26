export interface ISuccessResponse {
    success: boolean;
    statusCode?: number;
    message?: string;
}

export const ResponseSuccess = (message?: string, statusCode?: number): ISuccessResponse => ({
    success: true,
    statusCode,
    message
});

export const ResponseFailure = (message?: string, statusCode?: number): ISuccessResponse => ({
    success: false,
    statusCode,
    message
});

export interface  EmailConfirmationToken {
    token: string;
} 
