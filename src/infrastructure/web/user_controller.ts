import { UserService } from "../../application/services/user_service";
import { Request, Response } from "express";

export class UserController {
    constructor(private readonly userService: UserService) { }

    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "O campo nome é obrigatório." });
            }

            const user = await this.userService.createUser(name);

            return res.status(201).json({
                message: "Usuário criado com sucesso.",
                user: {
                    id: user.getId(),
                    name: user.getName(),
                },
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
