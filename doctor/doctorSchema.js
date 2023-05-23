// Import the dependencies for testing
const { buildSchema } = require('graphql');
// GraphQL schema
const doctorSchema = buildSchema(`
    type Query {
        doctor(id: Int!): Doctor
        doctors: [Doctor]
    }

    type Mutation {
        addDoctor(name: String!, lastName: String!, phone: Int!): Doctor
        updateDoctor(id: Int!, name: String!, lastName: String!, phone: Int!): Doctor
        deleteDoctor(id: Int!): String
    }

    type Doctor {
        id: Int
        name: String
        lastName: String
        phone: Int
    }
`);
module.exports = doctorSchema;