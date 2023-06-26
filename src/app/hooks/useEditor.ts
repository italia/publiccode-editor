import { useEffect, useState } from "react";
import { Block, getData } from "../contents/data";
import { Field } from "../contents/fields/generic";

export const useEditor = (currentCountry: string, languages: string[]) => {
  const [elements, setElements] = useState<Field[] | null>(null);
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [allFields, setAllFields] = useState<Field[] | null>(null);

  useEffect(() => {
    const initData = (country: string | null = null, languages: string[]) => {
      const { elements, blocks, allFields } = getData(country, languages);
      setElements(elements);
      setBlocks(blocks);
      setAllFields(allFields);
    };
    initData(currentCountry, languages);
  }, [currentCountry, languages]);

  return [elements, blocks, allFields];
};
