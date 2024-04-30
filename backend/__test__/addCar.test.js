const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Car = require("../models/Car");
const CarProvider = require("../models/CarProvider");
const User = require("../models/User");
const { deleteCar, addCar, updateCar } = require("../controllers/cars");

describe("Add Car Testing", () => {
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
      _id: "6621c2e1eb49fcefaef9f015",
      email: "test@gmail.com",
      password: "123456789",
      name: "test",
      address: "Bangkok",
      telephone: "0987654321",
      balance: 0,
      role: "carProvider",
    });
    await mockCarProvider.save();

    const mockAdmin = new User({
      _id: "6621c2e1eb49fcefaef9f020",
      name: "admin",
      telephone: "0989899898",
      email: "admin@gmail.com",
      password: "123456789",
      balance: 500,
      role: "admin",
    });
    await mockAdmin.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("Add a Car Successfully", () => {
    it("Add a Car Successfully", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
        user: {
          id: "6621c2e1eb49fcefaef9f015",
          role: "carProvider",
        },
        body: {
          brand: "Honda",
          model: "Civic",
          doors: 4,
          seats: 5,
          transmission: "auto",
          cargo: "small",
          radio: true,
          air: true,
          price: 1000,
          vrm: "5",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await addCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(true);
      //console.log(res.json.mock.calls[0][0].data)
      expect(res.json.mock.calls[0][0].data).toHaveProperty("brand", "Honda");
      expect(res.json.mock.calls[0][0].data).toHaveProperty("model", "Civic");
      expect(res.json.mock.calls[0][0].data).toHaveProperty("doors", 4);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("seats", 5);
      expect(res.json.mock.calls[0][0].data).toHaveProperty(
        "transmission",
        "auto"
      );
      expect(res.json.mock.calls[0][0].data).toHaveProperty("cargo", "small");
      expect(res.json.mock.calls[0][0].data).toHaveProperty("radio", true);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("air", true);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("price", 1000);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("vrm", "5");
    });
  });
  describe("Admin add Car for other", () => {
    it("Admin add Car for other Successfully", async () => {
      const req = {
        params: { id: "6621c2e1eb49fcefaef9f015" },
        user: {
          id: "6621c2e1eb49fcefaef9f020",
          role: "admin",
        },
        body: {
          brand: "Porsche",
          model: "Porsche cayenne",
          doors: 4,
          seats: 5,
          transmission: "auto",
          cargo: "small",
          radio: true,
          air: true,
          price: 1000,
          vrm: "99",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await addCar(req, res, jest.fn());

      console.log(res.json.mock.calls[0][0]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(true);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("brand", "Porsche");
      expect(res.json.mock.calls[0][0].data).toHaveProperty(
        "model",
        "Porsche cayenne"
      );
      expect(res.json.mock.calls[0][0].data).toHaveProperty("doors", 4);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("seats", 5);
      expect(res.json.mock.calls[0][0].data).toHaveProperty(
        "transmission",
        "auto"
      );
      expect(res.json.mock.calls[0][0].data).toHaveProperty("cargo", "small");
      expect(res.json.mock.calls[0][0].data).toHaveProperty("radio", true);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("air", true);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("price", 1000);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("vrm", "99");
    });
  });

  describe("No Car Provider", () => {
    it("No Car Provider", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f016",
        },
        user: {
          id: "6621c2e1eb49fcefaef9f016",
          role: "carProvider",
        },
        body: {
          brand: "Honda",
          model: "Civic",
          doors: 4,
          seats: 5,
          transmission: "auto",
          cargo: "small",
          radio: true,
          air: true,
          price: 1000,
          vrm: "5",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await addCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe(
        "No car provider with the ID of 6621c2e1eb49fcefaef9f016"
      );
    });
  });

  describe("Price below than 0", () => {
    it("Price below than 0", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
        user: {
          id: "6621c2e1eb49fcefaef9f015",
          role: "carProvider",
        },
        body: {
          brand: "Honda",
          model: "Civic",
          doors: 4,
          seats: 5,
          transmission: "auto",
          cargo: "small",
          radio: true,
          air: true,
          price: -1,
          vrm: "5",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await addCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe("Car has not been added");
    });
  });

  describe("Price is 0", () => {
    it("Price below than 0", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
        user: {
          id: "6621c2e1eb49fcefaef9f015",
          role: "carProvider",
        },
        body: {
          brand: "Honda",
          model: "Civic",
          doors: 4,
          seats: 5,
          transmission: "auto",
          cargo: "small",
          radio: true,
          air: true,
          price: 0,
          vrm: "5",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await addCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(false);
      expect(res.json.mock.calls[0][0].message).toBe("Car has not been added");
    });
  });

  describe("Add a Car Successfully by Admin", () => {
    it("Add a Car Successfully by Admin", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
        user: {
          id: "6621c2e1eb49fcefaef9f020",
          role: "admin",
        },
        body: {
          carProvider: "6621c2e1eb49fcefaef9f015",
          brand: "Honda",
          model: "Civic",
          doors: 4,
          seats: 5,
          transmission: "auto",
          cargo: "small",
          radio: true,
          air: true,
          price: 1000,
          vrm: "500",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await addCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].success).toBe(true);
      //console.log(res.json.mock.calls[0][0].data)
      expect(res.json.mock.calls[0][0].data).toHaveProperty("brand", "Honda");
      expect(res.json.mock.calls[0][0].data).toHaveProperty("model", "Civic");
      expect(res.json.mock.calls[0][0].data).toHaveProperty("doors", 4);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("seats", 5);
      expect(res.json.mock.calls[0][0].data).toHaveProperty(
        "transmission",
        "auto"
      );
      expect(res.json.mock.calls[0][0].data).toHaveProperty("cargo", "small");
      expect(res.json.mock.calls[0][0].data).toHaveProperty("radio", true);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("air", true);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("price", 1000);
      expect(res.json.mock.calls[0][0].data).toHaveProperty("vrm", "500");
    });
  });

  describe("updateCar", () => {
    it("should return 400 if car is not found", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Car.findById = jest.fn().mockResolvedValue(null);

      await updateCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false });
    });

    it("should return 400 if user is not authorized", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
        user: {
          id: "6621c2e1eb49fcefaef9f020",
          role: "user",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const car = {
        carProvider: "6621c2e1eb49fcefaef9f015",
      };

      Car.findById = jest.fn().mockResolvedValue(car);

      await updateCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: `Not authorized to update the car with id ${req.params.id}!`,
      });
    });

    it("should update the car and return 200", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
        user: {
          id: "6621c2e1eb49fcefaef9f015",
          role: "carProvider",
        },
        body: {
          brand: "Honda",
          model: "Civic",
          doors: 4,
          seats: 5,
          transmission: "auto",
          cargo: "small",
          radio: true,
          air: true,
          price: 1000,
          vrm: "500",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const car = {
        carProvider: "6621c2e1eb49fcefaef9f015",
      };

      const updatedCar = {
        brand: "Honda",
        model: "Civic",
        doors: 4,
        seats: 5,
        transmission: "auto",
        cargo: "small",
        radio: true,
        air: true,
        price: 1000,
        vrm: "500",
      };

      Car.findById = jest.fn().mockResolvedValue(car);
      Car.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCar);

      await updateCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedCar,
      });
    });

    it("should return 400 if there is an error", async () => {
      const req = {
        params: {
          id: "6621c2e1eb49fcefaef9f015",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Car.findById = jest.fn().mockRejectedValue(new Error());

      await updateCar(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false });
    });
  });
});

// npx jest --coverage --collectCoverageFrom=./models/Car.js --collectCoverageFrom=./controllers/cars.js
