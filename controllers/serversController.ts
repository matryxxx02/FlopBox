import db from "../utils/db.ts";
import Server from "../models/Server.ts";
import { Collection } from "../utils/deps.ts";

export default class serversController {
  constructor(servers: Collection<Server>) {
    this.servers = servers;
  }

  static async build(): Promise<Collection<Server>> {
    const serversCollection = await db.getCollection<Server>("servers");
    console.log(serversCollection);
    return new serversController(serversCollection);
  }

  get servers(): Array<Server> {
    return this.servers;
  }

  set servers(servers: Array<Server>) {
    this.servers = servers;
  }
}
