const createdGroupShow = document.getElementById("created-group-show");
const listContact = document.getElementById("list-of-all-contacts");

const socket = io();

socket.on("connect", () => {
  console.log("Server is Printing it to the client side", socket.id);
  // const groupId = localStorage.getItem("groupid");
  // socket.emit("joinRoom", groupId);
});

socket.on("receivedchat", () => {
  console.log("aa gela ene bhi ki kahe la marwila");

  allShowgroup();
});

function grouphandler(event) {
  const token = localStorage.getItem("token");
  console.log("inside loginhandler");
  event.preventDefault();

  const name = event.target.name.value;
  const groupname = event.target.groupnew.value;

  console.log(name, groupname);

  let obj = {
    name,
    groupname,
  };

  console.log(obj);
  axios
    .post("http://54.224.243.74:3000/group/addgroup", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);

      socket.emit("send-group", response.data.Value);
    })
    .catch((err) => console.log(err));
}

async function addUserToGroup(e) {
  try {
    e.preventDefault();
    console.log(e.target.adminStatus.value);
    const adduser = {
      groupName: e.target.grpname.value,
      email: e.target.email.value,
      admin: e.target.adminStatus.value == "Admin" ? true : false,
    };
    console.log(adduser);
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://54.224.243.74:3000/group/adduserTogroup",
      adduser,
      { headers: { Authorization: token } }
    );
    socket.emit("send-group", response.data.Value);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

async function removeUser(e) {
  try {
    e.preventDefault();
    const removeanyuser = {
      groupName: e.target.removeName.value,
      email: e.target.removeEmail.value,
    };
    console.log(removeanyuser);
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://54.224.243.74:3000/group/deleteuser",
      removeanyuser,
      { headers: { Authorization: token } }
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

async function getContacts() {
  listContact.innerHTML = "";
  const token = localStorage.getItem("token");
  const response = await axios.get("http://54.224.243.74:3000/group/allusers", {
    headers: { Authorization: token },
  });
  console.log(response);
  const user1 = response.data.allusers;
  user1.forEach((user) => {
    const childNodes = `<li class="list-group-item" >${user.email}<input type="hidden" class="user-id" value=${user.id} /></li>`;
    listContact.innerHTML += childNodes;
  });
}

async function allShowgroup() {
  try {
    createdGroupShow.innerHTML = "";
    const token = localStorage.getItem("token");
    const response = await axios.get("http://54.224.243.74:3000/group/allgroups", {
      headers: { Authorization: token },
    });
    console.log(response);
    const group1 = response.data.SabhiSamuh;
    console.log(group1);
    group1.forEach((group) => {
      console.log(group);
      const childNodes = `<li class="list-group-item" >${group[0].GroupName}<input type="hidden" class="user-id" value=${group[0].id} /></li>`;
      createdGroupShow.innerHTML += childNodes;
    });
  } catch (err) {
    console.log(err);
    // if (err.response.status == 500) {
    //   // createToast(err.response.data.message)
    // }
  }
}

function showScreen() {
  getContacts();
  allShowgroup();
}

window.addEventListener("DOMContentLoaded", showScreen);
