//  for not found
const notFound = (req, res, next) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};
// error handler for not found and other problems.
const notfoundHandler = (error, req, res, next) => {
    const statuscode = res.statuscode == 200 ? 500 : res.statuscode || 500;
// remember this is done in the case if the res.statuscode is undefined then it will be 500.
    res.status(statuscode);
    res.json({
        message: error?.message,
        stack: error?.stack,
// remember here i need to use the correct writing for the variables passed.
// remember If err was null or undefined, both err?.message and err?.stack would return undefined without causing any errors in your code.
    });
};
export { notfoundHandler, notFound } ;
