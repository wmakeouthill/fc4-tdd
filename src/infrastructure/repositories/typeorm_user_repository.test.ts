import { UserEntity } from "../persistence/entities/user_entity";
import { User } from "../../domain/entities/user";
import { DataSource, Repository } from "typeorm";
import { TypeORMUserRepository } from "./typeorm_user_repository";
describe("TypeORMUserRepository", () => {
  let dataSource: DataSource;
  let userRepository: TypeORMUserRepository;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqljs",
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar um usuário com sucesso", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);

    const savedUser = await repository.findOne({ where: { id: "1" } });
    expect(savedUser).not.toBeNull();
    expect(savedUser?.id).toBe("1");
    expect(savedUser?.name).toBe("John Doe");
  });

  it("deve retornar um usuário quando um ID válido for fornecido", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);

    const savedUser = await userRepository.findById("1");
    expect(savedUser).not.toBeNull();
    expect(savedUser?.getId()).toBe("1");
    expect(savedUser?.getName()).toBe("John Doe");
  });

  it("deve retornar null ao buscar um usuário inexistente", async () => {
    const user = await userRepository.findById("999");
    expect(user).toBeNull();
  });
});
