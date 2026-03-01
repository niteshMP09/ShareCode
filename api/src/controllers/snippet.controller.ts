import { Request, Response } from 'express';
import { SnippetService } from '../services/snippet.service';
import { CreateSnippetDto, UpdateSnippetDto } from '../types/snippet';

class SnippetController {
  create(req: Request, res: Response): void {
    const { content } = req.body as CreateSnippetDto;
    if (!content || typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }
    const snippet = SnippetService.create({ content });
    res.status(201).json(snippet);
  }

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    const snippet = SnippetService.getById(id);
    if (!snippet) {
      res.status(404).json({ message: 'Snippet not found' });
      return;
    }
    res.json(snippet);
  }

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const { content } = req.body as UpdateSnippetDto;
    const snippet = SnippetService.update(id, { content });
    if (!snippet) {
      res.status(404).json({ message: 'Snippet not found' });
      return;
    }
    res.json(snippet);
  }
}

export default new SnippetController();
