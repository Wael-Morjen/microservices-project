// appointementSchema.js
const { buildSchema } = require('graphql');

// Créer un schéma GraphQL
const appointementSchema = buildSchema(` 
    type Query {
        appointement(id: Int!): Appointement
        appointements: [Appointement]
    }
    type Mutation {
        addAppointement(patientId: Int!, doctorId: Int!, time: Int!, date: String!): Appointement
        updateAppointement(id: Int!, patientId: Int!, doctorId: Int!, time: Int!, date: String!): Appointement
        deleteAppointement(id: Int!): String
    }

    type Appointement {
        id: Int
        patientId: Int
        doctorId: Int
        time: Int
        date: String

    }
`);
module.exports = appointementSchema;