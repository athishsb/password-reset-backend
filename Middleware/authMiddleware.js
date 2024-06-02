import { check, validationResult } from "express-validator";

// Validation using Express-validator for signup, login, forgotPassword and resetPassword
export const signUpValidation = () => {
  return [
    check("username")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("the name must have minimum length of 3")
      .trim(),
    check("email", "Please enter a valid email address").isEmail(),
    check("password")
      .notEmpty()
      .withMessage("Password should not be empty")
      .isLength({ min: 8, max: 15 })
      .withMessage("your password should have min and max length between 8-15")
      .matches(/\d/)
      .withMessage("your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one sepcial character"),
    check("confirmPassword")
      .notEmpty()
      .withMessage("Password should not be empty")
      .isLength({ min: 8, max: 15 })
      .withMessage("your password should have min and max length between 8-15")
      .matches(/\d/)
      .withMessage("your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one sepcial character")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match with password");
        }
        return true;
      }),
    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

      return response.status(422).json({ errors: extractedErrors });
    },
  ];
};

export const loginValidation = () => {
  return [
    check("email", "Please enter a valid email address").isEmail(),
    check("password")
      .notEmpty()
      .withMessage("Password should not be empty")
      .isLength({ min: 8, max: 15 })
      .withMessage("your password should have min and max length between 8-15")
      .matches(/\d/)
      .withMessage("your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one sepcial character"),
    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));
      return response.status(422).json({ errors: extractedErrors });
    },
  ];
};

export const forgotPasswordvalidation = () => {
  return [
    check("email", "Please enter a valid email address").isEmail(),
    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      return response
        .status(401)
        .json({ message: "Please enter a valid email address" });
    },
  ];
};

export const resetPasswordValidation = () => {
  return [
    check("password")
      .notEmpty()
      .withMessage("Password should not be empty")
      .isLength({ min: 8, max: 15 })
      .withMessage("your password should have min and max length between 8-15")
      .matches(/\d/)
      .withMessage("your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one sepcial character"),
    check("confirmPassword")
      .notEmpty()
      .withMessage("Password should not be empty")
      .isLength({ min: 8, max: 15 })
      .withMessage("your password should have min and max length between 8-15")
      .matches(/\d/)
      .withMessage("your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one sepcial character")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match with password");
        }
        return true;
      }),

    (request, response, next) => {
      const errors = validationResult(request);

      if (errors.isEmpty()) {
        return next();
      } else {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));
        return response.status(422).json({ errors: extractedErrors });
      }
    },
  ];
};
