import pathController from "../controllers/pathController.ts";
import db from "../utils/db.ts";
import Server from "../models/Server.ts";
import { Router } from "../utils/deps.ts";

const router = Router();
const pathUrl = "/:alias/:path(*)";

router.get(pathUrl, async (req, res) => {
  const { alias, path } = req.params;
  const collection = await db.getCollection<Server>("servers");
  const url = collection.findOne({ alias }).url as string;
  const clientFtp = new pathController(url, 21);
  await clientFtp.connectToServer();
  try {
    const data = await clientFtp.downloadFile(path);
    res.setStatus(200).send(data);
  } catch (err) {
    if (err.code === 550) {
      res.setStatus(404).json("file or directory not exist.");
    } else {
      res.setStatus(500).json("Internal error.");
    }
  }
});

router.post(pathUrl, (req, res) => {
  console.log("PUSH NEW FILE");
  const file = req.body.file;
  console.log(file);
  res.setStatus(200).json({
    success: "true",
    data: "camarche",
  });
});

router.put(pathUrl, (req, res) => {
  res.setStatus(200).json({
    success: "true",
    data: "camarche",
  });
});

router.delete(pathUrl, (req, res) => {
  res.setStatus(200).json({
    success: "true",
    data: "camarche",
  });
});

export default router;
