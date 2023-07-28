function saveLogin(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  const obj = {
    name,
    email,
    password,
  };

  console.log(obj, "frontend");
  axios
    .post("http://localhost:3000/auth/authdetails", obj)
    .then((response) => {
      console.log(response);
      if (response.status === 202) {
        alert("User already exitst please login");
        window.location.href = "./signup.html";
      } else if (response.status === 201) {
        alert("you are signned in please login as existing user");
        window.location.href = "./signup.html";
      }
    })
    .catch((err) => console.log(err));
}
