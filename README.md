# 🎬 MoviCuration

> **Your Personal Movie Curation Backend** - A powerful REST API for discovering, organizing, and reviewing movies with style! 🍿

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37-52B0E7.svg)](https://sequelize.org/)

### 🌐 Live Demo

**Try the API now!** 🔗 [https://movicuration.onrender.com/api/movies/search?query=tree](https://movicuration.onrender.com/api/movies/search?query=tree)

---

## 🌟 Overview

**MoviCuration** is a feature-rich backend API that transforms how you interact with movies. Whether you're a cinephile building the perfect watchlist, a critic sharing your thoughts, or a curator creating themed collections, MoviCuration has you covered!

Powered by **The Movie Database (TMDB)** API and built with **Express.js** and **Sequelize ORM**, this project brings together movie discovery, personal organization, and community engagement in one elegant package.

### 🌐 Live Demo

**Try it out now!** The API is live and ready to use:

🔗 **Live API**: [https://movicuration.onrender.com](https://movicuration.onrender.com)

Example: [https://movicuration.onrender.com/api/movies/search?query=tree](https://movicuration.onrender.com/api/movies/search?query=tree)

---

## ✨ Features

### 🔍 **Smart Movie Discovery**
- **Search Movies**: Find your next favorite film with intelligent search
- **Genre & Actor Filtering**: Discover movies by your favorite genres and actors
- **Top 5 Movies**: Get curated recommendations of the highest-rated films
- **Advanced Sorting**: Sort movies by rating, release date, and more

### 📋 **Personal Organization**
- **Curated Lists**: Create and manage custom movie collections (e.g., "90s Action Classics", "Mind-Bending Thrillers")
- **Watchlist**: Keep track of movies you plan to watch
- **Wishlist**: Save movies you want to watch later
- **Dynamic Updates**: Modify your curated lists anytime

### 💬 **Community Engagement**
- **Movie Reviews**: Share your thoughts and ratings on films
- **Rich Movie Data**: Access detailed information including cast, genres, ratings, and descriptions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v13 or higher)
- **TMDB API Key** ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saurabh-827/MoviCuration
   cd MoviCuration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_NAME=movicuration_db
   DB_HOST=localhost
   DB_PORT=5432
   TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Run database migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will start on `http://localhost:3000` 🎉

---

## 📚 API Endpoints

### Movie Search & Discovery

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/movies/search?query={title}` | Search for movies by title | [https://movicuration.onrender.com/api/movies/search?query=tree](https://movicuration.onrender.com/api/movies/search?query=tree) |
| `GET` | `/api/movies/searchByGenreAndActor?genre={genre}&actor={actor}` | Filter movies by genre and actor | `https://movicuration.onrender.com/api/movies/searchByGenreAndActor?genre=action&actor=Tom%20Cruise` |
| `GET` | `/api/movies/sort?sortBy={field}&order={asc\|desc}` | Sort movies by various criteria | `https://movicuration.onrender.com/api/movies/sort?sortBy=rating&order=desc` |
| `GET` | `/api/movies/top5` | Get top 5 highest-rated movies | [https://movicuration.onrender.com/api/movies/top5](https://movicuration.onrender.com/api/movies/top5) |

### Lists & Collections

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `POST` | `/api/curated-lists` | Create a new curated list | `https://movicuration.onrender.com/api/curated-lists` |
| `PUT` | `/api/curated-lists/:curatedListId` | Update an existing curated list | `https://movicuration.onrender.com/api/curated-lists/1` |
| `POST` | `/api/movies/curated-list` | Add a movie to a curated list | `https://movicuration.onrender.com/api/movies/curated-list` |
| `POST` | `/api/movies/watchlist` | Add a movie to your watchlist | `https://movicuration.onrender.com/api/movies/watchlist` |
| `POST` | `/api/movies/wishlist` | Add a movie to your wishlist | `https://movicuration.onrender.com/api/movies/wishlist` |

### Reviews

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `POST` | `/api/movies/:movieId/reviews` | Create a review for a movie | `https://movicuration.onrender.com/api/movies/123/reviews` |

---

## 🏗️ Project Structure

```
MoviCuration/
├── config/              # Database configuration
│   └── config.js
├── controllers/         # Request handlers
│   ├── searchMovie.js
│   ├── createCuratedList.js
│   ├── updateCuratedList.js
│   ├── createWatchlist.js
│   ├── createAddWishlist.js
│   ├── addMovieCuratedListItem.js
│   ├── createReview.js
│   ├── searchMovieByGenreAndActor.js
│   ├── sortMovies.js
│   └── getTop5Movies.js
├── models/             # Sequelize models
│   ├── movie.js
│   ├── review.js
│   ├── watchlist.js
│   ├── wishlist.js
│   ├── curatedList.js
│   └── curatedListItem.js
├── migrations/         # Database migrations
├── services/           # Business logic
│   ├── fetchMovieAndCastDetails.js
│   └── movieExistsInDb.js
├── lib/                # Utility libraries
│   └── axios.lib.js
├── tests/              # Test files
│   └── controller.test.js
├── index.js            # Application entry point
└── package.json
```

---

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

The project uses **Jest** and **Supertest** for comprehensive API testing.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL (with SQLite3 support)
- **HTTP Client**: Axios (with retry logic)
- **Testing**: Jest + Supertest
- **External API**: The Movie Database (TMDB)

---

## 📝 Example Usage

### Search for a Movie

**Local:**
```bash
curl "http://localhost:3000/api/movies/search?query=Inception"
```

**Live API:**
```bash
curl "https://movicuration.onrender.com/api/movies/search?query=tree"
```

Or visit directly in your browser: [https://movicuration.onrender.com/api/movies/search?query=tree](https://movicuration.onrender.com/api/movies/search?query=tree)

### Create a Curated List

**Local:**
```bash
curl -X POST http://localhost:3000/api/curated-lists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Christopher Nolan Masterpieces",
    "description": "A collection of Nolan's best work"
  }'
```

**Live API:**
```bash
curl -X POST https://movicuration.onrender.com/api/curated-lists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Christopher Nolan Masterpieces",
    "description": "A collection of Nolan's best work"
  }'
```

### Add a Review

**Local:**
```bash
curl -X POST http://localhost:3000/api/movies/123/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 9.5,
    "comment": "Mind-blowing cinematography and storytelling!"
  }'
```

**Live API:**
```bash
curl -X POST https://movicuration.onrender.com/api/movies/123/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 9.5,
    "comment": "Mind-blowing cinematography and storytelling!"
  }'
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- **The Movie Database (TMDB)** for providing the comprehensive movie API
- **Express.js** community for the amazing framework
- All contributors and movie enthusiasts who make this project possible

---

## 📧 Contact & Support

Have questions or suggestions? Feel free to open an issue or reach out!

---

<div align="center">

**Made with ❤️ for movie lovers everywhere**

⭐ Star this repo if you find it helpful!

</div>

