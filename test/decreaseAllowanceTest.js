const Zeus = artifacts.require("../build/contracts/Zeus");
const boltTokenProxy = artifacts.require("../build/contracts/BoltTokenProxy");

contract("BoltTokenProxy", accounts => {

// // Increase Allowance Test.
    it("should increase allowance (acc.1 -> acc.2) of 1000", async () => {
        let zeusInstance = await Zeus.deployed();
        let proxyInstance = await boltTokenProxy.deployed();

        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        const amount = 1000;

        await proxyInstance.setAddressOfImplementation(zeusInstance.address);
        await zeusInstance.increaseAllowance(accountTwo, amount, {
            from: accountOne
        });

        let allowance = await proxyInstance.allowance(accountOne, accountTwo);

        assert.equal(
            amount,
            allowance,
            "Allowance and amount not equal"
        )

        assert.notEqual(
            0,
            allowance,
            "The allowance shouldn't be equal to zero"
        )
    })

    it("should decrease allowance (acc.1 -> acc.2) of 1000", async () => {
        let zeusInstance = await Zeus.deployed();
        let proxyInstance = await boltTokenProxy.deployed();

        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        const amount = 1000;

        let startingAllowance = await proxyInstance.allowance(accountOne, accountTwo);

        await proxyInstance.setAddressOfImplementation(zeusInstance.address);
        await zeusInstance.decreaseAllowance(accountTwo, amount, {
            from: accountOne
        });

        let finalAllowance = await proxyInstance.allowance(accountOne, accountTwo);

        assert.equal(
            finalAllowance,
            startingAllowance - amount,
            "Allowance and amount not equal"
        )

        assert.notEqual(
            finalAllowance,
            startingAllowance,
            "The allowance shouldn't be equal to the starting allowance"
        )
    })

})