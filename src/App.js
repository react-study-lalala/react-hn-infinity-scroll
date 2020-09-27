import React, { useEffect, useState } from "react";

function App() {
  console.log("🐛 App > Start");
  const LIMIT = 15;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const fetchAPI = async () => {
    console.log("🐛 App > fetchAPI");
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

    setIsLoaded(true);
    setItems(result);
  };

  useEffect(() => {
    try {
      fetchAPI();
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
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
                {item.score} points by {item.by} {item.time} | {item.kids.length} comments
              </p>
            </li>
          ))}
        </ol>
      </main>
    );
  }
}

export default App;
