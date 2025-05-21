import express from 'express';
import con from "../config/db.js";

const router = express.Router();

router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const [result] = await con.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.get("/listSchools", async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and Longitude required." });
  }
  try {
    const [rows] = con.query(`
      SELECT *,
        SQRT(POW(latitude - ?, 2) + POW(longitude - ?, 2)) AS distance
      FROM schools
      ORDER BY distance ASC
    `, [latitude, longitude]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
