import { Heading, Text } from "@pancakeswap/uikit";
//@ts-ignore
import { NormalComponents, SpecialComponents } from "react-markdown/src/ast-to-react";
import styled from "styled-components";

const Table = styled.table`
  margin-bottom: 32px;
  margin-top: 32px;
  width: 100%;

  td,
  th {
    color: ${({ theme }) => "black"};
    padding: 8px;
  }
`;
const TableBox = styled.div`
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const ThemedComponent = styled.div`
  color: ${({ theme }) => "black"};
  margin-bottom: 16px;
  margin-top: 16px;

  li {
    margin-bottom: 8px;
  }
`;

const Pre = styled.pre`
  color: ${({ theme }) => "black"};
  margin-bottom: 16px;
  margin-top: 16px;
  max-width: 100%;
  overflow-x: auto;
`;

const AStyle = styled.a`
  word-break: break-all;
  color: grey;
`;

const Title = (props: any) => {
  return <Heading as="h4" scale="lg" my="16px" {...props} color="black" />;
};

const markdownComponents: Partial<NormalComponents & SpecialComponents> = {
  h1: Title,
  h2: Title,
  h3: Title,
  h4: Title,
  h5: Title,
  h6: Title,
  p: (props: any) => {
    // @ts-ignore
    return <Text as="p" my="16px" {...props} color="black" />;
  },
  table: ({ ...props }) => {
    return (
      <TableBox>
        <Table>{props.children}</Table>
      </TableBox>
    );
  },
  ol: (props: any) => {
    return <ThemedComponent as="ol" {...props} />;
  },
  ul: (props: any) => {
    return <ThemedComponent as="ul" {...props} />;
  },
  pre: Pre,
  a: AStyle,
};

export default markdownComponents;
