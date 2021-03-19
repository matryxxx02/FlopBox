import { config } from "./utils/deps.ts";
import Servers from "./routes/servers.ts";
import Path from "./routes/path.ts";
import { opine, Router } from "./utils/deps.ts";

const port = Number(config().PORT);
const app = opine();

app.use("/servers", Path, Servers);
app.listen(port);

console.log(`SERVER HOST ON PORT : ${port} ✅`);
