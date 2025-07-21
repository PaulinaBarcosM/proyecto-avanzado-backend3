Este proyecto está basado en el repositorio original de [MauricioEF](https://github.com/usuario-original).
Modificado y mantenido por Paulina Barcos.

AdoptMe - Backend Proyecto Final Coderhouse
Proyecto de backend para un sistema de adopción de mascotas desarrollado durante la diplomatura de Backend III en Coderhouse.

Tecnologías utilizadas
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + Passport
- Docker + Docker Compose
- Swagger (documentación de API)
- Mocha + Chai + Supertest (tests unitarios y funcionales)
- Winston (logger)

📌 Instalación local
- Clonar el repositorio:
  https://github.com/PaulinaBarcosM/proyecto-avanzado-backend3.git
  cd RecursosBackend-Adoptme

- Instalar dependencias:
  npm install

- Configurar variables de entorno:
  cp .env.template .env

- Ejecutar entorno de desarrollo:
  npm run dev o node src/app.js

📌 Documentación con Swagger
-  Podés acceder a la documentación completa de la API en:
  http://localhost:8080/apidocs

- Incluye endpoints para:
  Autenticación (registro, login, current), Usuarios (users), Mascotas (pets) y Adopciones (adoptions).

📌 Scripts disponibles
- npm run dev 
- node src/app.js
- npm run start
- npm run test:api -> (para test funcionales)
- npm run test:unit -> (para test unitarios)

📌 Docker
- Crear imagen
  docker build -t paulinabarcos/adoptmeapp:1.0 .
- Imagen publicada
  https://hub.docker.com/r/paulinabarcos/adoptmeapp
- Ejecutar contenedor
  docker run -p 8080:8080 paulabarcos/adoptme-backend:1.0
- Levantar entorno con Docker Compose
  docker-compose up --build

📌 Variables de entorno importantes
- Puerto de aplicación
  PORT=8080
- Conexión a MongoDB
  MONGO_URL

📌 Usuario para pruebas
- Para pruebas automáticas:
    User:
    usar el mock baseUser de mock.user.test.js
    Pets:
    usar el mock mockPetRequest de mock.adoption.test.js
- Para pruebas de uso manual:
  crear manualmente un usuario desde Postman: POST http://localhost:8080/api/sessions/register
    {
      first_name: "Paula",
      last_name: "Barcos",
      email: "paula@correo.com",
      password: "123456",
    }

🐶 Parte 1: Mocking API - Generación de Usuarios y Mascotas Falsas
Este proyecto incluye un módulo de mocking que permite generar datos falsos de usuarios y mascotas para poblar la base de datos MongoDB con fines de prueba y desarrollo.

✅ Funcionalidad desarrolladas
1. 🔗 Router base /api/mocks
Se creó un archivo mocks.router.js y se montó en la ruta base /api/mocks desde app.js:
  import mocksRouter from './routes/mocks.router.js';
  app.use('/api/mocks', mocksRouter);

2. 🧍 Endpoint GET /api/mocks/mockingusers
Este endpoint genera 50 usuarios falsos utilizando Faker.
  Cada usuario tiene:
    id
    name, last_name
    email, phone
    password: encriptada con bcrypt, valor fijo "coder123"
    role: puede ser "user" o "admin"
    pets: array vacío
📁 El código de generación está en utils/generateUser.js.

3. 🐾 Endpoint GET /api/mocks/mockingpets
Este endpoint genera 50 mascotas falsas con Faker.
  Cada mascota tiene:
  id
  name, type, breed, color
  adopted: booleano aleatorio
  age: edad generada como { years, months }, con mínimo 3 meses y máximo 15 años
📁 El código está en utils/generatePets.js.

4. 🛠️ Endpoint POST /api/mocks/generateData
Este endpoint permite insertar usuarios y mascotas en la base de datos MongoDB.
 🔧 Parámetros requeridos (en el body):
  {
    "users": 10,
    "pets": 20
  }
users: cantidad de usuarios a insertar
pets: cantidad de mascotas a insertar

🧠 ¿Qué hace?
Genera e inserta usuarios usando generateUser().
Genera e inserta mascotas usando generatePets().
Las mascotas se asocian aleatoriamente a los usuarios generados.
  .Durante la creación de mascotas, cada una recibe como owner el ID de un usuario aleatorio recién      insertado.
  .Esto simula una relación realista: cada mascota pertenece a un usuario, y un usuario puede tener      muchas mascotas.
    const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
    fakePet.owner = randomUser._id;
  Esto simula una relación realista:
  ➡️ Cada mascota pertenece a un usuario
  ➡️ Un usuario puede tener múltiples mascotas
📁 Lógica en: services/mock.service.js.

5. Modelos MongoDB
Se crearon modelos UserModel y PetModel en la carpeta models/, siguiendo esquemas compatibles con los datos generados.

📌 Conclusión
Este módulo permite simular un entorno realista con datos falsos para testear endpoints, relaciones y flujos de la app sin tener que ingresar los datos manualmente.
