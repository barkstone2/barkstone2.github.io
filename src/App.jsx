import './App.css'
import {initImageFileMap, initMarkdownFileMap} from "./utils/file/fileUtils.js";
import Sidebar from "./components/Sidebar.jsx";
import {useEffect, useState} from "react";
import MarkdownContent from "./components/MarkdownContent.jsx";
import {Route, Routes} from "react-router-dom";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    async function initialize() {
      await initMarkdownFileMap();
      await initImageFileMap();
      setIsInitialized(true);
    }
    initialize();
  }, []);
  
  if (!isInitialized) {
    return <div className="loading-layer">로딩중...</div>;
  }
  
  return (
    <div className="horizontal-main-container">
      <div className="workspace is-left-sidedock-open is-right-sidedock-open">
        <Sidebar/>
        <Routes>
          <Route path={"/*"} element={<MarkdownContent/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;