import axios from "axios";

//makes your browser include cookies 
//and authentication headers in your XHR request
export default axios.create({
    withCredentials:true,
});