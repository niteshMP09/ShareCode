import { Request, Response } from 'express';
import { SnippetService } from '../services/snippet.service';
import { CreateSnippetDto, UpdateSnippetDto } from '../types/snippet';

class SnippetController {
  create(req: Request, res: Response): void {
    const { id, content } = req.body as CreateSnippetDto;
    try {
      const snippet = SnippetService.create({ id, content });
      res.status(201).json(snippet);
    } catch (err) {
      if (err instanceof Error && err.message === 'ROOM_EXISTS') {
        res.status(409).json({ message: 'Room ID already taken. Try a different one.' });
        return;
      }
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    const snippet = SnippetService.getById(id);
    if (!snippet) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }
    res.json(snippet);
  }

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const { content } = req.body as UpdateSnippetDto;
    const snippet = SnippetService.update(id, { content });
    if (!snippet) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }
    res.json(snippet);
  }
}

export default new SnippetController();
