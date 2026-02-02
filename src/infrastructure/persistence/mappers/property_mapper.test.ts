import { PropertyMapper } from "./property_mapper";
import { PropertyEntity } from "../entities/property_entity";
import { Property } from "../../../domain/entities/property";

describe("PropertyMapper", () => {
  it("deve converter PropertyEntity em Property corretamente", () => {
    const entity = new PropertyEntity();
    entity.id = "prop-123";
    entity.name = "Casa na Praia";
    entity.description = "Uma bela casa na praia";
    entity.maxGuests = 6;
    entity.basePricePerNight = 250;

    const property = PropertyMapper.toDomain(entity);

    expect(property).toBeInstanceOf(Property);
    expect(property.getId()).toBe("prop-123");
    expect(property.getName()).toBe("Casa na Praia");
    expect(property.getDescription()).toBe("Uma bela casa na praia");
    expect(property.getMaxGuests()).toBe(6);
    expect(property.getBasePricePerNight()).toBe(250);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const entityWithoutName = new PropertyEntity();
    entityWithoutName.id = "prop-123";
    entityWithoutName.name = "";
    entityWithoutName.description = "Descrição";
    entityWithoutName.maxGuests = 4;
    entityWithoutName.basePricePerNight = 100;

    expect(() => PropertyMapper.toDomain(entityWithoutName)).toThrow(
      "O nome da propriedade é obrigatório."
    );

    const entityWithInvalidMaxGuests = new PropertyEntity();
    entityWithInvalidMaxGuests.id = "prop-456";
    entityWithInvalidMaxGuests.name = "Casa";
    entityWithInvalidMaxGuests.description = "Descrição";
    entityWithInvalidMaxGuests.maxGuests = 0;
    entityWithInvalidMaxGuests.basePricePerNight = 100;

    expect(() => PropertyMapper.toDomain(entityWithInvalidMaxGuests)).toThrow(
      "A capacidade máxima deve ser maior que zero."
    );
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      "prop-789",
      "Apartamento Centro",
      "Apartamento no centro da cidade",
      4,
      180
    );

    const entity = PropertyMapper.toPersistence(property);

    expect(entity).toBeInstanceOf(PropertyEntity);
    expect(entity.id).toBe("prop-789");
    expect(entity.name).toBe("Apartamento Centro");
    expect(entity.description).toBe("Apartamento no centro da cidade");
    expect(entity.maxGuests).toBe(4);
    expect(entity.basePricePerNight).toBe(180);
  });
});
