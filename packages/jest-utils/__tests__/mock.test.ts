import { deepMock } from '../src';

describe('deepMock', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test.each([1, 2, 3])('seq %i', async seq => {
    const fs = deepMock<typeof import('fs')>('fs');
    fs.readFileSync.mockImplementationOnce(() => {
      return `mock seq: ${seq}`;
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { read } = await import('../__mock__/dummy');

    const content = read();
    expect(content).toEqual(`mock seq: ${seq}`);
    expect(fs.readFileSync).toBeCalled();
  });
});
