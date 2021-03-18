import db from "../utils/db.ts";
import Server from "../models/Server.ts";
//import serversController from "../controllers/serversController.ts";
import { Router } from "../utils/deps.ts";

const router = Router();
const pathUrl = "/:alias?";

router.get(pathUrl, async (req, res) => {
  try {
    const serversCollection = await db.getCollection<Server>("servers");
    const servers = serversCollection.findMany((server: Server) =>
      server.url != null
    ).value();
    res.setStatus(200).json(servers);
  } catch (err) {
    console.error(err);
    res.setStatus(500).json("Internal error");
  }
});

router.post(pathUrl, async (req, res) => {
  const alias = req.params.alias;
  const url = req.body.url;

  if (!alias || !url) {
    return res.setStatus(400).json(
      "This resource requires the `:alias` and `:url` body param",
    );
  }

  const collection = await db.getCollection<Server>("servers");
  const servers = collection.findMany((server: Server) => server.alias == alias)
    .value();

  if (servers.length > 0) {
    return res.setStatus(409).json(
      "This resource already exist",
    );
  }

  await collection.insertOne({ alias, url });
  res.setStatus(201).json("Server added");
});

router.put(pathUrl, async (req, res) => {
  const alias = req.params.alias;
  const url = req.body.url;
  const collection = await db.getCollection<Server>("servers");
  const servers = collection.findMany((server: Server) => server.alias == alias)
    .value();

  if (servers.length === 0) {
    return res.setStatus(404).json("Not found resource");
  }

  if (!url) {
    return res.setStatus(400).json(
      "This resource require the `:url` body param",
    );
  }

  await collection.updateOne(
    (el: Server) => el.alias === alias,
    { url },
  );
  res.setStatus(204).send();
});

router.delete(pathUrl, async (req, res) => {
  const alias = req.params.alias;
  const collection = await db.getCollection<Server>("servers");
  try {
    await collection.deleteOne({ alias });
  } catch (err) {
    console.error(err);
    res.setStatus(500).send("Internal error");
    //TODO: if server not exist
  }

  res.setStatus(204).send();
});

export default router;
