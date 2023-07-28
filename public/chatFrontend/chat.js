const socket = io();

const parentNode = document.getElementById("listofmessage");

socket.on("connect", () => {
  console.log("Server is Printing it to the client side", socket.id);
  // const groupId = localStorage.getItem("groupid");
  // socket.emit("joinRoom", groupId);
});

socket.on("receivedMsg", (msg) => {
  console.log("aa gela ene bhi ki kahe la marwila", msg);
  shownewUserOnScreen(msg);
});

socket.on("receivedchat", () => {
  console.log("aa gela ene bhi ki kahe la marwila");
  // shownewUserOnScreen(msg);
});

console.log(Math.random());

const fileInput = document.getElementById("myfile");
fileInput.addEventListener(
  "input",
  (handleSelectedFile = async (event) => {
    try {
      const file = event.target.files[0];
      console.log("files**********", file);

      const formData = new FormData();
      formData.append("myfile", file);

      console.log("formData", formData.get("myfile"));
      console.log(formData);

      const groupId = localStorage.getItem("groupid");
      console.log("groupId", groupId);
      console.log(formData);

      const formDataEntries = formData.entries();

      // Convert the iterator to an array to see the data
      const formDataArray = Array.from(formDataEntries);

      console.log(formDataArray);

      const token = localStorage.getItem("token");
      const fileStored = await axios.post(
        `http://localhost:3000/file/filestored/${groupId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("file name", fileStored.data.fileName);
      // console.log("duh", fileStored.data.msg.message);

      // document.getElementById("text").value = fileStored.data.msg.message;

      socket.emit("send-message", fileStored.data.msg);
    } catch (err) {
      document.getElementById("error").innerHTML = `Something went wrong`;
    }
  })
);

async function savChat(event) {
  event.preventDefault();
  let groupid = document.getElementById("mySelect").value;
  console.log("line noi 4", groupid);

  console.log(event.target.chat.value);

  // localStorage.setItem(obj.email, JSON.stringify(obj));
  //shownewUserOnScreen(obj);
  const obj = {
    msg: event.target.chat.value,
  };

  const token = localStorage.getItem("token");
  console.log(token);

  axios
    .post(`http://localhost:3000/chat/addchat?groupid=${groupid}`, obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);

      socket.emit("send-message", response.data.Value);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleSelectChange() {
  // Get the dropdown list element
  var selectElement = document.getElementById("mySelect");
  parentNode.innerHTML = "";

  // Get the selected option's value
  var groupid = selectElement.value;
  const token = localStorage.getItem("token");
  localStorage.setItem("groupid", groupid);

  console.log("Selected option value:", groupid);
  console.log("line noi 57", groupid);
  axios
    .get(`http://localhost:3000/chat/chatdetails?groupid=${groupid}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response.data.AllMessages);

      if (response.data.AllMessages && response.data.AllMessages.length > 10) {
        localStorage.setItem(
          "lastmessage",
          JSON.stringify(response.data.AllMessages.slice(-10))
        );
      }
      response.data.AllMessages.forEach((item) => {
        console.log(item);
        shownewUserOnScreen(item);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getContacts() {
  // listContact.innerHTML = "";
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/chat/allpartgroup", {
    headers: { Authorization: token },
  });
  console.log("parted group", response);
  const select = document.getElementById("mySelect");
  const data = response.data.AllPartGroup;
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item[0].id; // Set the value attribute
    option.text = item[0].GroupName; // Set the text content
    select.appendChild(option); // Append the option to the select element
  });
}
window.addEventListener("DOMContentLoaded", getContacts());

function shownewUserOnScreen(message) {
  console.log("message", message);

  //   message.forEach((message) => {
  //     const childHTML = `<li id=${message.message}> `;
  //     parentNode.insertAdjacentHTML("beforeend", childHTML);
  //   });

  // while (parentNode.firstChild) {
  //   parentNode.removeChild(parentNode.firstChild);
  // }

  if (Array.isArray(message)) {
    message.forEach((message) => {
      console.log(message);
      const childHTML = `<h1 id=${message.id} onClick={chatdownhandler("${message.message}")}>${message.authId}-- ${message.message} </h1>`;
      parentNode.insertAdjacentHTML("beforeend", childHTML);
    });
  } else {
    const childHTML = `<h1 id=${message.id} onClick={chatdownhandler("${message.message}")}  >${message.authId}-- ${message.message}</h1>`;
    parentNode.insertAdjacentHTML("beforeend", childHTML);
  }
}

const chatdownhandler = (balue) => {
  console.log("line 179", balue)
  
    // Open the URL in a new tab only if it's a valid URL
    window.open(balue, "_blank");



}


// Add event listener to the dropdown list
document
  .getElementById("mySelect")
  .addEventListener("change", handleSelectChange);
