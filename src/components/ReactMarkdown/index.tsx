//@ts-ignore
import ReactMarkdownLib, { ReactMarkdownOptions } from "react-markdown";
//@ts-ignore
import gfm from "remark-gfm";

import markdownComponents from "./styles";

const ReactMarkdown: React.FC<ReactMarkdownOptions> = (props: any) => {
  return <ReactMarkdownLib remarkPlugins={[gfm]} components={markdownComponents} {...props} />;
};

export default ReactMarkdown;
