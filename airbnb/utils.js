//if any error occurs we need to send error information to user with status cpde as a error
function createErrorResult(error) { 
    return { status: 'error', error } 
} 
//when request (get,post,delete,put) processed succesfully we need to send data along with status code as a success
function createSuccessResult(data) {
    return { status: 'success', data } 
    } 
//creating the final result depending on status
function createResult(error, data) { 
    return error ? createErrorResult(error) :
createSuccessResult(data)
         } 
//to make available all three functions in other js file
module.exports = 
         { createResult, 
            createSuccessResult, 
            createErrorResult,
         }