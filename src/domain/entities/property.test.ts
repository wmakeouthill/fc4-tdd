import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Property Entity", () => {
  it("deve criar um instância de Property com todos os atributos", () => {
    const property = new Property(
      "1",
      "Casa de praia",
      "Uma bela casa na praia",
      4,
      200
    );

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa de praia");
    expect(property.getDescription()).toBe("Uma bela casa na praia");
    expect(property.getMaxGuests()).toBe(4);
    expect(property.getBasePricePerNight()).toBe(200);
  });

  it("deve lançar um erro se o nome for vazio", () => {
    expect(() => {
      new Property("1", "", "Descrição", 4, 200);
    }).toThrow("O nome da propriedade é obrigatório.");
  });

  it("deve lançar um erro se o número máximo de hospedes for zero ou negativo", () => {
    expect(() => {
      new Property("1", "Casa", "Descrição", 0, 200);
    }).toThrow("A capacidade máxima deve ser maior que zero.");
  });

  it("deve validar o número máximo de hóspedes", () => {
    const property = new Property("1", "Casa de Campo", "Descrição", 5, 150);

    expect(() => {
      property.validateGuestCount(6);
    }).toThrow("Número máximo de hóspedes excedido. Máximo permitido: 5.");
  });

  it("não deve aplicar desconto para estadias menores que 7 noites", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-16")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(600);
  });

  it("deve aplicar desconto para estadias de 7 noites ou mais", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-17")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(630); // 7 noites * 100 *0.9 = 630
  });

  it("deve verificar disponibilidade da propriedade", () => {
    const property = new Property("1", "Apartamento", "Descrição", 4, 200);
    const user = new User("1", "Maria Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const dateRange2 = new DateRange(
      new Date("2024-12-22"),
      new Date("2024-12-27")
    );

    new Booking("1", property, user, dateRange, 2);

    expect(property.isAvailable(dateRange)).toBe(false);
    expect(property.isAvailable(dateRange2)).toBe(false);
  });
});
