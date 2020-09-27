import React, { useEffect, useState, useCallback } from "react";

function App() {
  console.log("🐛 App > Start");
  const LIMIT = 15;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const fetchAPI = useCallback(async () => {
    console.log("🐛 App > fetchAPI", page);
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

    setIsLoading(false);
    setItems((prev) => [...prev, ...result]);
  }, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    console.log("🐛 handleScroll out of if");
    setPage(page + 1);
    // fetchAPI(); // 왜 이럴까?
  }, [isLoading, page]);

  useEffect(() => {
    console.log("🐛 App > useEffect handleScroll");
    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("🐛 App > useEffect handleScroll return");
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    console.log("🐛 App > useEffect fetchAPI");
    try {
      fetchAPI();
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  }, [fetchAPI]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else {
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
                {item.score} points by {item.by} {item.time} |{" "}
                {item.kids.length} comments
              </p>
            </li>
          ))}
        </ol>
      </main>
    );
  }
}

export default App;
