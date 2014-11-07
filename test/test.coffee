Serializer = require("..")

describe "Test that the Encrypted Serializer...", ->
    serializer = null

    beforeEach ->
        serializer = new Serializer("AaBbCc")

    it "implements the correct methods", ->
        serializer.should.respondTo("serialize")
        serializer.should.respondTo("deserialize")

    it "implements the correct properties", ->
        serializer.should.have.property("name")

    it "is named correctly", ->
        serializer.should.have.property("name")
        serializer.name.should.equal("EncryptedSerializer")

    it "serialize(deserialize(x)) == x", ->
        x = true
        serializer.deserialize(serializer.serialize(x)).should.equal(x)
        x = "123"
        serializer.deserialize(serializer.serialize(x)).should.equal(x)
        x = 123
        serializer.deserialize(serializer.serialize(x)).should.equal(x)
