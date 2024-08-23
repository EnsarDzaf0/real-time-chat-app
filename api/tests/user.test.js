const expect = require('chai').expect;
const sinon = require('sinon');
const { User } = require('../models/index');
const UserService = require('../services/user');
const passwordUtils = require('../utils/password');
const jwt = require('jsonwebtoken');

describe('User Service', () => {

    const mockUser = {
        id: 1,
        username: 'johnDoe',
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: process.env.HASHED_PASSWORD || 'Password123',
        dateOfBirth: new Date(),
        image: 'image.jpg',
        lastLoginDate: new Date(),
        updatedAt: new Date(),
        createdAt: new Date()
    };

    describe('Get User By Username', () => {
        let findOne;

        beforeEach(() => {
            findOne = sinon.stub(User, 'findOne');
        });

        afterEach(() => {
            findOne.restore();
        });

        it('should return user with provided username', async () => {

            findOne.resolves(mockUser);

            const result = await UserService.getUserByUsername('johnDoe');

            expect(result).to.be.equal(mockUser);
            expect(findOne.calledOnce).to.be.true;
        });

        it('should return null if user is not found', async () => {
            findOne.resolves(null);

            const result = await UserService.getUserByUsername('empty');

            expect(result).to.be.null;
            expect(findOne.calledOnce).to.be.true;
        });
    });

    describe('Login User', () => {
        let findOne;
        let sign;
        let comparePasswordsStub;
        let updateStub

        const userData = {
            username: 'johnDoe',
            password: 'Password123'
        };

        beforeEach(() => {
            findOne = sinon.stub(UserService, 'getUserByUsername');
            sign = sinon.stub(jwt, 'sign');
            comparePasswordsStub = sinon.stub(passwordUtils, 'comparePasswords');
            updateStub = sinon.stub(User, 'update');
        });

        afterEach(() => {
            findOne.restore();
            sign.restore();
            comparePasswordsStub.restore();
            updateStub.restore();
        });

        it('should throw an error if user is not found', async () => {
            findOne.resolves(null);

            try {
                await UserService.loginUser(userData);
            } catch (error) {
                expect(error.message).to.be.equal('Invalid credentials');
            }
        });

        it('should return user and token if credentials are valid', async () => {
            findOne.resolves(mockUser);
            sign.returns('token');
            comparePasswordsStub.returns(true);
            updateStub.resolves([1]);

            const result = await UserService.loginUser(userData);

            expect(result).to.deep.equal({ user: mockUser, token: 'token' });
        });

        it('should throw an error if credentials are invalid', async () => {
            findOne.resolves(null);

            try {
                await UserService.loginUser(userData);
            } catch (error) {
                expect(error.message).to.be.equal('Invalid credentials');
            }
        });

        it('should throw an error if password is invalid', async () => {
            findOne.resolves(mockUser);
            comparePasswordsStub.resolves(false);

            try {
                await UserService.loginUser({
                    username: 'johnDoe',
                    password: 'password000'
                });
            } catch (error) {
                expect(error.message).to.be.equal('Invalid credentials');
            }
        });
    });

    describe('Register User', () => {
        let findOne;
        let create;
        let sign;

        const userData = {
            username: 'johnDoe',
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: 'Password123',
            dateOfBirth: new Date()
        }

        beforeEach(() => {
            findOne = sinon.stub(UserService, 'getUserByUsername');
            create = sinon.stub(User, 'create');
            sign = sinon.stub(jwt, 'sign');
        });

        afterEach(() => {
            findOne.restore();
            create.restore();
            sign.restore();
        });

        it('should throw an error if user already exists', async () => {
            findOne.resolves(mockUser);

            try {
                await UserService.registerUser(userData);
            } catch (error) {
                expect(error.message).to.be.equal('Username already exists');
            }
        });

        it('should return user and token if user is created successfully', async () => {
            findOne.resolves(null);
            create.resolves(mockUser);
            sign.returns('token');

            const result = await UserService.registerUser(userData);

            expect(result).to.deep.equal({ user: mockUser, token: 'token' });
        });

        it('should throw an error if user data is invalid', async () => {
            findOne.resolves(null);

            try {
                await UserService.registerUser({
                    username: 'johnDoe',
                    name: 'John Doe',
                    email: 'johndoeemail.com',
                    password: 'Password123',
                    dateOfBirth: new Date()
                });
            } catch (error) {
                expect(error.message).to.be.equal('"email" must be a valid email');
            }
        });
    });
});
