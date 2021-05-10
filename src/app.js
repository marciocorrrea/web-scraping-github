import cors from 'cors';
import express from 'express';
import router from './router.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(3000, () => console.log(`Server running`));

export default app;