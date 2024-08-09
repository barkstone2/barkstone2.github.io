import {useParams} from "react-router-dom";
import useBacklinkNavigation from "../utils/hooks/useBacklinkNavigation.js";
import {useEffect, useState} from "react";
import '../styles/content.css'
import {Helmet} from "react-helmet-async";

function MarkdownContent() {
  const {'*': filePath} = useParams();
  const [innerHtml, setInnerHtml] = useState({});
  useEffect(() => {
    const fetchHtml = async () => {
      const path = filePath ? `/html/${filePath.replace('.md', '.html')}` : `/default/home.html`;
      const response = await fetch(`${path}`);
      const content = await response.text();
      const title = filePath.split('/').pop().replace('.md', '');
      const newInnerHtml = {
        title: title,
        content: content
      };
      setInnerHtml(newInnerHtml)
    };
    fetchHtml()
  }, [filePath]);
  useBacklinkNavigation(innerHtml.content);
  
  return (
    <div className="workspace-split mod-vertical mod-root">
      <Helmet>
        <title>{innerHtml.title}</title>
      </Helmet>
      <hr className="workspace-leaf-resize-handle"/>
      <div className="workspace-tabs mod-top">
        <div className="workspace-tab-header-container"></div>
        <div className="workspace-tab-container">
          {/* 탭 전환 기능 추가 시 leaf 단위로 처리가 필요 */}
          <div className="workspace-leaf">
            <hr className="workspace-leaf-resize-handle"/>
            <div className="workspace-leaf-content" datatype="markdown" datamode="preview">
              {/* 요청 path 기준으로 렌더링 가능 */}
              <div className="view-header">
              </div>
              <div className="view-content">
                <div className="markdown-reading-view" style={{width: '100%', height: '100%'}}>
                  <div
                    className="markdown-preview-view markdown-rendered node-insert-event is-readable-line-width allow-fold-headings show-indentation-guide allow-fold-lists show-properties"
                    tabIndex="-1" style={{tabSize: 4}}>
                    <div className="markdown-preview-sizer markdown-preview-section">
                      <div className="markdown-preview-pusher"
                           style={{width: '1px', height: '0.1px', marginBottom: '0px'}}></div>
                      {/* 프로퍼티 렌더링을 처리하려면 HTML 변환 시 아래 태그들 처리 필요 */}
                      <div className="mod-header">
                        <div className="inline-title">{innerHtml.title}</div>
                        <div className="metadata-container" tabIndex="-1" data-property-count="3">
                          <div className="metadata-properties-heading">
                            <div className="collapse-indicator collapse-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                   fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                   strokeLinejoin="round" className="svg-icon right-triangle">
                                <path d="M3 8L12 17L21 8"></path>
                              </svg>
                            </div>
                            <div className="metadata-properties-title">Properties</div>
                          </div>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={{__html: innerHtml.content}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkdownContent;