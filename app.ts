import { Drash, FTPClient, serve } from "./utils/deps.ts";
import Servers from "./routes/servers.ts";
import Path from "./routes/path.ts";
import { opine, Router } from "./utils/deps.ts";

const port = 8080;
const app = opine();

app.use("/servers", Path);
app.listen(port);

console.log(`SERVER HOST ON PORT ${port} ✅`);
