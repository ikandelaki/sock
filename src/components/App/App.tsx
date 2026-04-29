import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { executeGet } from "Util/request";

function App() {
  const { isPending, data } = useQuery({
    queryKey: ["tester"],
    queryFn: () => executeGet(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log(">> data", data);

  const { message } = data || {};

  return (
    <>
      <section>{message}</section>
    </>
  );
}

export default App;
