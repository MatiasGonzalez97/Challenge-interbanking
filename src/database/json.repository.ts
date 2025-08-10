import { promises as fs } from 'fs';

export class JsonRepository<T> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async findAll(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data) as T[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveAll(data: T[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
