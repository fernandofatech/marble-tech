import { ChallengeController } from './../controllers/challengeController';
import bodyParser = require('body-parser');
import { testFileWritter } from '../handlers/testFileWriter';
import { authMiddleware } from '../config/authMiddleware';

const challengeController = new ChallengeController();

const routes = [
  {
    method: 'get',
    path: '/',
    middlewares: [],
    description: 'get all challenges',
    action: challengeController.findAll,
    body: ['none']
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [],
    description: 'get challenge by id',
    action: challengeController.findById,
    body: ['none']
  },
  {
    method: 'post',
    path: '/:id/test',
    middlewares: [
      authMiddleware,
      bodyParser.text(),
      testFileWritter
    ],
    description: 'test a user answer against challenge sample',
    action: challengeController.test,
    body: ['plain text']
  }
]

// //The following routes (and controller functions) are available for future implementation, after 
// //adding, for example, an ADMIN page.
// routes.patch('/:id', challengeController.update);
// routes.delete('/:id', challengeController.delete);
// routes.post('/', challengeController.create);

export default routes;