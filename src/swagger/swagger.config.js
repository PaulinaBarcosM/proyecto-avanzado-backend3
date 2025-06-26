import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación del proyecto backend III - Coderhouse",
      description:
        "Adopción de Mascotas API: endpoint de usuarios, mascotas, adopción y más",
      version: "1.0.0",
    },
  },

  apis: ["./src/swagger/docs/**/*.yaml"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
export default swaggerSpecs;
