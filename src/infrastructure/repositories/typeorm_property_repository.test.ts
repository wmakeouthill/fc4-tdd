import { PropertyEntity } from "../persistence/entities/property_entity";
import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

describe("TypeORMPropertyRepository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqljs",
      dropSchema: true,
      entities: [PropertyEntity, BookingEntity, UserEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar uma propriedade com sucesso", async () => {
    const property = new Property(
      "1",
      "Casa na Praia",
      "Vista para o mar",
      6,
      200
    );

    await propertyRepository.save(property);
    const savedProperty = await repository.findOne({ where: { id: "1" } });
    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.id).toBe("1");
  });

  it("deve retornar uma propriedade com ID valido", async () => {
    const property = new Property(
      "1",
      "Casa na Praia",
      "Vista para o mar",
      6,
      200
    );
    await propertyRepository.save(property);

    const savedProperty = await propertyRepository.findById("1");
    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.getId()).toBe("1");
    expect(savedProperty?.getName()).toBe("Casa na Praia");
  });

  it("deve retornar null ao buscar uma propriedade inexistente", async () => {
    const property = await propertyRepository.findById("999");
    expect(property).toBeNull();
  });
});
