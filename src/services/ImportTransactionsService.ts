import csvParse from 'csv-parse';
import fs from 'fs';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface ImportTransactionsDTO {
  filename: string;
}

class ImportTransactionsService {
  private createTransaction: CreateTransactionService;

  constructor(createTransaction: CreateTransactionService) {
    this.createTransaction = createTransaction;
  }

  async execute({ filename }: ImportTransactionsDTO): Promise<Transaction[]> {
    const transactions: Transaction[] = [];

    const csvFilePath = `${uploadConfig.directory}/${filename}`;

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line;

      const transaction = await this.createTransaction.execute({
        title,
        value,
        type,
        category,
      });

      transactions.push(transaction);
    });

    return transactions;
  }
}

export default ImportTransactionsService;
