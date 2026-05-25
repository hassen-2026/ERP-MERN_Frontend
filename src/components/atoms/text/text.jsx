import { Children } from "react";
import { defaultText } from "./defaultText";
import "./text.css";


function Text(props) {
    const {
        id,type,Children,className
    }={...defaultText,...props}
    return(
        <text type={type} className={className} id={id}>
            {Children}
        </text>
    )
}
export default Text;