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

export type Repository = {
  name: string;
  description: string;
};

export const getRepositoriesByUser = async (
  username: string
): Promise<Repository[]> => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  if (!response.ok) throw new Error("Failed to fetch repositories");

  return response.json();
};
