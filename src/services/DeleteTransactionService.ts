import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface DeleteTransactionDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: DeleteTransactionDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found.', 404);
    }

    await transactionsRepository.delete([id]);
  }
}

export default DeleteTransactionService;
