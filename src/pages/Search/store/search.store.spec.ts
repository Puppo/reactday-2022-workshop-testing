import { act, renderHook, waitFor } from "@testing-library/react";
import { gitHubService } from "../../../services";
import { SearchStore, useSearchStore } from "./search.store";

jest.mock("../../../services/github.service");

describe("useSearchStore", () => {
  const setup = (
    initialStoreState: Partial<SearchStore> = useSearchStore.getState()
  ) => {
    useSearchStore.setState(
      {
        ...useSearchStore.getState(),
        ...initialStoreState,
      },
      true
    );
    const { result } = renderHook(() => useSearchStore());
    const history: SearchStore[] = [];
    useSearchStore.subscribe(state => history.push(state));
    return { state: result.current, history };
  };

  const performSearch = (state: SearchStore) => {
    act(() => {
      state.search("test");
    });
  };

  describe("init", () => {
    it("should set loading to false on creation", async () => {
      const { result } = renderHook(() => useSearchStore());
      expect(result.current.loading).toBe(false);
    });

    it("should set error undefined on creation", async () => {
      const { result } = renderHook(() => useSearchStore());
      expect(result.current.error).toBeUndefined();
    });

    it("should set users as empty array on creation", async () => {
      const { result } = renderHook(() => useSearchStore());
      expect(result.current.users).toEqual([]);
    });
  });

  describe("search", () => {
    describe("when search is successful", () => {
      let searchUsersMocked: jest.MockedFn<typeof gitHubService.searchUsers>;
      const mockResult = {
        items: [
          {
            login: "login-1",
            avatar_url: "login-1-avatar",
          },
          {
            login: "login-2",
            avatar_url: "login-2-avatar",
          },
          {
            login: "login-3",
            avatar_url: "login-3-avatar",
          },
        ],
      };

      beforeEach(() => {
        searchUsersMocked = gitHubService.searchUsers as jest.MockedFn<
          typeof gitHubService.searchUsers
        >;
        searchUsersMocked.mockResolvedValue(mockResult);
      });

      it("should set loading to true when search is running", async () => {
        const { state, history } = setup();

        performSearch(state);

        await waitFor(() => {
          expect(history.length).toBe(2);
        });
        expect(history[0].loading).toBe(true);
      });

      it("should set loading to false when search is ended", async () => {
        const { state, history } = setup();

        performSearch(state);

        await waitFor(() => {
          expect(history[1].loading).toBe(false);
        });
      });

      it("should set users when search is ended", async () => {
        const expected = mockResult.items.map(({ login, avatar_url }) => ({
          username: login,
          avatar: avatar_url,
        }));
        const { state, history } = setup();

        performSearch(state);

        await waitFor(() => {
          expect(history[1].users).toEqual(expected);
        });
      });

      it("should set error undefined when search successes", async () => {
        const { state, history } = setup({
          error: "error",
        });

        performSearch(state);

        await waitFor(() => {
          expect(history[1].error).toBeUndefined();
        });
      });
    });

    describe("when search is unsuccessful", () => {
      let searchUsersMocked: jest.MockedFn<typeof gitHubService.searchUsers>;

      beforeEach(() => {
        searchUsersMocked = gitHubService.searchUsers as jest.MockedFn<
          typeof gitHubService.searchUsers
        >;
        searchUsersMocked.mockRejectedValue(new Error("error"));
      });

      it("should set loading to true when search is running", async () => {
        const { state, history } = setup();

        performSearch(state);

        await waitFor(() => {
          expect(history.length).toBe(2);
        });
        expect(history[0].loading).toBe(true);
      });

      it("should set loading to false when search is ended", async () => {
        const { state, history } = setup();

        performSearch(state);

        await waitFor(() => {
          expect(history[1].loading).toBe(false);
        });
      });

      it("should set error when search fails", async () => {
        const { state, history } = setup();

        performSearch(state);

        await waitFor(() => {
          expect(history[1].error).toBe("error");
        });
      });

      it("should set error with default message when search fails without Error class", async () => {
        const { state, history } = setup();
        searchUsersMocked.mockRejectedValue("error");

        performSearch(state);

        await waitFor(() => {
          expect(history[1].error).toBe("An error occurred");
        });
      });

      it("should set user empty when search fails", async () => {
        const { state, history } = setup({
          users: [{ username: "login-1", avatar: "login-1-avatar" }],
        });

        performSearch(state);

        await waitFor(() => {
          expect(history[1].users).toEqual([]);
        });
      });
    });
  });
});

export {};
