import { useEffect, useState } from "react";
import { getData } from "../contents/data";

export const useEditor = (currentCountry, languages) => {
  const [elements, setElements] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [allFields, setAllFields] = useState(null);

  useEffect(() => {
    const initData = (country = null, languages) => {
      const { elements, blocks, allFields } = getData(country, languages);
      setElements(elements);
      setBlocks(blocks);
      setAllFields(allFields);
    };
    initData(currentCountry, languages);
  }, [currentCountry, languages]);

  return [elements, blocks, allFields];
};
