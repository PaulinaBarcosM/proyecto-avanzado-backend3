export const baseUser = {
  first_name: "Paula",
  last_name: "Barcos",
  email: "paula@correo.com",
  password: "123456",
};

export const userWithId = {
  ...baseUser,
  _id: "12345",
};

export const userWithRole = {
  userWithId,
  role: "user",
};

export const userWithPets = {
  _id: "abc123",
  first_name: "Paula",
  last_name: "Barcos",
  email: "paula@correo.com",
  password: "123456",
  role: "user",
  pets: ["dog", "cat"],
};

export const userForDTO = {
  id: "12345",
  first_name: "Paula",
  last_name: "Barcos",
  email: "paula@correo.com",
  password: "PasswordDifícil",
};

export const alteredUser = {
  first_name: "Coder",
  last_name: "House",
  email: "example123@example.com",
  password: "PasswordDificil",
};

export const userUpdateService = {
  first_name: "Actualizada",
  email: "nueva@correo.com",
};
