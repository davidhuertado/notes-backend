const { response } = require('express');
const express = require('express');
const cors = require('cors');
const logger = require('./loggerMiddleware');

let notes = [
	{
		id: 1,
		content: 'Me tengo que suscribir en YT',
		date: '12 marzo',
		important: true,
	},
	{
		id: 2,
		content: 'Tengo que estudiar',
		date: '13 marzo',
		important: false,
	},
	{
		id: 3,
		content: 'Repasar',
		date: '12 marzo',
		important: true,
	},
];

const app = express();



app.use(express.json());
app.use(logger);
app.use(cors('*'));

const PORT = 3001;

app.get('/', (request, response) => {
	
	response.send('<h1>Hello world</h1>');
});

app.get('/api/notes', (req, res) => {
	res.json(notes);
});
app.get('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);
	const note = notes.find((note) => note.id === id);

	if (note) {
		res.json(note);
	} else {
		response.status(404).end();
	}
});

app.delete('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);
	notes = notes.filter((note) => note.id !== id);
	res.status(204).end();
});
app.post('/api/notes', (req, res) => {
	const note = req.body;

	if (!note || note.content) {
		return res.status(400).json({
			error: 'note.content is missing',
		});
	}

	const ids = notes.map((note) => note.id);
	const maxId = Math.max(...ids);

	const newNote = {
		id: maxId + 1,
		content: note.content,
		// eslint-disable-next-line valid-typeof
		important: typeof note.important !== undefined ? note.important : false,
		date: new Date().toISOString(),
	};

	notes = [...notes, newNote];
	res.status(201).json(newNote);
});

// app.use((req, res) => {
// 	res.status(404).json({
// 		error: 'Not found'
// 	});
// });

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
