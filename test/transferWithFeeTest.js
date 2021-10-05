const Zeus = artifacts.require("../build/contracts/Zeus");
const boltTokenProxy = artifacts.require("../build/contracts/BoltTokenProxy");

contract("BoltTokenProxy", accounts => {
    it("should send 10 coins correctly with fee", async () => {
        let zeusInstance = await Zeus.deployed();
        let proxyInstance = await boltTokenProxy.deployed();
        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        let balanceSender = await proxyInstance.balanceOf(accountOne);
        let balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        const amount = 100000000;

        let accountOneStartingBalance = balanceSender.toNumber();
        let accountTwoStartingBalance = balanceReceiver.toNumber();
        await proxyInstance.setAddressOfImplementation(zeusInstance.address);
        await zeusInstance.transferStorm(accountTwo, amount).catch(err => console.log(err))

        balanceSender = await proxyInstance.balanceOf(accountOne);
        balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        let accountOneEndingBalance = balanceSender.toNumber();
        let accountTwoEndingBalance = balanceReceiver.toNumber();

        //In this case the fee must be added because the owner is using the transfer with the fee, so
        //it's sending the fee to its own account
        assert.equal(
            accountOneEndingBalance,
            accountOneStartingBalance - amount,
            "Amount wasn't correctly taken from the account 1"
        )

        assert.equal(
            accountTwoEndingBalance,
            accountTwoStartingBalance + amount,
            "Amount wasn't correctly given to the account 2"
        )
    })

    it("should send 10 bolt from one account (not owner) to another", async () => {
        let zeusInstance = await Zeus.deployed();
        let proxyInstance = await boltTokenProxy.deployed();

        const accountOne = accounts[1];
        const accountTwo = accounts[2];

        let balanceSender = await proxyInstance.balanceOf(accountOne);
        let balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        const amount = 100000000;
        const fee = 1000;

        let accountOneStartingBalance = balanceSender.toNumber();
        let accountTwoStartingBalance = balanceReceiver.toNumber();

        await proxyInstance.setAddressOfImplementation(zeusInstance.address);
        await zeusInstance.transfer(accountTwo, amount, {
            from: accountOne
        }).catch(err => console.log(err));

        balanceSender = await proxyInstance.balanceOf(accountOne);
        balanceReceiver = await proxyInstance.balanceOf(accountTwo);

        let accountOneEndingBalance = balanceSender.toNumber();
        let accountTwoEndingBalance = balanceReceiver.toNumber();

        assert.equal(
            accountOneEndingBalance,
            accountOneStartingBalance - amount,
            "Amount wasn't correctly taken from the account 1"
        )

        assert.equal(
            accountTwoEndingBalance,
            accountTwoStartingBalance + amount - amount / fee,
            "Amount wasn't correctly given to the account 2"
        )
    })
})