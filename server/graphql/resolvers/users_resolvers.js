const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    SECRET_KEY,
    { expiresIn: "3h" }
  );
};

module.exports = {
  Mutation: {
    async login(_, { loginInput: { email, password } }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.email = "User not found";
        throw new UserInputError("Errors", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.password = "Wrong credentials provided";
        throw new UserInputError("Errors", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      {
        registerInput: {
          first_name,
          last_name,
          email,
          password,
          confirmPassword,
        },
      },
      context,
      info
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        first_name,
        last_name,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Make sure user doesnt already exist
      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError("User with this email already exists", {
          errors: {
            email: "User with this email already exists",
          },
        });
      }

      // Hash the password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        first_name,
        last_name,
        email,
        password,
        createdOn: new Date().toISOString(),
      });

      //Save the registerd user to the Database
      const res = await newUser.save();

      //Return the data, and token
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({ createdOn: -1 });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
