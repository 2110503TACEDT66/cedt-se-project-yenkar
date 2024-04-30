const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Car = require('../models/Car');
const CarProvider = require('../models/CarProvider');
const User = require('../models/User')
const { deleteCar } = require('../controllers/cars') 

describe('deleteCar', () => {
  let mongoServer;
  let connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
      const mockCarProvider = new CarProvider({
        _id: '6621c2e1eb49fcefaef9f015',
        email: 'test@gmail.com',
        password: '123456789',
        name: 'test',
        address: 'Bangkok',
        telephone: '0987654321',
        balance: 0,
        role: 'carProvider'
      });
      await mockCarProvider.save();
  
  
      const mockCarProvider2 = new CarProvider({
          _id: '6621c2e1eb49fcefaef9f016',
          email: 'test2@gmail.com',
          password: '123456789',
          name: 'test2',
          address: 'Bangkok',
          telephone: '0987654320',
          balance: 0,
          role: 'carProvider'
      });
      await mockCarProvider2.save();

      const mockCar = new Car({
        _id: '6621ca97b9abc01973195c02',
        carProvider: mockCarProvider,
        brand: 'Honda',
        model: 'Civic',
        doors: 4,
        seats: 5,
        transmission: 'auto',
        cargo: 'small',
        radio: true,
        air: true,
        price: 1000,
        vrm: '5'
      });
      await mockCar.save();
      
      const mockCar2 = new Car({
        _id: '6621ca97b9abc01973195c04',
        carProvider: mockCarProvider,
        brand: 'Toyota',
        model: 'Altis',
        doors: 4,
        seats: 5,
        transmission: 'auto',
        cargo: 'small',
        radio: true,
        air: true,
        price: 1000,
        vrm: '6'
      });
      await mockCar2.save();

      const mockAdmin = new User({
        _id: '6621c2e1eb49fcefaef9f020',
        name: 'admin',
        telephone: '0989899898',
        email: 'admin@gmail.com',
        password: '123456789',
        balance: 500,
        role: 'admin',
      })
      await mockAdmin.save();
  
  })

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });


  describe('Delete a non-existing car', () => {
    it('Not car found', async () => {
      const req = {
        params: {
            id: '6621ca97b9abc01973195c03',
          },
        user: {
            id: '6621c2e1eb49fcefaef9f015',
            role: 'carProvider',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await deleteCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe('No car with id 6621ca97b9abc01973195c03 found!');
    });
  });

  describe('Unauthorized deletion of a car', () => {
    it('Not authorized', async () => {
      const req = {
        params: {
            id: '6621ca97b9abc01973195c02',
          },
        user: {
            id: '6621c2e1eb49fcefaef9f016',
            role: 'carProvider',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await deleteCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe('Not authorized to delete car with id 6621ca97b9abc01973195c02!');
    });
  });

  describe('Deletion with invalid car provider ID', () => {
    it('Invalid car provider', async () => {
      const req = {
        params: {
            id: '6621ca97b9abc01973195c02',
          },
        user: {
            id: '6621c2e1eb49fcefaef9f017',
            role: 'carProvider',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await deleteCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe('Not authorized to delete car with id 6621ca97b9abc01973195c02!');
    });
  });

  describe('Successful deletion of a car', () => {
    it('Successfully deleted car', async () => {
      const req = {
        params: {
          id: '6621ca97b9abc01973195c02',
        },
        user: {
          id: '6621c2e1eb49fcefaef9f015',
          role: 'carProvider',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await deleteCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(true);
      expect(res.json.mock.calls[0][0].message).toBe('Successfully deleted car id 6621ca97b9abc01973195c02');
    });
  });

  describe('Checking that the car is deleted', () => {
    it('Car already deleted', async () => {
      const req = {
        params: {
            id: '6621ca97b9abc01973195c02',
          },
        user: {
            id: '6621c2e1eb49fcefaef9f015',
            role: 'carProvider',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await deleteCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe('No car with id 6621ca97b9abc01973195c02 found!');
    });
  });

  describe('Admin user deleting a car', () => {
    it('admin deleted car', async () => {
      const req = {
        params: {
          id: '6621ca97b9abc01973195c04',
        },
        user: {
          id: '6621c2e1eb49fcefaef9f020',
          role: 'admin',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await deleteCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(true);
      expect(res.json.mock.calls[0][0].message).toBe('Successfully deleted car id 6621ca97b9abc01973195c04');
    });
  });

});