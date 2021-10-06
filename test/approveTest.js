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

        let senderBalance = await proxyInstance.balanceOf(accountOne);
        let receiverBalance = await proxyInstance.balanceOf(accountTwo);

        assert.equal(
            amount,
            allowance,
            "Allowance and amount not equal"
        )

        assert.equal(
            0,
            receiverBalance.toNumber(),
            "The balance of the receiver should be 0"
        )

        assert.equal(
            3050000000000,
            senderBalance.toNumber(),
            "The balance of the first balance should be 0"
        )
    })

    it("should let transferFrom used after allowance was set", async () => {
        let zeusInstance = await Zeus.deployed();
        let proxyInstance = await boltTokenProxy.deployed();

        const accountZero = accounts[0];
        const accountOne = accounts[1];
        const accountTwo = accounts[2];

        let amount = 1000000;
        let fee = amount / 1000;

        let balanceSender = await proxyInstance.balanceOf(accountZero);
        let balanceCaller = await proxyInstance.balanceOf(accountOne);
        let balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        let accountSenderStartingBalance = balanceSender.toNumber();
        let accountReceiverStartingBalance = balanceReceiver.toNumber();
        let accountCallerStartingBalance = balanceCaller.toNumber();

        await proxyInstance.setAddressOfImplementation(zeusInstance.address);
        await zeusInstance.transferFrom(accountZero, accountTwo, amount, {
            from: accountOne
        })

        balanceSender = await proxyInstance.balanceOf(accountZero);
        balanceCaller = await proxyInstance.balanceOf(accountOne);
        balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        let accountSenderFinalBalance = balanceSender.toNumber();
        let accountReceiverFinalBalance = balanceReceiver.toNumber();
        let accountCallerEndingBalance = balanceCaller.toNumber();

        assert.equal(
            accountCallerEndingBalance, 
            accountCallerStartingBalance,
            "The caller must have the same amount of bolts before and after the call"
        )

        assert.equal(
            accountSenderFinalBalance, 
            accountSenderStartingBalance - amount + fee,
            "The sender did not send the correct amount of BOLTs"
        )        

        assert.equal(
            accountReceiverFinalBalance,
            accountReceiverStartingBalance + amount - fee,
            "The receiver has not received the correct amount of BOLTs"
        )

    })
})