import Swal from "sweetalert2";

const SuccessMsg = ({ message }) => {
  Swal.fire({
    icon: "success",
    title: "Done!",
    text: message,
  });
};

export default SuccessMsg;
