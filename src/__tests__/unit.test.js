const reqSchema = require("../schema/validator");
const getPhoneNumber = require("../services/getPhoneNumber");
const errorCatch = require("../utils/errorCatch");
const ServerResponse = require("../utils/serverResponse");

test("Server response returns the right object", () => {
  let status = 200
  let message = "empty value for from"
  let error = "from invalid"
  expect(ServerResponse(status, message, error)).toEqual(
    {
      status,
      response: {
        message,
        error
      }

    });
});

test("Error response is correct for each error case", () => {
  expect.assertions(4)
  let error1 = {
    details: [
      {
        type: "string.empty",
        path: ["from"]
      }
    ]
  }

  let error2 = {
    details: [
      {
        type: "string.min",
        path: ["to"]
      }
    ]
  }

  let error3 = {
    details: [
      {
        type: "string.max",
        path: ["to"]
      }
    ]
  }

  let error4 = {
    details: [
      {
        type: "any other reason",
        path: ["to"]
      }
    ]
  }
  expect(errorCatch(error1)).toEqual({
    status: 400,
    response: {
      message: "",
      error: "from is missing"
    }
  })

  expect(errorCatch(error2)).toEqual({
    status: 400,
    response: {
      message: "",
      error: "to is invalid"
    }
  })

  expect(errorCatch(error3)).toEqual({
    status: 400,
    response: {
      message: "",
      error: "to is invalid"
    }
  })

  expect(errorCatch(error4)).toEqual({
    status: 400,
    response: {
      message: "",
      error: "unknown failure"
    }
  })
})

describe("Joi validation", () => {
  let mockInput;

  beforeEach(() => {
    mockInput = {
      from: "1234567",
      to: "12345",
      text: "Hello"
    }
  })

  it("should return an error if any of the to or from parameters' length is lower than 6", async () => {
    try {
      await reqSchema.validateAsync(mockInput)
    }
    catch (err) {
      expect(err.details[0].type).toMatch(/string.min/)
    }

  })

  it("should return an error if any of the three parameters are missing", async () => {
    mockInput.from = ""
    try {
      await reqSchema.validateAsync(mockInput)
    }
    catch (err) {
      expect(err.details[0].type).toMatch(/string.empty/)
    }

  })

  it("should return an error if any of the to or from parameters' length is greater than 16", async () => {
    mockInput.from = "12345678910111213141516"
    try {
      await reqSchema.validateAsync(mockInput)
    }
    catch (err) {
      expect(err.details[0].type).toMatch(/string.max/)
    }

  })
})

describe("Communications with database", () => {
  let database;
  beforeEach(() => {
    database =
      [{
        from: "123456789",
        to: "345678910"
      },
      {
        from: "223456789",
        to: "3426228910"
      }]
  })

  it("gets the `to` value for a `from` input, from the database", async ()=>{
    const numberResponse = await getPhoneNumber("441224980100")
    expect(numberResponse.number).toBe("441224980100")
  })

  it("gets the `to` value for a `from` input, from the database", async ()=>{
    const numberResponse = await getPhoneNumber("4412249")
    expect(numberResponse).toBe(null)
  })
})
