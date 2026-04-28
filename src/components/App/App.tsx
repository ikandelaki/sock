import "./App.css";
import { useFetch } from "../../hooks/useFetch";

function App() {
  const { isLoading, data } = useFetch();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { message } = data || {};

  return (
    <>
      <section>{message}</section>
    </>
  );
}

export default App;
