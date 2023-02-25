//Import AuthenticationError from apollo-server-express
const { AuthenticationError } = require('apollo-server-express');
//Import User model
const { User } = require('../models');
//Import signToken function from authorization functions
const { signToken } = require('../utils/auth');

//Define resolvers
const resolvers = {
    //Define query resolvers
    Query: {
      //Define method to query me
        me: async (parent, args, context) => {
          if (context.user) { //If user context is available
            return User.findOne({ _id: context.user._id }).populate('savedBooks'); //Return proper user using the context and populate the savedBooks
          }
          throw new AuthenticationError('You need to be logged in!'); //If there is no context send Authentication Error
        },
    },
    //Define mutation resolvers
    Mutation: {
        //Define method to add User
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password }); //Create user using username, email and password
            const token = signToken(user); //Sign token using new user
            return { token, user }; //Return token and new user
          },
        //Define method to login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email }); //Find an user using its email
      
            if (!user) { //If no user was found
              throw new AuthenticationError('No user found with this email address'); //Send Authentication Error
            }
      
            const correctPw = await user.isCorrectPassword(password); //Validate if the password is correct
      
            if (!correctPw) { //If the password is not correct
              throw new AuthenticationError('Incorrect credentials'); //Send Authentication Error
            }
      
            const token = signToken(user); //Sign token using the user that is logging in
      
            return { token, user }; //Return token and user
          },
          //Method to save a book
          saveBook: async (parent, {input}, context) => {
            if (input.description === undefined){ //Validate if the book has no description
              input.description = "No description available" //Set the description to a message
            }
            if (context.user) { //If user context is available
              return User.findOneAndUpdate( //Return the user found and updated
                { _id: context.user._id }, //Find the user using its id
                {
                  $addToSet: { //Add book to the savedBooks of the user
                    savedBooks: input ,
                  },
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
            throw new AuthenticationError('You need to be logged in!'); //Return Authentication Error if there is no context available
          },
          //Method to remove a book
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {//If user context is available
              return User.findOneAndUpdate( //Return the user found and updated
                { _id: context.user._id }, //Find the user using its id
                {
                  $pull: { //Remove book from the savedBooks of the user
                    savedBooks: {
                      bookId: bookId,
                    },
                  },
                },
                { new: true }
              );
            }
            throw new AuthenticationError('You need to be logged in!'); //Return Authentication Error if there is no context available
          },

    }

}

//Export resolvers
module.exports = resolvers;

