import { Router } from 'express';

export const routes = Router();

routes.get('/status', (req, res) => res.send('OK'));
