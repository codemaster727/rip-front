import "easymde/dist/easymde.min.css";

import EasyMde from "easymde";
import merge from "lodash/merge";
import { TextareaHTMLAttributes, useEffect, useRef } from "react";
import styled from "styled-components";

interface SimpleMdeProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  options?: EasyMde.Options;
  onTextChange: (value: string) => void;
}

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => "black"};
  border-radius: 16px;
  .EasyMDEContainer {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 16px;
    box-shadow: ${({ theme }) => theme.shadows.inset};
    padding: 16px;
  }

  .EasyMDEContainer .CodeMirror {
    background: ${({ theme }) => theme.colors.primary};
    paddingy: 16px;
    border: none;
  }

  .CodeMirror-code {
    color: ${({ theme }) => theme.colors.text_b};
  }

  .CodeMirror-cursor {
    border-left: ${({ theme }) => `1px solid ${theme.colors.text_b}`};
  }

  .CodeMirror-scroll {
    min-height: 150px !important;
  }

  .editor-toolbar {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 40px;
    color: ${({ theme }) => theme.colors.primary};
    border: none;

    .separator {
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }

    a,
    button {
      color: ${({ theme }) => theme.colors.primary};

      &:hover,
      &.active {
        background: ${({ theme }) => theme.colors.background};
        border: 0;
      }
    }
  }
`;

/**
 * @see https://github.com/Ionaru/easy-markdown-editor#configuration
 */
const defaultOptions: EasyMde.Options = {
  autofocus: false,
  status: false,
  hideIcons: ["guide", "fullscreen", "preview", "side-by-side"],
  spellChecker: false,
  styleSelectedText: false,
};

const SimpleMde: React.FC<SimpleMdeProps> = ({ options, onTextChange, ...props }) => {
  const ref = useRef();
  const onTextChangeHandler = useRef(onTextChange);

  useEffect(() => {
    let simpleMde = new EasyMde(merge({ element: ref.current }, defaultOptions, options));

    simpleMde.codemirror.on("change", () => {
      onTextChangeHandler.current(simpleMde.value());
    });

    return () => {
      if (simpleMde) {
        simpleMde.toTextArea();
        //@ts-ignore
        simpleMde = null;
      }
    };
  }, [options, onTextChangeHandler, ref]);

  return (
    <Wrapper>
      {
        //@ts-ignore
        <textarea ref={ref} readOnly {...props} />
      }
    </Wrapper>
  );
};

export default SimpleMde;
