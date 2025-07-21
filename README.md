Este proyecto está basado en el repositorio original de [MauricioEF](https://github.com/usuario-original).
Modificado y mantenido por Paulina Barcos.

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
.Durante la creación de mascotas, cada una recibe como owner el ID de un usuario aleatorio recién insertado.
.Esto simula una relación realista: cada mascota pertenece a un usuario, y un usuario puede tener muchas mascotas.
const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
fakePet.owner = randomUser.\_id;
Esto simula una relación realista:
➡️ Cada mascota pertenece a un usuario
➡️ Un usuario puede tener múltiples mascotas
📁 Lógica en: services/mock.service.js.

5. Modelos MongoDB
   Se crearon modelos UserModel y PetModel en la carpeta models/, siguiendo esquemas compatibles con los datos generados.

📌 Conclusión
Este módulo permite simular un entorno realista con datos falsos para testear endpoints, relaciones y flujos de la app sin tener que ingresar los datos manualmente.
