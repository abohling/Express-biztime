const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT code, name FROM companies ORDER BY name`
    );
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:code", async (req, res, next) => {
  try {
    let code = req.params.code;
    const compResult = await db.query(
      `SELECT code,name, description FROM companies WHERE code =$1`,
      [code]
    );
    if (compResult.rows.length === 0) {
      throw new ExpressError(`Company can not be found: ${code}`, 404);
    } else {
      const business = compResult.rows[0];
      return res.json({ company: business });
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let code = slugify(name, { lower: true });
    const result = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put("/:code", async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let code = req.params.code;

    const result = await db.query(
      `UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description`,
      [code, name, description]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Company can not be found: ${code}`, 404);
    } else {
      return res.send({ company: result.rows[0] });
    }
  } catch (err) {
    return next(err);
  }
});

router.delete("/:code", async (req, res, next) => {
  try {
    let code = req.params.code;
    const result = await db.query(
      `DELETE FROM companies WHERE code =$1 RETURNING code`,
      [code]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Company can not be found: ${code}`, 404);
    } else {
      return res.json({ status: "deleted" });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
