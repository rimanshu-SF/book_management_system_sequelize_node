import { Request, Response, NextFunction } from 'express';


const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;



// import { Request, Response, NextFunction } from 'express';

// // TypeScript version of asyncHandler
// const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => any) => {
//   return (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     return Promise.resolve(requestHandler(req, res, next)).catch(next);
//   };
// };

// export default asyncHandler;
