require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {dbMovies, dbDirectors} = require('./database.js');
const app = express();
const port = process.env.PORT ||3100;
app.use(cors());
//nst port = 3100;

app.use(express.json());
//let idSeq = movies[movies.length - 1].id + 1;

// let movies = [
//   { id: 1, title: 'LOTR', director: 'Dian', year: 2020 },
//   { id: 2, title: 'Avangers', director: 'Restu', year: 2004 },
//   { id: 3, title: 'Spiderman', director: 'Khoirunnisa', year: 2005 }
// ];

let directors = [
  { id: 1, name: 'Christopher Nolan', birthYear: 1970 },
  { id: 2, name: 'Quentin Tarantino', birthYear: 1963 },
  { id: 3, name: 'Greta Gerwig', birthYear: 1983 },
  { id: 4, name: 'Dian Cantik', birthYear: 2006},
  { id: 5, name: 'Edwin Fatur', birthYear: 2003}
];


app.get('/directors', (req, res) => {
  const sql = "SELECT *FROM directors ORDER BY id ASC ";
  dbDirectors.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({"error": err.message });
    }
    res.json(rows);
    })
  }
);

//get id
app.get('/directors/:id', (req, res) => {
  const sql = "SELECT *FROM directors where id = ? ";
  const id = Number(req.params.id);

  dbDirectors.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({"error": err.message });
    }
    if (row) {
     res.json(row);
    } else {
      res.status(404).json({error: 'Sutradara tidak ditemukan'});
    }
    });
  });


app.post('/directors', (req, res) => {
    const { name , birthYear } = req.body;
    if (!name || !birthYear) {
        return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
    }
    const sql = 'INSERT INTO directors (name, birthYear) VALUES (?,?)';
    dbDirectors.run(sql, [name, birthYear], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });

        }
        res.status(201).json({ id: this.lastID, name, birthYear});
    });
});

//Put movie
app.put('/directors/:id', (req, res) => {
  const { name, birthYear} = req.body;
  const id = number (req.params.id);

  if (!name || !birthYear) {
    return res.status(404).json({ error: 'name dan birthyear wajib diisi' });
  }

  const sql = 'UPDATE movies SET name = ?,birthyear =? Where id = ?';
  dbDirectors.run(sql, [name, birthYear, id], function(err) {
    if (err) {
      return res.status(500).json({error:err.message});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'Sutradara tidak ditemukan'});
    }
    res.json({id, name, birthYear});
  });
});


//Delete
app.delete('/directors/:id', (req,res) => {
  const sql = 'DELETE FROM directors where id =?';
  const id = Number(req.params.id);

  dbDirectors.run(sql, id, function(err) {
    if (err){
      return res.status(500).json({error: err.message});
    }
    if (this.changes === 0) {
      return res.status(400).json({error: "sutradara tidak ditemukan"});
    }
    res.status(204).send();
  });
});

// app.get('/', (req, res) => {
//   res.send('Selamat aku ganteng fansku!');
// });

// app.get('/movies', (req, res) => {
//   res.json(movies);
// });


app.get('/status', (req,res) => {
  res.json({
    status: 'OK',
    message : 'Server is running',
    timestamp: new Date()
  
  });
}
);

app.get('/movies', (req, res) => {
  const sql = "SELECT * FROM movies ORDER BY id ASC ";
  dbMovies.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({"error": err.message });
    }
    res.json(rows);
    })
  }
);

//get id
app.get('/movies/:id', (req, res) => {
  const sql = "SELECT * FROM movies where id = ? ";
  //const id = Number [req.params.id];
  dbMovies.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({error: err.message });
    }
    if (row) {
    res.json(row);
    } else {
      res.status(404).json({error: 'Film tidak ditemukan'});
    }
    });
  });


app.post('/movies', (req, res) => {
    const { title, director, year } = req.body;
    if (!title || !director || !year) {
        return res.status(400).json({ error: 'title,director,year is required' });
    }
    const sql = 'INSERT INTO movies (title, director, year) VALUES (?,?,?)';
    dbMovies.run(sql, [title, director, year], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });

        }
        res.status(201).json({ id: this.lastID, title, director, year });
    });
});

