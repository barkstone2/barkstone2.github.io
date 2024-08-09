import {useEffect, useState} from "react";

function useContent(filePath) {
  const [content, setContent] = useState('');
  useEffect(() => {
    const fetchHtml = async () => {
      const response = await fetch(`/html/${filePath.replace('.md', '.html')}`);
      const text = await response.text();
      setContent(text)
    }
    fetchHtml()
  }, [filePath]);
  return {content, setContent};
}

export default useContent;
