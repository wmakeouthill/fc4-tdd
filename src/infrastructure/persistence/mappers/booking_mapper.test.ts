import { BookingMapper } from "./booking_mapper";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";

describe("BookingMapper", () => {
    const createValidPropertyEntity = (): PropertyEntity => {
        const entity = new PropertyEntity();
        entity.id = "prop-123";
        entity.name = "Casa Teste";
        entity.description = "Descrição da casa";
        entity.maxGuests = 5;
        entity.basePricePerNight = 200;
        return entity;
    };

    const createValidUserEntity = (): UserEntity => {
        const entity = new UserEntity();
        entity.id = "user-123";
        entity.name = "João Silva";
        return entity;
    };

    const createValidBookingEntity = (): BookingEntity => {
        const entity = new BookingEntity();
        entity.id = "booking-123";
        entity.property = createValidPropertyEntity();
        entity.guest = createValidUserEntity();
        entity.startDate = new Date("2025-01-10");
        entity.endDate = new Date("2025-01-15");
        entity.guestCount = 3;
        entity.totalPrice = 1000;
        entity.status = "CONFIRMED";
        return entity;
    };

    it("deve converter BookingEntity em Booking corretamente", () => {
        const entity = createValidBookingEntity();

        const booking = BookingMapper.toDomain(entity);

        expect(booking).toBeInstanceOf(Booking);
        expect(booking.getId()).toBe("booking-123");
        expect(booking.getGuestCount()).toBe(3);
        expect(booking.getTotalPrice()).toBe(1000);
        expect(booking.getStatus()).toBe("CONFIRMED");
        expect(booking.getProperty().getId()).toBe("prop-123");
        expect(booking.getGuest().getId()).toBe("user-123");
        expect(booking.getDateRange().getStartDate()).toEqual(new Date("2025-01-10"));
        expect(booking.getDateRange().getEndDate()).toEqual(new Date("2025-01-15"));
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
        const entityWithInvalidGuest = createValidBookingEntity();
        entityWithInvalidGuest.guest = new UserEntity();
        entityWithInvalidGuest.guest.id = "";
        entityWithInvalidGuest.guest.name = "Nome";

        expect(() => BookingMapper.toDomain(entityWithInvalidGuest)).toThrow(
            "O ID é obrigatório"
        );

        const entityWithInvalidProperty = createValidBookingEntity();
        entityWithInvalidProperty.property = new PropertyEntity();
        entityWithInvalidProperty.property.id = "id";
        entityWithInvalidProperty.property.name = "";
        entityWithInvalidProperty.property.description = "desc";
        entityWithInvalidProperty.property.maxGuests = 5;
        entityWithInvalidProperty.property.basePricePerNight = 100;

        expect(() => BookingMapper.toDomain(entityWithInvalidProperty)).toThrow(
            "O nome da propriedade é obrigatório."
        );
    });

    it("deve converter Booking para BookingEntity corretamente", () => {
        const property = new Property(
            "prop-456",
            "Apartamento",
            "Apartamento central",
            4,
            150
        );
        const guest = new User("user-456", "Maria Santos");
        const dateRange = new DateRange(
            new Date("2025-02-01"),
            new Date("2025-02-05")
        );
        const booking = new Booking("booking-456", property, guest, dateRange, 2);

        const entity = BookingMapper.toPersistence(booking);

        expect(entity).toBeInstanceOf(BookingEntity);
        expect(entity.id).toBe("booking-456");
        expect(entity.guestCount).toBe(2);
        expect(entity.status).toBe("CONFIRMED");
        expect(entity.property.id).toBe("prop-456");
        expect(entity.guest.id).toBe("user-456");
        expect(entity.startDate).toEqual(new Date("2025-02-01"));
        expect(entity.endDate).toEqual(new Date("2025-02-05"));
    });
});
