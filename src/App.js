import React, { useEffect, useState, useCallback } from "react";

const LIMIT = 15;

function App() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  useEffect(() => {
    const handleScroll = () => {
      const isReachedToBottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
      if (!isReachedToBottom || isLoading) {
        return;
      }
      setPage((page) => page + 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <main>
      <h1>Hacker News</h1>
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            <h4>
              <a href={item.url}>{item.title}</a>
            </h4>
            <p>
              {item.score} points by {item.by} {item.time} | {item.kids.length}{" "}
              comments
            </p>
          </li>
        ))}
      </ol>
    </main>
  );
}

export default App;
