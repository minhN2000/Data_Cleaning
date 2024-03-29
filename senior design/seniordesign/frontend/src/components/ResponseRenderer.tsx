import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

/**
 * ResponseRendererProps interface for the ResponseRenderer component.
 * @typedef {Object} ResponseRendererProps
 * @property {() => string} response - Respone recieve from bot.
 */
interface ResponseRendererProps {
  response: string;
}

/**
 * ResponseRenderer component that help modify bot message.
 * code will be put code blocks, and plaintexts are kept norma;
 * @param {ResponseRendererProps} props - Properties passed to the ResponseRenderer component: response.
 * @returns {React.FC} - The ResponseRenderer component.
 */
const ResponseRenderer: React.FC<ResponseRendererProps> = ({ response }) => {
  // const codeBlockRegex = /\n\n```(.*?)```\n\n|```(.*?)```|P code:(.*?)end p code/s;
  const codeBlockRegex =/Pcode:(.*?)end p code/
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


