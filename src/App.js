import React from "react";
import useHackerNewsStoires from "./hooks/useHackerNewsStories";
import useInfinityScroll from "./hooks/useInfinityScroll";

function App() {
  const { error, isLoading, items, fetchMore } = useHackerNewsStoires();

  useInfinityScroll({
    action: fetchMore,
  });

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <main>
      <h1>Hacker News</h1>
      {isLoading && <div>Loading...</div>}
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
