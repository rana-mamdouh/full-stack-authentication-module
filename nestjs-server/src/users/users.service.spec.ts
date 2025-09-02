import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

jest.mock('bcryptjs');

describe('UsersService.create', () => {
    let service: UsersService;

    const saveMock = jest.fn();
    const constructorMock = jest.fn().mockImplementation((doc: any) => ({
        ...doc,
        save: saveMock,
    }));

    const findOneExecMock = jest.fn();
    const findOneMock = jest.fn().mockReturnValue({ exec: findOneExecMock });

    const userModelMock: any = function (this: any, doc: any) {
        return constructorMock(doc);
    } as any;
    (userModelMock as any).findOne = findOneMock;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: userModelMock,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should hash password and create a user when email is unique', async () => {
        const dto = { email: 'test@example.com', name: 'Test', password: 'plain' } as any;

        findOneExecMock.mockResolvedValueOnce(null);
        (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-password');
        saveMock.mockResolvedValueOnce({
            _id: 'id123',
            email: dto.email,
            name: dto.name,
            password: 'hashed-password',
        });

        const created = await service.create(dto);

        expect(findOneMock).toHaveBeenCalledWith({ email: dto.email });
        expect(bcrypt.hash).toHaveBeenCalledWith('plain', 12);
        expect(constructorMock).toHaveBeenCalledWith({
            email: dto.email,
            name: dto.name,
            password: 'hashed-password',
        });
        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(created).toMatchObject({ email: dto.email, name: dto.name, password: 'hashed-password' });
    });

    it('should throw ConflictException when user already exists', async () => {
        const dto = { email: 'exists@example.com', name: 'User', password: 'secret' } as any;

        findOneExecMock.mockResolvedValueOnce({ _id: 'existing' });

        await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);

        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(saveMock).not.toHaveBeenCalled();
    });
});


