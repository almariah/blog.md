import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({className, children}) => {

  let lang = 'text';
  if (className && className.startsWith('lang-')) {
    lang = className.replace('lang-', '');
  }

  return (
    <SyntaxHighlighter language={lang} style={prism}>
      {children}
    </SyntaxHighlighter>
  );
}

// markdown-to-jsx uses <pre><code/></pre> for code blocks.
const PreBlock = ({children, ...rest}) => {

  if ('type' in children && children ['type'] === 'code') {
    return CodeBlock(children['props']);
  }

  return <pre {...rest}>{children}</pre>;
};

export default PreBlock
