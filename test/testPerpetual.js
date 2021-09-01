/**
 * @author Nick
 * To test:
 *  1) sudo truffle dev 
 *  2) migrate --reset
 *  3) test
 */

const zeusContract = artifacts.require("../build/contracts/Zeus");
const boltTokenProxy = artifacts.require("../build/contracts/BoltTokenProxy");
const perpetualProxy = artifacts.require("../build/contacts/PerpetualProxy");
const perpetualLogic = artifacts.require("../build/contacts/PerpetualLogic");

contract("PerpetualProxy", accounts => {

    it("The perpetual contract should be registered in the array of perpetual addresses", async () => {
        const instanceOfBoltTokenProxy = await boltTokenProxy.deployed();
        const instanceOfZeusContract = await zeusContract.deployed();
        const instanceOfPerpetualProxy = await perpetualProxy.deployed();
        const instanceOfPerpetualLogic = await perpetualLogic.deployed();

        await instanceOfBoltTokenProxy.addPerpetualAddress(instanceOfPerpetualProxy.address, {
            from: accounts[0]
        })
        const checkIfTheAddressIsAPerpetual = await instanceOfBoltTokenProxy.isTheAddressAPerpetual(instanceOfPerpetualProxy.address);
        assert.equal(
            checkIfTheAddressIsAPerpetual,
            true,
            "This isn't the address of a perpetual"
        )
    })

    it("Should let me see that the reserve of the first perpetual is 7625000000", async () => {
        const instanceOfBoltTokenProxy = await boltTokenProxy.deployed();
        const instanceOfZeusContract = await zeusContract.deployed();
        const instanceOfPerpetualProxy = await perpetualProxy.deployed();
        const instanceOfPerpetualLogic = await perpetualLogic.deployed();
        console.log("1 ", await instanceOfPerpetualProxy.getReserve());
        await instanceOfBoltTokenProxy.addPerpetualAddress(instanceOfPerpetualLogic.address, {
            from: accounts[0]
        })
        console.log("2 ", await instanceOfPerpetualProxy.getReserve());
        await instanceOfBoltTokenProxy.setAddressOfImplementation(instanceOfZeusContract.address, {
            from: accounts[0]
        }).catch(err => console.log(err));
        console.log("3 ", await instanceOfPerpetualProxy.getReserve());
        assert.equal(
            await instanceOfBoltTokenProxy.getAddressOfImplementation(),
            instanceOfZeusContract.address,
            "The Zeus instance is not set correctly"
        );
        console.log("4 ", await instanceOfPerpetualProxy.getReserve());
        
        await instanceOfPerpetualLogic.addFunds({
            from: accounts[0]
        }).catch(err => console.log(err));
        assert.equal(
            7625000000,
            await instanceOfPerpetualProxy.getReserve(),
            "The reserve of the owner is not 7625000000"
        );
    })

    // /*
    //     Test 1: Check the ownership of the perpetual contract, the owner must be Storm (the account that deploys the contract)
    //     but the beneficiary must be another account
    // */
    // it("The address of the logic of the perpetual is correct", async () => {
    //     const instanceOfPerpetualProxy = await perpetualProxy.deployed();
    //     const instanceOfPerpetualLogic = await perpetualLogic.deployed();

    //     await instanceOfPerpetualProxy.setAddressOfLogicImplementation(instanceOfPerpetualLogic.address);
    //     const addressOfLogicImplementation = await instanceOfPerpetualProxy.getAddressOfLogicImplementation();
    //     assert.equal(
    //         addressOfLogicImplementation,
    //         instanceOfPerpetualLogic.address,
    //         "The implementation address is not correct"
    //     );
    // })

    // // it("Should set the correct beneficiary of the contract", async () => {
    // //     const instanceOfPerpetualProxy = await perpetualProxy.deployed();
    // //     const instanceOfPerpetualLogic = await perpetualLogic.deployed();
    // //     assert.equal(
    // //         await instanceOfPerpetualProxy.getBeneficiary(),
    // //         accounts[0],
    // //         "The beneficiary should be the one specified when the contract was deployed"
    // //     )
    // //     await instanceOfPerpetualProxy.setAddressOfLogicImplementation(instanceOfPerpetualLogic.address);
    // //     await instanceOfPerpetualProxy.changeBeneficiary(accounts[1], {
    // //         from: accounts[0]
    // //     });
    // //     //Check if the beneficiary has changed
    // //     assert.equal(
    // //         await instanceOfPerpetualProxy.getBeneficiary(),
    // //         accounts[1],
    // //         "The beneficiary is not correct"
    // //     )
    // //     //Check if the beneficiary hasn't changed
    // //     assert.notEqual(
    // //         await instanceOfPerpetualProxy.getBeneficiary(),
    // //         accounts[0],
    // //         "The address of the beneficiary didn't change"
    // //     )
    // // })

    // it("Should mint 3 million tokens and give it to the admin", async () => {
    //     const instanceOfBoltTokenProxy = await boltTokenProxy.deployed();

    //     assert.equal(
    //         await instanceOfBoltTokenProxy.balanceOf(accounts[0]),
    //         3050000000000,
    //         "The amount of token given to the admin is not correct"
    //     )
    //     assert.notEqual(
    //         await instanceOfBoltTokenProxy.balanceOf(accounts[0]),
    //         10,
    //         "The amount given to the admin is wrong"
    //     )
    // })

    // // it("Should mint one milione tokens, give it to the admin and give the right percentage of those tokens to the instance of a perpetual", async () => {
    // //     const instanceOfBoltTokenProxy = await boltTokenProxy.deployed();
    // //     const instanceOfZeusContract = await zeusContract.deployed();
    // //     const instanceOfPerpetualProxy = await perpetualProxy.deployed();
    // //     const instanceOfPerpetualLogic = await perpetualLogic.deployed();

    // //     await instanceOfPerpetualProxy.setAddressOfLogicImplementation(instanceOfPerpetualLogic.address);
    // //     await instanceOfPerpetualProxy.changeBeneficiary(accounts[1], {
    // //         from: accounts[0]
    // //     });
    // //     await instanceOfBoltTokenProxy.mint(accounts[0], 1000000000, {
    // //         from: accounts[0]
    // //     });
    // //     //I CANNOT CALL TRANSFER BECAUSE OF THE MODIFIER IN THE ZEUS CONTRACT 
    // //     //From must be that account because addFunds is only callable from the owner of the proxy (Storm)
    // //     await instanceOfPerpetualLogic.addFunds(2500000).catch(err => console.error(err));
    // //     assert.equal(
    // //         instanceOfPerpetualProxy.getReserve(),
    // //         2500000, 
    // //         "The amount sent to the beneficiary is not correct"
    // //     );
    // // })

    // it("Should let me withdraw without problems", async () => {
    //     const instanceOfBoltTokenProxy = await boltTokenProxy.deployed();
    //     const instanceOfZeusContract = await zeusContract.deployed();
    //     const instanceOfPerpetualProxy = await perpetualProxy.deployed();
    //     const instanceOfPerpetualLogic = await perpetualLogic.deployed();
        
    //     await instanceOfPerpetualProxy.changeBeneficiary(accounts[1], {
    //         from: accounts[0]
    //     });
    //     await instanceOfPerpetualProxy.setAddressOfLogicImplementation(instanceOfPerpetualLogic.address);
    //     await instanceOfPerpetualLogic.withdraw(0, {
    //         from: accounts[0]
    //     })
    //     assert.equal(
    //         0,
    //         await instanceOfPerpetualProxy.getReserve(),
    //         "I should have the permission to withdraw 0 coins, this is a test just for the permissions to withdraw"
    //     );
    // })

})