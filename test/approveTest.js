const Zeus = artifacts.require("../build/contracts/Zeus");
const boltTokenProxy = artifacts.require("../build/contracts/BoltTokenProxy");

contract("BoltTokenProxy", accounts => {
      // //Approve Test.
    it("an address should approve 1 coin to another address", async () => {
        let zeusInstance = await Zeus.deployed();
        let proxyInstance = await boltTokenProxy.deployed();

        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        const amount = 1000000;

        await proxyInstance.setAddressOfImplementation(zeusInstance.address);
        await zeusInstance.approve(accountOne, accountTwo, amount).catch(err => console.log(err));

        let allowance = await proxyInstance.allowance(accountOne, accountTwo);

        assert.equal(
            amount,
            allowance,
            "Allowance and amount not equal"
        )
    })
})