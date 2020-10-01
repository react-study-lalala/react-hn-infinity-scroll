import { useState, useEffect, useCallback } from "react";

const LIMIT = 15;

export default function useHackerNewsStoires() {
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const fetchAPI = useCallback(async () => {
    try {
      setIsLoading(true);
      const bestStories = await fetch(
        "https://hacker-news.firebaseio.com/v0/beststories.json"
      ).then((res) => res.json());

      const result = await Promise.all(
        bestStories
          .filter(
            (_, index) => LIMIT * (page - 1) <= index && index < LIMIT * page
          )
          .map((story) =>
            fetch(
              `https://hacker-news.firebaseio.com/v0/item/${story}.json?print=pretty`
            ).then((res) => res.json())
          )
      );

      setItems((prev) => [...prev, ...result]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  function fetchMore() {
    if (isLoading) return;
    setPage((page) => page + 1);
  }

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  return {
    error,
    isLoading,
    items,
    fetchMore,
  };
}
