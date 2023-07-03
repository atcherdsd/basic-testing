// Uncomment the code below and write your tests
import path from 'path';
import fs from 'fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const timeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 100;

    doStuffByTimeout(callback, timeout);
    expect(timeoutSpy).toHaveBeenCalledWith(callback, timeout);

    timeoutSpy.mockClear();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 100;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(timeout);

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const intervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 100;

    doStuffByInterval(callback, interval);
    expect(intervalSpy).toHaveBeenCalledWith(callback, interval);

    intervalSpy.mockClear();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const intervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 100;

    doStuffByInterval(callback, interval);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    intervalSpy.mockClear();
  });
});

describe('readFileAsynchronously', () => {
  jest.mock('path');
  jest.mock('fs');

  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');
    const pathToFile = 'file.txt';

    await readFileAsynchronously(pathToFile);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);

    joinSpy.mockClear();
  });

  test('should return null if file does not exist', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const pathToFile = 'file.txt';

    expect(await readFileAsynchronously(pathToFile)).toBeNull();

    existsSyncSpy.mockClear();
  });

  test('should return file content if file exists', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSpy = jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue('Hello!');
    const pathToFile = 'file.txt';

    expect(await readFileAsynchronously(pathToFile)).toBe('Hello!');

    existsSyncSpy.mockClear();
    readFileSpy.mockClear();
  });
});