//Put movie
app.put('/movies/:id', (req, res) => {
  const { title, director, year } = req.body;
  const id = Number (req.params.id);

  if (!title || !director || !year) {
    return res.status(404).json({ error: 'title, director, dan year wajib diisi' });
  }

  const sql = 'UPDATE movies SET title = ?,director =?, year = ? WHERE ID = ?';
  dbMovies.run(sql, [title, director, year, id], function(err) {
    if (err) {
      return res.status(500).json({error:err.message});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'Film tidak ditemukan'});
    }
    res.json({id, title, director, year});
  });
});


//Delete
app.delete('/movies/:id', (req,res) => {
  const sql = 'DELETE FROM movies where id =?';
  const id = Number(req.params.id);

  dbMovies.run(sql, id, function(err) {
    if (err){
      return res.status(500).json({error: err.message});
    }
    if (this.changes === 0) {
      return res.status(400).json({error: "Film tidak ditemukan"});
    }
    res.status(204).send();
  });
});


app.use((req, res) => {
  res.status(400).json({error: "Route not found"});
});

app.listen(port, () => {
  console.log(`Server Running on locahost: ${port}`);
});

//



// app.get('/directors', (req, res) => {
//   res.json(directors);
// });


// app.get('/movies/:id', (req, res) => {
//   const movie = movies.find(m => m.id === parseInt(req.params.id));
//     if (movie) {
//       res.json(movie);
//     } else {
//       res.status(404).send('Movie not found');
//     }
// });


// app.get('/directors/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const director = directors.find(d => d.id === id);

//   if (!director) {
//     return res.status(404).json({ error: 'Director tidak ditemukan' });
//   }

//   res.json(director);
// });


// // POST /movies - Membuat film baru
// app.post('/movies', (req, res) => {
//   const { title, director, year } = req.body || {};
//   if (!title || !director || !year) {
//     return res.status(400).json({ error: 'title, director, year wajib diisi' });
//   }
//   const newMovie = { id: movies.length +1, title, director, year };
//   movies.push(newMovie);
//   res.status(201).json(newMovie);
// });

/*
app.post('/directors', (req, res) => {
  const { name, birthYear } = req.body || {};

  if (!name || !birthYear) {
    return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
  }

  const newDirector = {
    id: directors.length ? directors[directors.length - 1].id + 1 : 1,
    name,
    birthYear
  };

  directors.push(newDirector);
  res.status(201).json(newDirector);
});


// // PUT /movies/:id - Memperbarui data film
// app.put('/movies/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const movieIndex = movies.findIndex(m => m.id === id);

//   if (movieIndex === -1) {
//     return res.status(404).json({ error: 'Movie tidak ditemukan' });
//   }

//   const { title, director, year } = req.body || {};
//   const updatedMovie = { id, title, director, year };
//   movies[movieIndex] = updatedMovie;
//   res.json(updatedMovie);
// });


app.put('/directors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const directorIndex = directors.findIndex(d => d.id === id);

  if (directorIndex === -1) {
    return res.status(404).json({ error: 'Director tidak ditemukan' });
  }

  const { name, birthYear } = req.body || {};

  if (!name || !birthYear) {
    return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
  }

  const updatedDirector = { id, name, birthYear };
  directors[directorIndex] = updatedDirector;
  res.json(updatedDirector);
});




// // DELETE /movies/:id - Menghapus film
// app.delete('/movies/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const movieIndex = movies.findIndex(m => m.id === id);

//   if (movieIndex === -1) {
//     return res.status(404).json({ error: 'Movie tidak ditemukan' });
//   }

//   movies.splice(movieIndex, 1);
//   res.status(204).send();
// });


app.delete('/directors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const directorIndex = directors.findIndex(d => d.id === id);

  if (directorIndex === -1) {
    return res.status(404).json({ error: 'Director tidak ditemukan' });
  }

  directors.splice(directorIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on localhost: ${port}`);
}); */