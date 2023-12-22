import * as React from 'react';
import './style.css';

export default function App() {
  const [data, setData] = React.useState([]);
  const [elements, setElement] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>();
  const lasctChild = React.useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jsonData = await fetch(
        `https://openlibrary.org/search.json?q=spy&page=${pageNumber}`
      );
      let data = await jsonData.json();
      data = data.docs?.map((item) => {
        return { key: item.key, title: item.title };
      });
      setData(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [pageNumber]);

  React.useEffect(() => {
    if (data.length > 0) {
      const ls = [];
      data.forEach((item, index) => {
        ls.push(
          <div
            key={item.key}
            ref={index === data.length - 1 ? lasctChild : null}
          >
            {item.title}
          </div>
        );
      });
      setElement((prev) => [...prev, ...ls]);
    }
  }, [data]);

  React.useEffect(() => {
    if (lasctChild.current) {
      const intersectionObserver = new IntersectionObserver(
        (enteries, observer) => {
          if (enteries[enteries.length - 1].isIntersecting) {
            setPageNumber((prev) => prev + 1);
            observer.disconnect();
          }
        }
      );
      intersectionObserver.observe(lasctChild.current);
    }
  }, [elements]);

  return (
    <div className="parentDiv">
      <div className="box" ref={boxRef}>
        {elements}
        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
}
