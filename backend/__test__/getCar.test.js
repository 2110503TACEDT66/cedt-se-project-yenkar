const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { getCars, getSingleCar } = require("../controllers/cars");
const Car = require("../models/Car");
const CarProvider = require("../models/CarProvider");

describe("getCars", () => {
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
      createdAt: new Date("2021-06-21T07:00:49.000Z"),
    });
    await mockCarProvider.save();

    const mockCar = new Car({
      _id: "6621ca97b9abc01973195c02",
      carProvider: mockCarProvider,
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
    });
    await mockCar.save();
    const mockCar2 = new Car({
      _id: "43ccc79b21ba243f4ccc045c",
      carProvider: mockCarProvider,
      brand: "Tesla",
      model: "Model 3",
      doors: 4,
      seats: 5,
      transmission: "auto",
      cargo: "small",
      radio: true,
      air: true,
      price: 1000,
      vrm: "5",
    });
    await mockCar2.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("error GetCars", () => {
    it("should display error message", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      const errorMessage = "Cannot find car";
      const mockQuery = {
        populate: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      };
      const findSpy = jest.spyOn(Car, "find").mockReturnValueOnce(mockQuery);

      await getCars(req, res);

      expect(res.status).toHaveBeenCalledWith(500); // Expecting status 500
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
      expect(findSpy).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalledWith("carProvider");

      findSpy.mockRestore();
      mockQuery.populate.mockRestore();
    });
  });

  describe("getCars", () => {
    it("should return all cars", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await getCars(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const resjson = res.json.mock.calls[0][0];
      expect(resjson.success).toBe(true);
      expect(resjson.count).toBe(2);
      expect(resjson.data.length).toBe(2);
      expect(resjson.data[0].brand).toBe("Honda");
      expect(resjson.data[0].model).toBe("Civic");
      expect(resjson.data[0].doors).toBe(4);
      expect(resjson.data[0].seats).toBe(5);
      expect(resjson.data[0].transmission).toBe("auto");
      expect(resjson.data[0].cargo).toBe("small");
      expect(resjson.data[0].radio).toBe(true);
      expect(resjson.data[0].air).toBe(true);
      expect(resjson.data[0].price).toBe(1000);
      expect(resjson.data[0].vrm).toBe("5");
      expect(resjson.data[1].brand).toBe("Tesla");
      expect(resjson.data[1].model).toBe("Model 3");
      expect(resjson.data[1].doors).toBe(4);
      expect(resjson.data[1].seats).toBe(5);
      expect(resjson.data[1].transmission).toBe("auto");
      expect(resjson.data[1].cargo).toBe("small");
      expect(resjson.data[1].radio).toBe(true);
      expect(resjson.data[1].air).toBe(true);
      expect(resjson.data[1].price).toBe(1000);
      expect(resjson.data[1].vrm).toBe("5");
    });
  });

  describe("get Single Car", () => {
    it("should return a single car", async () => {
      const req = {
        params: {
          id: "6621ca97b9abc01973195c02",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      await getSingleCar(req, res);
      console.log(res.json.mock.calls[0][0]);

      expect(res.status).toHaveBeenCalledWith(200);
      const singleCar = res.json.mock.calls[0][0];
      console.log(singleCar);
      expect(singleCar.success).toBe(true);
      expect(singleCar.data.brand).toBe("Honda");
      expect(singleCar.data.model).toBe("Civic");
      expect(singleCar.data.doors).toBe(4);
      expect(singleCar.data.seats).toBe(5);
      expect(singleCar.data.transmission).toBe("auto");
      expect(singleCar.data.cargo).toBe("small");
      expect(singleCar.data.radio).toBe(true);
      expect(singleCar.data.air).toBe(true);
      expect(singleCar.data.price).toBe(1000);
      expect(singleCar.data.vrm).toBe("5");
    });
  });
  describe("Error when get Car that not exist", () => {
    it(" should return error message", async () => {
      const req = {
        params: {
          id: "6a6cf2711efb4a3d94feb2df",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      await getSingleCar(req, res);
      console.log(res);
      console.log(res.json.mock.calls[0][0]);

      expect(res.status).toHaveBeenCalledWith(400);
      const singleCar = res.json.mock.calls[0][0];
      console.log(singleCar);
      expect(singleCar.success).toBe(false);
      expect(singleCar.message).toBe(`No car with the ID of ${req.params.id}`);
    });
  });

  describe("Error handle when something went wrong in get single car", () => {
    it("should return error message", async () => {
      const req = {
        params: {
          id: "6621ca97b9abc01973195c02",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      const errorMessage = "Cannot find car";
      const mockQuery = {
        populate: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      };
      const findSpy = jest
        .spyOn(Car, "findById")
        .mockReturnValueOnce(mockQuery);

      await getSingleCar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
      expect(findSpy).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalledWith([
        "carProvider",
        { path: "renting", select: "rentDate rentTo" },
      ]);

      findSpy.mockRestore();
      mockQuery.populate.mockRestore();
    });
  });
});
