export default class UsersDTO {
  constructor(user) {
    if (!user) throw new Error("User data is required");
    this.id = user._id;
    this.name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    this.email = user.email;
    this.role = user.role;
    this.pets = user.pets || [];
  }

  static getUserTokenFrom(user) {
    return {
      _id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      email: user.email,
    };
  }
}
