import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyController } from "./property_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqljs",
        dropSchema: true,
        entities: [PropertyEntity, BookingEntity, UserEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );

    propertyService = new PropertyService(propertyRepository);
    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("PropertyController E2E", () => {
    beforeEach(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        await propertyRepo.clear();
    });

    it("deve criar uma propriedade com sucesso", async () => {
        const response = await request(app).post("/properties").send({
            name: "Casa na Praia",
            description: "Uma bela casa na praia",
            maxGuests: 6,
            basePricePerNight: 250,
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Propriedade criada com sucesso.");
        expect(response.body.property).toHaveProperty("id");
        expect(response.body.property.name).toBe("Casa na Praia");
        expect(response.body.property.maxGuests).toBe(6);
        expect(response.body.property.basePricePerNight).toBe(250);
    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/properties").send({
            name: "",
            description: "Descrição",
            maxGuests: 4,
            basePricePerNight: 100,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O nome da propriedade é obrigatório.");
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        const responseZero = await request(app).post("/properties").send({
            name: "Casa",
            description: "Descrição",
            maxGuests: 0,
            basePricePerNight: 100,
        });

        expect(responseZero.status).toBe(400);
        expect(responseZero.body.message).toBe(
            "A capacidade máxima deve ser maior que zero."
        );

        const responseNegative = await request(app).post("/properties").send({
            name: "Casa",
            description: "Descrição",
            maxGuests: -1,
            basePricePerNight: 100,
        });

        expect(responseNegative.status).toBe(400);
        expect(responseNegative.body.message).toBe(
            "A capacidade máxima deve ser maior que zero."
        );
    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const response = await request(app).post("/properties").send({
            name: "Casa",
            description: "Descrição",
            maxGuests: 4,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O preço base por noite é obrigatório.");
    });
});
