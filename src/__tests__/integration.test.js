const request = require('supertest')
const app = require('../app')
const { default: Redis } = require("ioredis");
const res = require('express/lib/response');

const redis = new Redis()
describe("testing inbound routes", () => {
    let username = "azr2"
    let password = "54P2EOKQ47"
    it("should return inbound sms okay for a post request without issue", async () => {
        const response = await request(app)

            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "441224980100",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "inbound sms ok",
            "error": ""
        })
    })

    it("should return an error if any of the parameter is missing", async () => {
        const response = await request(app)

            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "",
                to: "441224980100",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "from is missing"
        })
    })

    it("should return an error if any of the parameter is missing", async () => {
        const response = await request(app)

            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "441224980100",
                text: ""
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "text is missing"
        })
    })

    it("should return an error if any of the parameter is missing", async () => {
        const response = await request(app)

            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "to is missing"
        })
    })

    it("should return an error if any of the parameter is less than 6", async () => {
        const response = await request(app)

            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "44",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "to is invalid"
        })
    })

    it("should return an error if any of the parameter is less than 6", async () => {
        const response = await request(app)

            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "618",
                to: "441224980100",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "from is invalid"
        })
    })

    it("should return an error if any of the parameter is greater than 16", async () => {
        const response = await request(app)

            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "61813243546576089753423565768798809753",
                to: "441224980100",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "from is invalid"
        })
    })

})


describe("testing outbound routes", () => {
    let username = "azr2"
    let password = "54P2EOKQ47"
    it("should return a response to indicate STOP was in the inbound sms between the two numbers", async () => {
        await request(app)
            .post("/inbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "441224980100",
                text: "STOP"
            })

        const response =
            await request(app)
                .post("/outbound/sms")
                .auth(username, password)
                .send({
                    from: "61871112939",
                    to: "441224980100",
                    text: "Hey"
                })

        redis.del("61871112939-441224980100")

        expect(response.body).toEqual(
            {
                "error": "sms from 61871112939 to 441224980100 blocked by STOP request",
                "message": ""
            }
        )
    })

    it("should return outbound sms okay for a post request without issue", async () => {
        const response = await request(app)

            .post("/outbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "31297728125",
                text: "Hello"
            })

        await redis.del("61871112939")
        expect(response.body).toEqual({
            "message": "outbound sms ok",
            "error": ""
        })
    })

    it("should return an error if any of the parameter is missing", async () => {
        const response = await request(app)

            .post("/outbound/sms")
            .auth(username, password)
            .send({
                from: "",
                to: "441224980100",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "from is missing"
        })
    })

    it("should return an error if any of the parameter is missing", async () => {
        const response = await request(app)

            .post("/outbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "441224980100",
                text: ""
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "text is missing"
        })
    })

    it("should return an error if any of the parameter is missing", async () => {
        const response = await request(app)
            .post("/outbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "to is missing"
        })
    })

    it("should return an error if any of the parameter is less than 6", async () => {
        const response = await request(app)
            .post("/outbound/sms")
            .auth(username, password)
            .send({
                from: "61871112939",
                to: "44",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "to is invalid"
        })
    })

    it("should return an error if any of the parameter is less than 6", async () => {
        const response = await request(app)
            .post("/outbound/sms")
            .auth(username, password)
            .send({
                from: "618",
                to: "441224980100",
                text: "Hello"
            })

        expect(response.body).toEqual({
            "message": "",
            "error": "from is invalid"
        })
    })

    it("should return an error if the request has been called 50 times", async () => {
        // 61871112940
        await redis.set("61871112937", "51", 'ex', 14400)
        const response =
            await request(app)
                .post("/outbound/sms")
                .auth(username, password)
                .send({
                    from: "61871112937",
                    to: "441224980100",
                    text: "Hello"
                })
        await redis.del("61871112937")
        expect(response.body).toEqual({
            "error": "limit reached for from 61871112937",
            "message": ""
        })

    })
})