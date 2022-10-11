import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  getRepositoriesByUser,
  Repository,
  searchUsers,
  UserSearchResult,
} from "./github.service";

describe("GitHubService", () => {
  describe("searchUsers", () => {
    const mockResult = (query: string): UserSearchResult => ({
      items: [
        {
          login: `${query}-1`,
          avatar_url: `${query}-1-avatar`,
        },
        {
          login: `${query}-2`,
          avatar_url: `${query}-2-avatar`,
        },
        {
          login: `${query}-3`,
          avatar_url: `${query}-3-avatar`,
        },
      ],
    });

    const server = setupServer(
      rest.get(`https://api.github.com/search/users`, (req, res, ctx) => {
        const query = req.url.searchParams.get("q");
        if (!query) return res(ctx.status(400));

        return res(ctx.json(mockResult(query)));
      })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("should return the correct result", () => {
      const query = "test";
      const expectedResult = mockResult(query);
      return expect(searchUsers("test")).resolves.toEqual(expectedResult);
    });

    it.each`
      query     | expected
      ${"test"} | ${mockResult("test")}
      ${"foo"}  | ${mockResult("foo")}
      ${"bar"}  | ${mockResult("bar")}
    `(
      "should call the api with the query $query and return the expected $expected",
      ({ query, expected }: { query: string; expected: UserSearchResult }) => {
        return expect(searchUsers(query)).resolves.toEqual(expected);
      }
    );

    it("should throw an error if the query is empty", () => {
      return expect(searchUsers("")).rejects.toThrow();
    });

    it("should throw an error if the serve respond with the code 500", () => {
      // override initial "GET https://api.github.com/search/users" request handler
      server.use(
        rest.get(`https://api.github.com/search/users`, (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
      return expect(searchUsers("test")).rejects.toThrow();
    });
  });

  describe("getRepositoriesByUser", () => {
    const repositoriesMock = (user: string): Repository[] => [
      {
        name: `${user}-repo-1`,
        description: `${user}-repo-1-description`,
      },
      {
        name: `${user}-repo-2`,
        description: `${user}-repo-2-description`,
      },
      {
        name: `${user}-repo-3`,
        description: `${user}-repo-3-description`,
      },
    ];
    const mockHttpRequest = (user: string) => {
      return rest.get(
        `https://api.github.com/users/${user}/repos`,
        (req, res, ctx) => {
          return res(ctx.json(repositoriesMock(user)));
        }
      );
    };
    const server = setupServer(mockHttpRequest("test"));

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("should return the correct result", () => {
      const expectedResult = repositoriesMock("test");
      return expect(getRepositoriesByUser("test")).resolves.toEqual(
        expectedResult
      );
    });

    it.each`
      user      | expected
      ${"test"} | ${repositoriesMock("test")}
      ${"foo"}  | ${repositoriesMock("foo")}
      ${"bar"}  | ${repositoriesMock("bar")}
    `(
      "should call the api with the user $user and return the expected $expected",
      ({ user, expected }: { user: string; expected: Repository[] }) => {
        server.use(mockHttpRequest(user));

        return expect(getRepositoriesByUser(user)).resolves.toEqual(expected);
      }
    );

    it("should throw an error if the serve respond with the code 500", () => {
      // override initial "GET https://api.github.com/users/test/repos" request handler
      server.use(
        rest.get(`https://api.github.com/users/test/repos`, (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
      return expect(getRepositoriesByUser("test")).rejects.toThrow();
    });
  });
});

export {};
