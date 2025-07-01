export default class PetsDTO {
  static getPetInputFrom = (pet) => {
    return {
      name: pet.name || "",
      specie: pet.specie || "",
      breed: pet.breed || "",
      color: pet.color || "",
      age: {
        years: Number(pet.ageYears) || 0,
        months: Number(pet.ageMonths) || 0,
      },
      image: pet.image || "",
      adopted: false,
    };
  };
}
