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
  //revisar esto de los tags!!
  tags: [
    { name: "Mascotas", description: "Operaciones relacionadas con mascotas" },
    { name: "Usuarios", description: "Gestión de usuarios" },
    { name: "Adopciones", description: "Procesos de adopción" },
    { name: "Autenticación", description: "Login, registro, etc." },
  ],

  //aca van las carpetas donde decidamos hacer la documentacion
  apis: ["./src/routes/*.js"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
export default swaggerSpecs;
