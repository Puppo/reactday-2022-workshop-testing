import { act, renderHook } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { getRepositoriesByUser } from "../../../services/github.service";
import { useRepositories } from "./repositories.hooks";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));
jest.mock("../../../services/github.service");

const waitTesting = () => act(() => Promise.resolve());

describe("useRepositories", () => {
  let useParamsMock: jest.MockedFn<typeof useParams>;
  const userId = "userId";
  let getRepositoriesByUserMock: jest.MockedFn<typeof getRepositoriesByUser>;
  const repositoriesMock = [
    {
      name: "repo1",
      description: "description1",
    },
  ];

  beforeEach(() => {
    useParamsMock = useParams as unknown as jest.MockedFn<typeof useParams>;
    useParamsMock.mockReturnValue({ userId });
    getRepositoriesByUserMock =
      getRepositoriesByUser as unknown as jest.MockedFn<
        typeof getRepositoriesByUser
      >;
    getRepositoriesByUserMock.mockResolvedValue(repositoriesMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call 'getRepositoriesByUser' on startup", async () => {
    renderHook(() => useRepositories());

    expect(getRepositoriesByUserMock.mock.calls.length).toBe(1);
    await waitTesting();
  });

  it("should return repositories after the http request", async () => {
    const { result } = renderHook(() => useRepositories());

    await waitTesting();

    expect(result.current.repositories).toEqual(repositoriesMock);
  });

  it("should return loading false after http request", async () => {
    const { result } = renderHook(() => useRepositories());

    await waitTesting();

    expect(result.current.loading).toEqual(false);
  });

  it("should return error undefined on startup", async () => {
    const { result } = renderHook(() => useRepositories());

    expect(result.current.error).toBeUndefined();
    await waitTesting();
  });

  it("should return error with default message if http request return strange error", async () => {
    getRepositoriesByUserMock.mockRejectedValueOnce("error");

    const { result } = renderHook(() => useRepositories());
    await waitTesting();

    expect(result.current.error).toMatch(
      /an error occurred while loading repositories/i
    );
  });

  it("should return error with http message if http request return Error", async () => {
    getRepositoriesByUserMock.mockRejectedValueOnce(new Error("error"));

    const { result } = renderHook(() => useRepositories());
    await waitTesting();

    expect(result.current.error).toMatch(/error/i);
  });

  it("should not call http request if userId is not defined", async () => {
    useParamsMock.mockReturnValueOnce({});

    renderHook(() => useRepositories());

    await waitTesting();

    expect(getRepositoriesByUserMock.mock.calls.length).toBe(0);
  });
});

export {};
