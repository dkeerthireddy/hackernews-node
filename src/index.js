const Query  = require('../resolvers/Query');
const Mutation = require('../resolvers/Mutation');
const User = require('../resolvers/User');
const Link = require('../resolvers/Link');
const Subscription = require('../resolvers/Subscription')
const Vote = require('../resolvers/Vote')
const { getUserId } = require('./utils');
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()


let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}];

// 2
//let idCount = links.length;
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link, Vote
};
    // Mutation: {
    //     //2
    //     post: (parent, args, context, info) => {
    //         const newLink = context.prisma.link.create({
    //             data: {
    //                 url: args.url,
    //                 description: args.description,
    //             },
    //         })
    //         return newLink
    //     },
    // },



// noinspection JSCheckFunctionSignatures
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphqls'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    }
});
server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );