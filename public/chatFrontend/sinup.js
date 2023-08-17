function loginhandler(event) {
  console.log("inside loginhandler");
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  console.log(name, password);

  let obj = {
    email,
    password,
  };

  console.log(obj);

  axios
    .post("http://54.224.243.74:3000/auth/logindetails", obj)
    .then((response) => {
      console.log(response);
      localStorage.setItem("token", response.data.token);
    })
    .catch((err) => console.log(err));

  axios
    .post("http://54.224.243.74:3000/auth/logindetails", obj)
    .then((response) => {
      if (response.status == 200) {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);

        window.location.href = "./Chat.html";
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      alert("User not found");
      //   document.body.innerHTML += `<div style="color:red";>${err.message}</div>`;
    });
}
