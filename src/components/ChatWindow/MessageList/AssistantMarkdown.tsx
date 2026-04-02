import React, { useLayoutEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import './prism-languages';
import styles from './Message.module.css';

const LANG_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  py: 'python',
};

interface PrismCodeBlockProps {
  code: string;
  language: string;
}

const PrismCodeBlock: React.FC<PrismCodeBlockProps> = ({ code, language }) => {
  const ref = useRef<HTMLElement>(null);
  const lang =
    LANG_ALIASES[language.toLowerCase()] ?? language.toLowerCase();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const grammar =
      Prism.languages[lang] ??
      Prism.languages.javascript ??
      Prism.languages.markup;
    if (grammar) {
      el.innerHTML = Prism.highlight(code, grammar, lang);
    } else {
      el.textContent = code;
    }
  }, [code, lang]);

  return (
    <pre className={styles.codeBlock} tabIndex={0}>
      <code ref={ref} className={`language-${lang}`} />
    </pre>
  );
};

const markdownComponents: Components = {
  pre: ({ children }) => <>{children}</>,
  code({ className, children, ...props }) {
    const text = String(children).replace(/\n$/, '');
    const match = /language-([\w+-]+)/.exec(className ?? '');
    if (match) {
      return <PrismCodeBlock code={text} language={match[1]} />;
    }
    if (text.includes('\n')) {
      return <PrismCodeBlock code={text} language="markup" />;
    }
    return (
      <code className={styles.inlineCode} {...props}>
        {children}
      </code>
    );
  },
};

interface AssistantMarkdownProps {
  content: string;
}

const AssistantMarkdown: React.FC<AssistantMarkdownProps> = ({ content }) => {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AssistantMarkdown;
