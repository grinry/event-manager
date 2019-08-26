import { config } from "~config";
import "~bundles/express/index";
import { sequelize } from "~app/connection";
import User from "~app/models/user.model";
// import { User } from "~app/models/user.model";

console.log(`This is example var: ${config.env}`);

process.on("exit", async e => {
  console.log("about to exit", e);
  await sequelize.close();
});

process.on("SIGINT", async () => {
  console.log("exiting.");
  process.exit(0);
});

setTimeout(() => {
  User.create({
    name: "RG",
    birthday: "bbd",
    email: "rytis@grinry.dev"
  }).then(
    e => {
      console.log("created", e.email);

      // console.log(e);
    },
    e => {
      console.error("errored", e);
      // console.error(e);
    }
  );
}, 5000);
