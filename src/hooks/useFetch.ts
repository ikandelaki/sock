import { useState, useEffect } from "react";
import type { Data } from "../types/data";

const BASE_URL = "http://localhost:3000";

export const useFetch = (endpoint: string = "", body?: BodyInit | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        body,
      });

      const data: Data = await res.json();

      setIsLoading(false);
      setData(data);
    };

    fetcher();
  }, [endpoint, body]);

  return { data, isLoading };
};
