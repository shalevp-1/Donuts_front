import { act, render } from '@testing-library/react';
import ServerStatusLayer from './ServerStatusLayer';
import { fetchServerHealth } from '../../Utils/serverHealth';

jest.mock('../../Utils/serverHealth', () => ({
  fetchServerHealth: jest.fn()
}));

const mockedFetchServerHealth = fetchServerHealth as jest.MockedFunction<typeof fetchServerHealth>;

describe('ServerStatusLayer health polling', () => {
  let visibilityDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    visibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible'
    });
    mockedFetchServerHealth.mockReset();
    mockedFetchServerHealth.mockResolvedValue({ status: 'ok' });
  });

  afterEach(() => {
    jest.useRealTimers();
    if (visibilityDescriptor) {
      Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    } else {
      Reflect.deleteProperty(document, 'visibilityState');
    }
  });

  const changeVisibility = async (state: DocumentVisibilityState) => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: state
    });
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'));
      await Promise.resolve();
    });
  };

  it('pauses online polling while hidden and checks immediately when visible', async () => {
    render(<ServerStatusLayer />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(1);

    await changeVisibility('hidden');
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(1);

    await changeVisibility('visible');
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(2);
  });

  it('runs one immediate check after an in-flight request when visibility returns', async () => {
    let resolveInitialRequest: ((value: { status: 'ok' }) => void) | undefined;
    mockedFetchServerHealth
      .mockImplementationOnce(
        () => new Promise((resolve) => {
          resolveInitialRequest = resolve;
        })
      )
      .mockResolvedValue({ status: 'ok' });

    render(<ServerStatusLayer />);
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(1);
    await changeVisibility('hidden');
    await changeVisibility('visible');
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveInitialRequest?.({ status: 'ok' });
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(2);
  });

  it('keeps the 20-second retry delay while offline', async () => {
    mockedFetchServerHealth
      .mockResolvedValueOnce({ status: 'degraded' })
      .mockResolvedValue({ status: 'ok' });

    render(<ServerStatusLayer />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(19999);
    });
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(mockedFetchServerHealth).toHaveBeenCalledTimes(2);
  });
});
