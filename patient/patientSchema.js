// Import the dependencies for testing
const { buildSchema } = require('graphql');
// GraphQL schema
const patientSchema = buildSchema(`
    type Query {
        patient(id: Int!): Patient
        patients: [Patient]
    }

    type Mutation {
        addPatient(name: String!, lastName: String!, phone: Int!): Patient
        updatePatient(id: Int!, name: String!, lastName: String!, phone: Int!): Patient
        deletePatient(id: Int!): String
    }

    type Patient {
        id: Int
        name: String
        lastName: String
        phone: Int
    }
`);
module.exports = patientSchema;