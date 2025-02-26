import { Test, TestingModule } from "@nestjs/testing"
import { User } from "@prisma/client"
import { UserController } from "src/controllers/user.controller"
import { UserService } from "src/services/user.service"
import { UserRoles } from "src/types/UserTypes"

describe("UserController", () => {
    let controller: UserController
    let userService: UserService

    const mockUserService = {
        register: jest.fn(),
        signIn: jest.fn(),
        setUserEmailVerified: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService
                }
            ]
        }).compile()

        controller = module.get<UserController>(UserController)
        userService = module.get<UserService>(UserService)
    })

    describe("register", () => {
        it("should register a new user if data is correct", async () => {
            const userData: User = {
                email: 'test@test.com',
                firstName: 'Test',
                lastName: 'User',
                password: 'password123',
                id: 1 as unknown as bigint,
                emailVerified: false,
                role: UserRoles.USER,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            mockUserService.register.mockResolvedValue({
                success: true,
                message: "user created successfully"
            })

            const result = await controller.register(userData)
            expect(result.success).toBe(true)
            expect(result.message).toBe("user created successfully")
        })

        it("should not register a new user if data is incorrect", async () => {
            const userData: User = {
                email: 'test@test.com',
                firstName: '',
                lastName: 'User',
                password: 'password123',
                id: 1 as unknown as bigint,
                emailVerified: false,
                role: UserRoles.USER,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            mockUserService.register.mockResolvedValue({
                success: false,
                message: "all fields must be filled"
            })

            const result = await controller.register(userData)
            expect(result.success).toBe(false)
            expect(result.message).toBe("all fields must be filled")
        })
    })
})