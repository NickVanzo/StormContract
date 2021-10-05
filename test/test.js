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

    

    it("should send 1 coin from one account to another + fee to the owner", async () => {
        let zeusInstance = await Zeus.deployed();
        let proxyInstance = await boltTokenProxy.deployed();
        const owner = accounts[0];
        const accountOne = accounts[1];
        const accountTwo = accounts[2];

        let balanceOwner = await proxyInstance.balanceOf(owner);
        let balanceSender = await proxyInstance.balanceOf(accountOne);
        let balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        const amount = 1000000;
        const fee = amount / 1000;

        let ownerStartingBalance = balanceOwner.toNumber();
        let accountOneStartingBalance = balanceSender.toNumber();
        let accountTwoStartingBalance = balanceReceiver.toNumber();

        assert.equal(
            accountOneStartingBalance,
            0,
            "The sender account must be empty"
        )

        assert.equal(
            accountTwoStartingBalance,
            0,
            "The receiver account must be empty"
        )

        await proxyInstance.setAddressOfImplementation(zeusInstance.address);
        await zeusInstance.transferStorm(accountOne, amount);
        // await zeusInstance.transfer(accountTwo, amount, {
        //     from: accountOne
        // }).catch(err => console.log(err))

        balanceOwner = await proxyInstance.balanceOf(owner);
        balanceSender = await proxyInstance.balanceOf(accountOne);
        balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        let accountOneEndingBalance = balanceSender.toNumber();
        let accountTwoEndingBalance = balanceReceiver.toNumber();
        let ownerEndingBalance = balanceOwner.toNumber();

        assert.equal(
            ownerEndingBalance,
            ownerStartingBalance - amount,
            "The owner should have sent 1 coin at this point"
        )
    })

    // //Approve Test.
    // it("should approve 1 coin", async () => {
    //     let zeusInstance = await Zeus.deployed();
    //     let proxyInstance = await boltTokenProxy.deployed();

    //     const accountOne = accounts[0];
    //     const accountTwo = accounts[1];

    //     const amount = 1000000;

    //     await proxyInstance.setAddressOfImplementation(zeusInstance.address);
    //     await zeusInstance.approve(accountOne, accountTwo, amount).catch(err => console.log(err));


    //     let allowance = await proxyInstance.allowance(accountOne, accountTwo);

    //     assert.equal(
    //         amount,
    //         allowance,
    //         "Allowance and amount not equal"
    //     )

    // })

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