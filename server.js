import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { positioner, compatibility } from './index.js';
import { setupSwagger } from './swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 1300;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

setupSwagger(app);

app.post('/api/birth-chart', (req, res) => {
  const { dateString, timeString, lat, lng, timezone } = req.body;
  try {
    const chart = positioner.getBirthChart(dateString, timeString, lat, lng, timezone);
    res.json(chart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/getBirthNavamsaChart', (req, res) => {
  const { dateString, timeString, lat, lng, timezone } = req.body;
  try {
    const birthChart = positioner.getBirthChart(dateString, timeString, lat, lng, timezone);
    const navamsaChart = positioner.getNavamsaChart(birthChart);
    res.json({ birthChart, navamsaChart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/navamsa-chart', (req, res) => {
  const birthChart = req.body;
  try {
    const chart = positioner.getNavamsaChart(birthChart);
    res.json(chart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/compatibility', (req, res) => {
  const { person1, person2, threshold } = req.body;
  try {
    const result = compatibility.getCompatibilityScore(person1, person2, threshold);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/planets', (req, res) => {
  const { dateString, lng, lat, height = 0 } = req.query;
  try {
    const result = positioner.getAllPlanets(dateString, Number(lng), Number(lat), Number(height));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`AstroReha API listening at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
