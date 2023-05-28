import React, { useState, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import ReactHtmlParser from "react-html-parser";

//nextjsでreactquilを使おうとするとdynamicが必要で、その中でrefを使用しようとすると以下のように書く必要あるらしい。
// https://learnjsx.com/category/4/posts/nextjs-document-is-not-defined-react-quill
// https://github.com/zenoamaro/react-quill/issues/642

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

const UpdateReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

function MyComponent() {
  const quilRef = useRef(null);
  const [refState, setRefState] = useState("");
  const quilRef2 = useRef(null);
  const [refState2, setRefState2] = useState("");
  const [isUpdateMode, SetIsUpdateMode] = useState(false);

  const dammy_html_string = "<h1>Hello</h1><p>xxx</p><p>yyy</p><h2>XXX</h2>";
  const [updateText,setUpdateText] = useState(dammy_html_string)

  const handleSubmit = () => {
    const stringRefContent = quilRef.current.value;
    const htmlRefContent = ReactHtmlParser(stringRefContent);
    console.log(stringRefContent);
    console.log(htmlRefContent);
    setRefState(htmlRefContent);
  };

  const handleUpdateSubmit = () => {
    const stringRefContent = quilRef2.current.value;
    const htmlRefContent = ReactHtmlParser(stringRefContent);
    console.log(stringRefContent);
    console.log(htmlRefContent);
    setRefState2(htmlRefContent);
  };

  

  //これがないとdefaultValueを指定したとき勝手にh2の前などに<p><br><p>が入って改行された。作成時は必要ないかもしれないが、更新時は必要
  const modules = {
    clipboard: {
      matchVisual: false,
    },
  };

  console.log(quilRef2)

  return (
    <>
      <ReactQuill forwardedRef={quilRef} theme="snow" />
      <div
        onClick={() => {
          handleSubmit();
        }}
      >
        submit
      </div>
      {refState}

      {/* update */}
      <p>ここから下はupdateに関する内容です</p>
      {isUpdateMode ? (
        <>
          <UpdateReactQuill
            defaultValue={updateText}
            forwardedRef={quilRef2}
            theme="snow"
            modules={modules}
          />
          <div
            onClick={() => {
              handleUpdateSubmit();
              setUpdateText(quilRef2.current.value)
              SetIsUpdateMode(false);
            }}
          >
            update
          </div>

          <div
            onClick={() => {
              SetIsUpdateMode(false);
            }}
          >
            cancel
          </div>
        </>
      ) : (
        <div
          onClick={() => {
            SetIsUpdateMode(true);
          }}
        >
          {ReactHtmlParser(
            updateText
          )}
        </div>
      )}
    </>
  );
}

export default MyComponent;
