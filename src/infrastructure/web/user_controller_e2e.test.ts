import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserService } from "../../application/services/user_service";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserController } from "./user_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqljs",
        dropSchema: true,
        entities: [UserEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    );

    userService = new UserService(userRepository);
    userController = new UserController(userService);

    app.post("/users", (req, res, next) => {
        userController.createUser(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("UserController E2E", () => {
    beforeEach(async () => {
        const userRepo = dataSource.getRepository(UserEntity);
        await userRepo.clear();
    });

    it("deve criar um usuário com sucesso", async () => {
        const response = await request(app).post("/users").send({
            name: "João Silva",
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Usuário criado com sucesso.");
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user.name).toBe("João Silva");
    });

    it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/users").send({
            name: "",
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O campo nome é obrigatório.");
    });
});
