const { hashPassword, verifyPassword } = require("./core/password");
const { generateJWT, verifyJWT } = require("./core/jwt");

function messWithPayload(jwt) {
  const [header, payload, signature] = jwt.split(".");
  const parsedPayload = JSON.parse(
    Buffer.from(payload, "base64url").toString()
  );

  parsedPayload.roles.push("admin");

  const newPayload = Buffer.from(
    JSON.stringify(parsedPayload),
    "ascii"
  ).toString("base64url");
  return [header, newPayload, signature].join(".");
}

async function main() {
  const password = "verydifficult";
  const wrongPassword = "verywrong";
  console.log("The password:", password);

  const hash = await hashPassword(password);
  console.log("The hash:", hash);

  let valid = await verifyPassword(password, hash);
  console.log("The password", password, "is", valid ? "valid" : "incorrect");

  valid = await verifyPassword(wrongPassword, hash);
  console.log(
    "The password",
    wrongPassword,
    "is",
    valid ? "valid" : "incorrect"
  );

  const fakeUser = {
    id: 1,
    firstName: "Elon",
    lastName: "Musk",
    email: "elon.musk@hogent.be",
    roles: ["user"],
  };

  const jwt = await generateJWT(fakeUser);
  console.log("The JWT:", jwt);

  let validate = await verifyJWT(jwt);
  console.log("This JWT is", valid ? "valid" : "incorrect");

  const messedUpJwt = messWithPayload(jwt);
  console.log("Messed up JWT:", messedUpJwt);

  console.log("Verifying this JWT will throw an error:");
  validate = await verifyJWT(messedUpJwt);
}

main();
