import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRepositoriesByUser,
  Repository,
} from "../../../services/github.service";

export function useRepositories() {
  const { userId: username } = useParams();

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    async function load() {
      if (!username) return;

      setLoading(true);
      setError(undefined);
      try {
        const repositories = await getRepositoriesByUser(username);
        setRepositories(repositories);
      } catch (error) {
        let message = "An error occurred while loading repositories";
        if (error instanceof Error) message = error.message;
        setError(message);
      }
      setLoading(false);
    }
    load();
  }, [username]);

  return {
    repositories,
    loading,
    error,
  };
}
