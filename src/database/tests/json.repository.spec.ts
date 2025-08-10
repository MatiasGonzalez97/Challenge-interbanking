import { JsonRepository } from '../json.repository';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('JsonRepository', () => {
  let repo: JsonRepository<any>;
  let tempFile: string;

  beforeEach(async () => {
    tempFile = path.join(__dirname, 'test.json');
    await fs.writeFile(
      tempFile,
      JSON.stringify([{ id: 1, name: 'Test' }], null, 2),
    );
    repo = new JsonRepository<any>(tempFile);
  });

  afterEach(async () => {
    try {
      await fs.unlink(tempFile);
    } catch {}
  });

  it('findAll debería devolver datos del archivo', async () => {
    const data = await repo.findAll();
    expect(data).toEqual([{ id: 1, name: 'Test' }]);
  });

  it('findAll debería devolver [] si el archivo no existe', async () => {
    await fs.unlink(tempFile);
    const data = await repo.findAll();
    expect(data).toEqual([]);
  });

  it('saveAll debería escribir datos en el archivo', async () => {
    await repo.saveAll([{ id: 2, name: 'Nuevo' }]);
    const content = await fs.readFile(tempFile, 'utf8');
    expect(JSON.parse(content)).toEqual([{ id: 2, name: 'Nuevo' }]);
  });
});
