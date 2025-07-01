export default class UsersDTO {
  constructor(user) {
    this.id = user._id;
    this.name = `${user.first_name} ${user.last_name}`;
    this.email = user.email;
    this.role = user.role;
    this.pets = user.pets || [];
  }

  static getUserTokenFrom(user) {
    return {
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      email: user.email,
    };
  }
}
