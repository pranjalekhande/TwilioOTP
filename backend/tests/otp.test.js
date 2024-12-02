const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); 
const Otp = require("../models/otpModel");
const User = require("../models/userModel");

const { expect } = chai;
chai.use(chaiHttp);

describe("OTP System Tests", () => {
  before(async () => {
    await User.deleteMany({});
    await Otp.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
    await Otp.deleteMany({});
    server.close(); 
  });

  describe("User Registration", () => {
    it("should register a new user and send OTP", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({ phone: "+1234567890" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("message", "User registered and OTP sent successfully.");
          done();
        });
    });

    it("should not allow duplicate user registration", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({ phone: "+1234567890" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message", "Phone number already registered.");
          done();
        });
    });
  });

  describe("OTP Validation", () => {
    let otp;

    before(async () => {
      // Get the OTP for testing
      const otpRecord = await Otp.findOne({ phone: "+1234567890" });
      otp = otpRecord?.otp || null;
    });

    it("should validate the correct OTP", (done) => {
      chai
        .request(server)
        .post("/api/validate-otp")
        .send({ phone: "+1234567890", otp })
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res.body).to.have.property("message", "OTP validated successfully.");
          done();
        });
    });

    it("should reject an incorrect OTP", (done) => {
      chai
        .request(server)
        .post("/api/validate-otp")
        .send({ phone: "+1234567890", otp: "111111" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error", "Invalid OTP.");
          done();
        });
    });

    it("should reject an expired OTP", async () => {
      // Manually expire the OTP for testing
      await Otp.updateOne({ phone: "+1234567890" }, { createdAt: new Date(Date.now() - 3 * 60 * 1000) });

      chai
        .request(server)
        .post("/api/validate-otp")
        .send({ phone: "+1234567890", otp })
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body).to.have.property("error", "OTP expired. Please request a new OTP.");
        });
    });
  });

  describe("Resend OTP", () => {
    it("should resend a new OTP", (done) => {
      chai
        .request(server)
        .post("/api/resend-otp")
        .send({ phone: "+1234567890" })
        .end(async (err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message", "New OTP sent successfully.");

          const otpRecord = await Otp.findOne({ phone: "+1234567890" });
          expect(otpRecord).to.exist;
          done();
        });
    });

    it("should remove the previous OTP when resending", (done) => {
      chai
        .request(server)
        .post("/api/resend-otp")
        .send({ phone: "+1234567890" })
        .end(async (err, res) => {
          expect(res).to.have.status(200);

          const otpRecords = await Otp.find({ phone: "+1234567890" });
          expect(otpRecords).to.have.lengthOf(1); // Only one OTP should exist
          done();
        });
    });
  });

  describe("Error Handling", () => {
    it("should return 404 if phone number is not registered", (done) => {
      chai
        .request(server)
        .post("/api/validate-otp")
        .send({ phone: "+0987654321", otp: "123456" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error", "No OTP found for this phone number.");
          done();
        });
    });

    it("should handle missing fields gracefully", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});
