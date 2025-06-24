import "./bootstrap";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import process from "process";
import routes from "./routes";
import "./database";
const app = express();
app.set('trust proxy',  3);

app.use(cors());

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "block-all-mixed-content": [],
      "font-src": ["'self'", "https:", "data:"],
      "img-src": ["'self'", "data:"],
      "object-src": ["'none'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "upgrade-insecure-requests": [],
      scriptSrc: [
        "'self'",
        `*${process.env.FRONTEND_URL || "localhost: 3001"}`
      ],
      frameAncestors: [
        "'self'",
        `* ${process.env.FRONTEND_URL || "localhost: 3001"}`
      ]
    }
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "2000MB" }));
app.use(express.urlencoded({ extended: true, limit: "2000MB" }));

app.use('/api', routes);

app.get("/", (req: Request, res: Response) => {
  res.send("App is running!");
});

export default app;