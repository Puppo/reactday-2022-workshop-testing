jest.mock("../../../services/github.service");

describe("useSearchStore", () => {
  describe("init", () => {
    it.todo("should set loading to false on creation");

    it.todo("should set error undefined on creation");

    it.todo("should set users as empty array on creation");
  });

  describe("search", () => {
    describe("when search is successful", () => {
      it.todo("should set loading to true when search is running");

      it.todo("should set loading to false when search is ended");

      it.todo("should set users when search is ended");

      it.todo("should set error undefined when search successes");
    });

    describe("when search is unsuccessful", () => {
      it.todo("should set loading to true when search is running");

      it.todo("should set loading to false when search is ended");

      it.todo("should set error when search fails");

      it.todo(
        "should set error with default message when search fails without Error class"
      );

      it.todo("should set user empty when search fails");
    });
  });
});

export {};
