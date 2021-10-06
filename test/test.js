/**
 * @author Nick
 * To test:
 *  1) sudo truffle dev --network testnet
 *  2) migrate --reset
 *  3) test
 */

const Zeus = artifacts.require("../build/contracts/Zeus");
const boltTokenProxy = artifacts.require("../build/contracts/BoltTokenProxy");

contract("BoltTokenProxy", accounts => {

    //BalaceOf Test.
    it("the admin should have 3MLN coins", async () => {
        const instance = await boltTokenProxy.deployed();
        const balance = await instance.balanceOf(accounts[0]);
        assert.equal(balance.valueOf(), 3050000000000);
    })

  

    // //Decerase Allowance Test.
    // it("should decrease allowance (acc.1 -> acc.2) of 1000", async () => {
    //     let zeusInstance = await Zeus.deployed();
    //     let proxyInstance = await boltTokenProxy.deployed();

    //     const accountOne = accounts[0];
    //     const accountTwo = accounts[1];

    //     const amount = 1000;

    //     await proxyInstance.setAddressOfImplementation(zeusInstance.address);
    //     await zeusInstance.decreaseAllowance(accountOne, accountTwo, amount).catch(err => console.log(err));

    //     let allowance = await proxyInstance.allowance(accountOne, accountTwo);

    //     assert.equal(
    //         999000,
    //         allowance,
    //         "Allowance and amount not equal"
    //     )

    // })

    // // Increase Allowance Test.
    // it("should increase allowance (acc.1 -> acc.2) of 1000", async () => {
    //     let zeusInstance = await Zeus.deployed();
    //     let proxyInstance = await boltTokenProxy.deployed();

    //     const accountOne = accounts[0];
    //     const accountTwo = accounts[1];

    //     const amount = 1000;

    //     await proxyInstance.setAddressOfImplementation(zeusInstance.address);
    //     await zeusInstance.increaseAllowance(accountOne, accountTwo, amount).catch(err => console.log(err));

    //     let allowance = await proxyInstance.allowance(accountOne, accountTwo);

    //     assert.equal(
    //         1000000,
    //         allowance,
    //         "Allowance and amount not equal"
    //     )

    // })

})