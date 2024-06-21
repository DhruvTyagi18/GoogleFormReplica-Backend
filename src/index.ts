import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
const dbFilePath = path.join(__dirname, 'db.json');
interface Submission {
 name: string;
 email: string;
 phone: string;
 github_link: string;
 stopwatch_time: string;
}
// Ensure the db.json file exists
if (!fs.existsSync(dbFilePath)) {
 fs.writeFileSync(dbFilePath, JSON.stringify([]));
}
// /ping endpoint
app.get('/ping', (req: Request, res: Response) => {
 res.json({ success: true });
});
// /submit endpoint
app.post('/submit', (req: Request, res: Response) => {
 const { name, email, phone, github_link, stopwatch_time } = req.body;
 if (!name || !email || !phone || !github_link || !stopwatch_time) {
 return res.status(400).json({ error: 'All fields are required' });
 }
 const newSubmission: Submission = { name, email, phone, github_link, stopwatch_time
};
 const submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8')) as
Submission[];
 submissions.push(newSubmission);
 fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
 res.json({ success: true });
});
// /read endpoint
app.get('/read', (req: Request, res: Response) => {
 const index = parseInt(req.query.index as string, 10);
 if (isNaN(index) || index < 0) {
 return res.status(400).json({ error: 'Invalid index' });
 }
 const submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8')) as
Submission[];
 if (index >= submissions.length) {
 return res.status(404).json({ error: 'Submission not found' });
 }
 res.json(submissions[index]);
});
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});