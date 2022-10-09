export type GitHubUser = {
  login: string;
  avatar_url: string;
};

export type UserSearchResult = {
  items: GitHubUser[];
};

export const searchUsers = async (query: string): Promise<UserSearchResult> => {
  const response = await fetch(
    `https://api.github.com/search/users?q=${query}`
  );
  if (!response.ok) throw new Error("Failed to fetch users");

  return response.json();
};
