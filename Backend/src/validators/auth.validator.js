import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }
    next()
}

export const registerValidator = [
    body("username")
      .trim()
      .notEmpty().withMessage("Username is reuired")
      .isLength({min: 3, max: 30}).withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-z0-9_]+$/).withMessage("Username can only conatin letters, number, and underscores"),

    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please provide a valid email"),
    
    body("password")
      .notEmpty().withMessage("Password must required")
      .isLength({ min: 6 }).withMessage("Password muts be at least 6 characters"),

    validate
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Provide a vailed email."),
  
  body("password")
      .notEmpty().withMessage("Password must required")
      .isLength({ min: 6 }).withMessage("Password muts be at least 6 characters"),
  
  validate
]
