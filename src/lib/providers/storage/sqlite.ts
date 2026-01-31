import type { StorageProvider } from "../types";

export class SqliteStorageProvider implements StorageProvider {
  name = "sqlite";

  async ping(): Promise<boolean> {
    return true;
  }
}
