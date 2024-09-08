import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PrivacyPolicy = () => {
  const [text, setText] = useState("");

  const handleChange = (value: string) => {
    setText(value);
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={text}
        onChange={handleChange}
        style={{ height: "300px" }}
      />
    </div>
  );
};

export default PrivacyPolicy;
