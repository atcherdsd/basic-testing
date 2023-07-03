// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

const newBankAccount = getBankAccount(300);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const getBalanceSpy = jest.spyOn(newBankAccount, 'getBalance');
    const getCreatedBalance = newBankAccount.getBalance();
    expect(getCreatedBalance).toBe(300);

    expect(getBalanceSpy).toHaveBeenCalledTimes(1);
    getBalanceSpy.mockClear();
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawSpy = jest.spyOn(newBankAccount, 'withdraw');
    const balance = newBankAccount.getBalance();

    expect(() => {
      newBankAccount.withdraw(400);
    }).toThrow(new InsufficientFundsError(balance));

    expect(withdrawSpy).toHaveBeenCalledWith(400);
    withdrawSpy.mockClear();
  });

  test('should throw error when transferring more than balance', () => {
    const transferSpy = jest.spyOn(newBankAccount, 'transfer');
    const balance = newBankAccount.getBalance();
    const receivingAccount = getBankAccount(1000000);

    expect(() => {
      newBankAccount.transfer(400, receivingAccount);
    }).toThrow(new InsufficientFundsError(balance));

    expect(transferSpy).toHaveBeenCalledWith(400, receivingAccount);
    transferSpy.mockClear();
  });

  test('should throw error when transferring to the same account', () => {
    const transferSpy = jest.spyOn(newBankAccount, 'transfer');
    const receivingAccount = newBankAccount;

    expect(() => {
      newBankAccount.transfer(200, receivingAccount);
    }).toThrow(new TransferFailedError());

    expect(transferSpy).toHaveBeenCalledWith(200, receivingAccount);
    transferSpy.mockClear();
  });

  test('should deposit money', () => {
    const anotherBankAccount = getBankAccount(300);
    const depositSpy = jest.spyOn(anotherBankAccount, 'deposit');
    const makeDeposit = anotherBankAccount.deposit(670);

    expect(makeDeposit.getBalance()).toBe(970);

    expect(depositSpy).toHaveBeenCalledTimes(1);
    depositSpy.mockClear();
  });

  test('should withdraw money', () => {
    const anotherBankAccount = getBankAccount(300);
    const withdrawSpy = jest.spyOn(anotherBankAccount, 'withdraw');
    const withdrawMoney = anotherBankAccount.withdraw(100);

    expect(withdrawMoney.getBalance()).toBe(200);

    expect(withdrawSpy).toHaveBeenCalledTimes(1);
    expect(withdrawSpy).toHaveBeenCalledWith(100);
    withdrawSpy.mockClear();
  });

  test('should transfer money', () => {
    const anotherBankAccount = getBankAccount(300);
    const transferSpy = jest.spyOn(anotherBankAccount, 'transfer');
    const receivingAccount = getBankAccount(150);
    anotherBankAccount.transfer(100, receivingAccount);

    expect(anotherBankAccount.getBalance()).toBe(200);
    expect(receivingAccount.getBalance()).toBe(250);

    expect(transferSpy).toHaveBeenCalled();
    transferSpy.mockClear();
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const anotherBankAccount = getBankAccount(300);
    const fetchBalanceSpy = jest.spyOn(anotherBankAccount, 'fetchBalance');
    const data = await anotherBankAccount
      .fetchBalance()
      .then((number) => number);

    expect(data).toEqual(data);

    expect(fetchBalanceSpy).toHaveBeenCalledTimes(1);
    fetchBalanceSpy.mockClear();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const anotherBankAccount = getBankAccount(300);
    const fetchBalanceSpy = jest.spyOn(anotherBankAccount, 'fetchBalance');
    const synchronizeBalanceSpy = jest.spyOn(
      anotherBankAccount,
      'synchronizeBalance',
    );
    const mockedReceivedBalance = 42;

    fetchBalanceSpy.mockResolvedValueOnce(mockedReceivedBalance);
    await anotherBankAccount.synchronizeBalance();

    expect(anotherBankAccount.getBalance()).toEqual(42);

    expect(synchronizeBalanceSpy).toHaveBeenCalledTimes(1);
    fetchBalanceSpy.mockClear();
    synchronizeBalanceSpy.mockClear();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const anotherBankAccount = getBankAccount(300);
    const fetchBalanceSpy = jest.spyOn(anotherBankAccount, 'fetchBalance');
    const synchronizeBalanceSpy = jest.spyOn(
      anotherBankAccount,
      'synchronizeBalance',
    );
    const mockedReceivedBalance = null;
    fetchBalanceSpy.mockResolvedValueOnce(mockedReceivedBalance);

    expect(anotherBankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );

    expect(synchronizeBalanceSpy).toHaveBeenCalledTimes(1);
    fetchBalanceSpy.mockClear();
    synchronizeBalanceSpy.mockClear();
  });
});
