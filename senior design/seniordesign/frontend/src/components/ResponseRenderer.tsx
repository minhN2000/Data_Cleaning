import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ResponseRendererProps {
  response: string;
}

const ResponseRenderer: React.FC<ResponseRendererProps> = ({ response }) => {
  const codeBlockRegex = /\n\n```(.*?)\n```\n\n/s;
  const splitResponse = response.split(codeBlockRegex);

  return (
    <>
      {splitResponse.map((item, index) => {
        if (index % 2 === 1) {
          return (
            <SyntaxHighlighter language="python" style={docco} key={index}>
              {item.trim()}
            </SyntaxHighlighter>
          );
        } else {
          return <span key={index}>{item}</span>;
        }
      })}
    </>
  );
};

export default ResponseRenderer;