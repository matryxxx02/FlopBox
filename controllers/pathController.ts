import { FTPClient, JSZip } from "../utils/deps.ts";

export default class pathController {
  client: FTPClient;

  constructor(
    host: string,
    port: number,
    user?: string,
    pass?: string,
    mode?: "active" | "passive",
  ) {
    this.client = new FTPClient(host, { port, user, pass, mode });
  }

  /**
   * connect to FTP server 
   */
  async connectToServer() {
    await this.client.connect();
  }

  /**
   * download
   * @param path 
   * @returns 
   */
  async downloadFile(path: string): Promise<Uint8Array> {
    await this.connectToServer();
    const data = await this.client.download(path);
    return data;
  }

  async downloadDir(path: string): Promise<string> {
    const zip = new JSZip();
    const zipname = this.pathToName(path) + ".zip";
    await this.makeZip(path, zip);
    await zip.writeZip(zipname);
    return zipname;
  }

  async makeZip(path: string, folder: JSZip) {
    const dir = await this.listDir(path);
    let i = 0;
    for (const filepath of dir) {
      i++;
      if (filepath.includes(".")) {
        const file = await this.client.download(filepath);
        folder.addFile(this.pathToName(filepath), file);
      } else {
        const img = folder.folder(this.pathToName(filepath));
        await this.makeZip(filepath, img);
      }
    }
  }

  private pathToName(path: string): string {
    const splitPath = path.split("/");
    return splitPath.length > 1 && splitPath[1] != ""
      ? splitPath[splitPath.length - 1]
      : splitPath[0];
  }

  async listDir(path: string) {
    await this.connectToServer();
    return await this.client.list(path);
  }

  /**
   *  
   * @param path 
   * @param data 
   * @returns 
   */
  async uploadFile(path: string, data: Uint8Array) {
    await this.connectToServer();
    return await this.client.upload(path, data);
  }

  /**
   * 
   * @param path 
   * @param newName 
   * @returns 
   */
  async renameFile(path: string, newName: string) {
    await this.connectToServer();
    const pathArray = path.split("/");
    if (pathArray.length > 1 && pathArray[1] != "") {
      pathArray[pathArray.length - 1] = newName;
      const newPath = pathArray.join("/");
      await this.client.rename(path, newPath);
    } else {
      return await this.client.rename(path, newName);
    }
  }

  /**
   * 
   * @param path 
   * @returns 
   */
  async deleteFile(path: string) {
    await this.connectToServer();
    return await this.client.rm(path);
  }
}
